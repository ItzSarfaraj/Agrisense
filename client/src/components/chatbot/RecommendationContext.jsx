import {
  MapPin,
  CalendarDays,
  FlaskConical,
  IndianRupee,
  Sprout,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const RecommendationContext = ({
  context,
}) => {
  const {
    state,
    district,
    season,
    mode,
    selectedCrop,
    recommendations = [],
  } = context || {};

  if (!selectedCrop) return null;

  const cropName =
    selectedCrop.crop || "Crop";

  return (
    <section className="w-full pb-4">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/95 shadow-sm dark:border-emerald-900/60 dark:bg-gray-900/95">
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative px-3.5 py-3 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 dark:border-emerald-900/70 dark:bg-emerald-950/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300">
                  Recommendation Assistant
                </span>

                <Sparkles
                  size={10}
                  className="text-emerald-500"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <h2 className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                  Your Crop Recommendation
                </h2>

                <span className="hidden truncate text-xs text-slate-400 dark:text-gray-500 md:block">
                  Ask about cultivation, fertilizer, risks and more
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 px-2.5 py-1.5 text-white shadow-sm shadow-emerald-500/20">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-white/15">
                <Sprout
                  size={14}
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-100">
                  Best Crop
                </p>

                <p className="max-w-[120px] truncate text-sm font-bold capitalize leading-tight">
                  {cropName}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
            <ContextItem
              icon={MapPin}
              label="Location"
              value={
                district
                  ? `${district}${
                      state
                        ? `, ${state}`
                        : ""
                    }`
                  : state ||
                    "Not available"
              }
            />

            <ContextItem
              icon={CalendarDays}
              label="Season"
              value={
                season ||
                "Not available"
              }
            />

            <ContextItem
              icon={FlaskConical}
              label="Analysis"
              value={
                mode === "soil"
                  ? "Soil Analysis"
                  : "Quick Recommendation"
              }
            />

            <ContextItem
              icon={IndianRupee}
              label="Expected Profit"
              value={
                selectedCrop.expected_profit !=
                null
                  ? `₹${Number(
                      selectedCrop.expected_profit,
                    ).toLocaleString()}`
                  : "Not available"
              }
              highlight
            />
          </div>

          {recommendations.length >
            1 && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-800/60">
              <p className="shrink-0 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-gray-500">
                Other Crops
              </p>

              {recommendations
                .slice(1, 5)
                .map(
                  (
                    crop,
                    index,
                  ) => (
                    <span
                      key={`${crop.crop}-${index}`}
                      className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium capitalize text-slate-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {crop.crop}

                      <ChevronRight
                        size={9}
                        className="text-slate-300 dark:text-gray-500"
                        aria-hidden="true"
                      />
                    </span>
                  ),
                )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ContextItem = ({
  icon: Icon,
  label,
  value,
  highlight = false,
}) => (
  <div
    className={`rounded-lg border px-2 py-1.5 ${
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
        <Icon
          size={11}
          aria-hidden="true"
        />
      </div>

      <span className="truncate text-[8px] font-bold uppercase tracking-[0.07em] text-slate-400 dark:text-gray-500">
        {label}
      </span>
    </div>

    <p
      className={`mt-1 truncate text-[11px] font-semibold capitalize ${
        highlight
          ? "text-emerald-700 dark:text-emerald-300"
          : "text-slate-700 dark:text-gray-200"
      }`}
      title={value}
    >
      {value}
    </p>
  </div>
);

export default RecommendationContext;