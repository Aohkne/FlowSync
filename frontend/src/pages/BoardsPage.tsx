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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Icon
            icon="mdi:loading"
            width={48}
            className="animate-spin text-green-500 mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading your boards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-red-200">
        <div className="flex items-center gap-3 text-red-600">
          <Icon icon="mdi:alert-circle" width={24} />
          <div>
            <p className="font-semibold">Failed to load boards</p>
            <p className="text-sm text-red-500">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Boards
          </h1>
          <p className="text-gray-600">
            Manage and organize all your project boards
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Icon icon="mdi:plus-circle" width={22} />
          <span>New Board</span>
        </button>
      </div>

      {/* Boards Grid */}
      {boards && boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="group"
            >
              <div 
                className="card hover:scale-[1.02] transition-all duration-300 h-full border"
                style={{
                  borderColor: 'rgba(229, 231, 235, 0.5)',
                }}
              >
                {/* Board Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-600 transition-colors line-clamp-1">
                      {board.title}
                    </h3>
                    {board.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {board.description}
                      </p>
                    )}
                  </div>
                  
                  {board.isPublic && (
                    <div 
                      className="p-2 rounded-lg shrink-0 ml-2"
                      style={{
                        background: 'rgba(74, 222, 128, 0.1)'
                      }}
                      title="Public board"
                    >
                      <Icon icon="mdi:earth" width={18} className="text-green-600" />
                    </div>
                  )}
                </div>

                {/* Board Stats */}
                <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'rgba(229, 231, 235, 0.5)' }}>
                  {/* Members */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {board.members && board.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={member.id}
                          className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, #4ade80 0%, #22c55e 100%)`,
                            zIndex: 10 - idx
                          }}
                          title={member.user?.fullName || member.user?.email}
                        >
                          {member.user?.fullName?.[0] ||
                            member.user?.email[0].toUpperCase()}
                        </div>
                      ))}
                      {board.members && board.members.length > 3 && (
                        <div 
                          className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium shadow-sm"
                          style={{ background: '#e5e7eb' }}
                        >
                          +{board.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {board.members?.length || 0} {board.members?.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 ml-auto">
                    <Icon icon="mdi:clock-outline" width={14} />
                    <span>{format(new Date(board.updatedAt), "MMM d, yyyy")}</span>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)',
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
            }}
          >
            <Icon
              icon="mdi:view-dashboard-outline"
              width={56}
              className="text-gray-300"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No boards yet
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first board to start organizing tasks and collaborating with your team
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Icon icon="mdi:plus-circle" width={22} />
            Create Your First Board
          </button>
        </div>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};