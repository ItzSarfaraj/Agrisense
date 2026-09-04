import {
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import AgriSenseAvatar from "../AgriSenseAvatar";

const CropDoctorHeader = () => {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50/40 px-5 py-5 shadow-sm dark:border-emerald-900/60 dark:from-gray-900 dark:via-emerald-950/20 dark:to-gray-900 sm:px-7 sm:py-6">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <AgriSenseAvatar
            size={50}
            className="border-emerald-300 shadow-md shadow-emerald-500/10"
          />

          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 backdrop-blur-sm dark:border-emerald-900/60 dark:bg-gray-800/80">
              <Stethoscope
                size={13}
                className="text-emerald-600 dark:text-emerald-400"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                AI Crop Doctor
              </span>

              <Sparkles
                size={12}
                className="text-emerald-500"
              />
            </div>

            <h1 className="mt-2.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              What's wrong with your crop?
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-gray-400 sm:text-sm">
              Upload photos of the affected plant and describe what you're
              seeing. The AI will examine the visual symptoms and help you
              understand possible causes.
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 text-[11px] font-semibold text-emerald-700 backdrop-blur-sm dark:border-emerald-900/60 dark:bg-gray-800/80 dark:text-emerald-300 sm:flex">
          <ShieldCheck size={14} />
          Vision AI
        </div>
      </div>
    </div>
  );
};

export default CropDoctorHeader;