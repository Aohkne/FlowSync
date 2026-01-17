import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import { useBoard } from "../hooks/useBoards";

import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { CreateTaskModal } from "../components/modals/CreateTaskModal";
import { TaskDetailModal } from "../components/modals/TaskDetailModal";

export const BoardDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: board, isLoading, error } = useBoard(id!);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreateTaskModalOpen(true);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Icon
            icon="mdi:loading"
            width={48}
            className="animate-spin text-green-500 mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-red-200 text-center">
        <Icon icon="mdi:alert-circle" width={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Board not found</h3>
        <p className="text-gray-600 mb-6">This board doesn't exist or you don't have access to it.</p>
        <Link to="/boards" className="btn-primary inline-flex items-center gap-2">
          <Icon icon="mdi:arrow-left" width={20} />
          Back to Boards
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/boards"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4 group transition-colors"
        >
          <Icon icon="mdi:arrow-left" width={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to boards
        </Link>

        <div 
          className="glass-panel rounded-2xl p-6 border"
          style={{
            borderColor: 'rgba(229, 231, 235, 0.5)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {board.title}
                </h1>
                {board.isPublic && (
                  <div 
                    className="px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    style={{
                      background: 'rgba(74, 222, 128, 0.1)'
                    }}
                  >
                    <Icon icon="mdi:earth" width={16} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Public</span>
                  </div>
                )}
              </div>
              {board.description && (
                <p className="text-gray-600 leading-relaxed max-w-3xl">
                  {board.description}
                </p>
              )}
            </div>

            {/* Board Actions */}
            <div className="flex items-center gap-3">
              {/* Members */}
              {board.members && board.members.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50">
                  <div className="flex -space-x-2">
                    {board.members.slice(0, 4).map((member, idx) => (
                      <div
                        key={member.id}
                        className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                          zIndex: 10 - idx
                        }}
                        title={member.user?.fullName || member.user?.email}
                      >
                        {member.user?.fullName?.[0] ||
                          member.user?.email[0].toUpperCase()}
                      </div>
                    ))}
                    {board.members.length > 4 && (
                      <div 
                        className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-sm font-semibold shadow-md"
                        style={{ background: '#e5e7eb' }}
                      >
                        +{board.members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {board.members.length} {board.members.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
              )}

              {/* Settings Button */}
              <button 
                className="p-3 rounded-xl hover:bg-white/70 transition-all group"
                style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                title="Board settings"
              >
                <Icon 
                  icon="mdi:cog-outline" 
                  width={22} 
                  className="text-gray-600 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard
          board={board}
          onAddTask={handleAddTask}
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        columnId={selectedColumnId}
      />

      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
};