import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Modal } from "./Modal";
import { useCreateBoard } from "../../hooks/useBoards";

const boardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

type BoardFormData = z.infer<typeof boardSchema>;

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBoardModal = ({
  isOpen,
  onClose,
}: CreateBoardModalProps) => {
  const createBoard = useCreateBoard();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      isPublic: false,
    },
  });

  const onSubmit = async (data: BoardFormData) => {
    try {
      await createBoard.mutateAsync(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Board">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Board Title *
          </label>
          <input
            {...register("title")}
            type="text"
            id="title"
            className="input"
            placeholder="e.g., Marketing Campaign Q1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={3}
            className="input"
            placeholder="What's this board about?"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register("isPublic")}
            type="checkbox"
            id="isPublic"
            className="rounded"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-700">
            Make this board public
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={createBoard.isPending}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {createBoard.isPending ? (
              <>
                <Icon icon="mdi:loading" width={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icon icon="mdi:plus" width={20} />
                Create Board
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
