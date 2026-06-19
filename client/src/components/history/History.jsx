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
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        Loading prediction history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        No prediction history found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-md p-5 border border-green-100">
          <p className="text-sm text-gray-500">Total Predictions</p>

          <h3 className="text-3xl font-bold text-green-700 mt-2">
            {totalPredictions}
          </h3>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md p-5 border border-blue-100">
          <p className="text-sm text-gray-500">Quick Mode</p>

          <h3 className="text-3xl font-bold text-blue-700 mt-2">
            {quickPredictions}
          </h3>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-md p-5 border border-amber-100">
          <p className="text-sm text-gray-500">Soil Mode</p>

          <h3 className="text-3xl font-bold text-amber-700 mt-2">
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
                rounded-2xl
                border border-green-100
                shadow-md
                p-6
                hover:shadow-xl
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
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.mode === "soil" ? "Soil Mode" : "Quick Mode"}
                </span>

                <span className="text-sm text-gray-500">
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
                <p className="text-gray-700">
                  📍 {item.district}, {item.state}
                </p>

                <p className="text-gray-700 mt-1">🌾 {item.season}</p>
              </div>

              {/* Top Crop */}
              <div className="flex items-center gap-4 mb-5 bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-green-100">
                <img
                  src={`/crops/${topCrop?.crop?.toLowerCase()}.png`}
                  alt={topCrop?.crop}
                  onError={(e) => {
                    e.target.src = "/crops/default.png";
                  }}
                  className="w-16 h-16 rounded-xl object-cover border"
                />

                <div>
                  <p className="text-sm text-gray-500">Top Recommendation</p>

                  <h3 className="text-2xl font-bold capitalize text-gray-800">
                    {topCrop?.crop}
                  </h3>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-gray-500">Top Crop</p>

                  <p className="text-xl font-bold capitalize mt-1 text-green-800">
                    {topCrop?.crop}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-gray-500">Expected Profit</p>

                  <p className="text-xl font-bold text-blue-700 mt-1">
                    ₹{topCrop?.expected_profit?.toLocaleString()}
                  </p>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-sm text-gray-500">Total Recommendations</p>

                  <p className="text-xl font-bold text-amber-700 mt-1">
                    {item.recommendations?.length}
                  </p>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => setSelectedPrediction(item)}
                className="mt-5 w-full bg-gradient-to-r  from-green-600  to-emerald-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
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
