import Select from "react-select";
import VoiceInputButton from "./VoiceInputButton";

const FarmLocationFields = ({
  selectedState,
  selectedDistrict,
  season,
  stateOptions,
  districtOptions,
  seasonOptions,
  selectStyles,
  setSelectedState,
  setSelectedDistrict,
  setSeason,
  voice,
}) => {
  const renderVoiceButton = (field, label, disabled = false) => (
    <VoiceInputButton
      field={field}
      label={label}
      isSupported={voice.isSupported}
      isListening={voice.isListening}
      activeField={voice.activeField}
      onToggle={voice.toggle}
      disabled={disabled}
    />
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold">
          1
        </span>

        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100">
            Farm Location
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Used for location-specific recommendation and weather context.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            State
          </label>

          <div className="relative">
            <Select
              options={stateOptions}
              placeholder="Search State..."
              styles={selectStyles}
              value={
                stateOptions.find((option) => option.value === selectedState) ||
                null
              }
              onChange={(selected) => {
                setSelectedState(selected?.value || "");
                setSelectedDistrict("");
              }}
            />

            {renderVoiceButton("state", "state")}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            District
          </label>

          <div className="relative">
            <Select
              options={districtOptions}
              placeholder="Search District..."
              isDisabled={!selectedState}
              styles={selectStyles}
              value={
                districtOptions.find(
                  (option) => option.value === selectedDistrict,
                ) || null
              }
              onChange={(selected) =>
                setSelectedDistrict(selected?.value || "")
              }
            />

            {renderVoiceButton("district", "district", !selectedState)}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Farming Season
          </label>

          <div className="relative">
            <Select
              options={seasonOptions}
              placeholder="Select Season..."
              styles={selectStyles}
              value={
                seasonOptions.find((option) => option.value === season) || null
              }
              onChange={(selected) => setSeason(selected?.value || "")}
            />

            {renderVoiceButton("season", "farming season")}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Choose the season for which you want the recommendation.
          </p>
        </div>
      </div>

      {voice.isListening && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />

          {voice.interimTranscript || "Listening..."}
        </div>
      )}
    </div>
  );
};

export default FarmLocationFields;
