import { create } from "zustand";
import { User } from "../types";
import { API_URL } from "../config";

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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem("token"),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Server error: ${response.status} ${response.statusText}`,
        }));
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store token in localStorage and state
      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        token: data.token,
      });
    } catch (error) {
      console.error("Login error:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : error instanceof Response
            ? `Network error: ${error.status} ${error.statusText}`
            : "Login failed - Check if the server is running",
        isLoading: false,
      });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();

      // Store token in localStorage and state
      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        token: data.token,
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
      // First try with the status endpoint
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid
        localStorage.removeItem("token");
        set({ isAuthenticated: false, user: null, token: null });
        return false;
      }

      const data = await response.json();
      set({
        isAuthenticated: true,
        user: data.user,
        token,
      });
      return true;
    } catch (error) {
      console.error("Error verifying token:", error);

      // If there's a network error, don't log out the user immediately
      // Instead, assume the token is still valid until proven otherwise
      // This prevents logout on refresh when server is down
      return true;
    }
  },
}));

// set