import { api } from "../lib/api";

export interface Notification {
  id: string;
  userId: string;
  type: "task_assigned" | "mentioned" | "comment_added" | "task_moved";
  title: string;
  message: string;
  entityType?: "task" | "comment" | "board";
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getAll: (params?: { limit?: number; offset?: number; unreadOnly?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return api.get(`/notifications${queryString ? `?${queryString}` : ''}`) as Promise<{
      notifications: Notification[];
      unreadCount: number;
    }>;
  },

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`) as Promise<{ notification: Notification }>,

  markAllAsRead: () =>
    api.patch("/notifications/read-all") as Promise<{ message: string }>,
};