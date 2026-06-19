import { useState } from "react";
import Select from "react-select";
import indiaData from "../../data/indiaStatesDistricts.json";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

const PredictionForm = ({
  setRecommendations,
  mode,
  setMode,
  setWeather,
  setAdvisory,
}) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [season, setSeason] = useState("");
  const [N, setN] = useState("");
  const [P, setP] = useState("");
  const [K, setK] = useState("");
  const [pH, setPH] = useState("");

  const [loading, setLoading] = useState(false);

  const seasonOptions = [
    {
      value: "Kharif",
      label: "Kharif (Monsoon: Jun–Oct)",
    },
    {
      value: "Rabi",
      label: "Rabi (Winter: Nov–Apr)",
    },
    {
      value: "Zaid",
      label: "Zaid (Summer: Mar–Jun)",
    },
  ];

  const states = indiaData.states;

  const stateOptions = states.map((state) => ({
    value: state.state,
    label: state.state,
  }));

  const districts =
    states.find((state) => state.state === selectedState)?.districts || [];

  const districtOptions = districts.map((district) => ({
    value: district,
    label: district,
  }));

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
          Number(N) < 0 ||
          Number(N) > 140 ||
          Number(P) < 0 ||
          Number(P) > 145 ||
          Number(K) < 0 ||
          Number(K) > 205 ||
          Number(pH) < 3.5 ||
          Number(pH) > 9.5
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
      // console.log("Full Response:", response.data);

      setRecommendations(response.data.recommendations);
      setWeather(response.data.weather);
      // console.log("Weather:", response.data.weather);
      setAdvisory(response.data.advisory || []);
      await api.post("/predictions", {
        mode,
        state: selectedState,
        district: selectedDistrict,
        season,
        recommendations: response.data.recommendations,
      });

      // console.log(response.data);

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
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Input Parameter</h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
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
                : "bg-gray-100 text-gray-700"
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
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Soil Mode
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* State */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">State</label>

          <Select
            options={stateOptions}
            placeholder="Search State..."
            value={
              stateOptions.find((option) => option.value === selectedState) ||
              null
            }
            onChange={(selected) => {
              setSelectedState(selected?.value || "");
              setSelectedDistrict("");
            }}
          />
        </div>

        {/* District */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            District
          </label>

          <Select
            options={districtOptions}
            placeholder="Search District..."
            isDisabled={!selectedState}
            value={
              districtOptions.find(
                (option) => option.value === selectedDistrict,
              ) || null
            }
            onChange={(selected) => setSelectedDistrict(selected?.value || "")}
          />
        </div>

        {/* Season */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Season</label>

          <Select
            options={seasonOptions}
            placeholder="Select Season..."
            value={
              seasonOptions.find((option) => option.value === season) || null
            }
            onChange={(selected) => setSeason(selected?.value || "")}
          />

          <p className="text-sm text-gray-500 mt-1">
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
                className="border rounded-lg p-3"
              />

              <input
                type="number"
                placeholder="Phosphorus (P: 0-145 kg/ha)"
                value={P}
                onChange={(e) => setP(e.target.value)}
                className="border rounded-lg p-3"
              />

              <input
                type="number"
                placeholder="Potassium (K: 0-205 kg/ha)"
                value={K}
                onChange={(e) => setK(e.target.value)}
                className="border rounded-lg p-3"
              />

              <input
                type="number"
                step="0.1"
                placeholder="Soil pH (3.5-9.5)"
                value={pH}
                onChange={(e) => setPH(e.target.value)}
                className="border rounded-lg p-3"
              />
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Enter soil test values obtained from a Soil Health Card or
              laboratory soil report.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Typical ranges: N (0-140), P (0-145), K (0-205), pH (3.5-9.5)
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isFormInvalid}
          className={`w-full py-3 rounded-xl font-semibold transition duration-200 ${
            isFormInvalid
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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
