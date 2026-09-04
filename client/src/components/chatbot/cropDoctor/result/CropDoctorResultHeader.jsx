import {
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

const CropDoctorResultHeader = ({
  text,
  speaking = false,
  speechText,
  onSpeak,
  onStopSpeaking,
  onNewAnalysis,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 px-5 py-6 text-white sm:px-7">
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur-sm"
            >
              🩺
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-50">
                {text.analysis}
              </p>

              <p className="mt-0.5 text-xs text-emerald-100">
                {text.subtitle}
              </p>
            </div>
          </div>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            {text.title}
          </h2>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-emerald-50 sm:text-sm">
            {text.description}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              speaking
                ? onStopSpeaking?.()
                : onSpeak?.(speechText)
            }
            aria-label={
              speaking
                ? text.stop
                : text.speak
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            {speaking ? (
              <VolumeX
                size={15}
                aria-hidden="true"
              />
            ) : (
              <Volume2
                size={15}
                aria-hidden="true"
              />
            )}

            {speaking
              ? text.stop
              : text.speak}
          </button>

          <button
            type="button"
            onClick={onNewAnalysis}
            aria-label={text.newAnalysis}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <RotateCcw
              size={14}
              aria-hidden="true"
            />

            <span>
              {text.newAnalysis}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropDoctorResultHeader;