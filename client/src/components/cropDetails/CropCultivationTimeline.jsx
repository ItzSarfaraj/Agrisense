const CropCultivationTimeline = ({ crop }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <div className="mb-8">
        <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
          Cultivation Guide
        </p>

        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          Step-by-Step Cultivation Process
        </h2>

        <p className="text-gray-500 mt-2">
          Follow these recommended cultivation practices to maximize yield,
          maintain crop health and improve profitability.
        </p>
      </div>

      <div className="space-y-8">

        {crop.cultivationProcess?.map((item, index) => (
          <div
            key={item.step}
            className="relative flex gap-6"
          >
            {/* Timeline Line */}
            {index !== crop.cultivationProcess.length - 1 && (
              <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-green-200"></div>
            )}

            {/* Step Circle */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-md">
                {item.step}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">

              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">

                <h3 className="text-xl font-bold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-8 mt-3">
                  {item.description}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default CropCultivationTimeline;