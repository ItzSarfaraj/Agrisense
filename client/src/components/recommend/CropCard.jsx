const formatProfit = (value) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  }

  return `₹${value.toLocaleString()}`;
};

const CropCard = ({
  rank,
  crop,
  confidence,
  expected_profit,
  profit_per_hectare,
  profit_per_acre,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-2 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        rank === 1
          ? "border-2 border-green-500 shadow-md"
          : "border border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <img
            src={`/crops/${crop.toLowerCase()}.png`}
            alt={crop}
            onError={(e) => {
              e.target.src = "/crops/default.png";
            }}
            className="w-16 h-16 rounded-xl object-cover border"
          />

          <div>
            <h3 className="text-2xl font-bold capitalize text-gray-800">
              {crop}
            </h3>

            {confidence !== undefined && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${confidence}%` }}
                  />
                </div>

                <p className="text-sm text-green-700 font-medium mt-1">
                  Suitability Score: {confidence}%
                </p>
              </div>
            )}

            {confidence === undefined && (
              <p className="text-sm text-gray-500">Recommended Crop</p>
            )}
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            rank === 1
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-700"
          }`}
        >
          #{rank}
        </div>
      </div>

      {/* Main Profit */}
      <div className="mb-5">
        <p className="text-sm text-gray-500">Expected Profit</p>

        <h2 className="text-4xl font-bold text-green-700 mt-1">
          {formatProfit(expected_profit)}
        </h2>

        <p className="text-sm text-gray-500 mt-1">per hectare</p>
      </div>

      {/* Range */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Profit Range</p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Minimum</p>

            <p className="font-semibold text-gray-800">
              ₹{Math.max(0, profit_per_hectare.min).toLocaleString()}
            </p>
          </div>

          <div className="text-gray-400">—</div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Maximum</p>

            <p className="font-semibold text-gray-800">
              ₹{profit_per_hectare.max.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Per Acre */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700">Per Acre Estimate</p>

        <p className="text-xl font-bold text-blue-700 mt-2">
          ₹{profit_per_acre.expected.toLocaleString()}
        </p>
      </div>

      {/* Best Crop Badge */}
      {rank === 1 && (
        <div className="mt-4 bg-green-100 text-green-800 text-center py-2 rounded-lg text-sm font-semibold">
          🏆 Best Recommendation
        </div>
      )}
    </div>
  );
};

export default CropCard;
