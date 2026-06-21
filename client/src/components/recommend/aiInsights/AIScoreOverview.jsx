const AIScoreOverview = ({ weatherMatch, soilMatch, profitScore, riskScore }) => {
  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-5">
        <p className="text-gray-500 dark:text-gray-400">Weather Match</p>
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          {weatherMatch}%
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-5">
        <p className="text-gray-500 dark:text-gray-400">Soil Match</p>
        <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
          {soilMatch}%
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-5">
        <p className="text-gray-500 dark:text-gray-400">Profit Score</p>
        <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
          {profitScore}%
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-5">
        <p className="text-gray-500 dark:text-gray-400">Risk Score</p>
        <h2 className="text-3xl font-bold text-orange-500 dark:text-orange-400 mt-2">
          {riskScore}%
        </h2>
      </div>
    </div>
  );
};

export default AIScoreOverview;