import { useState } from "react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { activitiesApi } from "../api/activities";
import { formatDistanceToNow } from "date-fns";

interface ActivitySidebarProps {
  boardId: string;
}

const activityConfig = {
  created: { icon: "mdi:plus-circle", color: "#22c55e", label: "created" },
  updated: { icon: "mdi:pencil", color: "#3b82f6", label: "updated" },
  deleted: { icon: "mdi:delete", color: "#ef4444", label: "deleted" },
  moved: { icon: "mdi:arrow-right", color: "#8b5cf6", label: "moved" },
  commented: { icon: "mdi:comment", color: "#f59e0b", label: "commented on" },
};

export const ActivitySidebar = ({ boardId }: ActivitySidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["activities", boardId],
    queryFn: () => activitiesApi.getBoardActivities(boardId, { limit: 50 }),
    enabled: isOpen,
  });

  const activities = data?.activities || [];

  return (
    <>
      {/* Activity Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl hover:bg-white/50 transition-all group"
        title="Activity log"
      >
        <Icon
          icon="mdi:history"
          width={22}
          className="text-gray-600 group-hover:text-green-600 transition-colors"
        />
      </button>

      {/* Activity Sidebar */}
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

          {/* Sidebar */}
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
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
                }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div
                      className="w-1 h-8 rounded-full"
                      style={{
                        background: "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)",
                      }}
                    />
                    Activity Log
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                  >
                    <Icon icon="mdi:close" width={24} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Recent activity on this board
                </p>
              </div>

              {/* Activity Timeline */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Icon icon="mdi:loading" width={32} className="animate-spin text-green-500" />
                  </div>
                ) : activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity, index) => {
                      const config = activityConfig[activity.action] || activityConfig.updated;
                      return (
                        <div
                          key={activity.id}
                          className="relative"
                        >
                          {/* Timeline Line */}
                          {index < activities.length - 1 && (
                            <div
                              className="absolute left-5 top-12 bottom-0 w-0.5"
                              style={{
                                background: "linear-gradient(180deg, rgba(229, 231, 235, 0.5) 0%, transparent 100%)",
                              }}
                            />
                          )}

                          {/* Activity Item */}
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div
                              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center relative z-10"
                              style={{
                                background: `${config.color}15`,
                              }}
                            >
                              <Icon icon={config.icon} width={20} style={{ color: config.color }} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div
                                className="p-3 rounded-xl"
                                style={{ background: "rgba(249, 250, 251, 0.8)" }}
                              >
                                <p className="text-sm text-gray-900 mb-1">
                                  <span className="font-semibold">
                                    {activity.user?.fullName || "User"}
                                  </span>{" "}
                                  <span className="text-gray-600">{config.label}</span>{" "}
                                  <span className="font-medium">{activity.entityType}</span>
                                </p>
                                {activity.metadata && (
                                  <p className="text-xs text-gray-500">
                                    {JSON.stringify(activity.metadata).slice(0, 100)}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatDistanceToNow(new Date(activity.createdAt), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon icon="mdi:history" width={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No activity yet</p>
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