const axios = require("axios");

const GENAI_SERVICE_URL = process.env.GENAI_SERVICE_URL;

const generateWeatherAdvisory = async (weather) => {
  const response = await axios.post(
    `${GENAI_SERVICE_URL}/advisory/weather`,
    weather,
  );

  return response.data.advisory;
};

const generateRecommendationInsights = async (data) => {
  const response = await axios.post(
    `${GENAI_SERVICE_URL}/insights/recommendations`,
    data,
  );

  return response.data;
};

module.exports = {
  generateWeatherAdvisory,
  generateRecommendationInsights,
};