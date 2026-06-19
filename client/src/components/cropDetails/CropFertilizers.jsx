const CropFertilizers = ({ crop }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <div className="mb-6">
        <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
          Nutrient Management
        </p>

        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          Recommended Fertilizers
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {crop.fertilizers?.map((fertilizer) => (
          <div
            key={fertilizer.name}
            className="bg-green-50 border border-green-100 rounded-2xl p-5"
          >

            <h3 className="font-bold text-xl text-gray-800">
              {fertilizer.name}
            </h3>

            <p className="mt-3 text-gray-600">
              {fertilizer.purpose}
            </p>

            <div className="mt-4 inline-block bg-white px-3 py-2 rounded-xl text-sm font-medium text-green-700">
              {fertilizer.applicationStage}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default CropFertilizers;