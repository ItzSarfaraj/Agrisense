/*
  Crop Insight Service

  Generates human-readable agricultural insights
  based on market and recommendation data.

  Future:
  - Weather analysis
  - Seasonal outlook
  - Disease risk analysis
*/

const generateCropInsights = ({
  demand,
  trend,
  finalScore,
  expectedProfit,
}) => {
  const insights = [];

  if (demand === "High") {
    insights.push(
      "Strong market demand expected for this crop."
    );
  }

  if (trend === "Rising") {
    insights.push(
      "Market prices are showing an upward trend."
    );
  }

  if (expectedProfit > 70000) {
    insights.push(
      "High profitability potential."
    );
  }

  if (finalScore >= 90) {
    insights.push(
      "Highly recommended for cultivation."
    );
  }

  if (finalScore < 70) {
    insights.push(
      "Consider alternative crops with better potential."
    );
  }

  return insights;
};

module.exports = {
  generateCropInsights,
};