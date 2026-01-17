import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useAuthStore, useUser } from "../store/authStore";

export const Navbar = () => {
  const user = useUser();
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/boards" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" 
                style={{ backgroundColor: '#4ade80' }} 
              />
              <div 
                className="relative p-2 rounded-xl shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)'
                }}
              >
                <Icon
                  icon="mdi:view-dashboard-variant"
                  width={28}
                  className="text-white"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span 
                className="text-xl font-bold"
                style={{ 
                  background: 'linear-gradient(to right, #16a34a, #166534)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                FlowSync
              </span>
              <span 
                className="text-[10px] font-medium tracking-wider uppercase"
                style={{ color: 'rgba(22, 163, 74, 0.6)' }}
              >
                Project Management
              </span>
            </div>
          </Link>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button 
                className="relative p-2 rounded-xl hover:bg-white/50 transition-colors group"
                title="Notifications"
              >
                <Icon 
                  icon="mdi:bell-outline" 
                  width={22} 
                  className="text-gray-600 group-hover:transition-colors"
                  style={{ color: '#4b5563' }}
                />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/50 hover:bg-white/70 transition-all group">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || "User"}
                      className="w-9 h-9 rounded-full transition-all"
                      style={{ 
                        boxShadow: '0 0 0 2px rgba(74, 222, 128, 0.3)'
                      }}
                    />
                  ) : (
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
                        boxShadow: '0 0 0 2px rgba(74, 222, 128, 0.3)'
                      }}
                    >
                      {user.fullName?.[0] || user.email[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {user.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-300 group"
                title="Logout"
              >
                <Icon 
                  icon="mdi:logout-variant" 
                  width={20} 
                  className="group-hover:rotate-12 transition-transform duration-300"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};