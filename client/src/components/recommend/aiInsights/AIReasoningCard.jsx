const AIReasoningCard = ({ reasoning }) => {
  if (!reasoning?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🧠</span>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          AI Reasoning
        </h2>
      </div>

      <div className="space-y-4">
        {reasoning.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 text-gray-700 dark:text-gray-300"
          >
            <span>✅</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIReasoningCard;