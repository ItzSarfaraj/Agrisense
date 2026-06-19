import { X } from "lucide-react";
const RecommendationModal = ({ isOpen, onClose, recommendations }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className=" bg-white rounded-3xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl ">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Saved Recommendations</h2>

            <p className="text-gray-500 mt-1">
              View all crops generated for this prediction.
            </p>
          </div>

          <button
            onClick={onClose}
            className=" w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all duration-200"
          >
            <X size={20}/>
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
              className="bg-green-50 border border-green-100 rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={`/crops/${crop.crop.toLowerCase()}.png`}
                  alt={crop.crop}
                  onError={(e) => {
                    e.target.src = "/crops/default.png";
                  }}
                  className="w-12 h-12 rounded-lg object-cover border"
                />

                <div>
                  <h3 className="font-bold text-lg capitalize">
                    #{index + 1} {crop.crop}
                  </h3>

                  <p className="text-sm text-gray-500">Recommended Crop</p>
                </div>
              </div>

              {crop.confidence !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Suitability Score</span>

                    <span className="font-semibold text-green-700">
                      {crop.confidence}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{
                        width: `${crop.confidence}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg p-2">
                <p className="text-sm text-gray-500">Expected Profit</p>

                <p className="text-xl font-bold text-green-700">
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
