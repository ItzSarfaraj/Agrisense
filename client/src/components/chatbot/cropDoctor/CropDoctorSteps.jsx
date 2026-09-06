import { Check, ImagePlus, Search, Stethoscope } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: ImagePlus,
    title: "Add photos",
    text: "Upload up to 5 clear images",
  },
  {
    number: 2,
    icon: Search,
    title: "Add context",
    text: "Tell us the crop and symptoms",
  },
  {
    number: 3,
    icon: Stethoscope,
    title: "Get diagnosis",
    text: "AI analyzes the visual signs",
  },
];

const CropDoctorSteps = ({ activeStep = 1 }) => {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {steps.map((step) => {
        const Icon = step.icon;
        const done = step.number < activeStep;
        const active = step.number === activeStep;

        return (
          <div
            key={step.number}
            className={`relative flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all ${
              active || done
                ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                : "border-gray-100 bg-gray-50/60 dark:border-gray-800 dark:bg-gray-800/40"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                done
                  ? "bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-400"
                  : active
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                    : "bg-white text-gray-400 shadow-sm dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {done ? <Check size={16} /> : <Icon size={16} />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold tracking-wider text-gray-400">
                  {String(step.number).padStart(2, "0")}
                </span>

                <p className="truncate text-xs font-bold text-gray-800 dark:text-gray-100">
                  {step.title}
                </p>
              </div>

              <p className="mt-0.5 truncate text-[10px] text-gray-500 dark:text-gray-400">
                {step.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CropDoctorSteps;