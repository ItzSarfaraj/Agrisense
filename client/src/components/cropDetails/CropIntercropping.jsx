const CropIntercropping = ({ crop }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">

      <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
        Farm Optimization
      </p>

      <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
        Intercropping Options
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Compatible crops that can be grown
        alongside for better land utilization.
      </p>

      <div className="flex flex-wrap gap-3 mt-6">

        {crop.intercroppingOptions?.map((cropName) => (
          <span
            key={cropName}
            className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium"
          >
            {cropName}
          </span>
        ))}

      </div>

    </div>
  );
};

export default CropIntercropping;