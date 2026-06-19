import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import AIConfidenceCard from "./AIConfidenceCard";
import CropComparisonCard from "./CropComparisonCard";
import AIReasoningCard from "./AIReasoningCard";
import WeatherSuitabilityCard from "./WeatherSuitabilityCard";
import DistrictIntelligenceCard from "./DistrictIntelligenceCard";

import RiskAnalysisCard from "./RiskAnalysisCard";
import AIVerdictCard from "./AIVerdictCard";
import AISummaryCard from "./AISummaryCard";
import AIComparisonAnalysisCard from "./AIComparisonAnalysisCard";
import AIScoreOverview from "./AIScoreOverview";
import CropAnalysisCard from "./CropAnalysisCard";
import AIActionPlanCard from "./AIActionPlanCard";

import {
  calculateWeatherMatch,
  calculateProfitScore,
  calculateSoilMatch,
  calculateRisk,
  getCropAnalysis,
} from "./AIInsightsHelper";

import { generateAIReport } from "./reportGenerator";

const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cropDetails, setCropDetails] = useState([]);
  const location = useLocation();

  const { recommendations, weather } = location.state || {};

  if (!recommendations?.length) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">No AI Insight Data Found</h2>

        <p className="text-gray-500 mt-2">
          Please generate recommendations first and then click AI Insights.
        </p>
      </div>
    );
  }

  const bestCrop = recommendations?.[0];

  const cropAnalysis = getCropAnalysis(cropDetails[0]);

  const fetchCropDetails = async () => {
    try {
      setLoading(true);

      const crops = await Promise.all(
        recommendations.slice(0, 3).map(async (crop) => {
          const response = await api.get(`/crops/${crop.crop.toLowerCase()}`);

          return {
            ...crop,
            details: response.data.crop,
          };
        }),
      );

      setCropDetails(crops);
    } catch (error) {
      setError("Unable to generate AI insights.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-red-600">AI Insight Error</h2>

          <p className="mt-2 text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (recommendations?.length > 0) {
      fetchCropDetails();
    }
  }, [recommendations]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <h2 className="text-2xl font-bold">Generating AI Insights...</h2>

          <p className="text-gray-500 mt-2">
            Analyzing profitability, weather, risks and market demand.
          </p>
        </div>
      </div>
    );
  }

  const confidence =
    recommendations?.length > 0
      ? Math.min(
          95,
          Math.round(
            (recommendations[0].expected_profit /
              recommendations.reduce(
                (sum, crop) => sum + crop.expected_profit,
                0,
              )) *
              100 +
              70,
          ),
        )
      : 0;

  const weatherAnalysis = calculateWeatherMatch(weather);
  const profitScore = calculateProfitScore(bestCrop, recommendations);

  const soilMatch = calculateSoilMatch(confidence);

  const riskAnalysis = calculateRisk(cropDetails[0]);

  const handleDownloadReport = () => {
    generateAIReport({
      bestCrop,
      weather,
      confidence,
      riskAnalysis,
      weatherAnalysis,
      cropAnalysis,
    });
  };
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-600 rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-[-30px] right-8 text-[160px] font-black opacity-10">
          AI
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
            🤖 AI Generated Analysis
          </div>

          <h1 className="text-4xl font-bold">🧠 AI Crop Intelligence</h1>

          <p className="mt-3 text-indigo-100 text-lg">
            Advanced recommendation analysis powered by the AgriSense
            Intelligence Engine.
          </p>
        </div>
      </div>

      {/* Download Report */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleDownloadReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          📄 Download AI Report
        </button>
      </div>

      {/* AI Score Cards */}
      <AIScoreOverview
        weatherMatch={weatherAnalysis.score}
        soilMatch={soilMatch}
        profitScore={profitScore}
        riskScore={riskAnalysis?.score || 0}
      />

      {/* AI Reasoning */}
      <AIReasoningCard cropDetails={cropDetails} />

      {/* AI Confidence */}
      <AIConfidenceCard confidence={confidence} />

      {cropDetails[0] && <CropAnalysisCard crop={cropDetails[0]} />}
      {cropDetails[0] && <AIActionPlanCard crop={cropDetails[0]} />}
      {/* Weather Suitability */}
      <WeatherSuitabilityCard
        weather={weather}
        weatherMatch={weatherAnalysis}
      />

      {/* Crop Comparison */}
      <CropComparisonCard
        cropDetails={cropDetails}
        recommendations={recommendations}
      />

      {/* AI Decision Analysis */}
      <AIComparisonAnalysisCard cropDetails={cropDetails} />

      {/* District Intelligence */}
      <DistrictIntelligenceCard cropDetails={cropDetails} weather={weather} />

      {/* Risk Analysis */}
      <RiskAnalysisCard bestCrop={bestCrop} cropDetails={cropDetails} />

      {/* AI Verdict */}
      <AIVerdictCard bestCrop={bestCrop} />

      {/* AI Summary */}
      <AISummaryCard bestCrop={bestCrop} />
    </div>
  );
};

export default AIInsights;
