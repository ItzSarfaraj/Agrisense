const CropSuitableStates = ({ crop }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <div className="mb-6">
        <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
          Regional Suitability
        </p>

        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          Suitable States
        </h2>

        <p className="text-gray-500 mt-2">
          Regions where this crop performs best under
          recommended agronomic practices.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {crop.suitableStates?.map((state) => (
          <span
            key={state}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
          >
            {state}
          </span>
        ))}
      </div>

    </div>
  );
};

export default CropSuitableStates;