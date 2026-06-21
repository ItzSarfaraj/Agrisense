import { useState, useContext } from "react";
import Select from "react-select";
import indiaData from "../../data/indiaStatesDistricts.json";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";

const PredictionForm = ({
  setRecommendations,
  mode,
  setMode,
  setWeather,
  setAdvisory,
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

  const seasonOptions = [
    { value: "Kharif", label: "Kharif (Monsoon: Jun–Oct)" },
    { value: "Rabi", label: "Rabi (Winter: Nov–Apr)" },
    { value: "Zaid", label: "Zaid (Summer: Mar–Jun)" },
  ];

  const states = indiaData.states;
  const stateOptions = states.map((state) => ({ value: state.state, label: state.state }));
  const districts = states.find((state) => state.state === selectedState)?.districts || [];
  const districtOptions = districts.map((district) => ({ value: district, label: district }));

  // react-select dark mode styling — reactive via ThemeContext
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderColor: state.isFocused ? "#16a34a" : isDark ? "#374151" : "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#16a34a" },
    }),
    singleValue: (base) => ({ ...base, color: isDark ? "#f3f4f6" : "#111827" }),
    input: (base) => ({ ...base, color: isDark ? "#f3f4f6" : "#111827" }),
    placeholder: (base) => ({ ...base, color: isDark ? "#9ca3af" : "#6b7280" }),
    menu: (base) => ({ ...base, backgroundColor: isDark ? "#1f2937" : "#fff", zIndex: 50 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#16a34a"
        : state.isFocused
        ? isDark ? "#374151" : "#f3f4f6"
        : "transparent",
      color: state.isSelected ? "#fff" : isDark ? "#f3f4f6" : "#111827",
    }),
    singleValue: (base) => ({ ...base, color: isDark ? "#f3f4f6" : "#111827" }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const toastId = toast.loading("Generating prediction...");

      if (!selectedState || !selectedDistrict || !season) {
        toast.error("Please fill all fields");
        return;
      }

      if (mode === "soil") {
        if (!N || !P || !K || !pH) {
          toast.error("Please enter all soil parameters");
          return;
        }
      }

      if (mode === "soil") {
        if (
          Number(N) < 0 || Number(N) > 140 ||
          Number(P) < 0 || Number(P) > 145 ||
          Number(K) < 0 || Number(K) > 205 ||
          Number(pH) < 3.5 || Number(pH) > 9.5
        ) {
          toast.error("Please enter valid soil parameter values.");
          return;
        }
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

      setRecommendations(response.data.recommendations);
      setWeather(response.data.weather);
      setAdvisory(response.data.advisory || []);
      await api.post("/predictions", {
        mode,
        state: selectedState,
        district: selectedDistrict,
        season,
        recommendations: response.data.recommendations,
      });

      toast.success("Crop prediction generated successfully!", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !selectedState ||
    !selectedDistrict ||
    !season ||
    (mode === "soil" && (!N || !P || !K || !pH));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Input Parameter
      </h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Recommendation Mode
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setMode("quick");
              setN("");
              setP("");
              setK("");
              setPH("");
            }}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              mode === "quick"
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Quick Mode
          </button>

          <button
            type="button"
            onClick={() => setMode("soil")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              mode === "soil"
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Soil Mode
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* State */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">State</label>
          <Select
            options={stateOptions}
            placeholder="Search State..."
            styles={selectStyles}
            value={stateOptions.find((option) => option.value === selectedState) || null}
            onChange={(selected) => {
              setSelectedState(selected?.value || "");
              setSelectedDistrict("");
            }}
          />
        </div>

        {/* District */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">District</label>
          <Select
            options={districtOptions}
            placeholder="Search District..."
            isDisabled={!selectedState}
            styles={selectStyles}
            value={districtOptions.find((option) => option.value === selectedDistrict) || null}
            onChange={(selected) => setSelectedDistrict(selected?.value || "")}
          />
        </div>

        {/* Season */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Season</label>
          <Select
            options={seasonOptions}
            placeholder="Select Season..."
            styles={selectStyles}
            value={seasonOptions.find((option) => option.value === season) || null}
            onChange={(selected) => setSeason(selected?.value || "")}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select the current farming season.
          </p>
        </div>

        {mode === "soil" && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Nitrogen (N: 0-140 kg/ha)"
                value={N}
                onChange={(e) => setN(e.target.value)}
                className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg p-3"
              />
              <input
                type="number"
                placeholder="Phosphorus (P: 0-145 kg/ha)"
                value={P}
                onChange={(e) => setP(e.target.value)}
                className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg p-3"
              />
              <input
                type="number"
                placeholder="Potassium (K: 0-205 kg/ha)"
                value={K}
                onChange={(e) => setK(e.target.value)}
                className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg p-3"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Soil pH (3.5-9.5)"
                value={pH}
                onChange={(e) => setPH(e.target.value)}
                className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg p-3"
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Enter soil test values obtained from a Soil Health Card or laboratory soil report.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Typical ranges: N (0-140), P (0-145), K (0-205), pH (3.5-9.5)
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isFormInvalid}
          className={`w-full py-3 rounded-xl font-semibold transition duration-200 ${
            isFormInvalid
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Predicting..." : "Get Recommendation"}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;