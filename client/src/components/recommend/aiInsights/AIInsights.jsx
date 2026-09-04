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
import CropAnalysisCard from "./CropAnalysisCard";
import AIActionPlanCard from "./AIActionPlanCard";

import { generateAIReport } from "./reportGenerator";

const AIInsights = () => {
  const location = useLocation();

  const {
    recommendations,
    weather,
    advisory,
    state,
    district,
    season,
  } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cropDetails, setCropDetails] = useState([]);
  const [genaiInsights, setGenaiInsights] = useState(null);

  if (!recommendations?.length) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              No AI Insight Data Found
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Please generate recommendations first and then click AI Insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const bestCrop = recommendations[0];

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError("");

        const crops = await Promise.all(
          recommendations.slice(0, 3).map(async (crop) => {
            const response = await api.get(
              `/crops/${crop.crop.toLowerCase()}`,
            );

            return {
              ...crop,
              details: response.data.crop,
            };
          }),
        );

        setCropDetails(crops);

        const insightsResponse = await api.post(
          "/recommendations/insights",
          {
            state,
            district,
            season,
            recommendations: crops,
            weather,
            advisory,
          },
        );

        setGenaiInsights(insightsResponse.data);
      } catch (error) {
        console.error(
          "AI insights error:",
          error.response?.data || error.message,
        );

        setError("Unable to generate AI insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [
    recommendations,
    weather,
    advisory,
    state,
    district,
    season,
  ]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
              AI Insight Error
            </h2>

            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !genaiInsights) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md p-10 md:p-14 text-center">
            <div className="text-5xl mb-5">🧠</div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Generating AI Insights...
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              Analyzing recommendations, weather, risks and agricultural
              factors using GenAI.
            </p>

            <div className="mt-7 h-2 max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const confidence =
    bestCrop?.confidence != null ? bestCrop.confidence : null;

  const handleDownloadReport = () => {
    generateAIReport({
      bestCrop,
      weather,
      confidence,
      genaiInsights,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-cyan-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-600 shadow-xl mb-8">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold text-white mb-5">
                  🤖 GenAI Agricultural Intelligence
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  AI Crop Intelligence
                </h1>

                <p className="mt-4 text-indigo-100 text-base md:text-lg leading-relaxed">
                  AI-powered analysis of your ML crop recommendations, weather
                  conditions, agricultural risks and practical next steps.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-5 min-w-[220px]">
                <p className="text-indigo-100 text-sm">
                  Top ML Recommendation
                </p>

                <p className="text-2xl font-bold text-white capitalize mt-1">
                  🌱 {bestCrop?.crop || "N/A"}
                </p>

                {confidence != null && (
                  <p className="text-sm text-indigo-100 mt-2">
                    Model confidence: {confidence}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              AI Analysis Report
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Insights generated from your recommendation and available
              agricultural data.
            </p>
          </div>

          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
          >
            📄 Download AI Report
          </button>
        </div>

        <main className="space-y-8">
          <section className="space-y-6">
            <AIReasoningCard
              reasoning={genaiInsights.reasoning}
            />

            {confidence != null && (
              <AIConfidenceCard confidence={confidence} />
            )}

            <CropAnalysisCard
              strengths={genaiInsights.strengths}
              weaknesses={genaiInsights.weaknesses}
              opportunities={genaiInsights.opportunities}
              risks={genaiInsights.risks}
            />
          </section>

          <section className="space-y-6">
            <AIActionPlanCard
              actionPlan={genaiInsights.action_plan}
            />

            <WeatherSuitabilityCard
              weather={weather}
              advisory={advisory}
            />
          </section>

          <section className="space-y-6">
            <CropComparisonCard
              cropDetails={cropDetails}
              recommendations={recommendations}
            />

            <AIComparisonAnalysisCard
              comparison={genaiInsights.comparison}
            />
          </section>

          <section className="space-y-6">
            <DistrictIntelligenceCard
              cropDetails={cropDetails}
              weather={weather}
              state={state}
              district={district}
              season={season}
            />

            <RiskAnalysisCard
              bestCrop={bestCrop}
              cropDetails={cropDetails}
              risks={genaiInsights.risks}
            />
          </section>

          <section className="space-y-6">
            <AIVerdictCard
              verdict={genaiInsights.verdict}
            />

            <AISummaryCard
              summary={genaiInsights.summary}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AIInsights;