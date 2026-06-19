const CropYieldMarket = ({ crop }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8">

      <div className="mb-6">
        <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
          Economics
        </p>

        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          Yield & Market Intelligence
        </h2>

        <p className="text-gray-500 mt-2">
          Production potential and market opportunities.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500">
            Expected Yield
          </p>

          <h3 className="text-2xl font-bold text-green-700 mt-2">
            {crop.yield?.perHectare}
          </h3>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500">
            Profitability
          </p>

          <h3 className="text-xl font-bold text-blue-700 mt-2">
            {crop.yield?.profitability}
          </h3>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500">
            Market Demand
          </p>

          <h3 className="text-lg font-bold text-amber-700 mt-2">
            High
          </h3>
        </div>

      </div>

      <div className="mt-6 bg-gray-50 rounded-2xl p-5 border">
        <h4 className="font-semibold text-lg mb-3">
          Market Outlook
        </h4>

        <p className="text-gray-600 leading-8">
          {crop.marketDemand}
        </p>
      </div>

    </div>
  );
};

export default CropYieldMarket;