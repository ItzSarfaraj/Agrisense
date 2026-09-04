const DistrictIntelligenceCard = ({
  cropDetails,
  weather,
  state,
  district,
  season,
}) => {
  const crop = cropDetails?.[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        📍 District Intelligence
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400">State</p>
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
            {state || "N/A"}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">District</p>
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
            {district || "N/A"}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Season</p>
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
            {season || "N/A"}
          </h3>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">
            Recommended Crop
          </p>
          <h3 className="font-bold text-xl capitalize text-gray-800 dark:text-gray-100">
            {crop?.crop || "N/A"}
          </h3>
        </div>
      </div>

      <div className="mt-5 grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400">
            Temperature
          </p>
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {weather?.temperature != null
              ? `${weather.temperature}°C`
              : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">
            Humidity
          </p>
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {weather?.humidity != null
              ? `${weather.humidity}%`
              : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">
            Conditions
          </p>
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {weather?.condition || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DistrictIntelligenceCard;