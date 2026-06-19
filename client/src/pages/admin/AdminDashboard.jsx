import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";
import { Users, BarChart3, Zap, FlaskConical, Sprout } from "lucide-react";
import AdminHero from "../../components/adminDashboard/AdminHero";
import StatsCards from "../../components/adminDashboard/StatsCards";
import SystemStatus from "../../components/adminDashboard/SystemStatus";
import QuickActions from "../../components/adminDashboard/QuickActions";
import PredictionCharts from "../../components/adminDashboard/PredictionCharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");

      setStats(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h2 className="text-2xl font-semibold">Loading Dashboard...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <AdminHero />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/*Prediction Chart */}
        <PredictionCharts />

        {/* Quick Overview Section */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <SystemStatus />

          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
