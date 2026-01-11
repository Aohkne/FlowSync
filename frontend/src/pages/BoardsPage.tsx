import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useBoards } from "../hooks/useBoards";
import { CreateBoardModal } from "../components/modals/CreateBoardModal";
import { format } from "date-fns";

export const BoardsPage = () => {
  const { data: boards, isLoading, error } = useBoards();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load boards. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Boards</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Icon icon="mdi:plus" width={20} />
          New Board
        </button>
      </div>

      {boards && boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{board.title}</h3>
                {board.isPublic && (
                  <Icon icon="mdi:earth" width={16} className="text-gray-400" />
                )}
              </div>

              {board.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {board.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Updated {format(new Date(board.updatedAt), "MMM d, yyyy")}
                </span>
                {board.members && (
                  <span>
                    {board.members.length} member
                    {board.members.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon
            icon="mdi:view-dashboard-outline"
            width={64}
            className="mx-auto text-gray-300 mb-4"
          />
          <p className="text-gray-600 mb-4">
            No boards yet. Create your first board to get started!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
          >
            <Icon icon="mdi:plus" width={20} className="inline mr-2" />
            Create Board
          </button>
        </div>
      )}

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
