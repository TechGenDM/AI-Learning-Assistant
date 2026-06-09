import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, Menu, Search, LogOut, User as UserIcon, Settings } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between z-30 relative">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-[#374151]" />
        </button>

        {/* Global Search Bar (Centered visually by flexible margins, but left aligned here for simplicity with mobile menu) */}
        <div className="hidden md:flex items-center gap-2 bg-[#F8F9FC] border border-[#E5E7EB] rounded-md px-3 py-1.5 w-full max-w-md transition-colors focus-within:border-[#4F46E5] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#4F46E5]">
          <Search size={16} className="text-[#6B7280]" />
          <input 
            type="text" 
            placeholder="Search documents, flashcards, quizzes..." 
            className="bg-transparent border-none outline-none text-sm w-full text-[#111827] placeholder-[#6B7280]"
          />
          <div className="flex-shrink-0 text-[10px] font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded px-1.5 py-0.5">
            ⌘K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100 transition cursor-pointer">
          <Search size={18} className="text-[#6B7280]" />
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-md hover:bg-gray-100 transition cursor-pointer text-[#6B7280]"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Badge */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#4F46E5] rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="h-8 w-8 rounded-full bg-[#E5E7EB] text-[#4B5563] font-semibold flex items-center justify-center text-sm cursor-pointer hover:ring-2 hover:ring-[#E5E7EB] transition-all focus:outline-none"
          >
            {(user?.username || "U").charAt(0).toUpperCase()}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md py-1 border border-[#E5E7EB] shadow-lg transform transition-all"
            >
              <div className="py-1 border-b border-[#E5E7EB] px-3">
                <p className="text-sm font-medium text-[#111827] truncate">{user?.username || "User"}</p>
                <p className="text-xs text-[#6B7280] truncate">{user?.email || "user@example.com"}</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#374151] hover:bg-[#F8F9FC] flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon size={14} className="text-[#6B7280]" />
                  Profile
                </button>
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#374151] hover:bg-[#F8F9FC] flex items-center gap-2 cursor-pointer"
                >
                  <Settings size={14} className="text-[#6B7280]" />
                  Settings
                </button>
              </div>
              <div className="py-1 border-t border-[#E5E7EB]">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;