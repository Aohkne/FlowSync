import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "../api/notifications";

interface NotificationConfig {
  icon: string;
  color: string;
}

const notificationIcons: Record<Notification["type"], NotificationConfig> = {
  task_assigned: { icon: "mdi:clipboard-account", color: "#4ade80" },
  mentioned: { icon: "mdi:at", color: "#f59e0b" },
  comment_added: { icon: "mdi:comment", color: "#3b82f6" },
  task_moved: { icon: "mdi:arrow-right", color: "#8b5cf6" },
};

export const NotificationsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const { data, isLoading } = useNotifications(showUnreadOnly);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const getNotificationConfig = (type: Notification["type"]): NotificationConfig => {
    return notificationIcons[type] || { icon: "mdi:bell", color: "#6b7280" };
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl hover:bg-white/50 transition-all group"
        title="Notifications"
      >
        <Icon
          icon="mdi:bell-outline"
          width={22}
          className="text-gray-600 group-hover:text-green-600 transition-colors"
        />
        {unreadCount > 0 && (
          <span 
            className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1"
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className="absolute right-0 mt-2 w-[380px] max-h-[500px] z-50 animate-scale-in"
            style={{ top: "100%" }}
          >
            <div
              className="glass-card rounded-2xl shadow-2xl overflow-hidden"
              style={{
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Header */}
              <div
                className="p-4 border-b"
                style={{
                  borderColor: "rgba(229, 231, 235, 0.5)",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-green-600 hover:text-green-700 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUnreadOnly(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      !showUnreadOnly
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setShowUnreadOnly(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      showUnreadOnly
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Icon
                      icon="mdi:loading"
                      width={32}
                      className="animate-spin text-green-500"
                    />
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-gray-200/30">
                    {notifications.map((notification) => {
                      const config = getNotificationConfig(notification.type);
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-white/50 transition-all cursor-pointer group ${
                            !notification.isRead ? "bg-green-50/30" : ""
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div
                              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{
                                background: `${config.color}15`,
                              }}
                            >
                              <Icon
                                icon={config.icon}
                                width={20}
                                style={{ color: config.color }}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm mb-1">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>

                            {/* Unread Indicator */}
                            {!notification.isRead && (
                              <div
                                className="shrink-0 w-2.5 h-2.5 rounded-full"
                                style={{ background: config.color }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon
                      icon="mdi:bell-off-outline"
                      width={48}
                      className="text-gray-300 mx-auto mb-3"
                    />
                    <p className="text-gray-500 text-sm">
                      {showUnreadOnly ? "No unread notifications" : "No notifications yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};