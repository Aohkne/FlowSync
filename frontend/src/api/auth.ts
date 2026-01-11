import { api } from "../lib/api";
import type { User, AuthResponse } from "../types";

export const authApi = {
  register: (data: { email: string; password: string; fullName?: string }) =>
    api.post("/auth/register", data) as Promise<AuthResponse>,

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data) as Promise<AuthResponse>,

  getMe: () => api.get("/auth/me") as Promise<{ user: User }>,

  updateProfile: (data: { fullName?: string; avatarUrl?: string }) =>
    api.patch("/auth/profile", data) as Promise<{ user: User }>,
};
