const axios = require("axios");

const getCoordinates = async (district, state) => {
  let response = await axios.get(
    "https://api.openweathermap.org/geo/1.0/direct",
    {
      params: {
        q: `${district},${state},IN`,
        limit: 1,
        appid: process.env.OPENWEATHER_API_KEY,
      },
    },
  );

  // Fallback to state
  if (!response.data.length) {
    console.log(`District not found: ${district}`);

    response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: `${state},IN`,
          limit: 1,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      },
    );
  }

  if (!response.data.length) {
    throw new Error("Location not found");
  }

  return {
    lat: response.data[0].lat,
    lon: response.data[0].lon,
  };
};

module.exports = {
  getCoordinates,
};
