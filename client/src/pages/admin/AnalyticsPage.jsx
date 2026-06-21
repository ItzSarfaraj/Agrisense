import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";
import {
  AlertCircle,
  Loader2,
  TrendingUp,
  Users,
  Sprout,
  Sparkles,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Response shape from GET /admin/analytics (see getAnalytics in adminController.js):
// {
//   summary: { totalUsers, totalCrops, totalPredictions, totalPricePredictions },
//   userGrowth: [{ month: "Jan", users: number }, ...],            // last 6 months
//   predictionsOverTime: [{ month: "Jan", predictions: number }, ...], // last 6 months
//   cropCategoryDistribution: [{ category: "Cereal", count: number }, ...],
//   modeSplit: [{ name: "Quick Mode" | "Soil-Based", value: number }, ...],
//   topCrops: [{ crop: "Wheat", count: number }, ...],             // top 5 by price-prediction volume
// }

const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#fbbf24", "#60a5fa"];

const tooltipStyle = {
  borderRadius: 12,
  backgroundColor: "var(--chart-tooltip-bg)",
  border: "1px solid var(--chart-tooltip-border)",
  color: "var(--chart-tooltip-text)",
};

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/analytics");
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load analytics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin mb-3 text-green-600 dark:text-green-400" size={32} />
          <p className="text-sm sm:text-base font-medium">
            Loading analytics...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ---- Error state ----
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-center px-4">
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-5 py-3 rounded-2xl text-sm mb-4 shadow-sm">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-2.5 rounded-xl bg-green-600 dark:bg-green-700 text-white text-sm font-semibold hover:bg-green-700 dark:hover:bg-green-600 active:scale-95 transition-all shadow-md shadow-green-600/20 dark:shadow-green-900/30"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const summary = data?.summary || {};
  const userGrowth = data?.userGrowth || [];
  const predictionsOverTime = data?.predictionsOverTime || [];
  const cropCategoryDistribution = data?.cropCategoryDistribution || [];
  const modeSplit = data?.modeSplit || [];
  const topCrops = data?.topCrops || [];

  const hasAnyData =
    userGrowth.length ||
    predictionsOverTime.length ||
    cropCategoryDistribution.length ||
    modeSplit.length ||
    topCrops.length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 -m-4 md:-m-6 p-4 md:p-6">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 dark:from-green-800 dark:via-emerald-800 dark:to-green-700 rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-green-900/10 dark:shadow-black/30 mb-6 sm:mb-8">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl">
              <BarChart3 size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="mt-1 text-green-100 dark:text-green-200/90 text-sm sm:text-base">
                Crop trends, prediction stats, user activity and
                recommendation insights.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Users size={16} />
              <p className="text-xs sm:text-sm">Total Users</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
              {summary.totalUsers ?? "—"}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <TrendingUp size={16} />
              <p className="text-xs sm:text-sm">Predictions Made</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-blue-500 dark:text-blue-400 mt-2">
              {summary.totalPredictions ?? "—"}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Sprout size={16} />
              <p className="text-xs sm:text-sm">Crops Tracked</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
              {summary.totalCrops ?? "—"}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Sparkles size={16} />
              <p className="text-xs sm:text-sm">Price Predictions</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-orange-500 dark:text-orange-400 mt-2">
              {summary.totalPricePredictions ?? "—"}
            </h2>
          </div>
        </div>

        {!hasAnyData ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-full mb-4">
              <BarChart3 size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">No analytics data yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Charts will populate as users and predictions come in.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            {userGrowth.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">User Growth</h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  New sign-ups over time
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--chart-axis)" }} stroke="var(--chart-axis)" />
                    <YAxis tick={{ fontSize: 12, fill: "var(--chart-axis)" }} stroke="var(--chart-axis)" allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "var(--chart-tooltip-text)" }} itemStyle={{ color: "var(--chart-tooltip-text)" }} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#16a34a" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Predictions Over Time */}
            {predictionsOverTime.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Predictions Over Time
                </h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  Crop & profit prediction requests per month
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={predictionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--chart-axis)" }} stroke="var(--chart-axis)" />
                    <YAxis tick={{ fontSize: 12, fill: "var(--chart-axis)" }} stroke="var(--chart-axis)" allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "var(--chart-tooltip-text)" }} itemStyle={{ color: "var(--chart-tooltip-text)" }} />
                    <Line
                      type="monotone"
                      dataKey="predictions"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Crop Category Distribution */}
            {cropCategoryDistribution.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Crop Category Distribution
                </h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  Number of crops tracked per category
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={cropCategoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 12, fill: "var(--chart-axis)" }}
                      stroke="var(--chart-axis)"
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "var(--chart-axis)" }} stroke="var(--chart-axis)" allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "var(--chart-tooltip-text)" }} itemStyle={{ color: "var(--chart-tooltip-text)" }} />
                    <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Prediction Mode Split */}
            {modeSplit.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Prediction Mode Split
                </h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  Quick mode vs soil-based crop recommendations
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={modeSplit}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {modeSplit.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "var(--chart-tooltip-text)" }} itemStyle={{ color: "var(--chart-tooltip-text)" }} />
                    <Legend wrapperStyle={{ color: "var(--chart-axis)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Predicted Crops */}
            {topCrops.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                  Top Predicted Crops
                </h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  Most frequently price-predicted crops
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topCrops} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "var(--chart-axis)" }} stroke="var(--chart-axis)" allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="crop"
                      tick={{ fontSize: 12, fill: "var(--chart-axis)" }}
                      stroke="var(--chart-axis)"
                      width={80}
                    />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "var(--chart-tooltip-text)" }} itemStyle={{ color: "var(--chart-tooltip-text)" }} />
                    <Bar dataKey="count" fill="#fbbf24" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;