import { create } from "zustand";
import { Resume } from "../types";
import { LocalDataService } from "../services/localDataService";
import { useAuthStore } from "./authStore";
import { ParsedResumeData } from "../services/pdfParserService";

interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;
  uploadResume: (file: File, parsedData?: ParsedResumeData) => Promise<void>;
  fetchResumes: () => Promise<void>;
  selectResume: (resumeId: string) => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,

  uploadResume: async (file: File, parsedData?: ParsedResumeData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const newResume = await LocalDataService.uploadResume(
        user.id,
        file,
        parsedData
      );
      set((state) => ({
        resumes: [newResume, ...state.resumes],
        currentResume: newResume,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to upload resume",
        isLoading: false,
      });
    }
  },

  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const resumes = await LocalDataService.getResumes(user.id);
      set({
        resumes,
        currentResume: resumes.length > 0 ? resumes[0] : null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch resumes",
        isLoading: false,
      });
    }
  },

  selectResume: (resumeId: string) => {
    const { resumes } = get();
    const selected = resumes.find((r) => r.id === resumeId) || null;
    set({ currentResume: selected });
  },
}));
