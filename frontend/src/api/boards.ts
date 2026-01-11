import { api } from "../lib/api";
import type { Board } from "../types";

export const boardsApi = {
  getAll: () => api.get("/boards") as Promise<{ boards: Board[] }>,

  getById: (id: string) =>
    api.get(`/boards/${id}`) as Promise<{ board: Board }>,

  create: (data: { title: string; description?: string; isPublic?: boolean }) =>
    api.post("/boards", data) as Promise<{ board: Board }>,

  update: (id: string, data: Partial<Board>) =>
    api.patch(`/boards/${id}`, data) as Promise<{ board: Board }>,

  delete: (id: string) =>
    api.delete(`/boards/${id}`) as Promise<{ message: string }>,
};
