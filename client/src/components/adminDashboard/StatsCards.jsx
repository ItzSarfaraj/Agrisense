import {
  Users,
  BarChart3,
  Zap,
  FlaskConical,
  Sprout,
} from "lucide-react";

const StatsCards = ({ stats }) => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Total Users
          </p>

          <Users
            size={28}
            className="text-green-600"
          />
        </div>

        <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-white">
          {stats?.totalUsers || 0}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Predictions
          </p>

          <BarChart3
            size={28}
            className="text-blue-600"
          />
        </div>

        <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-white">
          {stats?.totalPredictions || 0}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Quick Mode
          </p>

          <Zap
            size={28}
            className="text-yellow-500"
          />
        </div>

        <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-white">
          {stats?.quickPredictions || 0}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Soil Mode
          </p>

          <FlaskConical
            size={28}
            className="text-orange-500"
          />
        </div>

        <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-white">
          {stats?.soilPredictions || 0}
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Top Crop
          </p>

          <Sprout
            size={28}
            className="text-green-600"
          />
        </div>

        <h2 className="text-3xl font-bold mt-4 text-green-600 dark:text-green-400 capitalize">
          {stats?.topCrop || "N/A"}
        </h2>
      </div>

    </div>
  );
};

export default StatsCards;