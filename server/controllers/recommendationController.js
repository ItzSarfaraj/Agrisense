const axios = require("axios");

const { getCoordinates } = require("../services/geocodingService");

const { getWeatherByCoordinates } = require("../services/weatherService");
const {
  generateWeatherAdvisory,
} = require("../services/weatherAdvisoryService");

const ML_URL = process.env.ML_SERVICE_URL;

const getQuickRecommendation = async (req, res) => {
  try {
    const response = await axios.post(
      `${ML_URL}/recommend/quick`,
      req.body,
    );

    const { district, state } = req.body;

    // console.log("State:", state);
    // console.log("District:", district);

    const { lat, lon } = await getCoordinates(district, state);

    const weather = await getWeatherByCoordinates(lat, lon);
    const advisory = generateWeatherAdvisory(weather);

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
    const response = await axios.post(
     `${ML_URL}/recommend/soil`,
      req.body,
    );

    const { district, state } = req.body;
    // console.log("State:", state);
    // console.log("District:", district);

    const { lat, lon } = await getCoordinates(district, state);

    const weather = await getWeatherByCoordinates(lat, lon);

    const advisory = generateWeatherAdvisory(weather);

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

module.exports = {
  getQuickRecommendation,
  getSoilRecommendation,
};
