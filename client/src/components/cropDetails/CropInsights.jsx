const CropInsights = ({ crop }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Advantages */}
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">

        <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
          Benefits
        </p>

        <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
          Advantages
        </h2>

        <div className="mt-6 space-y-4">

          {crop.advantages?.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 items-start"
            >
              <span className="text-green-600 dark:text-green-400 text-xl">
                ✅
              </span>

              <p className="text-gray-700 dark:text-gray-300">
                {item}
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* Challenges */}
      <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">

        <p className="text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider text-sm">
          Risks
        </p>

        <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
          Challenges
        </h2>

        <div className="mt-6 space-y-4">

          {crop.challenges?.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 items-start"
            >
              <span className="text-red-500 dark:text-red-400 text-xl">
                ⚠️
              </span>

              <p className="text-gray-700 dark:text-gray-300">
                {item}
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default CropInsights;