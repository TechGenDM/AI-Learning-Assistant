import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  Layers,
  CheckSquare,
  Flame,
  ArrowRight,
  ArrowUpRight,
  Upload,
  PlayCircle,
  ChartBar
} from "lucide-react";

// Helper for formatting date strings
const formatRelativeTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const DashboardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="mb-6">
      <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-64 bg-gray-100 rounded"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="card-saas p-6 h-32"></div>
      ))}
    </div>
    <div className="h-10 bg-gray-200 rounded w-full max-w-lg mb-6"></div>
    <div className="flex gap-6">
      <div className="w-2/3 h-64 card-saas"></div>
      <div className="w-1/3 h-64 card-saas"></div>
    </div>
  </div>
);

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityTab, setActivityTab] = useState("all");
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

  if (loading) return <DashboardSkeleton />;

  const overview = dashboardData?.overview || {};
  const recentDocuments = Array.isArray(dashboardData?.recentActivity?.document)
    ? dashboardData.recentActivity.document
    : [];
  const recentQuizzes = Array.isArray(dashboardData?.recentActivity?.quizzes)
    ? dashboardData.recentActivity.quizzes
    : [];

  const rawActivity = [
    ...recentDocuments.map((doc) => ({
      id: doc._id || Math.random().toString(),
      type: "document",
      title: doc.title || doc.fileName || "Untitled Document",
      time: doc.lastAccessed || doc.updatedAt || doc.createdAt,
    })),
    ...recentQuizzes.map((quiz) => ({
      id: quiz._id || Math.random().toString(),
      type: "quiz",
      title: quiz.title || quiz.fileName || "Untitled Quiz",
      time: quiz.lastAccessed || quiz.updatedAt || quiz.createdAt,
    })),
  ];

  // Group duplicate activities by title and type, keeping count
  const groupedActivity = rawActivity.reduce((acc, current) => {
    const key = `${current.type}-${current.title}`;
    if (!acc[key]) {
      acc[key] = { ...current, count: 1 };
    } else {
      acc[key].count += 1;
      if (new Date(current.time) > new Date(acc[key].time)) {
        acc[key].time = current.time;
      }
    }
    return acc;
  }, {});

  const activityList = Object.values(groupedActivity).sort((a, b) => new Date(b.time) - new Date(a.time));

  // Filter logic
  const displayActivity = activityList.filter(item => {
    if (activityTab === "all") return true;
    return item.type === activityTab;
  }).slice(0, 8);

  const stats = [
    { label: "Documents", value: overview.totalDocuments ?? 0, trend: "+2 this week", icon: FileText },
    { label: "Flashcards", value: overview.totalFlashcards ?? overview.totalFlashcardSets ?? 0, trend: "+15 this week", icon: Layers },
    { label: "Quizzes", value: overview.totalQuizzes ?? 0, trend: "+1 this week", icon: CheckSquare },
    { label: "Study Streak", value: String(overview.studyStreak ?? 0), trend: overview.studyStreak > 0 ? "Active streak" : "Start a streak!", icon: Flame },
  ];

  // Extract weekly progress data from backend, fallback to empty arrays
  const wp = dashboardData?.weeklyProgress || {};
  const weeklyData = wp.data || [0, 0, 0, 0, 0, 0, 0];
  const days = wp.labels || ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const streakDays = wp.streakDays || [false, false, false, false, false, false, false];
  const maxActivities = Math.max(...weeklyData, 4); // minimum 4 to give bars some scale even if counts are low
  const currentDayIndex = 6; // since the backend explicitly constructs it so index 6 is 'today'
  const totalWeeklyActivities = weeklyData.reduce((sum, curr) => sum + curr, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const lastItem = activityList[0];

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">
          {getGreeting()}, {user?.username || "TechGen_DM"}
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Here's your learning summary for today.
        </p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-saas p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] uppercase tracking-[0.05em] font-semibold text-[#6B7280]">
                  {stat.label}
                </span>
                <div className="h-6 w-6 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                  <Icon size={14} className="text-[#4F46E5]" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#111827] tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#10B981] font-medium">
                  <ArrowUpRight size={12} />
                  <span>{stat.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button 
          onClick={() => navigate(lastItem?.type === 'document' ? `/documents/${lastItem.id}` : '/documents')}
          className="btn-saas-primary flex items-center gap-2"
        >
          <PlayCircle size={16} />
          Continue Studying
        </button>
        <button onClick={() => navigate("/documents")} className="btn-saas-outline flex items-center gap-2">
          <Upload size={16} className="text-[#6B7280]" />
          Upload Document
        </button>
        <button onClick={() => navigate("/flashcards")} className="btn-saas-outline flex items-center gap-2">
          <Layers size={16} className="text-[#6B7280]" />
          Study Flashcards
        </button>
        <button onClick={() => navigate("/quizzes")} className="btn-saas-outline flex items-center gap-2">
          <CheckSquare size={16} className="text-[#6B7280]" />
          Take a Quiz
        </button>
      </div>

      {/* Main Content: 2/3 + 1/3 Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Recent Activity (2/3) */}
        <div className="lg:w-2/3">
          <div className="card-saas overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#111827]">Recent Activity</h2>
              
              {/* Pill Tabs */}
              <div className="flex items-center bg-[#F3F4F6] p-0.5 rounded-md">
                {["all", "document", "quiz"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActivityTab(tab)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      activityTab === tab 
                      ? "bg-white text-[#111827] shadow-sm" 
                      : "text-[#6B7280] hover:text-[#374151]"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#F3F4F6]">
              {displayActivity.length > 0 ? (
                displayActivity.map((item) => {
                  const isDoc = item.type === "document";
                  return (
                    <div key={item.id} className="px-6 py-4 flex items-center justify-between group hover:bg-[#F9FAFB] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status/Type Tag */}
                        <span className={`flex-shrink-0 w-2 h-2 rounded-full ${isDoc ? 'bg-blue-500' : 'bg-amber-500'}`} />
                        
                        <div className="min-w-0 flex items-center gap-2">
                          <Link 
                            to={isDoc ? `/documents/${item.id}` : "/documents"} 
                            className="text-sm font-medium text-[#111827] truncate hover:underline hover:text-[#4F46E5] transition-colors"
                          >
                            {item.title}
                          </Link>
                          {item.count > 1 && (
                            <span className="bg-[#F3F4F6] text-[#6B7280] text-[10px] font-medium px-1.5 py-0.5 rounded">
                              ×{item.count}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-shrink-0 pl-4">
                        <span className="text-xs text-[#9CA3AF]">
                          {formatRelativeTime(item.time)}
                        </span>
                        <Link
                          to={isDoc ? `/documents/${item.id}` : "/documents"}
                          className="text-sm font-medium text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-[#6B7280]">No recent activity found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Progress & Streak (1/3) */}
        <div className="lg:w-1/3 space-y-6">
          {/* Weekly Progress Card */}
          <div className="card-saas p-6 border-t-4 border-t-[#4F46E5] shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-base font-bold text-[#111827] mb-6">Weekly Progress</h2>
            
            {/* Bar Chart */}
            <div className="flex items-end justify-between h-32 mb-5 gap-2 px-2">
              {weeklyData.map((val, idx) => {
                const heightPercentage = (val / maxActivities) * 100;
                const isCurrent = idx === currentDayIndex;
                const hasActivity = val > 0;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 flex-1 group">
                    <div className="relative w-full h-full flex items-end justify-center">
                       {/* Tooltip for value */}
                       <div className="absolute -top-8 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                         {val} act.
                       </div>
                       <div 
                         className={`w-full max-w-[20px] rounded-t-md transition-all duration-500 ease-out ${
                           isCurrent ? 'bg-gradient-to-t from-[#4F46E5] to-[#7C3AED]' : 
                           hasActivity ? 'bg-gradient-to-t from-[#818CF8] to-[#A78BFA]' : 'bg-[#F3F4F6]'
                         } ${hasActivity ? 'shadow-sm shadow-indigo-200' : ''}`}
                         style={{ height: `${Math.max(heightPercentage, 6)}%` }} // min height for empty look vs 0
                       />
                    </div>
                    <span className={`text-[11px] font-bold ${isCurrent ? 'text-[#4F46E5]' : 'text-[#9CA3AF]'}`}>{days[idx]}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-[#F9FAFB] rounded-xl p-4 flex items-center justify-between border border-[#F3F4F6]">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                    <ChartBar size={18} />
                 </div>
                 <div>
                   <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">Total Activity</p>
                   <p className="text-lg font-black text-[#111827]">{totalWeeklyActivities} <span className="text-sm font-semibold text-[#6B7280]">actions</span></p>
                 </div>
               </div>
            </div>
          </div>

          {/* Study Streak Card */}
          <div className="card-saas p-6 border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-orange-500/10 rotate-12">
               <Flame size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-base font-bold text-[#111827] mb-6 flex items-center gap-2">
                Study Streak
                {overview?.studyStreak > 0 && <Flame size={18} className="text-orange-500 animate-pulse" />}
              </h2>
              
              <div className="flex items-center justify-between mb-6">
                {streakDays.map((studied, idx) => {
                  const isToday = idx === currentDayIndex;
                  return (
                    <div 
                      key={idx} 
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                          studied 
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 border-none' 
                            : isToday 
                              ? 'border-2 border-dashed border-gray-300 bg-gray-50'
                              : 'border-2 border-[#E5E7EB] bg-transparent'
                        }`}
                      >
                        {studied ? <CheckSquare size={14} className="text-white" /> : (isToday && <span className="w-2 h-2 rounded-full bg-gray-300"></span>)}
                      </div>
                      <span className={`text-[10px] font-bold ${isToday ? 'text-orange-600' : 'text-[#9CA3AF]'}`}>{days[idx]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex items-center gap-3">
                 <div className="flex-1">
                   <p className="text-sm text-orange-900">
                     <span className="font-black text-lg">{overview?.studyStreak || 0} day streak.</span> 
                     {overview?.studyStreak > 0 ? " Keep the fire burning! 🔥" : " Time to start learning! 🚀"}
                   </p>
                 </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;