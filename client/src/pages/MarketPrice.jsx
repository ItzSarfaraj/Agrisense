import DashboardLayout from "../components/layout/DashboardLayout";
import PricePredictorHeader from "../components/pricePredictor/PricePredictorHeader";
import PricePredictorForm from "../components/pricePredictor/PricePredictorForm";
import PricePredictorResult from "../components/pricePredictor/PricePredictorResult";
import usePricePredictor from "../hooks/usePricePredictor";

const MarketPrice = () => {
  const {
    formData,
    price,
    loading,
    cropQuery,
    filteredCrops,
    showSuggestions,
    error,
    states,
    districts,
    language,
    text,
    translatedResult,
    speechSupported,
    voiceSupported,
    isListening,
    activeField,
    interimTranscript,
    isSpeaking,
    setShowSuggestions,
    selectCrop,
    handleCropSearch,
    handleStateChange,
    handleSubmit,
    handleSpeak,
    handleLanguageChange,
    toggle,
    stopSpeaking,
    setFormData,
  } = usePricePredictor();

  const handleDistrictChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      district: event.target.value,
    }));
  };

  const handleMonthChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      month: Number(event.target.value),
    }));
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-emerald-50/70 via-white to-green-50/50 px-4 py-6 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <PricePredictorHeader text={text} />

          <div className="mt-6">
            <PricePredictorForm
              formData={formData}
              cropQuery={cropQuery}
              filteredCrops={filteredCrops}
              showSuggestions={showSuggestions}
              states={states}
              districts={districts}
              language={language}
              text={text}
              loading={loading}
              voiceSupported={voiceSupported}
              isListening={isListening}
              activeField={activeField}
              interimTranscript={interimTranscript}
              onLanguageChange={handleLanguageChange}
              onCropSearch={handleCropSearch}
              onCropSelect={selectCrop}
              onStateChange={handleStateChange}
              onDistrictChange={handleDistrictChange}
              onMonthChange={handleMonthChange}
              onSubmit={handleSubmit}
              onVoiceToggle={toggle}
              onCropFocus={() => {
                if (cropQuery) {
                  setShowSuggestions(true);
                }
              }}
            />
          </div>

          <PricePredictorResult
            price={price}
            formData={formData}
            translatedResult={translatedResult}
            text={text}
            isSpeaking={isSpeaking}
            speechSupported={speechSupported}
            onSpeak={handleSpeak}
            onStopSpeaking={stopSpeaking}
          />

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketPrice;