import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  Clock3,
  Upload,
  Zap,
  ArrowRight,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboard();
        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  const overview = dashboardData?.overview || {};
  const recentDocuments = Array.isArray(dashboardData?.recentActivity?.document)
    ? dashboardData.recentActivity.document
    : [];
  const recentQuizzes = Array.isArray(dashboardData?.recentActivity?.quizzes)
    ? dashboardData.recentActivity.quizzes
    : [];

  const recentActivity = [
    ...recentDocuments.map((doc) => ({
      type: "document",
      title: doc.title || doc.fileName || "Untitled Document",
      time: doc.lastAccessed || doc.updatedAt || doc.createdAt,
    })),
    ...recentQuizzes.map((quiz) => ({
      type: "quiz",
      title: quiz.title || quiz.fileName || "Untitled Quiz",
      time: quiz.lastAccessed || quiz.updatedAt || quiz.createdAt,
    })),
  ].slice(0, 6);

  const fallbackActivity = [
    { type: "document", title: "React JS Study Guide", time: "22/11/2025, 10:39:15" },
    { type: "quiz", title: "React Js Guide Quiz", time: "Recently" },
  ];

  const displayActivity = recentActivity.length ? recentActivity : fallbackActivity;

  const stats = [
    {
      label: "Total Documents",
      value: overview.totalDocuments ?? 0,
      icon: FileText,
      cardBg: "#EFF6FF",
      iconBg: "#DBEAFE",
      iconColor: "#3B82F6",
    },
    {
      label: "Total Flashcards",
      value: overview.totalFlashcards ?? overview.totalFlashcardSets ?? 0,
      icon: BookOpen,
      cardBg: "#FDF2F8",
      iconBg: "#FCE7F3",
      iconColor: "#EC4899",
    },
    {
      label: "Total Quizzes",
      value: overview.totalQuizzes ?? 0,
      icon: BrainCircuit,
      cardBg: "#F0FDF4",
      iconBg: "#D1FAE5",
      iconColor: "#10B981",
    },
  ];

  const quickActions = [
    { label: "Upload Document", icon: Upload, onClick: () => navigate("/documents") },
    { label: "Study Flashcards", icon: BookOpen, onClick: () => navigate("/documents") },
    { label: "Take a Quiz", icon: Zap, onClick: () => navigate("/documents") },
  ];

  return (
    <div className="w-full max-w-none">
      {/* Greeting + Title */}
      <div className="mb-7">
        <p className="text-[13px] text-[#9CA3AF] font-medium mb-1">
          Welcome back, {user?.username || "Learner"} 👋
        </p>
        <h1 className="text-[28px] font-bold text-[#111827] leading-tight">
          Dashboard
        </h1>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Track your learning progress and activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl p-6 transition-all duration-200 cursor-default"
              style={{
                background: stat.cardBg,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
                minHeight: "120px",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest font-semibold text-[#9CA3AF] mb-3">
                    {stat.label}
                  </p>
                  <p
                    className="font-extrabold text-[#111827] leading-none"
                    style={{ fontSize: "40px" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[12px] text-[#9CA3AF] mt-2">Last updated today</p>
                </div>
                <div
                  className="flex items-center justify-center rounded-2xl flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: stat.iconBg,
                  }}
                >
                  <Icon size={22} color={stat.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[#10B981] text-[#10B981] text-sm font-semibold transition-all duration-150 hover:bg-[#F0FDF4] cursor-pointer"
              style={{ boxShadow: "0 1px 3px rgba(16,185,129,0.1)" }}
            >
              <Icon size={15} />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div
        className="bg-white rounded-2xl p-5"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="h-8 w-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">
            <Clock3 size={15} />
          </div>
          <h2 className="text-[18px] font-semibold text-[#111827]">
            Recent Activity
          </h2>
        </div>

        <div className="space-y-0">
          {displayActivity.map((item, idx) => {
            const isDoc = item.type === "document";
            return (
              <div key={`${item.title}-${idx}`}>
                <div className="flex items-center justify-between gap-4 py-3.5 pl-4 pr-2"
                  style={{ borderLeft: "3px solid #10B981" }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Type badge */}
                    <span
                      className="flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: isDoc ? "#DBEAFE" : "#FEF3C7",
                        color: isDoc ? "#2563EB" : "#D97706",
                      }}
                    >
                      {isDoc ? "Document" : "Quiz"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-[#374151] font-medium truncate">
                        {isDoc ? "Accessed: " : "Attempted: "}{item.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[12px] text-[#9CA3AF] hidden sm:block">
                      {formatDate(item.time)}
                    </span>
                    <button
                      onClick={() => navigate(isDoc ? "/documents" : "/documents")}
                      className="text-sm font-semibold text-[#10B981] hover:text-[#059669] flex items-center gap-1 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-[#F0FDF4]"
                    >
                      View <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                {idx < displayActivity.length - 1 && (
                  <div className="h-px bg-[#F3F4F6] ml-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* View All link if > 5 items */}
        {displayActivity.length >= 5 && (
          <div className="mt-4 pt-4 border-t border-[#F3F4F6] flex justify-end">
            <button
              onClick={() => navigate("/documents")}
              className="text-sm font-semibold text-[#10B981] hover:text-[#059669] transition-colors cursor-pointer"
            >
              View All Activity →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;