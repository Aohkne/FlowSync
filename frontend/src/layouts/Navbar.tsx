import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useAuthStore, useUser } from "../store/authStore";

export const Navbar = () => {
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/boards" className="flex items-center gap-2">
            <Icon
              icon="mdi:view-dashboard"
              width={28}
              className="text-blue-600"
            />
            <span className="text-xl font-bold text-gray-900">FlowSync</span>
          </Link>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {user.fullName?.[0] || user.email[0].toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.fullName || user.email}
                </span>
              </div>

              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Logout"
              >
                <Icon icon="mdi:logout" width={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
