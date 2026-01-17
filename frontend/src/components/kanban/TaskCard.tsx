import { Icon } from "@iconify/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityConfig = {
  low: { 
    color: '#6b7280', 
    bg: 'rgba(243, 244, 246, 0.8)', 
    icon: 'mdi:flag-outline',
    label: 'Low'
  },
  medium: { 
    color: '#f59e0b', 
    bg: 'rgba(254, 243, 199, 0.8)', 
    icon: 'mdi:flag',
    label: 'Medium'
  },
  high: { 
    color: '#ef4444', 
    bg: 'rgba(254, 226, 226, 0.8)', 
    icon: 'mdi:flag',
    label: 'High'
  },
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
      className="group relative cursor-grab active:cursor-grabbing"
    >
      {/* Glass Card */}
      <div 
        className="glass-card rounded-xl p-4 border hover:shadow-xl transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(229, 231, 235, 0.5)',
        }}
      >
        {/* Priority Badge - Top Right */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="font-semibold text-gray-900 leading-tight flex-1 line-clamp-2">
            {task.title}
          </h4>
          
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium shrink-0"
            style={{ 
              backgroundColor: priority.bg,
              color: priority.color
            }}
          >
            <Icon icon={priority.icon} width={14} />
            <span>{priority.label}</span>
          </div>
        </div>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Task Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Assigned User */}
          <div className="flex items-center gap-2">
            {task.assignedUser ? (
              <>
                {task.assignedUser.avatarUrl ? (
                  <img
                    src={task.assignedUser.avatarUrl}
                    alt={task.assignedUser.fullName || "User"}
                    className="w-7 h-7 rounded-full ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)'
                    }}
                  >
                    {task.assignedUser.fullName?.[0] ||
                      task.assignedUser.email[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-gray-500 font-medium">
                  {task.assignedUser.fullName || task.assignedUser.email.split('@')[0]}
                </span>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Icon icon="mdi:account-outline" width={16} />
                <span>Unassigned</span>
              </div>
            )}
          </div>

          {/* Comment Count (if you have comments) */}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Icon icon="mdi:comment-outline" width={16} />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>

        {/* Hover Effect Indicator */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
          }}
        />
      </div>

      {/* Drag Indicator */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Icon icon="mdi:drag-vertical" width={16} className="text-gray-400" />
      </div>
    </div>
  );
};