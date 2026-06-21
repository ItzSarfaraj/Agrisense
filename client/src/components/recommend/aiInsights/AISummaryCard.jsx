const AISummaryCard = ({ bestCrop }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 border border-indigo-200 dark:border-indigo-800 rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
        🤖 AI Summary
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Based on profitability, cultivation requirements, market demand and
        current weather conditions,
        <span className="font-bold text-indigo-700 dark:text-indigo-400">
          {" "}
          {bestCrop?.crop}
        </span>{" "}
        emerged as the strongest recommendation and achieved the highest overall
        AI score.
      </p>
    </div>
  );
};

export default AISummaryCard;