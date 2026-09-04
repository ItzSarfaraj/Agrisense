import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PredictionForm from "../components/recommend/PredictionForm";
import RecommendationsSection from "../components/recommend/RecommendationsSection";
import RecommendationWeatherCard from "../components/recommend/RecommendationWeatherCard";
import AgriculturalAdvisory from "../components/recommend/AgriculturalAdvisory";
import { useAgriSenseContext } from "../context/AgriSenseContext";

const Recommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [mode, setMode] = useState("quick");
  const [weather, setWeather] = useState(null);
  const [advisory, setAdvisory] = useState([]);
  const [location, setLocation] = useState({
    state: "",
    district: "",
    season: "",
  });

  const { updateAgriSenseContext } = useAgriSenseContext();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/20 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-green-700 to-teal-600 shadow-2xl mb-8">
            <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="absolute top-10 right-10 text-7xl opacity-10 rotate-12 select-none">
              🌾
            </div>

            <div className="relative p-6 md:p-8 lg:p-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm shadow-lg">
                  🌱 Smart Agriculture Intelligence
                </div>

                <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                  Crop Recommendation
                </h1>

                <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-emerald-50">
                  Generate data-driven crop recommendations using your
                  location, farming season and soil conditions.
                </p>
              </div>
            </div>
          </section>

          <div className="space-y-8">
            <PredictionForm
              setRecommendations={setRecommendations}
              mode={mode}
              setMode={setMode}
              setWeather={setWeather}
              setAdvisory={setAdvisory}
              onLocationChange={setLocation}
              onContextChange={updateAgriSenseContext}
            />

            {weather && (
              <RecommendationWeatherCard weather={weather} />
            )}

            {advisory?.length > 0 && (
              <AgriculturalAdvisory advisory={advisory} />
            )}

            <RecommendationsSection
              recommendations={recommendations}
              mode={mode}
              weather={weather}
              advisory={advisory}
              state={location.state}
              district={location.district}
              season={location.season}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Recommend;