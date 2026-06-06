import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [userHovered, setUserHovered] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[#F1F5F9] px-4 md:px-8 flex items-center justify-between"
      style={{ boxShadow: "0 1px 0 #F1F5F9" }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-[#374151]" />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Notification Bell with red dot */}
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={2} className="text-[#6B7280]" />
          {/* Red dot badge — 8px */}
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#EF4444] rounded-full"
            aria-hidden="true"
          />
        </button>

        {/* User chip — hoverable pill */}
        <div
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer"
          style={{
            background: userHovered ? "#F3F4F6" : "transparent",
          }}
          onMouseEnter={() => setUserHovered(true)}
          onMouseLeave={() => setUserHovered(false)}
        >
          <div
            className="h-8 w-8 rounded-lg bg-[#10B981] text-white font-semibold flex items-center justify-center text-sm flex-shrink-0"
            style={{ boxShadow: "0 1px 4px rgba(16,185,129,0.3)" }}
          >
            {(user?.username || "U").charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-[#111827]">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-[#9CA3AF] truncate max-w-[160px]">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;