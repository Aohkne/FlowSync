import { useState } from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

import { useQuery } from "@tanstack/react-query";

import { Modal } from "./Modal";

import { tasksApi } from "../../api/tasks";

interface TaskDetailModalProps {
  taskId: string;
  onClose: () => void;
}

const priorityConfig = {
  low: { color: "#6b7280", bg: "rgba(243, 244, 246, 0.8)", icon: "mdi:flag-outline" },
  medium: { color: "#f59e0b", bg: "rgba(254, 243, 199, 0.8)", icon: "mdi:flag" },
  high: { color: "#ef4444", bg: "rgba(254, 226, 226, 0.8)", icon: "mdi:flag" },
};

export const TaskDetailModal = ({ taskId, onClose }: TaskDetailModalProps) => {
  const [comment, setComment] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      const response = await tasksApi.getById(taskId);
      return response.task;
    },
  });

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Task Details" size="lg">
        <div className="flex items-center justify-center py-20">
          <Icon icon="mdi:loading" width={40} className="animate-spin text-green-500" />
        </div>
      </Modal>
    );
  }

  if (!data) {
    return null;
  }

  const task = data;
  const priority = priorityConfig[task.priority];

  return (
    <Modal isOpen={true} onClose={onClose} title="Task Details" size="lg">
      <div className="space-y-6">
        {/* Task Header */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {task.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Icon icon="mdi:account-outline" width={16} />
                <span>
                  Created by {task.creator?.fullName || task.creator?.email}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon icon="mdi:clock-outline" width={16} />
                <span>{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Priority Badge */}
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ 
              backgroundColor: priority.bg,
              color: priority.color
            }}
          >
            <Icon icon={priority.icon} width={18} />
            <span className="text-sm font-semibold capitalize">{task.priority}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="mdi:text" width={18} />
            Description
          </h3>
          {task.description ? (
            <div 
              className="p-4 rounded-xl"
              style={{ background: 'rgba(249, 250, 251, 0.8)' }}
            >
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">No description provided</p>
          )}
        </div>

        {/* Assigned User */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Icon icon="mdi:account-circle" width={18} />
            Assigned To
          </h3>
          {task.assignedUser ? (
            <div 
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(249, 250, 251, 0.8)' }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' }}
              >
                {task.assignedUser.fullName?.[0] || task.assignedUser.email[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {task.assignedUser.fullName || "User"}
                </p>
                <p className="text-sm text-gray-500">{task.assignedUser.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 italic">Not assigned</p>
          )}
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Icon icon="mdi:comment-multiple-outline" width={18} />
            Comments ({task.comments?.length || 0})
          </h3>

          {/* Add Comment Form */}
          <div className="mb-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="input flex-1"
              />
              <button
                onClick={() => {
                  // TODO: Add comment functionality
                  setComment("");
                }}
                disabled={!comment.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="mdi:send" width={20} />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div 
                  key={comment.id}
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(249, 250, 251, 0.8)' }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                      style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' }}
                    >
                      {comment.user?.fullName?.[0] || comment.user?.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {comment.user?.fullName || "User"}
                        </p>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8 italic">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t" style={{ borderColor: 'rgba(229, 231, 235, 0.5)' }}>
          <button className="btn-danger flex items-center gap-2">
            <Icon icon="mdi:delete-outline" width={20} />
            Delete Task
          </button>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};