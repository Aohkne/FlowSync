import { useState } from "react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/search";
import type { TaskPriority } from "../types";

interface SearchPanelProps {
  boardId: string;
  onTaskClick: (taskId: string) => void;
}

export const SearchPanel = ({ boardId, onTaskClick }: SearchPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | "">("");
  const [assignedFilter, setAssignedFilter] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["search", boardId, searchQuery, selectedPriority, assignedFilter],
    queryFn: () =>
      searchApi.searchTasks({
        boardId,
        q: searchQuery,
        priority: selectedPriority || undefined,
        assignedTo: assignedFilter || undefined,
      }),
    enabled: isOpen && (!!searchQuery || !!selectedPriority || !!assignedFilter),
  });

  const tasks = data?.tasks || [];

  const handleReset = () => {
    setSearchQuery("");
    setSelectedPriority("");
    setAssignedFilter("");
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl hover:bg-white/50 transition-all group"
        title="Search tasks"
      >
        <Icon
          icon="mdi:magnify"
          width={22}
          className="text-gray-600 group-hover:text-green-600 transition-colors"
        />
      </button>

      {/* Search Panel Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 h-screen"
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md z-50 animate-slide-up h-screen">
            <div
              className="glass-panel h-full flex flex-col"
              style={{
                boxShadow: "-10px 0 60px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Header */}
              <div
                className="p-6 border-b"
                style={{
                  borderColor: "rgba(229, 231, 235, 0.5)",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div
                      className="w-1 h-8 rounded-full"
                      style={{
                        background: "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)",
                      }}
                    />
                    Search Tasks
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                  >
                    <Icon icon="mdi:close" width={24} />
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative border rounded-lg border-green-500 overflow-hidden">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or description..."
                    className="w-full px-11 py-2 bg-white outline-none"
                    autoFocus
                  />
                  <Icon
                    icon="mdi:magnify"
                    width={20}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="p-6 border-b space-y-4" style={{ borderColor: "rgba(229, 231, 235, 0.5)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  {(selectedPriority || assignedFilter) && (
                    <button
                      onClick={handleReset}
                      className="text-xs text-green-600 hover:text-green-700 font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "", label: "All" },
                      { value: "low", label: "Low" },
                      { value: "medium", label: "Medium" },
                      { value: "high", label: "High" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedPriority(option.value as TaskPriority | "")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedPriority === option.value
                            ? "bg-green-100 text-green-700"
                            : "bg-white/50 text-gray-600 hover:bg-white/70"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assigned Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "", label: "All" },
                      { value: "unassigned", label: "Unassigned" },
                      { value: "me", label: "Assigned to me" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setAssignedFilter(option.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          assignedFilter === option.value
                            ? "bg-green-100 text-green-700"
                            : "bg-white/50 text-gray-600 hover:bg-white/70"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Icon icon="mdi:loading" width={32} className="animate-spin text-green-500" />
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      Found {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                    </p>
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          onTaskClick(task.id);
                          setIsOpen(false);
                        }}
                        className="card hover:scale-[1.02] transition-all cursor-pointer border"
                        style={{ borderColor: "rgba(229, 231, 235, 0.5)" }}
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              background:
                                task.priority === "high"
                                  ? "rgba(239, 68, 68, 0.1)"
                                  : task.priority === "medium"
                                  ? "rgba(245, 158, 11, 0.1)"
                                  : "rgba(107, 114, 128, 0.1)",
                              color:
                                task.priority === "high"
                                  ? "#ef4444"
                                  : task.priority === "medium"
                                  ? "#f59e0b"
                                  : "#6b7280",
                            }}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (searchQuery || selectedPriority || assignedFilter) ? (
                  <div className="text-center py-12">
                    <Icon icon="mdi:file-search-outline" width={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No tasks found</p>
                    <button
                      onClick={handleReset}
                      className="text-sm text-green-600 hover:text-green-700 font-medium mt-2"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon icon="mdi:magnify" width={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Start typing to search tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};