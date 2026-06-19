/*
  Recommendation Enhancement Service

  Enhances ML recommendations with:
  - Market Data
  - Final Recommendation Score
  - Agricultural Insights
*/

const {
  getMarketData,
} = require("./marketPriceService");

const {
  calculateRecommendationScore,
} = require("./recommendationScoreService");

const {
  generateCropInsights,
} = require("./cropInsightService");

const enhanceRecommendation = (
  recommendation
) => {
  const marketData =
    getMarketData(recommendation.crop);

  const finalScore =
    calculateRecommendationScore({
      modelConfidence:
        recommendation.confidence,
      demand: marketData.demand,
      trend: marketData.trend,
    });

  const insights =
    generateCropInsights({
      demand: marketData.demand,
      trend: marketData.trend,
      finalScore,
      expectedProfit:
        recommendation.expected_profit,
    });

  return {
    ...recommendation,

    marketPrice:
      marketData.currentPrice,

    marketDemand:
      marketData.demand,

    marketTrend:
      marketData.trend,

    finalScore,

    insights,
  };
};

module.exports = {
  enhanceRecommendation,
};