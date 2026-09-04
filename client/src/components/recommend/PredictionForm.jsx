import { useContext, useEffect, useMemo, useState } from "react";
import indiaData from "../../data/indiaStatesDistricts.json";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";

import RecommendationModeSelector from "./RecommendationModeSelector";
import FarmLocationFields from "./FarmLocationFields";
import SoilParameters from "./SoilParameters";
import useRecommendationVoice from "./useRecommendationVoice";

const PredictionForm = ({
  setRecommendations,
  mode,
  setMode,
  setWeather,
  setAdvisory,
  onLocationChange,
  onContextChange,
  language = "en-IN",
}) => {
  const { isDark } = useContext(ThemeContext);

  const [selectedState, setSelectedState] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [season, setSeason] = useState("");

  const [N, setN] = useState("");
  const [P, setP] = useState("");
  const [K, setK] = useState("");
  const [pH, setPH] = useState("");

  const [loading, setLoading] = useState(false);

  const seasonOptions = useMemo(
    () => [
      {
        value: "Kharif",
        label: "Kharif · Monsoon · Jun–Oct",
      },
      {
        value: "Rabi",
        label: "Rabi · Winter · Nov–Apr",
      },
      {
        value: "Zaid",
        label: "Zaid · Summer · Mar–Jun",
      },
    ],
    [],
  );

  const states = indiaData.states;

  const stateOptions = useMemo(
    () =>
      states.map((item) => ({
        value: item.state,
        label: item.state,
      })),
    [states],
  );

  const districts =
    states.find((item) => item.state === selectedState)?.districts || [];

  const districtOptions = useMemo(
    () =>
      districts.map((district) => ({
        value: district,
        label: district,
      })),
    [districts],
  );

  const voice = useRecommendationVoice({
    language,
    stateOptions,
    districtOptions,
    seasonOptions,
    setSelectedState,
    setSelectedDistrict,
    setSeason,
    setN,
    setP,
    setK,
    setPH,
  });

  useEffect(() => {
    onLocationChange?.({
      state: selectedState,
      district: selectedDistrict,
      season,
    });
  }, [selectedState, selectedDistrict, season, onLocationChange]);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 52,
      borderRadius: 14,
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderColor: state.isFocused ? "#16a34a" : isDark ? "#374151" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(22,163,74,.12)" : "none",
      "&:hover": {
        borderColor: "#16a34a",
      },
    }),

    singleValue: (base) => ({
      ...base,
      color: isDark ? "#f3f4f6" : "#111827",
      fontWeight: 600,
    }),

    input: (base) => ({
      ...base,
      color: isDark ? "#f3f4f6" : "#111827",
    }),

    placeholder: (base) => ({
      ...base,
      color: isDark ? "#9ca3af" : "#6b7280",
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderRadius: 14,
      overflow: "hidden",
      zIndex: 50,
    }),

    option: (base, state) => ({
      ...base,
      padding: "12px 14px",
      backgroundColor: state.isSelected
        ? "#16a34a"
        : state.isFocused
          ? isDark
            ? "#374151"
            : "#f0fdf4"
          : "transparent",
      color: state.isSelected ? "#ffffff" : isDark ? "#f3f4f6" : "#111827",
    }),
  };

  const clearSoilValues = () => {
    setN("");
    setP("");
    setK("");
    setPH("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let toastId;

    try {
      setLoading(true);

      toastId = toast.loading("Generating prediction...");

      if (!selectedState || !selectedDistrict || !season) {
        toast.error("Please fill all fields", { id: toastId });
        return;
      }

      if (mode === "soil" && (!N || !P || !K || !pH)) {
        toast.error("Please enter all soil parameters", { id: toastId });
        return;
      }

      if (
        mode === "soil" &&
        (Number(N) < 0 ||
          Number(N) > 140 ||
          Number(P) < 0 ||
          Number(P) > 145 ||
          Number(K) < 0 ||
          Number(K) > 205 ||
          Number(pH) < 3.5 ||
          Number(pH) > 9.5)
      ) {
        toast.error("Please enter valid soil parameter values.", {
          id: toastId,
        });
        return;
      }

      let response;

      if (mode === "quick") {
        response = await api.post("/recommendations/quick", {
          state: selectedState,
          district: selectedDistrict,
          season,
        });
      } else {
        response = await api.post("/recommendations/soil", {
          state: selectedState,
          district: selectedDistrict,
          season,
          N: Number(N),
          P: Number(P),
          K: Number(K),
          pH: Number(pH),
        });
      }

      const recommendations = response.data.recommendations;

      const currentWeather = response.data.weather;

      const currentAdvisory = response.data.advisory || [];

      setRecommendations(recommendations);

      setWeather(currentWeather);
      setAdvisory(currentAdvisory);

      onContextChange?.({
        state: selectedState,
        district: selectedDistrict,
        season,
        mode,
        soil:
          mode === "soil"
            ? {
                N: Number(N),
                P: Number(P),
                K: Number(K),
                pH: Number(pH),
              }
            : null,
        weather: currentWeather,
        advisory: currentAdvisory,
        recommendations,
      });

      await api.post("/predictions", {
        mode,
        state: selectedState,
        district: selectedDistrict,
        season,
        recommendations,
      });

      toast.success("Crop prediction generated successfully!", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Prediction failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !selectedState ||
    !selectedDistrict ||
    !season ||
    (mode === "soil" && (!N || !P || !K || !pH));

  const inputClass =
    "w-full min-h-[52px] border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 pr-12 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10";

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-black/20">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Recommendation Engine
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Farm Parameters
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Tell us about your farm to generate suitable crop recommendations.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-semibold">
            🧠 ML-powered analysis
          </div>
        </div>

        <RecommendationModeSelector
          mode={mode}
          setMode={setMode}
          clearSoilValues={clearSoilValues}
        />

        <form onSubmit={handleSubmit} className="space-y-7">
          <FarmLocationFields
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            season={season}
            stateOptions={stateOptions}
            districtOptions={districtOptions}
            seasonOptions={seasonOptions}
            selectStyles={selectStyles}
            setSelectedState={setSelectedState}
            setSelectedDistrict={setSelectedDistrict}
            setSeason={setSeason}
            voice={voice}
          />

          {mode === "soil" && (
            <SoilParameters
              N={N}
              P={P}
              K={K}
              pH={pH}
              setN={setN}
              setP={setP}
              setK={setK}
              setPH={setPH}
              inputClass={inputClass}
              voice={voice}
            />
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={isFormInvalid || loading}
              className={`flex-1 min-h-[56px] rounded-2xl font-bold text-base transition-all duration-200 shadow-lg ${
                isFormInvalid || loading
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:-translate-y-0.5 hover:shadow-xl"
              }`}
            >
              {loading ? "⏳ Analyzing Farm..." : "🌱 Get Recommendation"}
            </button>

            <div className="sm:w-64 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Tip:
              </span>{" "}
              You can use the microphone beside a field to enter it by voice.
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PredictionForm;
