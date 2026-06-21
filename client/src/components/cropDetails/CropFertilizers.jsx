const CropFertilizers = ({ crop }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">

      <div className="mb-6">
        <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
          Nutrient Management
        </p>

        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
          Recommended Fertilizers
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {crop.fertilizers?.map((fertilizer) => (
          <div
            key={fertilizer.name}
            className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-2xl p-5"
          >

            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
              {fertilizer.name}
            </h3>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              {fertilizer.purpose}
            </p>

            <div className="mt-4 inline-block bg-white dark:bg-gray-900/50 px-3 py-2 rounded-xl text-sm font-medium text-green-700 dark:text-green-400">
              {fertilizer.applicationStage}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default CropFertilizers;