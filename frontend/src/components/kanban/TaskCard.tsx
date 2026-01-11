import { Icon } from "@iconify/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityConfig = {
  low: { color: "text-gray-600", bg: "bg-gray-100", icon: "mdi:flag-outline" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-100", icon: "mdi:flag" },
  high: { color: "text-red-600", bg: "bg-red-100", icon: "mdi:flag" },
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priority = priorityConfig[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Task Title */}
      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between">
        {/* Priority Badge */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded ${priority.bg}`}
        >
          <Icon icon={priority.icon} width={14} className={priority.color} />
          <span className={`text-xs font-medium ${priority.color}`}>
            {task.priority}
          </span>
        </div>

        {/* Assigned User */}
        {task.assignedUser && (
          <div className="flex items-center gap-1">
            {task.assignedUser.avatarUrl ? (
              <img
                src={task.assignedUser.avatarUrl}
                alt={task.assignedUser.fullName || "User"}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                {task.assignedUser.fullName?.[0] ||
                  task.assignedUser.email[0].toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
