import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Modal } from "./Modal";
import { useCreateTask } from "../../hooks/useTasks";
import type { TaskPriority } from "../../types";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  columnId,
}: CreateTaskModalProps) => {
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask.mutateAsync({
        columnId,
        ...data,
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            {...register("title")}
            type="text"
            id="title"
            className="input"
            placeholder="Enter task title"
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
            rows={4}
            className="input"
            placeholder="Enter task description"
          />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select {...register("priority")} id="priority" className="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {createTask.isPending ? (
              <>
                <Icon icon="mdi:loading" width={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icon icon="mdi:plus" width={20} />
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
