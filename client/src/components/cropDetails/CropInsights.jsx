const CropInsights = ({ crop }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Advantages */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
          Benefits
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Advantages
        </h2>

        <div className="mt-6 space-y-4">

          {crop.advantages?.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 items-start"
            >
              <span className="text-green-600 text-xl">
                ✅
              </span>

              <p className="text-gray-700">
                {item}
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* Challenges */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <p className="text-red-600 font-semibold uppercase tracking-wider text-sm">
          Risks
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Challenges
        </h2>

        <div className="mt-6 space-y-4">

          {crop.challenges?.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 items-start"
            >
              <span className="text-red-500 text-xl">
                ⚠️
              </span>

              <p className="text-gray-700">
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