import { X } from "lucide-react";

const RecommendationModal = ({ isOpen, onClose, recommendations }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Saved Recommendations
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              View all crops generated for this prediction.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-5 mb-6">
          <p className="text-sm opacity-90">Best Recommendation</p>

          <h3 className="text-3xl font-bold capitalize mt-1">
            🏆 {recommendations?.[0]?.crop}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recommendations?.map((crop, index) => (
            <div
              key={index}
              className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-xl p-4 hover:shadow-md dark:hover:border-green-700 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={`/crops/${crop.crop.toLowerCase()}.png`}
                  alt={crop.crop}
                  onError={(e) => {
                    e.target.src = "/crops/default.png";
                  }}
                  className="w-12 h-12 rounded-lg object-cover border dark:border-gray-600"
                />

                <div>
                  <h3 className="font-bold text-lg capitalize text-gray-900 dark:text-gray-100">
                    #{index + 1} {crop.crop}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recommended Crop
                  </p>
                </div>
              </div>

              {crop.confidence !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      Suitability Score
                    </span>

                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {crop.confidence}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 dark:bg-green-500 rounded-full"
                      style={{
                        width: `${crop.confidence}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-900/50 rounded-lg p-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expected Profit
                </p>

                <p className="text-xl font-bold text-green-700 dark:text-green-400">
                  ₹{crop.expected_profit?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;