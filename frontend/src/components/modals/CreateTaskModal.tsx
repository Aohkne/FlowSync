import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Modal } from "./Modal";
import { useCreateTask } from "../../hooks/useTasks";
import type { TaskPriority } from "../../types";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
}

const priorityOptions: { value: TaskPriority; label: string; icon: string; color: string }[] = [
  { value: "low", label: "Low Priority", icon: "mdi:flag-outline", color: "#6b7280" },
  { value: "medium", label: "Medium Priority", icon: "mdi:flag", color: "#f59e0b" },
  { value: "high", label: "High Priority", icon: "mdi:flag", color: "#ef4444" },
];

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
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  const selectedPriority = watch("priority");

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
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Task Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("title")}
              type="text"
              id="title"
              className="input pl-11"
              placeholder="e.g., Design landing page mockup"
              autoFocus
            />
            <Icon 
              icon="mdi:checkbox-marked-circle-outline" 
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
          <textarea
            {...register("description")}
            id="description"
            rows={5}
            className="input resize-none"
            placeholder="Add more details about this task..."
          />
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {priorityOptions.map((option) => {
              const isSelected = selectedPriority === option.value;
              return (
                <label
                  key={option.value}
                  className="relative cursor-pointer"
                >
                  <input
                    {...register("priority")}
                    type="radio"
                    value={option.value}
                    className="sr-only"
                  />
                  <div 
                    className="p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: isSelected ? option.color : 'rgba(229, 231, 235, 0.5)',
                      background: isSelected 
                        ? `${option.color}15` 
                        : 'rgba(255, 255, 255, 0.5)',
                      boxShadow: isSelected 
                        ? `0 4px 12px ${option.color}30` 
                        : 'none'
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Icon 
                        icon={option.icon} 
                        width={24}
                        style={{ color: option.color }}
                      />
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? option.color : '#374151' }}
                      >
                        {option.label}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div 
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ 
                        background: option.color,
                        boxShadow: `0 2px 8px ${option.color}50`
                      }}
                    >
                      <Icon icon="mdi:check" width={16} className="text-white" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'rgba(229, 231, 235, 0.5)' }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            disabled={createTask.isPending}
          >
            <Icon icon="mdi:close" width={20} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTask.isPending ? (
              <>
                <Icon icon="mdi:loading" width={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icon icon="mdi:check" width={20} />
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};