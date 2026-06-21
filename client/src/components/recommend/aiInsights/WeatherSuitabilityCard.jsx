const WeatherSuitabilityCard = ({ weather, weatherAnalysis }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🌦 Weather Suitability
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Temperature</p>
          <h3 className="text-2xl font-bold text-orange-500 dark:text-orange-400">
            {weather?.temperature}°C
          </h3>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Humidity</p>
          <h3 className="text-2xl font-bold text-blue-500 dark:text-blue-400">
            {weather?.humidity}%
          </h3>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Conditions</p>
          <h3 className={`text-xl font-bold ${weatherAnalysis?.color}`}>
            {weatherAnalysis?.status}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WeatherSuitabilityCard;