import { create } from "zustand";
import { api } from "../services/api";
import { v4 as uuidv4 } from 'uuid';
import { InterviewSession } from '../types';

export type InterviewStatus = 'idle' | 'setup' | 'instructions' | 'live' | 'completed';

export interface InterviewConfig {
  role: string;
  type: 'technical' | 'hr' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface InterviewState {
  interviewStatus: InterviewStatus;
  config: InterviewConfig;
  currentQuestionIndex: number;
  questions: any[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  sessions: InterviewSession[];

  goToSetup: () => void;
  goToInstructions: () => void;
  startInterview: () => Promise<void>;
  submitAnswer: (answer: string, metrics?: any) => Promise<void>;
  endInterview: () => void;
  resetInterview: () => void;
  setInterviewConfig: (config: Partial<InterviewConfig>) => void;
  fetchSessions: () => Promise<void>;
}

const DEFAULT_CONFIG: InterviewConfig = {
    role: 'frontend',
    type: 'technical',
    difficulty: 'medium',
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviewStatus: 'idle',
  config: DEFAULT_CONFIG,
  currentQuestionIndex: 0,
  questions: [],
  sessionId: null,
  isLoading: false,
  error: null,
  sessions: [],

  goToSetup: () => set({ interviewStatus: 'setup', error: null }),
  
  goToInstructions: () => {
    set({ interviewStatus: 'instructions', error: null });
  },

  startInterview: async () => {
    set({ isLoading: true, error: null });
    const { config } = get();
    
    try {
        const data = await api.startInterview(config.role, config.difficulty);
        
        // Backend returns the first question as 'message'
        const firstQuestion = {
            id: uuidv4(),
            question: data.message,
            category: "General", 
            userAnswer: ""
        };

        set({ 
            interviewStatus: 'live', 
            sessionId: data.session_id,
            questions: [firstQuestion],
            currentQuestionIndex: 0,
            isLoading: false
        });
    } catch (err) {
        console.error("Failed to start interview:", err);
        set({ error: "Failed to connect to AI server. Create sure backend is running.", isLoading: false });
    }
  },

  submitAnswer: async (answer: string, metrics?: any) => {
    // ... existing logic ...
    const { sessionId, questions, currentQuestionIndex } = get();
    if (!sessionId) return;
    
    // Optimistically update current answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].userAnswer = answer;
    set({ questions: updatedQuestions, isLoading: true });

    try {
        const data = await api.submitAnswer(sessionId, answer, metrics);
        
        if (data.is_completed) {
             set({ interviewStatus: 'completed', isLoading: false });
             return;
        }

        if (data.next_question) {
             const nextQuestion = {
                 id: uuidv4(),
                 question: data.next_question,
                 category: "Follow-up",
                 userAnswer: ""
             };
             
             set({ 
                 questions: [...updatedQuestions, nextQuestion],
                 currentQuestionIndex: currentQuestionIndex + 1,
                 isLoading: false
             });
        }
    } catch (err) {
        console.error("Failed to submit answer:", err);
        set({ error: "Failed to submit answer.", isLoading: false });
    }
  },

  handleVoiceResponse: (data: any) => {
      // Called by component after successful audio upload
      const { questions, currentQuestionIndex } = get();
      
      // Update the current question with a placeholder for voice
      // Ideally we would get the transcribed text back from backend, 
      // but if we don't, we can mark it as [Voice Answer]
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].userAnswer = "(Voice Answer)"; // or transcribe result if available

      if (data.is_completed) {
           set({ questions: updatedQuestions, interviewStatus: 'completed', isLoading: false });
           return;
      }

      if (data.next_question) {
           const nextQuestion = {
               id: uuidv4(),
               question: data.next_question,
               category: "Follow-up",
               userAnswer: ""
           };
           
           set({ 
               questions: [...updatedQuestions, nextQuestion],
               currentQuestionIndex: currentQuestionIndex + 1,
               isLoading: false
           });
      }
  },

  endInterview: () => {
    set({ interviewStatus: 'completed' });
  },

  resetInterview: () => {
    set({
        interviewStatus: 'idle',
        questions: [],
        currentQuestionIndex: 0,
        sessionId: null,
        error: null,
        config: DEFAULT_CONFIG
    });
  },

  setInterviewConfig: (config) => set((state) => ({ 
    config: { ...state.config, ...config } 
  })),

  fetchSessions: async () => {
    try {
        set({ isLoading: true });
        const sessionsData = await api.getSessions(); // Now returns InterviewSession[]
        set({ sessions: sessionsData, isLoading: false });
    } catch (err) {
        console.error("Failed to fetch sessions:", err);
        set({ error: "Failed to load history", isLoading: false });
    }
  }
}));
