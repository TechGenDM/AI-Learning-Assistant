import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, FileText, User, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Documents", to: "/documents", icon: FileText },
  { label: "Profile", to: "/profile", icon: User },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        style={{ width: "240px", boxShadow: "1px 0 0 #F1F3F4" }}
        className={`fixed md:static z-40 inset-y-0 left-0 bg-white flex flex-col transform transition-transform duration-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-bold text-sm"
              style={{ boxShadow: "0 2px 8px rgba(16,185,129,0.35)" }}
            >
              C
            </div>
            <span className="text-sm font-semibold text-[#111827]">
              AI Learning
            </span>
          </div>
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 pt-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (isSidebarOpen) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#10B981] text-white shadow-sm"
                      : "text-[#6B7280] hover:bg-[#F0FDF4] hover:text-[#10B981]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active left accent bar */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-60"
                        aria-hidden="true"
                      />
                    )}
                    <Icon size={16} className={isActive ? "text-white" : ""} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout — with gradient fade */}
        <div className="p-3 sidebar-footer-gradient">
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-red-50 hover:text-red-500 transition-all duration-150 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
