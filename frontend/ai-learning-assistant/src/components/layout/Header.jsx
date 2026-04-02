import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#e9edf2] px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button
          className="relative p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={2} className="text-gray-600" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-[#f43f5e] rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 rounded-full">
          <div className="h-9 w-9 rounded-lg bg-emerald-400 text-white font-semibold flex items-center justify-center text-sm">
            {(user?.username || "U").charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-800">
              {user?.username || "Alex"}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[200px]">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;