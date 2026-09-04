const AIActionPlanCard = ({ actionPlan }) => {
  if (!actionPlan?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        📋 AI Action Plan
      </h2>

      <div className="space-y-4">
        {actionPlan.map((action, index) => (
          <div
            key={index}
            className="flex items-start gap-4"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold">
              {index + 1}
            </span>

            <p className="text-gray-700 dark:text-gray-300 pt-1">
              {action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIActionPlanCard;