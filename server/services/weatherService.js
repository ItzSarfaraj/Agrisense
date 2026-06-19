const axios = require("axios");

/*
  Weather Service

  Reusable weather utility.
  Used by dashboard and recommendations.
*/

const getWeatherByCoordinates = async (
  lat,
  lon
) => {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat,
        lon,
        units: "metric",
        appid:
          process.env.OPENWEATHER_API_KEY,
      },
    }
  );

  const data = response.data;

  return {
    city: data.name,
    temperature: Math.round(
      data.main.temp
    ),
    feelsLike: Math.round(
      data.main.feels_like
    ),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: data.weather[0].main,
    description:
      data.weather[0].description,
    icon: data.weather[0].icon,
  };
};

module.exports = {
  getWeatherByCoordinates,
};