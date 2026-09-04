import { TrendingUp } from "lucide-react";

const DEFAULT_TEXT = {
  badge: "Market Intelligence",
  title: "Market Price Predictor",
  subtitle: "Estimate the expected market price using historical mandi data.",
};

const PricePredictorHeader = ({ text = DEFAULT_TEXT }) => {
  const safeText = {
    ...DEFAULT_TEXT,
    ...text,
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-green-700 to-teal-700 p-6 text-white shadow-xl shadow-emerald-900/10 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <TrendingUp size={14} />
            {safeText.badge}
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {safeText.title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
            {safeText.subtitle}
          </p>
        </div>

        <div className="hidden h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white/10 text-4xl shadow-inner backdrop-blur sm:flex">
          📈
        </div>
      </div>
    </div>
  );
};

export default PricePredictorHeader;