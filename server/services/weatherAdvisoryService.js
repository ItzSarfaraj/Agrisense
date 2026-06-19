/*
  Weather Advisory Service

  Generates agricultural guidance
  from live weather conditions.
*/

const generateWeatherAdvisory = (weather) => {
  const advisory = [];

  if (weather.temperature > 38) {
    advisory.push("High temperature may increase crop water requirements.");
  }

  if (weather.humidity > 80) {
    advisory.push("High humidity may increase fungal disease risk.");
  }

  if (weather.condition === "Rain" || weather.condition === "Drizzle") {
    advisory.push("Rainfall expected. Ensure proper field drainage.");
  }

  if (weather.condition === "Clear") {
    advisory.push("Clear weather is favorable for field operations.");
  }

  if (!advisory.length) {
    advisory.push("Current weather conditions are generally favorable.");
  }

  return advisory;
};

module.exports = {
  generateWeatherAdvisory,
};
