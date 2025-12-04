import { create } from "zustand";
import { CareerPath, Resource } from "../types";
import { LocalDataService } from "../services/localDataService";

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
      const careerPaths = await LocalDataService.getCareerPaths();
      set({ careerPaths, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch career paths",
        isLoading: false,
      });
    }
  },

  fetchRecommendedPaths: async (resumeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const recommendedPaths = await LocalDataService.getRecommendedPaths(
        resumeId
      );
      set({ recommendedPaths, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch recommended paths",
        isLoading: false,
      });
    }
  },

  fetchResources: async (pathId: string) => {
    set({ isLoading: true, error: null });
    try {
      const resources = await LocalDataService.getResourcesByCategory(pathId);
      set({ resources, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch resources",
        isLoading: false,
      });
    }
  },
}));
