const CropStorage = ({ crop }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">

      <p className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider text-sm">
        Post Harvest
      </p>

      <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
        Storage Guidelines
      </h2>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-2xl p-6">

        <p className="text-gray-700 dark:text-gray-300 leading-8">
          {crop.storageGuidelines}
        </p>

      </div>

    </div>
  );
};

export default CropStorage;