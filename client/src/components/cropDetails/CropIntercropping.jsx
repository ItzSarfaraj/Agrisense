const CropIntercropping = ({ crop }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
        Farm Optimization
      </p>

      <h2 className="text-3xl font-bold mt-2">
        Intercropping Options
      </h2>

      <p className="text-gray-500 mt-2">
        Compatible crops that can be grown
        alongside for better land utilization.
      </p>

      <div className="flex flex-wrap gap-3 mt-6">

        {crop.intercroppingOptions?.map((cropName) => (
          <span
            key={cropName}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
          >
            {cropName}
          </span>
        ))}

      </div>

    </div>
  );
};

export default CropIntercropping;