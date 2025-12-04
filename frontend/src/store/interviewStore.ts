import { create } from "zustand";
import { InterviewSession, InterviewMetrics, EmotionDataPoint } from "../types";
import { LocalDataService } from "../services/localDataService";
import { useAuthStore } from "./authStore";

interface InterviewState {
  currentSession: InterviewSession | null;
  sessions: InterviewSession[];
  isLoading: boolean;
  error: string | null;
  startInterview: (jobTitle: string) => Promise<void>;
  endInterview: () => Promise<void>;
  updateMetrics: (metrics: Partial<InterviewMetrics>) => void;
  addEmotionDataPoint: (dataPoint: EmotionDataPoint) => void;
  addQuestionResponse: (questionId: string, question: string, answer: string) => void;
  fetchSessions: () => Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,

  startInterview: async (jobTitle: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const session = await LocalDataService.startInterview(user.id, jobTitle);
      set({ currentSession: session, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to start interview",
        isLoading: false,
      });
    }
  },

  endInterview: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    set({ isLoading: true, error: null });
    try {
      const updatedSession = await LocalDataService.endInterview(
        currentSession.id
      );
      set((state) => ({
        currentSession: null,
        sessions: [updatedSession, ...state.sessions],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to end interview",
        isLoading: false,
      });
    }
  },

  updateMetrics: (metrics: Partial<InterviewMetrics>) => {
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            metrics: {
              ...(state.currentSession.metrics || {}),
              ...metrics,
            } as InterviewMetrics,
          }
        : null,
    }));
  },

  addEmotionDataPoint: (dataPoint: EmotionDataPoint) => {
    set((state) => {
      if (!state.currentSession) return state;

      const currentMetrics = state.currentSession.metrics || {};
      const emotionTimeline = currentMetrics.emotionTimeline || [];

      return {
        currentSession: {
          ...state.currentSession,
          metrics: {
            ...currentMetrics,
            emotionTimeline: [...emotionTimeline, dataPoint],
          },
        },
      };
    });
  },

  addQuestionResponse: (questionId: string, question: string, answer: string) => {
    set((state) => {
      if (!state.currentSession) return state;

      const currentQuestions = state.currentSession.questions || [];
      const questionIndex = currentQuestions.findIndex((q) => q.id === questionId);

      const questionData = {
        id: questionId,
        question,
        category: "",
        difficulty: "medium",
        userAnswer: answer,
      };

      let updatedQuestions;
      if (questionIndex >= 0) {
        updatedQuestions = [...currentQuestions];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          userAnswer: answer,
        };
      } else {
        updatedQuestions = [...currentQuestions, questionData];
      }

      return {
        currentSession: {
          ...state.currentSession,
          questions: updatedQuestions,
        },
      };
    });
  },

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const sessions = await LocalDataService.getInterviews(user.id);
      set({ sessions, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch interview sessions",
        isLoading: false,
      });
    }
  },
}));
