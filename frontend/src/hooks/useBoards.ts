import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../api/boards";
import type { Board } from "../types";

export const useBoards = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const data = await boardsApi.getAll();
      return data.boards;
    },
  });
};

export const useBoard = (id: string) => {
  return useQuery({
    queryKey: ["boards", id],
    queryFn: async () => {
      const data = await boardsApi.getById(id);
      return data.board;
    },
    enabled: !!id,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Board> }) =>
      boardsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["boards", variables.id] });
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};
