import { getCropAnalysis } from "./AIInsightsHelper";

const CropAnalysisCard = ({ crop }) => {
  const analysis = getCropAnalysis(crop);

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">🌟 SWOT Analysis</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 rounded-2xl p-4">
          <h3 className="font-bold text-green-700 mb-3">🟢 Strengths</h3>

          <ul className="space-y-2">
            {analysis.strengths.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50 rounded-2xl p-4">
          <h3 className="font-bold text-red-700 mb-3">🔴 Weaknesses</h3>

          <ul className="space-y-2">
            {analysis.weaknesses.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <h3 className="font-bold text-blue-700 mb-3">📈 Opportunities</h3>

          <ul className="space-y-2">
            {analysis.opportunities.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-yellow-50 rounded-2xl p-4">
          <h3 className="font-bold text-yellow-700 mb-3">⚠ Risks</h3>

          <ul className="space-y-2">
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
