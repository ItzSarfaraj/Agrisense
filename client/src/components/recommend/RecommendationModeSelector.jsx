const RecommendationModeSelector = ({ mode, setMode, clearSoilValues }) => {
  const selectMode = (value) => {
    setMode(value);
    if (value === "quick") {
      clearSoilValues();
    }
  };

  const ModeButton = ({ value, icon, title, description }) => {
    const active = mode === value;

    return (
      <button
        type="button"
        onClick={() => selectMode(value)}
        className={`group text-left rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
          active
            ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 shadow-md ring-1 ring-green-500/20"
            : "border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xl">{icon}</span>
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-full border-2 text-[11px] font-bold transition-colors ${
              active
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-300 dark:border-gray-600 text-transparent"
            }`}
          >
            ✓
          </span>
        </div>

        <h3 className="mt-4 font-bold text-lg text-gray-800 dark:text-gray-100">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <ModeButton
        value="quick"
        icon="⚡"
        title="Quick Mode"
        description="Fast recommendation using location and season."
      />

      <ModeButton
        value="soil"
        icon="🧪"
        title="Soil Mode"
        description="More precise analysis using soil test parameters."
      />

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