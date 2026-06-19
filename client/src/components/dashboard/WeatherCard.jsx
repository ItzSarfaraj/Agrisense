import { useEffect, useState } from "react";
import api from "../../api/axios";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather(28.6139, 77.209); // Delhi fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        fetchWeather(28.6139, 77.209); // Delhi fallback
      },
    );
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await api.get(`/weather/current?lat=${lat}&lon=${lon}`);

      setWeather(response.data.weather);
    } catch (error) {
      console.error("Weather Fetch Error", error);
    }
  };

  if (!weather) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-green-500 rounded-3xl p-5 text-white shadow-lg">
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 left-1/2 w-28 h-28 bg-white/10 rounded-full"></div>

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section */}
        <div>
          <p className="text-green-100 text-sm uppercase tracking-wider">
            Current Weather
          </p>

          <div className="flex items-center gap-4 mt-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-20 h-20"
            />

            <div>
              <h2 className="text-5xl font-bold">{weather.temperature}°C</h2>

              <p className="capitalize text-green-100 text-lg">
                {weather.description}
              </p>

              <p className="text-sm text-green-100 mt-1">
                Feels like {weather.feelsLike}°C
              </p>
            </div>
          </div>

          <p className="text-green-100 text-sm mt-4">
            {weather.temperature > 40
              ? "High temperature detected. Consider irrigation and avoid midday field work."
              : weather.humidity > 80
                ? "High humidity may increase disease risk."
                : "Weather conditions are currently favorable for field activities."}
          </p>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-xs text-green-100">Humidity</p>

            <p className="text-2xl font-bold mt-1">{weather.humidity}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-xs text-green-100">Wind</p>

            <p className="text-2xl font-bold mt-1">{weather.windSpeed}</p>

            <p className="text-xs text-green-100">m/s</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-xs text-green-100">Condition</p>

            <p className="font-bold mt-2 capitalize">{weather.condition}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-xs text-green-100">Location</p>

            <p className="font-bold mt-2">{weather.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
