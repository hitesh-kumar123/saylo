import { create } from "zustand";
import { User } from "../types";
import { LocalDataService } from "../services/localDataService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem("token"),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await LocalDataService.login(email, password);

      // Store token in localStorage and state
      localStorage.setItem("token", token);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await LocalDataService.register(
        name,
        email,
        password
      );

      // Store token in localStorage and state
      localStorage.setItem("token", token);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        token,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Registration failed",
        isLoading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false, token: null });
  },

  clearError: () => set({ error: null }),

  checkAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }

    try {
      const user = await LocalDataService.verifyToken(token);
      set({
        isAuthenticated: true,
        user,
        token,
      });
      return true;
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("token");
      set({ isAuthenticated: false, user: null, token: null });
      return false;
    }
  },
}));

// set
