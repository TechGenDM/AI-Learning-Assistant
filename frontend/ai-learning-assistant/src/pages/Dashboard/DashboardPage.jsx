import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import { FileText, BookOpen, BrainCircuit, Clock3 } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // 🔄 Loading State
  if (loading) {
    return <Spinner />;
  }

  const overview = dashboardData?.overview || {};
  const recentDocuments = Array.isArray(dashboardData?.recentActivity?.document)
    ? dashboardData.recentActivity.document
    : [];
  const recentQuizzes = Array.isArray(dashboardData?.recentActivity?.quizzes)
    ? dashboardData.recentActivity.quizzes
    : [];

  const recentActivity = [
    ...recentDocuments.map((doc) => ({
      title: `Accessed Document: ${doc.title || doc.fileName || "Untitled Document"}`,
      time: doc.lastAccessed || doc.updatedAt || doc.createdAt,
    })),
    ...recentQuizzes.map((quiz) => ({
      title: `Attempted Quiz: ${quiz.title || quiz.fileName || "Untitled Quiz"}`,
      time: quiz.lastAccessed || quiz.updatedAt || quiz.createdAt,
    })),
  ].slice(0, 5);

  const fallbackActivity = [
    {
      title: "Accessed Document: React JS Study Guide",
      time: "22/11/2025, 10:39:15",
    },
    { title: "Attempted Quiz: React Js Guide Quiz", time: "Recently" },
  ];

  const stats = [
    {
      label: "Total Documents",
      value: overview.totalDocuments ?? 0,
      icon: FileText,
      bg: "bg-gradient-to-br from-sky-400 to-blue-500",
    },
    {
      label: "Total Flashcards",
      value: overview.totalFlashcards ?? overview.totalFlashcardSets ?? 0,
      icon: BookOpen,
      bg: "bg-gradient-to-br from-fuchsia-400 to-pink-500",
    },
    {
      label: "Total Quizzes",
      value: overview.totalQuizzes ?? 0,
      icon: BrainCircuit,
      bg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    },
  ];

  return (
    <div className="w-full max-w-none">
      <div className="mb-6">
        <h1 className="text-[30px] font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your learning progress and activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-[#edf1f6] px-6 py-5 shadow-[0_3px_10px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                    {stat.label}
                  </p>
                  <p className="text-4xl mt-3 font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`h-11 w-11 rounded-xl ${stat.bg} text-white flex items-center justify-center shadow-sm`}
                >
                  <Icon size={19} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-[#edf1f6] shadow-[0_3px_10px_rgba(15,23,42,0.04)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Clock3 size={16} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Recent Activity</h2>
        </div>

        <div className="space-y-3">
          {(recentActivity.length ? recentActivity : fallbackActivity).map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="border border-[#edf1f6] rounded-xl px-4 py-3.5 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm text-gray-700">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(item.time)}</p>
              </div>
              <button className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;