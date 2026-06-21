import { useEffect, useState } from "react";
import api from "../../api/axios";
import RecommendationModal from "./RecommendationModal";
import CropModal from "../crops/CropModal";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/predictions/history");

      setHistory(response.data.history);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPredictions = history.length;

  const quickPredictions = history.filter(
    (item) => item.mode === "quick",
  ).length;

  const soilPredictions = history.filter((item) => item.mode === "soil").length;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl shadow-md dark:shadow-none p-8 text-center text-gray-700 dark:text-gray-300">
        Loading prediction history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl shadow-md dark:shadow-none p-8 text-center text-gray-700 dark:text-gray-300">
        No prediction history found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-md dark:shadow-none p-5 border border-green-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Predictions
          </p>

          <h3 className="text-3xl font-bold text-green-700 dark:text-green-400 mt-2">
            {totalPredictions}
          </h3>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-md dark:shadow-none p-5 border border-blue-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quick Mode
          </p>

          <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-2">
            {quickPredictions}
          </h3>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-md dark:shadow-none p-5 border border-amber-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Soil Mode
          </p>

          <h3 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-2">
            {soilPredictions}
          </h3>
        </div>
      </div>

      {/* History Cards */}
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {history.map((item) => {
          const topCrop = item.recommendations?.[0];

          return (
            <div
              key={item._id}
              className="
                bg-gradient-to-br
                from-green-50
                via-white
                to-emerald-50
                dark:from-gray-800
                dark:via-gray-800
                dark:to-gray-800
                rounded-2xl
                border border-green-100 dark:border-gray-700
                shadow-md dark:shadow-none
                p-6
                hover:shadow-xl
                dark:hover:border-gray-600
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.mode === "soil"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  }`}
                >
                  {item.mode === "soil" ? "Soil Mode" : "Quick Mode"}
                </span>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Location */}
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  📍 {item.district}, {item.state}
                </p>

                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  🌾 {item.season}
                </p>
              </div>

              {/* Top Crop */}
              <div className="flex items-center gap-4 mb-5 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-green-100 dark:border-gray-700">
                <img
                  src={`/crops/${topCrop?.crop?.toLowerCase()}.png`}
                  alt={topCrop?.crop}
                  onError={(e) => {
                    e.target.src = "/crops/default.png";
                  }}
                  className="w-16 h-16 rounded-xl object-cover border dark:border-gray-700"
                />

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Top Recommendation
                  </p>

                  <h3 className="text-2xl font-bold capitalize text-gray-800 dark:text-gray-100">
                    {topCrop?.crop}
                  </h3>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-900">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Top Crop
                  </p>

                  <p className="text-xl font-bold capitalize mt-1 text-green-800 dark:text-green-400">
                    {topCrop?.crop}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expected Profit
                  </p>

                  <p className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-1">
                    ₹{topCrop?.expected_profit?.toLocaleString()}
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-900">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Recommendations
                  </p>

                  <p className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-1">
                    {item.recommendations?.length}
                  </p>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => setSelectedPrediction(item)}
                className="mt-5 w-full bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
              >
                View All Recommendation
              </button>
            </div>
          );
        })}
      </div>
      <RecommendationModal
        isOpen={!!selectedPrediction}
        recommendations={selectedPrediction?.recommendations}
        onClose={() => setSelectedPrediction(null)}
      />
    </div>
  );
};

export default History;