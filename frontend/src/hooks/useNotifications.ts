import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications";

export const useNotifications = (unreadOnly: boolean = false) => {
  return useQuery({
    queryKey: ["notifications", { unreadOnly }],
    queryFn: () => notificationsApi.getAll({ unreadOnly }),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};