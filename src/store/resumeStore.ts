import { create } from 'zustand';
import { Resume, ParsedResumeData } from '../types';
import { API_URL } from '../config';

interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;
  uploadResume: (file: File) => Promise<void>;
  fetchResumes: () => Promise<void>;
  selectResume: (resumeId: string) => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,

  uploadResume: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('resume', file);

      // In a real app, this would make a fetch request to your API
      const response = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload resume');
      }

      const newResume = await response.json();
      set(state => ({ 
        resumes: [newResume, ...state.resumes],
        currentResume: newResume,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload resume', 
        isLoading: false 
      });
    }
  },

  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would make a fetch request to your API
      const response = await fetch(`${API_URL}/resumes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch resumes');
      }

      const resumes = await response.json();
      set({ 
        resumes, 
        currentResume: resumes.length > 0 ? resumes[0] : null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch resumes', 
        isLoading: false 
      });
    }
  },

  selectResume: (resumeId: string) => {
    const { resumes } = get();
    const selected = resumes.find(r => r.id === resumeId) || null;
    set({ currentResume: selected });
  },
}));