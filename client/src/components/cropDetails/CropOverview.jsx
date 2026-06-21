const CropOverview = ({ crop }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Crop Overview
      </h2>

      <p className="text-gray-600 dark:text-gray-300 leading-9 text-lg">
        {crop.overview}
      </p>

    </div>
  );
};

export default CropOverview;