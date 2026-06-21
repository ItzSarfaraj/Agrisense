import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";

const CropLibrary = () => {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    const filtered = crops.filter((crop) =>
      crop.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredCrops(filtered);
  }, [search, crops]);

  const fetchCrops = async () => {
    try {
      const response = await api.get("/crops");

      setCrops(response.data.crops);
      setFilteredCrops(response.data.crops);
    } catch (error) {
      console.error("Crop Fetch Error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
            Crop Knowledge Center
          </p>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">
            Crop Library
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Browse all available crop intelligence reports,
            cultivation guides, diseases, fertilizers and
            market insights.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl shadow-md dark:shadow-none p-5">

          <input
            type="text"
            placeholder="Search crops..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600"
          />

        </div>

        {/* Stats */}
        <div className="text-gray-500 dark:text-gray-400">
          {filteredCrops.length} crops available
        </div>

        {/* Crop Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {filteredCrops.map((crop) => (
            <div
              key={crop._id}
              onClick={() =>
                navigate(
                  `/crops/${crop.name.toLowerCase()}`
                )
              }
              className="cursor-pointer bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl shadow-md dark:shadow-none overflow-hidden hover:shadow-xl dark:hover:border-gray-600 hover:-translate-y-1 transition-all duration-300"
            >

              <img
                src={
                  crop.image ||
                  "/crops/default.png"
                }
                alt={crop.name}
                onError={(e) => {
                  e.target.src =
                    "/crops/default.png";
                }}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">

                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {crop.name}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {crop.category}
                </p>

                <button className="mt-4 text-green-600 dark:text-green-400 font-semibold text-sm">
                  View Report →
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default CropLibrary;