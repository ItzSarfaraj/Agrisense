import { Info } from "lucide-react";

const severityStyles = {
  low: {
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    width: "w-1/3",
  },
  moderate: {
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    width: "w-2/3",
  },
  high: {
    text: "text-red-600 dark:text-red-400",
    bar: "bg-red-500",
    width: "w-full",
  },
  unclear: {
    text: "text-gray-500 dark:text-gray-400",
    bar: "bg-gray-400",
    width: "w-1/4",
  },
};

const CropDoctorOverview = ({
  analysis,
  text,
  conditionsCount,
}) => {
  const severity = (
    analysis.severity || "unclear"
  ).toLowerCase();

  const severityInfo =
    severityStyles[severity] ||
    severityStyles.unclear;

  return (
    <div className="p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
            {text.imageQuality}
          </p>

          <p className="mt-2 text-sm font-bold capitalize text-gray-800 dark:text-gray-100">
            {analysis.image_quality ||
              text.unknown}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
              {text.severity}
            </p>

            <span
              className={`text-sm font-bold ${severityInfo.text}`}
            >
              {text[severity] ||
                text.unclear}
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full rounded-full ${severityInfo.width} ${severityInfo.bar}`}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
            {text.conditions}
          </p>

          <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
            {conditionsCount}
          </p>
        </div>
      </div>

      {analysis.summary && (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50/60 p-4 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-teal-950/20 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-gray-900 dark:text-emerald-400">
              <Info
                size={17}
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {text.assessment}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-gray-600 dark:text-gray-300">
                {analysis.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDoctorOverview;