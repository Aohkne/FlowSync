import { api } from "../lib/api";
import type { Activity } from "../types";

interface GetActivitiesParams {
  limit?: number;
  offset?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

export const activitiesApi = {
  getBoardActivities: (boardId: string, params?: GetActivitiesParams) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`/activities/board/${boardId}?${queryParams.toString()}`) as Promise<{
      activities: Activity[];
      total: number;
      filters: Partial<GetActivitiesParams>;
    }>;
  },
};