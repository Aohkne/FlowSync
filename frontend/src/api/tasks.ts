import { api } from "../lib/api";
import type { Task, TaskPriority } from "../types";

export const tasksApi = {
  create: (data: {
    columnId: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    assignedTo?: string;
  }) => api.post("/tasks", data) as Promise<{ task: Task }>,

  getById: (id: string) => api.get(`/tasks/${id}`) as Promise<{ task: Task }>,

  update: (id: string, data: Partial<Task>) =>
    api.patch(`/tasks/${id}`, data) as Promise<{ task: Task }>,

  move: (id: string, data: { columnId: string; position: number }) =>
    api.patch(`/tasks/${id}/move`, data) as Promise<{ task: Task }>,

  delete: (id: string) =>
    api.delete(`/tasks/${id}`) as Promise<{ message: string }>,
};
