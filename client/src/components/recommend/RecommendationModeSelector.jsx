const RecommendationModeSelector = ({ mode, setMode, clearSoilValues }) => {
  const selectMode = (value) => {
    setMode(value);

    if (value === "quick") {
      clearSoilValues();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      <button
        type="button"
        onClick={() => selectMode("quick")}
        className={`group text-left rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
          mode === "quick"
            ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 shadow-md"
            : "border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xl">⚡</span>

          <span
            className={`w-5 h-5 rounded-full border-4 ${
              mode === "quick"
                ? "border-green-500 bg-white dark:bg-gray-800"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
        </div>

        <h3 className="mt-4 font-bold text-lg text-gray-800 dark:text-gray-100">
          Quick Mode
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fast recommendation using location and season.
        </p>
      </button>

      <button
        type="button"
        onClick={() => setMode("soil")}
        className={`group text-left rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
          mode === "soil"
            ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 shadow-md"
            : "border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xl">🧪</span>

          <span
            className={`w-5 h-5 rounded-full border-4 ${
              mode === "soil"
                ? "border-green-500 bg-white dark:bg-gray-800"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
        </div>

        <h3 className="mt-4 font-bold text-lg text-gray-800 dark:text-gray-100">
          Soil Mode
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          More precise analysis using soil test parameters.
        </p>
      </button>

      <div className="hidden lg:flex rounded-2xl bg-gradient-to-br from-slate-900 to-gray-800 text-white p-5 flex-col justify-between shadow-lg">
        <span className="text-3xl">🌱</span>

        <div>
          <p className="text-sm text-gray-300">Current mode</p>

          <p className="text-xl font-bold mt-1">
            {mode === "quick" ? "Quick Recommendation" : "Soil Analysis"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModeSelector;
