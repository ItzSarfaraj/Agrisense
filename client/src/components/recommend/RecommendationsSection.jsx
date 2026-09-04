import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import CropCard from "./CropCard";
import api from "../../api/axios";
import { SUPPORTED_LANGUAGES } from "../chatbot/LanguageSelector";
import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";

const getInitialLanguage = () => {
  const saved = localStorage.getItem("agrisense-language");

  return SUPPORTED_LANGUAGES.some(
    (item) => item.code === saved,
  )
    ? saved
    : "en-IN";
};

const RecommendationsSection = ({
  recommendations = [],
  mode,
  weather,
  advisory,
  state,
  district,
  season,
}) => {
  const navigate = useNavigate();

  const [language, setLanguage] =
    useState(getInitialLanguage);

  const [translating, setTranslating] =
    useState(false);

  const {
    isSupported: speechSupported,
    speakingId,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis();

  const selectedLanguage =
    SUPPORTED_LANGUAGES.find(
      (item) => item.code === language,
    ) || SUPPORTED_LANGUAGES[0];

  const bestCrop = recommendations[0];

  const speaking =
    speakingId === "recommendation-result";

  useEffect(() => {
    localStorage.setItem(
      "agrisense-language",
      language,
    );
  }, [language]);

  useEffect(() => {
    if (language) {
      stopSpeaking();
    }
  }, [language, stopSpeaking]);

  const englishSpeechText = useMemo(() => {
    if (!bestCrop) return "";

    const cropList = recommendations
      .slice(0, 5)
      .map((crop, index) => {
        const profit =
          crop.expected_profit != null
            ? `${Number(
                crop.expected_profit,
              ).toLocaleString("en-IN")} rupees per hectare`
            : "profit estimate unavailable";

        return `${index + 1}. ${crop.crop}, with ${profit}.`;
      })
      .join(" ");

    const bestProfit =
      bestCrop.expected_profit != null
        ? `The expected profit is ${Number(
            bestCrop.expected_profit,
          ).toLocaleString("en-IN")} rupees per hectare.`
        : "The profit estimate is unavailable.";

    return [
      "Here is your crop recommendation.",
      `The best recommended crop is ${bestCrop.crop}.`,
      bestProfit,
      `The selected location is ${district || "not specified"} district in ${state || "not specified"} state.`,
      `The selected season is ${season || "not specified"}.`,
      `The top recommended crops are ${cropList}`,
    ].join(" ");
  }, [
    bestCrop,
    recommendations,
    district,
    state,
    season,
  ]);

  const handleSpeak = async () => {
    if (!speechSupported || !englishSpeechText) {
      return;
    }

    if (speaking) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    if (language === "en-IN") {
      speak({
        text: englishSpeechText,
        lang: selectedLanguage.code,
        id: "recommendation-result",
      });

      return;
    }

    setTranslating(true);

    try {
      const response = await api.post("/chat", {
        message: `
Translate the following AgriSense crop recommendation into ${selectedLanguage.label}.

Rules:
- Return only the translated text.
- Do not explain the translation.
- Do not add information.
- Keep crop names recognizable.
- Keep all numbers exactly unchanged.
- Keep the recommendation meaning exactly unchanged.
- Do not translate proper crop names when doing so would make them unclear.

TEXT TO TRANSLATE:
${englishSpeechText}
        `.trim(),
        history: [],
        context: {},
        language: selectedLanguage.label,
        languageCode: selectedLanguage.code,
      });

      const translatedText =
        response.data.response?.trim();

      if (!translatedText) {
        throw new Error(
          "Empty translation response",
        );
      }

      speak({
        text: translatedText,
        lang: selectedLanguage.code,
        id: "recommendation-result",
      });
    } catch (error) {
      console.error(
        "Recommendation speech translation error:",
        error.response?.data || error.message,
      );
    } finally {
      setTranslating(false);
    }
  };

  const askAgriSenseAI = () => {
    if (!bestCrop) return;

    navigate("/chatbot", {
      state: {
        message: `Tell me more about my ${bestCrop.crop} recommendation.`,
        context: {
          state,
          district,
          season,
          mode,
          selectedCrop: bestCrop,
          recommendations,
          weather,
          advisory,
        },
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
      <div className="mb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Top Recommended Crops
            </h2>

            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
              {mode === "quick"
                ? "⚡ Quick Recommendation"
                : "🧪 Soil Analysis"}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {recommendations.length} crops found
            </p>
          </div>

          {bestCrop && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="recommendation-language"
                className="sr-only"
              >
                Language
              </label>

              <select
                id="recommendation-language"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
                disabled={translating}
                className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                {SUPPORTED_LANGUAGES.map(
                  (item) => (
                    <option
                      key={item.code}
                      value={item.code}
                    >
                      {item.label}
                    </option>
                  ),
                )}
              </select>

              <button
                type="button"
                onClick={handleSpeak}
                disabled={
                  !speechSupported ||
                  translating
                }
                aria-label={
                  speaking
                    ? "Stop speaking recommendation"
                    : "Speak recommendation"
                }
                title={
                  translating
                    ? "Translating recommendation"
                    : speaking
                      ? "Stop speaking"
                      : `Speak in ${selectedLanguage.label}`
                }
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                  speaking
                    ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-green-400 hover:text-green-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                } ${
                  !speechSupported ||
                  translating
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {translating ? (
                  <Loader2
                    size={19}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : speaking ? (
                  <VolumeX
                    size={19}
                    aria-hidden="true"
                  />
                ) : (
                  <Volume2
                    size={19}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              No Recommendations Yet
            </h3>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Select recommendation parameters and click
              <span className="font-semibold text-green-600 dark:text-green-400">
                {" "}
                Get Recommendation
              </span>
              .
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm uppercase tracking-wide opacity-90">
              Best Recommendation
            </p>

            <h2 className="text-3xl font-bold capitalize mt-2">
              🏆 {bestCrop.crop}
            </h2>

            <p className="mt-3 text-lg">
              Expected Profit:
              <span className="font-bold">
                {" "}
                {bestCrop.expected_profit != null
                  ? `₹${Number(
                      bestCrop.expected_profit,
                    ).toLocaleString()} per hectare`
                  : "Profit estimate unavailable"}
              </span>
            </p>

            <p className="mt-2 text-green-100">
              Highest estimated profit for the selected district and season.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button
                type="button"
                onClick={() =>
                  navigate("/insights", {
                    state: {
                      recommendations,
                      weather,
                      advisory,
                      state,
                      district,
                      season,
                    },
                  })
                }
                className="bg-white text-green-700 px-5 py-3 rounded-xl font-semibold hover:bg-green-50 transition shadow-md"
              >
                🤖 Get AI Insights
              </button>

              <button
                type="button"
                onClick={askAgriSenseAI}
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-900/25 border border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/30 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-green-600"
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />

                <span className="relative flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm shadow-inner">
                    💬
                  </span>

                  <span>Ask AgriSense AI</span>

                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommendations.map((crop, index) => (
              <CropCard
                key={`${crop.crop}-${index}`}
                rank={index + 1}
                {...crop}
                onClick={() =>
                  navigate(
                    `/crops/${crop.crop.toLowerCase()}`,
                  )
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendationsSection;