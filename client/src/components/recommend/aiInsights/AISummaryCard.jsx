const AISummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🤖</span>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          AI Summary
        </h2>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        {summary}
      </p>
    </div>
  );
};

export default AISummaryCard;