import { create } from "zustand";
import { InterviewSession, InterviewMetrics, EmotionDataPoint, InterviewQuestion } from "../types";
import { LocalDataService } from "../services/localDataService";
import { useAuthStore } from "./authStore";
import { v4 as uuidv4 } from 'uuid';

export type InterviewStatus = 'idle' | 'setup' | 'instructions' | 'live' | 'completed';

export interface InterviewConfig {
  role: string;
  type: 'technical' | 'hr' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface InterviewState {
  // State
  interviewStatus: InterviewStatus;
  config: InterviewConfig;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  currentSession: InterviewSession | null;
  sessions: InterviewSession[];
  isLoading: boolean;
  error: string | null;

  // Actions
  goToSetup: () => void;
  goToInstructions: () => void;
  startInterview: () => void;
  submitAnswer: (answer: string) => void;
  endInterview: () => Promise<void>;
  resetInterview: () => void;
  
  // Configuration Actions
  setInterviewConfig: (config: Partial<InterviewConfig>) => void;
  
  // Legacy/Helper Actions (for compatibility or additional features)
  updateMetrics: (metrics: Partial<InterviewMetrics>) => void;
  addEmotionDataPoint: (dataPoint: EmotionDataPoint) => void;
  fetchSessions: () => Promise<void>;
}

// Mock Questions Database
const MOCK_QUESTIONS = {
  frontend: [
    { id: '1', question: "Explain the Virtual DOM in React.", category: "Technical", difficulty: "medium" },
    { id: '2', question: "What is the difference between specificty in CSS?", category: "Technical", difficulty: "easy" },
    { id: '3', question: "How do you handle state management in large applications?", category: "Technical", difficulty: "hard" },
  ],
  backend: [
    { id: '1', question: "Explain the difference between SQL and NoSQL.", category: "Technical", difficulty: "medium" },
    { id: '2', question: "What are RESTful API principles?", category: "Technical", difficulty: "easy" },
    { id: '3', question: "How do you handle database scaling?", category: "Technical", difficulty: "hard" },
  ],
  fullstack: [
    { id: '1', question: "Describe the request-response cycle.", category: "Technical", difficulty: "medium" },
    { id: '2', question: "How would you design a secure authentication system?", category: "Technical", difficulty: "hard" },
  ],
  hr: [
    { id: '1', question: "Tell me about a time you faced a conflict at work.", category: "HR", difficulty: "medium" },
    { id: '2', question: "Where do you see yourself in 5 years?", category: "HR", difficulty: "easy" },
  ],
};

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
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,

  goToSetup: () => set({ interviewStatus: 'setup', error: null }),
  
  goToInstructions: () => {
    // Generate questions when moving to instructions
    const { config } = get();
    let selectedQuestions: any[] = [];
    
    if (config.type === 'hr') {
      selectedQuestions = [...MOCK_QUESTIONS.hr];
    } else {
      const roleKey = config.role.toLowerCase().includes('backend') ? 'backend' : 
                      config.role.toLowerCase().includes('full') ? 'fullstack' : 'frontend';
      
      selectedQuestions = [...MOCK_QUESTIONS[roleKey as keyof typeof MOCK_QUESTIONS] || MOCK_QUESTIONS.frontend];
      
      if (config.type === 'mixed') {
        selectedQuestions = [...selectedQuestions.slice(0, 2), ...MOCK_QUESTIONS.hr.slice(0, 1)];
      }
    }

    const questionsWithIds = selectedQuestions.map(q => ({
      ...q,
      id: uuidv4(),
      userAnswer: '',
    }));

    set({ 
        interviewStatus: 'instructions', 
        questions: questionsWithIds, 
        currentQuestionIndex: 0 
    });
  },

  startInterview:  () => {
    // This transitions to LIVE
    // Ideally we also start the session in DB here or in background
    const { user } = useAuthStore.getState();
    const { config } = get();
    
    if (user) {
        // optimistically set status
        set({ interviewStatus: 'live', isLoading: true });
        
        // Fire and forget, or handle loading state if critical
        LocalDataService.startInterview(user.id, config.role)
            .then(session => {
                set({ currentSession: session, isLoading: false });
            })
            .catch(err => {
                console.error("Failed to start session DB", err);
                set({ isLoading: false }); 
            });
    } else {
        set({ interviewStatus: 'live' });
    }
  },

  submitAnswer: (answer: string) => {
    const { currentQuestionIndex, questions } = get();
    
    // Update answer
    const updatedQuestions = [...questions];
    if (updatedQuestions[currentQuestionIndex]) {
        updatedQuestions[currentQuestionIndex] = {
            ...updatedQuestions[currentQuestionIndex],
            userAnswer: answer,
        };
    }
    
    // Move to next or finish
    if (currentQuestionIndex < questions.length - 1) {
        set({ 
            questions: updatedQuestions,
            currentQuestionIndex: currentQuestionIndex + 1 
        });
    } else {
        set({ 
            questions: updatedQuestions,
            interviewStatus: 'completed'
        });
        // We should trigger end logic
        get().endInterview();
    }
  },

  endInterview: async () => {
    set({ isLoading: true });
    const { currentSession, questions } = get();
    
    if (currentSession) {
        try {
            // Update session with final questions
            currentSession.questions = questions;
            
            // Generate basic feedback locally (mock) or via service
             const answeredCount = questions.filter(q => q.userAnswer && q.userAnswer.length > 5).length;
             const score = Math.min(10, (answeredCount / questions.length) * 10);
            
             const sessionWithFeedback = {
                ...currentSession,
                 feedback: {
                    overallScore: score,
                    strengths: ["Communication", "Technical Knowledge"],
                    weaknesses: ["Detail orientation"],
                    detailedFeedback: "Good attempt!",
                    recommendations: ["Review basics"]
                 }
             };

             // This persists to DB
             const updatedSession = await LocalDataService.endInterview(currentSession.id);
             
             // Ensure our local feedback overlays whatever the service returned if it was empty
             if (!updatedSession.feedback) {
                 updatedSession.feedback = sessionWithFeedback.feedback;
             }
             
             set((state) => ({
                 isLoading: false,
                 currentSession: updatedSession,
                 sessions: [updatedSession, ...state.sessions],
                 interviewStatus: 'completed'
             }));

        } catch (e) {
            console.error(e);
            set({ isLoading: false, interviewStatus: 'completed' }); 
        }
    } else {
        set({ isLoading: false, interviewStatus: 'completed' });
    }
  },

  resetInterview: () => {
    set({
        interviewStatus: 'idle',
        questions: [],
        currentQuestionIndex: 0,
        currentSession: null,
        error: null,
        config: DEFAULT_CONFIG
    });
  },

  setInterviewConfig: (config) => set((state) => ({ 
    config: { ...state.config, ...config } 
  })),

  // Legacy/Helpers
  updateMetrics: (metrics) => {
      set((state) => ({
        currentSession: state.currentSession
            ? { ...state.currentSession, metrics: { ...(state.currentSession.metrics || {}), ...metrics } as InterviewMetrics }
            : null
      }));
  },
  
  addEmotionDataPoint: (dataPoint) => { 
       set((state) => {
          if (!state.currentSession) return state;
          const metrics = state.currentSession.metrics || {
              eyeContact: 0, confidence: 0, clarity: 0, enthusiasm: 0, posture: 0, emotionTimeline: []
          };
          return {
              currentSession: {
                  ...state.currentSession,
                  metrics: { ...metrics, emotionTimeline: [...(metrics.emotionTimeline || []), dataPoint] }
              }
          } as Partial<InterviewState>;
       });
  },
  
  fetchSessions: async () => {
      const { user } = useAuthStore.getState();
      if (!user) return; 
      const sessions = await LocalDataService.getInterviews(user.id);
      set({ sessions });
  },

}));
