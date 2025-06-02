import { create } from 'zustand';
import { CareerPath, Resource } from '../types';
import { API_URL } from '../config';

interface CareerState {
  careerPaths: CareerPath[];
  recommendedPaths: CareerPath[];
  resources: Resource[];
  isLoading: boolean;
  error: string | null;
  fetchCareerPaths: () => Promise<void>;
  fetchRecommendedPaths: (resumeId: string) => Promise<void>;
  fetchResources: (pathId: string) => Promise<void>;
}

export const useCareerStore = create<CareerState>((set) => ({
  careerPaths: [],
  recommendedPaths: [],
  resources: [],
  isLoading: false,
  error: null,

  fetchCareerPaths: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would make a fetch request to your API
      const response = await fetch(`${API_URL}/career-paths`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch career paths');
      }

      const careerPaths = await response.json();
      set({ careerPaths, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch career paths', 
        isLoading: false 
      });
    }
  },

  fetchRecommendedPaths: async (resumeId: string) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would make a fetch request to your API
      const response = await fetch(`${API_URL}/career-paths/recommended?resumeId=${resumeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch recommended paths');
      }

      const recommendedPaths = await response.json();
      set({ recommendedPaths, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch recommended paths', 
        isLoading: false 
      });
    }
  },

  fetchResources: async (pathId: string) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would make a fetch request to your API
      const response = await fetch(`${API_URL}/career-paths/${pathId}/resources`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch resources');
      }

      const resources = await response.json();
      set({ resources, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch resources', 
        isLoading: false 
      });
    }
  },
}));