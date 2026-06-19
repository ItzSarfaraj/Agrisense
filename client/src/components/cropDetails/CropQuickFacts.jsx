const CropQuickFacts = ({ crop }) => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

      <div className="bg-white rounded-2xl p-5 shadow-md border min-h-[170px] flex flex-col">
        <p className="text-gray-500 text-sm">🌡 Temperature</p>
        <h3 className="font-bold text-lg mt-3 text-gray-800 leading-8">
          {crop.climate.temperature}
        </h3>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-md border">
        <p className="text-gray-500 text-sm">🌧 Rainfall</p>
        <h3 className="font-bold mt-2">
          {crop.climate.rainfall}
        </h3>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-md border">
        <p className="text-gray-500 text-sm">🌱 Soil Type</p>
        <h3 className="font-bold mt-2">
          {crop.soil.type}
        </h3>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-md border">
        <p className="text-gray-500 text-sm">💧 Water Need</p>
        <h3 className="font-bold mt-2">
          {crop.waterRequirement}
        </h3>
      </div>

    </div>
  );
};

export default CropQuickFacts;