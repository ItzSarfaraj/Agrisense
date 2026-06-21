import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PredictionForm from "../components/recommend/PredictionForm";
import RecommendationsSection from "../components/recommend/RecommendationsSection";
import RecommendationWeatherCard from "../components/recommend/RecommendationWeatherCard";
import AgriculturalAdvisory from "../components/recommend/AgriculturalAdvisory";

const Recommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [mode, setMode] = useState("quick");
  const [weather, setWeather] = useState(null);
  const [advisory, setAdvisory] = useState([]);

  return (
    <DashboardLayout>
      <div className="mb-6 px-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Crop Recommendation
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Get AI-powered crop recommendations for your farm.
        </p>
      </div>

      <div className="space-y-8 p-8">
        <div>
          <PredictionForm
            setRecommendations={setRecommendations}
            mode={mode}
            setMode={setMode}
            setWeather={setWeather}
            setAdvisory={setAdvisory}
          />
        </div>

        {weather && <RecommendationWeatherCard weather={weather} />}
        <AgriculturalAdvisory advisory={advisory} />

        <div className="lg:col-span-2">
          <RecommendationsSection
            recommendations={recommendations}
            mode={mode}
            weather={weather}
            advisory={advisory}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Recommend;
