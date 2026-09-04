import VoiceInputButton from "./VoiceInputButton";

const SoilParameters = ({
  N,
  P,
  K,
  pH,
  setN,
  setP,
  setK,
  setPH,
  inputClass,
  voice,
}) => {
  const renderField = ({ field, value, setter, placeholder, label, step }) => (
    <div className="relative">
      <input
        type="number"
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className={inputClass}
        aria-label={label}
      />

      <VoiceInputButton
        field={field}
        label={`${label} value`}
        isSupported={voice.isSupported}
        isListening={voice.isListening}
        activeField={voice.activeField}
        onToggle={voice.toggle}
      />
    </div>
  );

  return (
    <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-900/10 p-5 md:p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="text-2xl">🧪</span>

        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100">
            Soil Test Parameters
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Enter values from your Soil Health Card or laboratory report.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderField({
          field: "N",
          value: N,
          setter: setN,
          placeholder: "Nitrogen · 0–140",
          label: "Nitrogen",
        })}

        {renderField({
          field: "P",
          value: P,
          setter: setP,
          placeholder: "Phosphorus · 0–145",
          label: "Phosphorus",
        })}

        {renderField({
          field: "K",
          value: K,
          setter: setK,
          placeholder: "Potassium · 0–205",
          label: "Potassium",
        })}

        {renderField({
          field: "pH",
          value: pH,
          setter: setPH,
          placeholder: "Soil pH · 3.5–9.5",
          label: "Soil pH",
          step: "0.1",
        })}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Ranges: N (0–140), P (0–145), K (0–205), pH (3.5–9.5).
      </p>
    </div>
  );
};

export default SoilParameters;
