const AIComparisonAnalysisCard = ({ comparison }) => {
  if (!comparison?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🧠</span>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          AI Decision Analysis
        </h2>
      </div>

      <div className="space-y-4">
        {comparison.map((item, index) => (
          <p
            key={index}
            className="text-gray-700 dark:text-gray-300"
          >
            • {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AIComparisonAnalysisCard;