const RecommendationWeatherCard = ({
  weather,
}) => {
  if (!weather) return null;

  return (
    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-3xl p-6 shadow-lg">

      <p className="text-blue-100 text-sm uppercase tracking-wide">
        Current Conditions
      </p>

      <div className="flex items-center justify-between mt-4">

        <div>
          <h2 className="text-5xl font-bold">
            {weather.temperature}°C
          </h2>

          <p className="capitalize mt-2">
            {weather.description}
          </p>

          <p className="text-blue-100 mt-1">
            {weather.city}
          </p>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-20 h-20"
        />

      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm">
            Humidity
          </p>

          <p className="text-2xl font-bold">
            {weather.humidity}%
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm">
            Wind Speed
          </p>

          <p className="text-2xl font-bold">
            {weather.windSpeed}
          </p>
        </div>

      </div>

    </div>
  );
};

export default RecommendationWeatherCard;