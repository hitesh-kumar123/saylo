import { create } from 'zustand';
import { InterviewSession, InterviewMetrics, EmotionDataPoint } from '../types';
import { API_URL } from '../config';

interface InterviewState {
  currentSession: InterviewSession | null;
  sessions: InterviewSession[];
  isLoading: boolean;
  error: string | null;
  startInterview: (jobTitle: string) => Promise<void>;
  endInterview: () => Promise<void>;
  updateMetrics: (metrics: Partial<InterviewMetrics>) => void;
  addEmotionDataPoint: (dataPoint: EmotionDataPoint) => void;
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
      // In a real app, this would make a fetch request to your API
      const response = await fetch(`${API_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ jobTitle }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start interview');
      }

      const session = await response.json();
      set({ currentSession: session, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start interview', 
        isLoading: false 
      });
    }
  },

  endInterview: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    set({ isLoading: true, error: null });
    try {
      // In a real app, this would make a fetch request to your API
      const response = await fetch(`${API_URL}/interviews/${currentSession.id}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to end interview');
      }

      const updatedSession = await response.json();
      set(state => ({
        currentSession: null,
        sessions: [updatedSession, ...state.sessions],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to end interview', 
        isLoading: false 
      });
    }
  },

  updateMetrics: (metrics: Partial<InterviewMetrics>) => {
    set(state => ({
      currentSession: state.currentSession 
        ? { 
            ...state.currentSession, 
            metrics: { ...(state.currentSession.metrics || {}), ...metrics } as InterviewMetrics 
          }
        : null
    }));
  },

  addEmotionDataPoint: (dataPoint: EmotionDataPoint) => {
    set(state => {
      if (!state.currentSession) return state;
      
      const currentMetrics = state.currentSession.metrics || {};
      const emotionTimeline = currentMetrics.emotionTimeline || [];
      
      return {
        currentSession: {
          ...state.currentSession,
          metrics: {
            ...currentMetrics,
            emotionTimeline: [...emotionTimeline, dataPoint]
          }
        }
      };
    });
  },

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would make a fetch request to your API
      const response = await fetch(`${API_URL}/interviews`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch interview sessions');
      }

      const sessions = await response.json();
      set({ sessions, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch interview sessions', 
        isLoading: false 
      });
    }
  },
}));