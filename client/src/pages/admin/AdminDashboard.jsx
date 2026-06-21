import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";
import { AlertCircle, Loader2 } from "lucide-react";
import AdminHero from "../../components/adminDashboard/AdminHero";
import StatsCards from "../../components/adminDashboard/StatsCards";
import SystemStatus from "../../components/adminDashboard/SystemStatus";
import QuickActions from "../../components/adminDashboard/QuickActions";
import PredictionCharts from "../../components/adminDashboard/PredictionCharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load dashboard stats. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin mb-3" size={28} />
          <p className="text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
         <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
          <button
            onClick={fetchStats}
            className="px-5 py-2 rounded-lg bg-green-600 dark:bg-green-600 text-white text-sm font-medium hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
            >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <AdminHero />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Prediction Chart */}
        <PredictionCharts />

        {/* Quick Overview Section */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <SystemStatus />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;