import { useEffect, useState } from "react";
import api from "../api/axios";

import StatCard from "../components/dashboard/StatCard";
import ProgressChart from "../components/dashboard/ProgressChart";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";

import { FileText, Brain, Layers, Trophy } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Documents"
          value={stats.documents}
          icon={FileText}
        />

        <StatCard
          title="Quizzes"
          value={stats.quizzes}
          icon={Brain}
        />

        <StatCard
          title="Flashcard Sets"
          value={stats.flashcardSets}
          icon={Layers}
        />

        <StatCard
          title="Average Score"
          value={`${stats.avgScore}%`}
          icon={Trophy}
        />
      </div>

      {/* Charts */}
      <AnalyticsCharts
        weeklyUploads={stats.weeklyUploads}
        scoreTrend={stats.scoreTrend}
      />

      {/* Progress */}
      <ProgressChart
        completed={stats.completedFlashcards}
        total={stats.totalFlashcards}
      />

      {/* Recent Activity */}
<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[350px]">
  <h3 className="text-lg font-semibold mb-4 shrink-0">
    Recent Activity
  </h3>

  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
    {stats.recentActivity?.length > 0 ? (
      stats.recentActivity.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-start border-b border-slate-800 pb-3"
        >
          <p className="text-slate-300 text-sm">
            {item.message}
          </p>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))
    ) : (
      <p className="text-slate-500 text-sm">
        No recent activity yet.
      </p>
    )}
  </div>
</div>

    </div>
  );
}