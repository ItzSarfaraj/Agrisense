import {
  AlertTriangle,
  Check,
} from "lucide-react";

const CropDoctorExpertHelp = ({
  expertHelp,
  disclaimer,
  fallback,
  title,
}) => {
  return (
    <>
      {expertHelp && (
        <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle
                size={16}
                className="text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-amber-800/80 dark:text-amber-200/80">
                {expertHelp}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
        <div className="flex items-start gap-2">
          <Check
            size={14}
            className="mt-0.5 shrink-0 text-emerald-500"
            aria-hidden="true"
          />

          <p className="text-[10px] leading-5 text-gray-500 dark:text-gray-400">
            {disclaimer || fallback}
          </p>
        </div>
      </div>
    </>
  );
};

export default CropDoctorExpertHelp;