const axios = require("axios");
const { getCoordinates } = require("../services/geocodingService");
const { getWeatherByCoordinates } = require("../services/weatherService");
const { generateWeatherAdvisory, generateRecommendationInsights } = require("../services/genaiService");
const { sendUpstreamError } = require("../utils/upstreamError");

const ML_URL = process.env.ML_SERVICE_URL;

// Weather and advisory are extras. If they fail, the crop recommendation must still work.
const getWeatherAndAdvisory = async (district, state) => {
  let weather = null;
  let advisory = [];
  try {
    const { lat, lon } = await getCoordinates(district, state);
    weather = await getWeatherByCoordinates(lat, lon);
  } catch (error) {
    console.error("Weather unavailable:", error.message);
  }
  if (weather) {
    try {
      advisory = await generateWeatherAdvisory(weather);
    } catch (error) {
      console.error("Advisory unavailable:", error.message);
    }
  }
  return { weather, advisory };
};

const buildRecommendation = (path) => async (req, res) => {
  try {
    const response = await axios.post(`${ML_URL}${path}`, req.body, { timeout: 30000 });
    const recommendations = response.data.recommendations;

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      return res.status(404).json({
        message: "No crop data is available for this district and season. Try a nearby district or another season.",
      });
    }

    const { district, state } = req.body;
    const { weather, advisory } = await getWeatherAndAdvisory(district, state);

    res.status(200).json({ recommendations, weather, advisory });
  } catch (error) {
    sendUpstreamError(res, error, "Failed to generate recommendation");
  }
};

const getQuickRecommendation = buildRecommendation("/recommend/quick");
const getSoilRecommendation = buildRecommendation("/recommend/soil");

const getRecommendationInsights = async (req, res) => {
  try {
    const insights = await generateRecommendationInsights(req.body);
    res.status(200).json(insights);
  } catch (error) {
    sendUpstreamError(res, error, "Failed to generate recommendation insights");
  }
};

module.exports = { getQuickRecommendation, getSoilRecommendation, getRecommendationInsights };