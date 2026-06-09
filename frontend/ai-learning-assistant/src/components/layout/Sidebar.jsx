import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, FileText, Layers, CheckSquare, Settings, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Documents", to: "/documents", icon: FileText },
  { label: "Flashcards", to: "/flashcards", icon: Layers },
  { label: "Quizzes", to: "/quizzes", icon: CheckSquare },
  { label: "Settings", to: "/profile", icon: Settings },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar, isSidebarCollapsed, toggleDesktopCollapse }) => {
  const { user } = useAuth();

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
        style={{ 
          width: isSidebarCollapsed ? "80px" : "240px", 
          transition: "width 0.2s ease, transform 0.2s ease"
        }}
        className={`fixed md:static z-40 inset-y-0 left-0 bg-white border-r border-[#E5E7EB] flex flex-col transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap">
            <div className="h-7 w-7 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              AL
            </div>
            {!isSidebarCollapsed && (
              <span className="text-sm font-semibold text-[#111827]">
                AI Learning
              </span>
            )}
          </div>
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100 cursor-pointer flex-shrink-0"
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
                  `relative flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#EEF2FF] text-[#4F46E5]"
                      : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"
                  }`
                }
                title={isSidebarCollapsed ? item.label : ""}
              >
                {({ isActive }) => (
                  <>
                    {/* Active left 3px accent border */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#4F46E5] rounded-r-md"
                        aria-hidden="true"
                      />
                    )}
                    <Icon size={isSidebarCollapsed ? 20 : 18} className={isActive ? "text-[#4F46E5]" : ""} />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Block */}
        <div className="border-t border-[#E5E7EB] p-4">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
            <div className="h-8 w-8 rounded-full bg-[#E5E7EB] text-[#4B5563] font-semibold flex items-center justify-center text-sm flex-shrink-0">
              {(user?.username || "U").charAt(0).toUpperCase()}
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#111827] truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-[#6B7280] truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={toggleDesktopCollapse}
            className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-2"} text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer`}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            {!isSidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
