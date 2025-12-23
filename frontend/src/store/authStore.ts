import { create } from "zustand";
import { User } from "../types";
import { api } from "../services/api";

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
      const { access_token } = await api.auth.login(email, password);
      
      localStorage.setItem("token", access_token);
      
      // Fetch user details immediately
      // The interceptor will pick up the new token from localStorage? 
      // Wait, api.ts interceptor reads localStorage. So yes.
      // But we might need to await a tick? No, sync.
      
      const user = await api.auth.me();

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        token: access_token,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      set({
        error: error.response?.data?.detail || "Login failed. Check your credentials.",
        isLoading: false,
      });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Register
      await api.auth.register(email, password); // Name is ignored for now by backend, or we should add it

      // 2. Login automatically
      const { access_token } = await api.auth.login(email, password);
      localStorage.setItem("token", access_token);

      // 3. Fetch user
      const user = await api.auth.me();

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        token: access_token,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      set({
        error: error.response?.data?.detail || "Registration failed. Try a different email.",
        isLoading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false, token: null });
    // Optional: Redirect to login
  },

  clearError: () => set({ error: null }),

  checkAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }

    try {
      const user = await api.auth.me();
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
