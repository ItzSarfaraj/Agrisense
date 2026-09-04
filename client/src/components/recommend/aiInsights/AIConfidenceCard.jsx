const AIConfidenceCard = ({ confidence }) => {
  const value = Math.max(0, Math.min(100, Number(confidence)));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🎯 ML Model Confidence
      </h2>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-4 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>

      <p className="mt-4 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
        {value}%
      </p>

      <p className="text-gray-500 dark:text-gray-400">
        Confidence reported by the crop recommendation model.
      </p>
    </div>
  );
};

export default AIConfidenceCard;