import { Sparkles, TrendingUp, Volume2, VolumeX } from "lucide-react";
import { MONTHS } from "../../hooks/usePricePredictor";

const PricePredictorResult = ({
  price,
  formData,
  translatedResult,
  text,
  isSpeaking,
  speechSupported,
  onSpeak,
  onStopSpeaking,
}) => {
  if (price === null) return null;

  return (
    <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5 dark:border-emerald-900/40 dark:bg-gray-900">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Sparkles size={13} />
              {text.result}
            </div>

            <h2 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
              {translatedResult || text.modalPrice}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formData.crop} · {formData.district}, {formData.state} ·{" "}
              {MONTHS[formData.month - 1]}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="text-right">
              <p className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-5xl">
                ₹ {Number(price).toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-xs font-semibold text-gray-400">
                {text.perQuintal}
              </p>
            </div>

            <button
              type="button"
              onClick={isSpeaking ? onStopSpeaking : onSpeak}
              disabled={!speechSupported}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                isSpeaking
                  ? "bg-red-500 text-white"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}
              title={isSpeaking ? text.stop : text.speak}
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-4">
          {[
            [text.crop, formData.crop],
            [text.state, formData.state],
            [text.district, formData.district],
            [text.month, MONTHS[formData.month - 1]],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {label}
              </p>

              <p className="mt-1.5 truncate text-sm font-bold text-gray-800 dark:text-gray-100">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-4 dark:bg-emerald-900/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-gray-800 dark:text-emerald-400">
            <TrendingUp size={18} />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {text.details}
            </p>

            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {text.modalPrice}: ₹ {Number(price).toLocaleString("en-IN")}{" "}
              {text.perQuintal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePredictorResult;