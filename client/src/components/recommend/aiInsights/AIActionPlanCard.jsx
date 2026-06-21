import { getActionPlan } from "./AIInsightsHelper";

const AIActionPlanCard = ({ crop }) => {
  const actions = getActionPlan(crop);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        📋 AI Action Plan
      </h2>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <p className="text-gray-700 dark:text-gray-300">{action}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIActionPlanCard;