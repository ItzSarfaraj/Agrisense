import { getCropAnalysis } from "./AIInsightsHelper";

const CropAnalysisCard = ({ crop }) => {
  const analysis = getCropAnalysis(crop);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        🌟 SWOT Analysis
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
          <h3 className="font-bold text-green-700 dark:text-green-400 mb-3">🟢 Strengths</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {analysis.strengths.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4">
          <h3 className="font-bold text-red-700 dark:text-red-400 mb-3">🔴 Weaknesses</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {analysis.weaknesses.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
          <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3">📈 Opportunities</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {analysis.opportunities.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4">
          <h3 className="font-bold text-yellow-700 dark:text-yellow-400 mb-3">⚠ Risks</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {analysis.risks.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CropAnalysisCard;