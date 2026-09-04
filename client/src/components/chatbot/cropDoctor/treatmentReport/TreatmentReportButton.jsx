import { FileText, Loader2, Sparkles } from "lucide-react";
import { getTreatmentReportText } from "./treatmentReportTranslations";

const TreatmentReportButton = ({
  onGenerate,
  loading = false,
  language = "en-IN",
}) => {
  const text = getTreatmentReportText(language);

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-5 shadow-[0_12px_35px_-20px_rgba(16,185,129,0.35)] dark:border-emerald-900/50 dark:from-emerald-950/30 dark:via-gray-900 dark:to-cyan-950/20 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-600/20">
            <Sparkles size={19} aria-hidden="true" />

            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-white shadow-sm"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {text.generate}
            </p>

            <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500 dark:text-gray-400">
              {text.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <FileText size={16} aria-hidden="true" />
          )}

          <span>{loading ? text.generating : text.generate}</span>
        </button>
      </div>
    </section>
  );
};

export default TreatmentReportButton;
