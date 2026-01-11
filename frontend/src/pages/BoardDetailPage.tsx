import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useBoard } from "../hooks/useBoards";
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { CreateTaskModal } from "../components/modals/CreateTaskModal";

export const BoardDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: board, isLoading, error } = useBoard(id!);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreateTaskModalOpen(true);
  };

  const handleTaskClick = (taskId: string) => {
    // TODO: Open task detail modal
    console.log("Task clicked:", taskId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon
          icon="mdi:loading"
          width={40}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load board. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/boards"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"
        >
          <Icon icon="mdi:arrow-left" width={20} />
          Back to boards
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
            {board.description && (
              <p className="text-gray-600 mt-1">{board.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {board.members && board.members.length > 0 && (
              <div className="flex -space-x-2">
                {board.members.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                    title={member.user?.fullName || member.user?.email}
                  >
                    {member.user?.fullName?.[0] ||
                      member.user?.email[0].toUpperCase()}
                  </div>
                ))}
                {board.members.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                    +{board.members.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        board={board}
        onAddTask={handleAddTask}
        onTaskClick={handleTaskClick}
      />

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        columnId={selectedColumnId}
      />
    </div>
  );
};
