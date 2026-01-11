import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) =>
        set((state) => {
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        }),

      logout: () =>
        set((state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }),

      updateUser: (updates) =>
        set((state) => {
          if (state.user) {
            state.user = { ...state.user, ...updates };
          }
        }),
    })),
    {
      name: "auth-storage",
    }
  )
);

// Selectors (atomic)
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
