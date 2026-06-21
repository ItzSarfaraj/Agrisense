const CropStats = ({ crops }) => {
  const categories = [...new Set(crops.map((crop) => crop.category))];

  const categoryCounts = {};

  crops.forEach((crop) => {
    categoryCounts[crop.category] = (categoryCounts[crop.category] || 0) + 1;
  });

  const topCategory = Object.keys(categoryCounts).reduce(
    (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
    Object.keys(categoryCounts)[0],
  );

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl dark:shadow-black/30 border border-green-100 dark:border-gray-700 hover:-translate-y-1 transition">
        <p className="text-gray-500 dark:text-gray-400">Total Crops</p>

        <h2 className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
          {crops.length}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl dark:shadow-black/30 border border-green-100 dark:border-gray-700 hover:-translate-y-1 transition">
        <p className="text-gray-500 dark:text-gray-400">Categories</p>

        <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          {categories.length}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl dark:shadow-black/30 border border-green-100 dark:border-gray-700 hover:-translate-y-1 transition">
        <p className="text-gray-500 dark:text-gray-400">Top Category</p>

        <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">
          {topCategory}
        </h2>
      </div>
    </div>
  );
};

export default CropStats;