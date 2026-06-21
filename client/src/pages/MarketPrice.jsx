import { useState, useEffect } from "react";
import {
  predictPrice,
  getSupportedCrops,
  getStates,
  getDistricts,
  savePrediction,
} from "../api/priceApi";
import DashboardLayout from "../components/layout/DashboardLayout";

const MarketPrice = () => {
  const [formData, setFormData] = useState({
    crop: "",
    state: "",
    district: "",
    month: "",
  });

  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allCrops, setAllCrops] = useState([]);
  const [cropQuery, setCropQuery] = useState("");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const data = await getSupportedCrops();

        setAllCrops(data.crops);
      } catch (error) {
        console.error(error);
      }
    };

    loadCrops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.crop ||
      !formData.state ||
      !formData.district ||
      !formData.month
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setPrice(null);
      setError("");
      //   console.log("Submitting:", formData);
      const response = await predictPrice({
        ...formData,
        month: Number(formData.month),
      });
      //   console.log("Response:", response);

      setPrice(response.predicted_price);

      await savePrediction({
        crop: formData.crop,
        state: formData.state,
        district: formData.district,
        month: formData.month,
        predictedPrice: response.predicted_price,
      });

      setError("");
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data);
      setError(error?.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCropSearch = (e) => {
    const value = e.target.value;

    setCropQuery(value);

    setFormData({
      crop: value,
      state: "",
      district: "",
      month: formData.month,
    });

    setStates([]);
    setDistricts([]);

    if (!value.trim()) {
      setFilteredCrops([]);
      setShowSuggestions(false);
      return;
    }

    const matches = allCrops.filter((crop) =>
      crop.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredCrops(matches.slice(0, 8));
    setShowSuggestions(true);
  };

  const handleStateChange = async (e) => {
    try {
      const selectedState = e.target.value;

      setFormData({
        ...formData,
        state: selectedState,
        district: "",
      });

      const data = await getDistricts(formData.crop, selectedState);

      setDistricts(data.districts);
    } catch (error) {
      console.error(error);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const inputClasses =
    "w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
          Market Price Predictor
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Predict expected market price using historical mandi data.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-none dark:border dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Crop"
                value={cropQuery}
                onChange={handleCropSearch}
                className={inputClasses}
              />

              {showSuggestions && filteredCrops.length > 0 && (
                <div className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {filteredCrops.map((crop) => (
                    <div
                      key={crop}
                      className="p-3 cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={async () => {
                        try {
                          setCropQuery(crop);

                          setFormData({
                            crop,
                            state: "",
                            district: "",
                            month: formData.month,
                          });

                          setShowSuggestions(false);
                          setFilteredCrops([]);

                          const data = await getStates(crop);

                          setStates(data.states);
                          setDistricts([]);
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    >
                      {crop}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <select
              value={formData.state}
              onChange={handleStateChange}
              className={inputClasses}
            >
              <option value="">Select State</option>

              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              value={formData.district}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  district: e.target.value,
                })
              }
              className={inputClasses}
            >
              <option value="">Select District</option>

              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <select
              value={formData.month}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  month: Number(e.target.value),
                })
              }
              className={inputClasses}
            >
              <option value="">Select Month</option>

              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? "Predicting..." : "Predict Price"}
            </button>
          </form>
        </div>

        {price && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-none dark:border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Predicted Price
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  Market Modal Price
                </p>
              </div>

              <div className="text-right">
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  ₹ {Number(price).toLocaleString()}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  per quintal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Crop
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.crop}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  State
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.state}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  District
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formData.district}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Month
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {months[formData.month - 1]}
                </p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketPrice;