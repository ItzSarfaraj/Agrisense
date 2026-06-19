/*
  Market Price Service

  Provides crop market price, demand and trend data.

  Currently uses static data.
  Later this service can be replaced with a real mandi/market API
  without changing recommendation logic.
*/

const marketData = {
  rice: {
    currentPrice: 2450,
    demand: "High",
    trend: "Rising",
  },

  wheat: {
    currentPrice: 2350,
    demand: "High",
    trend: "Stable",
  },

  maize: {
    currentPrice: 2200,
    demand: "Medium",
    trend: "Rising",
  },

  cotton: {
    currentPrice: 7600,
    demand: "High",
    trend: "Rising",
  },

  sugarcane: {
    currentPrice: 340,
    demand: "High",
    trend: "Stable",
  },

  soybean: {
    currentPrice: 5800,
    demand: "High",
    trend: "Rising",
  },

  mustard: {
    currentPrice: 6100,
    demand: "Medium",
    trend: "Stable",
  },

  banana: {
    currentPrice: 1800,
    demand: "High",
    trend: "Rising",
  },

  mango: {
    currentPrice: 4500,
    demand: "High",
    trend: "Rising",
  },

  papaya: {
    currentPrice: 2200,
    demand: "Medium",
    trend: "Stable",
  },
};

const getMarketData = (cropName) => {
  return (
    marketData[cropName.toLowerCase()] || {
      currentPrice: 0,
      demand: "Unknown",
      trend: "Unknown",
    }
  );
};

module.exports = {
  getMarketData,
};