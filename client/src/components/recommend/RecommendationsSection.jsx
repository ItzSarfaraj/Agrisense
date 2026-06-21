import React from "react";
import CropCard from "./CropCard";
import { useNavigate } from "react-router-dom";

const RecommendationsSection = ({
  recommendations = [],
  mode,
  weather,
  advisory,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Top Recommended Crops
        </h2>

        <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
          {mode === "quick" ? "⚡ Quick Recommendation" : "🧪 Soil Analysis"}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {recommendations.length} crops found
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              No Recommendations Yet
            </h3>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Select recommendation parameters and click
              <span className="font-semibold text-green-600 dark:text-green-400">
                {" "}
                Get Recommendation
              </span>
              .
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Best Recommendation Banner — fixed green gradient, no change needed */}
          <div className="mb-6 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm uppercase tracking-wide opacity-90">
              Best Recommendation
            </p>

            <h2 className="text-3xl font-bold capitalize mt-2">
              🏆 {recommendations[0].crop}
            </h2>

            <p className="mt-3 text-lg">
              Expected Profit:
              <span className="font-bold">
                {" "}
                ₹{recommendations[0].expected_profit.toLocaleString()}
              </span>{" "}
              per hectare
            </p>
            <p className="mt-2 text-green-100">
              Highest estimated profit for the selected district and season.
            </p>
            <button
              onClick={() =>
                navigate("/insights", {
                  state: {
                    recommendations,
                    weather,
                    advisory,
                  },
                })
              }
              className="mt-5 bg-white text-green-700 px-5 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
            >
              🤖 Get AI Insights
            </button>
          </div>

          {/* Crop Cards */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommendations.map((crop, index) => (
              <CropCard
                key={`${crop.crop}-${index}`}
                rank={index + 1}
                {...crop}
                onClick={() => navigate(`/crops/${crop.crop.toLowerCase()}`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendationsSection;