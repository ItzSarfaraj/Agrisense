import { generateComparisonReason } from "./AIInsightsHelper";

const AIComparisonAnalysisCard = ({ cropDetails }) => {
  if (cropDetails.length < 2) {
    return null;
  }

  const reasons = generateComparisonReason(cropDetails[0], cropDetails[1]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        🧠 AI Decision Analysis
      </h2>

      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          AI selected
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {" "}
            {cropDetails[0].crop}
          </span>{" "}
          over
          <span className="font-bold text-gray-800 dark:text-gray-100"> {cropDetails[1].crop}</span> because it
          achieved a higher overall AI score.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border dark:border-gray-700 rounded-2xl p-4 bg-indigo-50 dark:bg-indigo-900/20">
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
              🥇 {cropDetails[0].crop}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Profit: ₹{cropDetails[0].expected_profit.toLocaleString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Demand: {cropDetails[0].details?.marketDemand || "N/A"}
            </p>
          </div>

          <div className="border dark:border-gray-700 rounded-2xl p-4">
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
              🥈 {cropDetails[1].crop}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Profit: ₹{cropDetails[1].expected_profit.toLocaleString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Demand: {cropDetails[1].details?.marketDemand || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">
          <h3 className="font-bold text-indigo-700 dark:text-indigo-400 mb-3">
            🤖 AI Explanation
          </h3>
          <div className="space-y-2">
            {reasons.map((reason, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                • {reason}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIComparisonAnalysisCard;