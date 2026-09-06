import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Mic,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import VoiceInputButton from "../common/VoiceInputButton";
import { SUPPORTED_LANGUAGES } from "../chatbot/LanguageSelector";
import { MONTHS } from "../../hooks/usePricePredictor";

const PricePredictorForm = ({
  formData,
  cropQuery,
  filteredCrops,
  showSuggestions,
  states,
  districts,
  language,
  text,
  loading,
  voiceSupported,
  isListening,
  activeField,
  interimTranscript,
  onLanguageChange,
  onCropSearch,
  onCropSelect,
  onStateChange,
  onDistrictChange,
  onMonthChange,
  onSubmit,
  onVoiceToggle,
  onCropFocus,
}) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/95 shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-500" />
            <h2 className="font-bold text-gray-900 dark:text-white">
              {text.ready}
            </h2>
          </div>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {text.description}
          </p>
        </div>

        <select
          value={language}
          onChange={onLanguageChange}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 outline-none transition focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          aria-label="Language"
        >
          {SUPPORTED_LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={onSubmit} className="p-5 sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="relative">
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <span className="rounded-lg bg-emerald-100 p-1.5 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                🌱
              </span>
              {text.crop}
            </label>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder={text.searchCrop}
                value={cropQuery}
                onChange={onCropSearch}
                onFocus={onCropFocus}
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-14 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              />

              <VoiceInputButton
                field="crop"
                label={text.crop}
                isSupported={voiceSupported}
                isListening={isListening}
                activeField={activeField}
                onToggle={onVoiceToggle}
              />
            </div>

            {showSuggestions && filteredCrops.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                {filteredCrops.map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => onCropSelect(crop)}
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-gray-200 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                  >
                    {crop}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <MapPin size={17} className="text-emerald-500" />
              {text.state}
            </label>

            <div className="relative">
              <select
                value={formData.state}
                onChange={onStateChange}
                disabled={!formData.crop}
                className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 pr-20 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">{text.selectState}</option>

                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <VoiceInputButton
                field="state"
                label={text.state}
                isSupported={voiceSupported}
                isListening={isListening}
                activeField={activeField}
                onToggle={onVoiceToggle}
                disabled={!formData.crop}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <MapPin size={17} className="text-emerald-500" />
              {text.district}
            </label>

            <div className="relative">
              <select
                value={formData.district}
                onChange={onDistrictChange}
                disabled={!formData.state}
                className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 pr-20 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">{text.selectDistrict}</option>

                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <VoiceInputButton
                field="district"
                label={text.district}
                isSupported={voiceSupported}
                isListening={isListening}
                activeField={activeField}
                onToggle={onVoiceToggle}
                disabled={!formData.state}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <CalendarDays size={17} className="text-emerald-500" />
              {text.month}
            </label>

            <div className="relative">
              <select
                value={formData.month}
                onChange={onMonthChange}
                className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 pr-20 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">{text.selectMonth}</option>

                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <VoiceInputButton
                field="month"
                label={text.month}
                isSupported={voiceSupported}
                isListening={isListening}
                activeField={activeField}
                onToggle={onVoiceToggle}
              />
            </div>
          </div>
        </div>

        {interimTranscript && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            <Mic size={14} className="animate-pulse" />
            {interimTranscript}
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            !formData.crop ||
            !formData.state ||
            !formData.district ||
            !formData.month
          }
          className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none dark:disabled:bg-gray-700"
        >
          <TrendingUp size={18} className={loading ? "animate-pulse" : ""} />
          {loading ? text.predicting : text.predict}
        </button>
      </form>
    </div>
  );
};

export default PricePredictorForm;