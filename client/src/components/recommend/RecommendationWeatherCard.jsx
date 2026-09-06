const RecommendationWeatherCard = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-3xl p-6 shadow-lg">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <p className="relative text-blue-100 text-sm uppercase tracking-wide">
        Current Conditions
      </p>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            {weather.temperature}°C
          </h2>
          <p className="capitalize mt-2">{weather.description}</p>
          <p className="text-blue-100 mt-1">{weather.city}</p>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-16 h-16 sm:w-20 sm:h-20 self-start sm:self-auto"
        />
      </div>

      <div className="relative grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm">Humidity</p>
          <p className="text-2xl font-bold">{weather.humidity}%</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm">Wind Speed</p>
          <p className="text-2xl font-bold">{weather.windSpeed}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationWeatherCard;