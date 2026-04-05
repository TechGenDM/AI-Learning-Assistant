import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, FileText, BookOpen, User, LogOut, X } from "lucide-react";
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
      <div
        className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 w-[270px] bg-white border-r border-[#e9edf2] flex flex-col transform transition-transform duration-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-16 px-5 border-b border-[#eef2f6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#22c59e] text-white flex items-center justify-center font-bold text-sm">
              C
            </div>
            <span className="text-sm font-semibold text-gray-800">
              AI Learning Assistant
            </span>
          </div>
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 pt-4 space-y-1.5">
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
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#10c7a1] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto p-3">
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
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
