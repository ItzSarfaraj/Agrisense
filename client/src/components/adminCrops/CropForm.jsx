import { useState, useEffect } from "react";

const CropForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      name: initialData.name || "",
      scientificName: initialData.scientificName || "",
      category: initialData.category || "",
      overview: initialData.overview || "",
      season: initialData.season || "",
      cropDuration: initialData.cropDuration || "",
      waterRequirement: initialData.waterRequirement || "",
      marketDemand: initialData.marketDemand || "",
      storageGuidelines: initialData.storageGuidelines || "",
      image: initialData.image || "",

      bestSowingMonths: initialData.bestSowingMonths?.join(", ") || "",

      bestHarvestMonths: initialData.bestHarvestMonths?.join(", ") || "",

      suitableStates: initialData.suitableStates?.join(", ") || "",

      intercroppingOptions: initialData.intercroppingOptions?.join(", ") || "",

      advantages: initialData.advantages?.join(", ") || "",

      challenges: initialData.challenges?.join(", ") || "",

      soilType: initialData.soil?.type || "",

      soilPH: initialData.soil?.ph || "",

      soilDrainage: initialData.soil?.drainage || "",

      temperature: initialData.climate?.temperature || "",

      rainfall: initialData.climate?.rainfall || "",

      humidity: initialData.climate?.humidity || "",
    });
  }, [initialData]);

  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    category: "",
    overview: "",
    season: "",
    cropDuration: "",
    waterRequirement: "",
    marketDemand: "",
    storageGuidelines: "",
    image: "",

    bestSowingMonths: "",
    bestHarvestMonths: "",

    suitableStates: "",
    intercroppingOptions: "",

    advantages: "",
    challenges: "",

    soilType: "",
    soilPH: "",
    soilDrainage: "",

    temperature: "",
    rainfall: "",
    humidity: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cropData = {
      name: formData.name,
      scientificName: formData.scientificName,
      category: formData.category,
      overview: formData.overview,
      season: formData.season,
      cropDuration: formData.cropDuration,
      waterRequirement: formData.waterRequirement,
      marketDemand: formData.marketDemand,
      storageGuidelines: formData.storageGuidelines,
      image: formData.image,

      bestSowingMonths: formData.bestSowingMonths
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      bestHarvestMonths: formData.bestHarvestMonths
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      suitableStates: formData.suitableStates
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      intercroppingOptions: formData.intercroppingOptions
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      advantages: formData.advantages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      challenges: formData.challenges
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      soil: {
        type: formData.soilType,
        ph: formData.soilPH,
        drainage: formData.soilDrainage,
      },

      climate: {
        temperature: formData.temperature,
        rainfall: formData.rainfall,
        humidity: formData.humidity,
      },
    };

    await onSubmit(cropData);
  };
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Add New Crop</h1>

        <p className="text-gray-500 mt-2">
          Create a new crop entry for the AgriSense crop library.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-bold mb-2">Basic Information</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              type="text"
              name="name"
              placeholder="Crop Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

            <input
              required
              type="text"
              name="scientificName"
              placeholder="Scientific Name"
              value={formData.scientificName}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

            <input
              required
              type="text"
              name="season"
              placeholder="season"
              value={formData.season}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="cropDuration"
              placeholder="Crop Duration"
              value={formData.cropDuration}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />

            <input
              required
              type="text"
              name="image"
              placeholder="/crops/rice.jpg"
              value={formData.image}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <textarea
            required
            rows="4"
            name="overview"
            placeholder="Overview"
            value={formData.overview}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <h3 className="text-xl font-bold mt-6 mb-2">Cultivation</h3>

          <input
            type="text"
            name="waterRequirement"
            placeholder="Water Requirement"
            value={formData.waterRequirement}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="marketDemand"
            placeholder="Market Demand"
            value={formData.marketDemand}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <textarea
            rows="3"
            name="storageGuidelines"
            placeholder="Storage Guidelines"
            value={formData.storageGuidelines}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <h3 className="text-xl font-bold mt-6 mb-2">Crop Calendar</h3>

          <input
            type="text"
            name="bestSowingMonths"
            placeholder="Best Sowing Months (June, July)"
            value={formData.bestSowingMonths}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="bestHarvestMonths"
            placeholder="Best Harvest Months (October, November)"
            value={formData.bestHarvestMonths}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <h3 className="text-xl font-bold mt-6 mb-2">Soil Requirements</h3>

          <input
            type="text"
            name="soilType"
            placeholder="Soil Type"
            value={formData.soilType}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="soilPH"
            placeholder="Soil pH"
            value={formData.soilPH}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="soilDrainage"
            placeholder="Drainage"
            value={formData.soilDrainage}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <h3 className="text-xl font-bold mt-6 mb-2">Climate Requirements</h3>

          <input
            type="text"
            name="temperature"
            placeholder="Temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="rainfall"
            placeholder="Rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="humidity"
            placeholder="Humidity"
            value={formData.humidity}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <h3 className="text-xl font-bold mt-6 mb-2">
            Additional Information
          </h3>

          <input
            type="text"
            name="suitableStates"
            placeholder="Suitable States (UP, Bihar, Punjab)"
            value={formData.suitableStates}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            name="intercroppingOptions"
            placeholder="Intercropping Options"
            value={formData.intercroppingOptions}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <textarea
            rows="3"
            name="advantages"
            placeholder="Advantages (comma separated)"
            value={formData.advantages}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <textarea
            rows="3"
            name="challenges"
            placeholder="Challenges (comma separated)"
            value={formData.challenges}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl border"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              {mode === "add" ? "Save Crop" : "Update Crop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropForm;
