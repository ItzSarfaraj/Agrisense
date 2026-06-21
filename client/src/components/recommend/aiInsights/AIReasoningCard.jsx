import { getReasoning } from "./AIInsightsHelper";

const AIReasoningCard = ({ cropDetails }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🧠 AI Reasoning
      </h2>

      <div className="space-y-3">
        {getReasoning(cropDetails[0]).map((reason, index) => (
          <div key={index} className="flex items-start gap-3">
            <span>✅</span>
            <p className="text-gray-700 dark:text-gray-300">{reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIReasoningCard;