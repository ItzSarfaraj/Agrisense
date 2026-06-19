const AIScoreOverview = ({ weatherMatch, soilMatch, profitScore, riskScore }) => {
  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-3xl shadow-md p-5">
        <p className="text-gray-500">Weather Match</p>

        <h2 className="text-3xl font-bold text-blue-600 mt-2">
          {weatherMatch}%
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-5">
        <p className="text-gray-500">Soil Match</p>

        <h2 className="text-3xl font-bold text-purple-600 mt-2">
          {soilMatch}%
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-5">
        <p className="text-gray-500">Profit Score</p>

        <h2 className="text-3xl font-bold text-emerald-600 mt-2">
          {profitScore}%
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-5">
        <p className="text-gray-500">Risk Score</p>

        <h2 className="text-3xl font-bold text-orange-500 mt-2">{riskScore}%</h2>
      </div>
    </div>
  );
};

export default AIScoreOverview;
