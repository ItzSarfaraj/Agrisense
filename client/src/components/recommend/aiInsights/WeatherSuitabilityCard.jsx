const WeatherSuitabilityCard = ({ weather, advisory }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🌦 Weather & Agricultural Advisory
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Temperature</p>
          <h3 className="text-2xl font-bold text-orange-500 dark:text-orange-400">
            {weather?.temperature != null
              ? `${weather.temperature}°C`
              : "N/A"}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Humidity</p>
          <h3 className="text-2xl font-bold text-blue-500 dark:text-blue-400">
            {weather?.humidity != null
              ? `${weather.humidity}%`
              : "N/A"}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Conditions</p>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {weather?.condition || "N/A"}
          </h3>
        </div>
      </div>

      <div>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          AI Weather Advisory
        </p>

        {advisory?.length ? (
          <ul className="space-y-2">
            {advisory.map((item, index) => (
              <li
                key={index}
                className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-gray-700 dark:text-gray-300"
              >
                🌱 {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No weather advisory available.
          </p>
        )}
      </div>
    </div>
  );
};

export default WeatherSuitabilityCard;