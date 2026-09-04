const axios = require("axios");

const { getCoordinates } = require("../services/geocodingService");
const { getWeatherByCoordinates } = require("../services/weatherService");
const {
  generateWeatherAdvisory,
  generateRecommendationInsights
} = require("../services/genaiService");

const ML_URL = process.env.ML_SERVICE_URL;

const getQuickRecommendation = async (req, res) => {
  try {
    // Existing ML prediction — DO NOT MODIFY
    const response = await axios.post(
      `${ML_URL}/recommend/quick`,
      req.body,
    );

    const { district, state } = req.body;

    const { lat, lon } = await getCoordinates(
      district,
      state,
    );

    // Existing weather service — DO NOT MODIFY
    const weather = await getWeatherByCoordinates(
      lat,
      lon,
    );

    // GenAI replaces the old rule-based advisory
    const advisory = await generateWeatherAdvisory(
      weather,
    );

    res.status(200).json({
      recommendations: response.data.recommendations,
      weather,
      advisory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate recommendation",
    });
  }
};

const getSoilRecommendation = async (req, res) => {
  try {
    // Existing ML prediction — DO NOT MODIFY
    const response = await axios.post(
      `${ML_URL}/recommend/soil`,
      req.body,
    );

    const { district, state } = req.body;

    const { lat, lon } = await getCoordinates(
      district,
      state,
    );

    // Existing weather service — DO NOT MODIFY
    const weather = await getWeatherByCoordinates(
      lat,
      lon,
    );

    // GenAI replaces the old rule-based advisory
    const advisory = await generateWeatherAdvisory(
      weather,
    );

    res.status(200).json({
      recommendations: response.data.recommendations,
      weather,
      advisory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate recommendation",
    });
  }
};

const getRecommendationInsights = async (req, res) => {
  try {
    const insights = await generateRecommendationInsights(
      req.body,
    );

    res.status(200).json(insights);
  } catch (error) {
    console.error(
      "Recommendation insights error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      message: "Failed to generate recommendation insights",
    });
  }
};

module.exports = {
  getQuickRecommendation,
  getSoilRecommendation,
  getRecommendationInsights
};