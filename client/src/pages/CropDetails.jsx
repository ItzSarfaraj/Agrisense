import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import CropHero from "../components/cropDetails/CropHero";
import CropQuickFacts from "../components/cropDetails/CropQuickFacts";
import CropOverview from "../components/cropDetails/CropOverview";
import CropCultivationTimeline from "../components/cropDetails/CropCultivationTimeline";

import api from "../api/axios";
import CropYieldMarket from "../components/cropDetails/CropYieldMarket";
import CropSuitableStates from "../components/cropDetails/CropSuitableStates";
import CropFertilizers from "../components/cropDetails/CropFertilizers";
import CropProtection from "../components/cropDetails/CropProtection";
import CropInsights from "../components/cropDetails/CropInsights";
import CropIntercropping from "../components/cropDetails/CropIntercropping";
import CropStorage from "../components/cropDetails/CropStorage";
import RelatedCrops from "../components/cropDetails/RelatedCrops";

const CropDetails = () => {
  const { cropName } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);

  useEffect(() => {
    fetchCrop();
  }, [cropName]);

  const fetchCrop = async () => {
    try {
      const response = await api.get(`/crops/${cropName}`);

      setCrop(response.data.crop);
    } catch (error) {
      console.error(error);
    }
  };

  if (!crop) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl p-8 text-center text-gray-700 dark:text-gray-300">
          Loading Crop Details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
            Crop Knowledge Center
          </p>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">
            Crop Intelligence Report
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-7xl">
            Explore detailed cultivation practices, climate requirements,
            fertilizer recommendations, pest management strategies, yield
            potential and market opportunities for recommended crops.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl shadow-md dark:shadow-none hover:shadow-lg dark:hover:border-gray-600 transition"
        >
          ← Back
        </button>

        <CropHero crop={crop} />

        <CropQuickFacts crop={crop} />

        <CropOverview crop={crop} />
        <CropYieldMarket crop={crop} />
        <CropSuitableStates crop={crop} />
        <CropCultivationTimeline crop={crop} />
        <CropFertilizers crop={crop} />
        <CropProtection crop={crop} />
        <CropInsights crop={crop} />

        <CropIntercropping crop={crop} />

        <CropStorage crop={crop} />
        <RelatedCrops cropName={crop.name} />
      </div>
    </DashboardLayout>
  );
};

export default CropDetails;