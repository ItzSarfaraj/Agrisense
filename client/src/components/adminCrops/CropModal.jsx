const CropModal = ({ crop, onClose }) => {
  if (!crop) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl dark:shadow-black/40"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{crop.name}</h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <img
          src={crop.image}
          alt={crop.name}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Scientific Name</p>

            <p className="font-semibold text-gray-900 dark:text-gray-100">{crop.scientificName}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Category</p>

            <p className="font-semibold text-gray-900 dark:text-gray-100">{crop.category}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Season</p>

            <p className="font-semibold text-gray-900 dark:text-gray-100">{crop.season}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Crop Duration</p>

            <p className="font-semibold text-gray-900 dark:text-gray-100">{crop.cropDuration}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-500 dark:text-gray-400 mb-2">Overview</p>

          <p className="text-gray-700 dark:text-gray-300">{crop.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default CropModal;