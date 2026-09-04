import { AlertTriangle } from "lucide-react";
import CropDoctorConditionCard from "./CropDoctorConditionCard";

const CropDoctorConditions = ({
  conditions = [],
  text,
}) => {
  if (!conditions.length) {
    return null;
  }

  return (
    <div className="rounded-[1.4rem] border border-gray-100 bg-white/85 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/85 sm:p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle
            size={16}
            className="text-amber-500"
            aria-hidden="true"
          />
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {text.possibleConditions}
          </h3>

          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            {text.possibilities}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {conditions.map(
          (condition, index) => (
            <CropDoctorConditionCard
              key={`condition-${index}`}
              condition={condition}
              index={index}
              text={text}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default CropDoctorConditions;