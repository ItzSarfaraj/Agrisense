const likelihoodStyles = {
  high:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300",

  moderate:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300",

  low:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300",
};

const CropDoctorConditionCard = ({
  condition,
  index,
  text,
}) => {
  const likelihood = (
    condition.likelihood || "low"
  ).toLowerCase();

  return (
    <div
      className={`rounded-2xl border p-4 ${
        likelihoodStyles[likelihood] ||
        likelihoodStyles.low
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="text-base font-bold">
            {condition.common_name ||
              condition.name ||
              text.possibleConditions}
          </h4>

          {condition.local_name && (
            <p className="mt-1 text-sm font-semibold">
              {condition.local_name}
            </p>
          )}

          {condition.scientific_name && (
            <p className="mt-1 text-[11px] italic opacity-70">
              {condition.scientific_name}
            </p>
          )}
        </div>

        <span className="w-fit shrink-0 rounded-full border border-current/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide">
          {likelihood}{" "}
          {text.likelihood}
        </span>
      </div>

      {condition.reason && (
        <div className="mt-3 border-t border-current/10 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
            {text.why}
          </p>

          <p className="mt-1.5 text-xs leading-5 opacity-90">
            {condition.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default CropDoctorConditionCard;