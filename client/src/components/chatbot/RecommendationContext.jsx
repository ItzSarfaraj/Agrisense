import {
  MapPin,
  CalendarDays,
  FlaskConical,
  IndianRupee,
  Sprout,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const RecommendationContext = ({ context }) => {
  const {
    state,
    district,
    season,
    mode,
    selectedCrop,
    recommendations = [],
  } = context || {};

  if (!selectedCrop) return null;

  const cropName = selectedCrop.crop || "Crop";

  return (
    <section className="w-full pb-4">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/95 shadow-sm dark:border-emerald-900/60 dark:bg-gray-900/95">
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 dark:border-emerald-900/70 dark:bg-emerald-950/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  Recommendation Assistant
                </span>
                <Sparkles size={11} className="text-emerald-500" aria-hidden="true" />
              </div>

              <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                  Your Crop Recommendation
                </h2>
                <span className="hidden text-xs text-slate-400 dark:text-gray-500 md:block">
                  Ask about cultivation, fertilizer, risks and more
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2.5 rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 px-3 py-2 text-white shadow-sm shadow-emerald-500/20">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/15">
                <Sprout size={16} aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-100">
                  Best Crop
                </p>
                <p className="max-w-[140px] truncate text-sm font-bold capitalize leading-tight">
                  {cropName}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <ContextItem
              icon={MapPin}
              label="Location"
              value={
                district
                  ? `${district}${state ? `, ${state}` : ""}`
                  : state || "Not available"
              }
            />
            <ContextItem
              icon={CalendarDays}
              label="Season"
              value={season || "Not available"}
            />
            <ContextItem
              icon={FlaskConical}
              label="Analysis"
              value={mode === "soil" ? "Soil Analysis" : "Quick Recommendation"}
            />
            <ContextItem
              icon={IndianRupee}
              label="Expected Profit"
              value={
                selectedCrop.expected_profit != null
                  ? `₹${Number(selectedCrop.expected_profit).toLocaleString()}`
                  : "Not available"
              }
              highlight
            />
          </div>

          {recommendations.length > 1 && (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/60">
              <p className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-gray-500">
                Other Crops
              </p>

              {recommendations.slice(1, 5).map((crop, index) => (
                <span
                  key={`${crop.crop}-${index}`}
                  className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium capitalize text-slate-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  {crop.crop}
                  <ChevronRight size={11} className="text-slate-300 dark:text-gray-500" aria-hidden="true" />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ContextItem = ({ icon: Icon, label, value, highlight = false }) => (
  <div
    className={`rounded-lg border px-2.5 py-2 ${
      highlight
        ? "border-emerald-100 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20"
        : "border-slate-100 bg-slate-50/70 dark:border-gray-700 dark:bg-gray-800/60"
    }`}
  >
    <div className="flex items-center gap-1.5">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
          highlight
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
            : "bg-white text-slate-400 shadow-sm dark:bg-gray-700 dark:text-gray-400"
        }`}
      >
        <Icon size={12} aria-hidden="true" />
      </div>
      <span className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-gray-500">
        {label}
      </span>
    </div>

    <p
      className={`mt-1 truncate text-xs font-semibold capitalize ${
        highlight ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-gray-200"
      }`}
      title={value}
    >
      {value}
    </p>
  </div>
);

export default RecommendationContext;