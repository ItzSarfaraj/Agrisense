const WeatherSuitabilityCard = ({ weather, weatherAnalysis }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">🌦 Weather Suitability</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">Temperature</p>

          <h3 className="text-2xl font-bold text-orange-500">
            {weather?.temperature}°C
          </h3>
        </div>

        <div>
          <p className="text-gray-500">Humidity</p>

          <h3 className="text-2xl font-bold text-blue-500">
            {weather?.humidity}%
          </h3>
        </div>

        <div>
          <p className="text-gray-500">Conditions</p>

          <h3 className={`text-xl font-bold ${weatherAnalysis?.color}`}>
            {weatherAnalysis?.status}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WeatherSuitabilityCard;
