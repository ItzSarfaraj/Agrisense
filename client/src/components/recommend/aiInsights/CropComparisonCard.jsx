import { calculateAIScore } from "./AIInsightsHelper";

const CropComparisonCard = ({ cropDetails, recommendations }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">📊 Top Crop Comparison</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {cropDetails.map((crop, index) => (
          <div
            key={crop.crop}
            className={`rounded-2xl p-5 border ${
              index === 0 ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
            }`}
          >
            <h3 className="font-bold text-lg">
              #{index + 1} {crop.crop}
            </h3>

            <div className="mt-4 space-y-2 text-sm">
              <p>💰 Profit: ₹{crop.expected_profit.toLocaleString()}</p>

              <p>
                💧 Water:
                {crop.details?.waterRequirement || "N/A"}
              </p>

              <p>
                ⏳ Duration:
                {crop.details?.cropDuration || "N/A"}
              </p>

              <p>
                📈 Demand:
                {crop.details?.marketDemand || "N/A"}
              </p>
            </div>

            <div className="mt-4">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                AI Score:
                {calculateAIScore(crop, recommendations[0]?.expected_profit)}
                /100
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropComparisonCard;
