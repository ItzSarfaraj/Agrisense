import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";
import WeatherCard from "../components/dashboard/WeatherCard";
import { getPredictionHistory, getPriceStats } from "../api/priceApi";

import {
  BarChart3,
  Sprout,
  Zap,
  FlaskConical,
  PlusCircle,
  History,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [priceStats, setPriceStats] = useState({ totalPricePredictions: 0 });

  useEffect(() => {
    fetchStats();
    fetchPriceHistory();
    fetchPriceStats();
  }, []);

  const { user } = useAuth();

  const fetchStats = async () => {
    try {
      const response = await api.get("/predictions/stats");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const data = await getPredictionHistory();
      setPriceHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPriceStats = async () => {
    try {
      const data = await getPriceStats();
      setPriceStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center text-gray-800 dark:text-gray-100">
            Loading Dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Hero — kept as-is, green gradient stays fixed in both modes */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 rounded-3xl p-8 shadow-xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute right-32 bottom-0 w-24 h-24 bg-white/10 rounded-full"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white">
                👋 Welcome back, {user?.name}
              </h1>
              <p className="text-green-100 mt-2 text-lg">
                Smart farming decisions powered by data.
              </p>

              <div className="flex gap-4 mt-8">
                <Link
                  to="/recommend"
                  className="flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  <PlusCircle size={18} />
                  New Recommendation
                </Link>

                <Link
                  to="/history"
                  className="flex items-center gap-2 bg-green-700/30 border border-green-300 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700/50 transition"
                >
                  <History size={18} />
                  View History
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User",
                  )}&background=16a34a&color=fff`
                }
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-white/30 object-cover"
              />
              <p className="text-white font-semibold mt-3 text-lg">{user?.name}</p>
              <p className="text-green-100 text-sm capitalize">{user?.role}</p>
              <p className="text-green-100 text-xs mt-1">
                Member since {new Date(user?.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        <WeatherCard />

        {/* Stats — gradient cards: keep colored gradients, just darken border + adjust text */}
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-700 rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Total Predictions</p>
                <h2 className="text-4xl font-bold text-green-700 dark:text-green-400 mt-3">
                  {stats.totalPredictions}
                </h2>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-700 rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Most Recommended Crop</p>
                <h2 className="text-3xl font-bold capitalize text-green-800 dark:text-green-400 mt-3">
                  {stats.topCrop}
                </h2>
              </div>
              <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-gray-700 rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Quick Mode</p>
                <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mt-3">
                  {stats.quickPredictions}
                </h2>
              </div>
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 border border-amber-200 dark:border-gray-700 rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Soil Mode</p>
                <h2 className="text-4xl font-bold text-amber-700 dark:text-amber-400 mt-3">
                  {stats.soilPredictions}
                </h2>
              </div>
              <FlaskConical className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 border border-purple-200 dark:border-gray-700 rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Price Predictions</p>
                <h2 className="text-4xl font-bold text-purple-700 dark:text-purple-400 mt-3">
                  {priceStats.totalPricePredictions}
                </h2>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-green-100 dark:border-gray-700 shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Recent Activity
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last {stats.recentPredictions.length} Predictions
            </span>
          </div>

          <div className="space-y-3 max-w-5xl mx-auto">
            {stats.recentPredictions.map((prediction) => {
              const crop = prediction.recommendations?.[0]?.crop;
              const profit = prediction.recommendations?.[0]?.expected_profit;

              return (
                <div
                  key={prediction._id}
                  className="flex justify-between items-center p-4 rounded-xl bg-white/70 dark:bg-gray-700/50 border border-green-100 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-gray-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`/crops/${crop?.toLowerCase()}.png`}
                      alt={crop}
                      onError={(e) => {
                        e.target.src = "/crops/default.png";
                      }}
                      className="w-14 h-14 rounded-lg object-cover border dark:border-gray-600"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg capitalize text-gray-800 dark:text-gray-100">
                          {crop}
                        </p>
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Top Pick
                        </span>
                      </div>

                      <p className="text-green-700 dark:text-green-400 font-semibold text-sm">
                        ₹{profit?.toLocaleString()} Expected Profit
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        📍 {prediction.district}, {prediction.state}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        🌾 {prediction.season}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        prediction.mode === "soil"
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                          : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                      }`}
                    >
                      {prediction.mode === "soil" ? "Soil Mode" : "Quick Mode"}
                    </span>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      {new Date(prediction.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Price Predictions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Recent Price Predictions
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last {priceHistory.length}
            </span>
          </div>

          {priceHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No price predictions yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 text-gray-700 dark:text-gray-300">Crop</th>
                    <th className="text-left py-3 text-gray-700 dark:text-gray-300">Location</th>
                    <th className="text-left py-3 text-gray-700 dark:text-gray-300">Month</th>
                    <th className="text-left py-3 text-gray-700 dark:text-gray-300">Price</th>
                    <th className="text-left py-3 text-gray-700 dark:text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 font-semibold capitalize text-gray-800 dark:text-gray-100">
                        {item.crop}
                      </td>
                      <td className="py-4 text-gray-800 dark:text-gray-200">
                        {item.district}, {item.state}
                      </td>
                      <td className="py-4 text-gray-800 dark:text-gray-200">
                        {months[item.month - 1]}
                      </td>
                      <td className="py-4 font-bold text-green-600 dark:text-green-400">
                        ₹{Number(item.predictedPrice).toLocaleString()}
                      </td>
                      <td className="py-4 text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;