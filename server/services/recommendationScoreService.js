/*
  Recommendation Score Service

  Combines:
  - ML Model Confidence
  - Market Demand
  - Market Trend

  Future:
  - Weather Score
  - Seasonal Forecast
  - Risk Analysis

  Returns a final ranking score.
*/

const getDemandScore = (demand) => {
  switch (demand?.toLowerCase()) {
    case "high":
      return 100;

    case "medium":
      return 70;

    case "low":
      return 40;

    default:
      return 50;
  }
};

const getTrendScore = (trend) => {
  switch (trend?.toLowerCase()) {
    case "rising":
      return 100;

    case "stable":
      return 70;

    case "falling":
      return 40;

    default:
      return 50;
  }
};

const calculateRecommendationScore = ({
  modelConfidence,
  demand,
  trend,
}) => {
  const demandScore =
    getDemandScore(demand);

  const trendScore =
    getTrendScore(trend);

  const finalScore =
    modelConfidence * 0.7 +
    demandScore * 0.2 +
    trendScore * 0.1;

  return Math.round(finalScore);
};

module.exports = {
  calculateRecommendationScore,
};