import { getMarketOutlook, calculateWeatherMatch } from "./AIInsightsHelper";
const DistrictIntelligenceCard = ({ cropDetails, weather }) => {
  const crop = cropDetails?.[0];

  const marketOutlook = getMarketOutlook(crop?.details?.marketDemand);
  const weatherAnalysis = calculateWeatherMatch(weather);
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">📍 District Intelligence</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">Recommended Crop</p>

          <h3 className="font-bold text-xl capitalize">{crop?.crop}</h3>
        </div>

        <div>
          <p className="text-gray-500">Weather Status</p>
          <h3 className={`font-bold ${weatherAnalysis.color}`}>
            {weatherAnalysis.status}
          </h3>{" "}
        </div>

        <div>
          <p className="text-gray-500">Market Outlook</p>

          <h3 className={`font-bold ${marketOutlook.color}`}>
            {marketOutlook.outlook}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default DistrictIntelligenceCard;
