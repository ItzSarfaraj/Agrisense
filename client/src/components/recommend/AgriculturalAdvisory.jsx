import { AlertTriangle } from "lucide-react";

const AgriculturalAdvisory = ({ advisory }) => {
  if (!advisory?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
          <AlertTriangle size={22} className="text-green-600 dark:text-green-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Agricultural Advisory
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Based on current weather conditions
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {advisory.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-green-50 dark:bg-gray-700/50 rounded-xl p-4"
          >
            <span className="text-green-600 dark:text-green-400 font-bold">•</span>

            <p className="text-gray-700 dark:text-gray-300">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgriculturalAdvisory;