import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Modal } from "./Modal";
import { useCreateBoard } from "../../hooks/useBoards";

const boardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
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
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Board" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Board Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("title")}
              type="text"
              id="title"
              className="input pl-11"
              placeholder="e.g., Marketing Campaign Q1"
              autoFocus
            />
            <Icon 
              icon="mdi:bulletin-board" 
              width={20} 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" width={16} />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <textarea
              {...register("description")}
              id="description"
              rows={4}
              className="input resize-none"
              placeholder="What's this board about? Add goals, context, or any helpful information..."
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" width={16} />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Public Toggle */}
        <div 
          className="p-4 rounded-xl border"
          style={{
            background: 'rgba(249, 250, 251, 0.8)',
            borderColor: 'rgba(229, 231, 235, 0.5)'
          }}
        >
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg group-hover:scale-110 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                }}
              >
                <Icon icon="mdi:earth" width={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Make board public</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Anyone with the link can view this board
                </p>
              </div>
            </div>
            <input
              {...register("isPublic")}
              type="checkbox"
              className="w-5 h-5 rounded text-green-600 focus:ring-green-500 focus:ring-offset-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'rgba(229, 231, 235, 0.5)' }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            disabled={createBoard.isPending}
          >
            <Icon icon="mdi:close" width={20} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={createBoard.isPending}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createBoard.isPending ? (
              <>
                <Icon icon="mdi:loading" width={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icon icon="mdi:check" width={20} />
                Create Board
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};