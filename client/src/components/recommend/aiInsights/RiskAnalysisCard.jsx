import { calculateRisk } from "./AIInsightsHelper";

const RiskAnalysisCard = ({ bestCrop, cropDetails }) => {
  const risk = calculateRisk(cropDetails?.[0]);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        ⚠ Risk Analysis
      </h2>

      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p>🌱 Crop: {bestCrop?.crop}</p>
        <p>
          💧 Water Dependency:{" "}
          {cropDetails?.[0]?.details?.waterRequirement || "N/A"}
        </p>
        <p>⏳ Duration: {cropDetails?.[0]?.details?.cropDuration || "N/A"}</p>
        <p className={`font-semibold ${risk.color}`}>
          {risk.icon} Risk Level: {risk.level}
        </p>
      </div>
    </div>
  );
};

export default RiskAnalysisCard;