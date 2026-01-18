import { api } from "../lib/api";
import type { Task, TaskPriority } from "../types";

interface SearchParams {
  boardId: string;
  q?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  columnId?: string;
  createdBy?: string;
  limit?: number;
  offset?: number;
}

export const searchApi = {
  searchTasks: (params: SearchParams) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
    
    return api.get(`/search/tasks?${queryParams.toString()}`) as Promise<{
      tasks: Task[];
      total: number;
      query: Partial<SearchParams>;
    }>;
  },
};