import { AlertCircle, ChevronDown, Leaf } from "lucide-react";

const CROP_OPTIONS = [
  "Rice",
  "Wheat",
  "Maize",
  "Cotton",
  "Sugarcane",
  "Potato",
  "Tomato",
  "Onion",
  "Chilli",
  "Soybean",
  "Groundnut",
  "Mustard",
  "Chickpea",
  "Pigeon Pea",
  "Brinjal",
  "Okra",
  "Cabbage",
  "Cauliflower",
  "Mango",
  "Banana",
  "Other / Not sure",
];

const CropDoctorDetails = ({
  crop,
  symptoms,
  onCropChange,
  onSymptomsChange,
}) => {
  return (
    <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-800/40 sm:p-5">
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
          Case details
        </p>

        <h2 className="mt-1 text-base font-bold text-gray-800 dark:text-gray-100">
          Help the AI understand the problem
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          These details are optional, but they can make the analysis more
          useful.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <label
            htmlFor="crop-doctor-crop"
            className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200"
          >
            <Leaf
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
            Crop
            <span className="font-normal text-gray-400">Optional</span>
          </label>

          <div className="relative">
            <select
              id="crop-doctor-crop"
              value={crop}
              onChange={(event) => onCropChange(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-xs font-medium text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">Select crop</option>

              {CROP_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label
              htmlFor="crop-doctor-symptoms"
              className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200"
            >
              <AlertCircle
                size={14}
                className="text-emerald-600 dark:text-emerald-400"
              />
              What are you noticing?
              <span className="font-normal text-gray-400">Optional</span>
            </label>

            <span className="text-[10px] text-gray-400">
              {symptoms.length}/500
            </span>
          </div>

          <textarea
            id="crop-doctor-symptoms"
            value={symptoms}
            maxLength={500}
            rows={3}
            onChange={(event) => onSymptomsChange(event.target.value)}
            placeholder="Example: Yellow spots appeared on the leaves about one week ago..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-xs leading-5 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CropDoctorDetails;
