import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";
import ChatModeSwitcher from "./chat/ChatModeSwitcher";
import CropDoctorMode from "./cropDoctor/CropDoctorMode";

import { SUPPORTED_LANGUAGES } from "./LanguageSelector";

import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";
import useCropDoctor from "../../hooks/useCropDoctor";
import useChatbot from "../../hooks/useChatbot";

const initialMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm **AgriSense AI** 🌱\n\nI can help you with crops, soil, fertilizers, pests, diseases, irrigation, weather and farming practices.",
};

const getInitialLanguage = () => {
  const saved = localStorage.getItem("agrisense-language");

  return SUPPORTED_LANGUAGES.some((language) => language.code === saved)
    ? saved
    : "en-IN";
};

const Chatbot = () => {
  const location = useLocation();

  const navigationContext = location.state?.context || {};

  const navigationMessage = location.state?.message || "";

  const recommendationMode = Boolean(navigationContext?.selectedCrop);

  const [input, setInput] = useState(navigationMessage);

  const [language, setLanguage] = useState(getInitialLanguage);

  const [mode, setMode] = useState("chat");

  const [chatContext] = useState(navigationContext);

  const initialMessagesRef = useRef(recommendationMode ? [] : [initialMessage]);

  const {
    isSupported: speechSupported,
    speakingId,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis();

  const selectedLanguage =
    SUPPORTED_LANGUAGES.find((item) => item.code === language) ||
    SUPPORTED_LANGUAGES[0];

  const {
    messages,
    loading,
    sendMessage,
    retryMessage,
    regenerateLastResponse,
    stopGenerating,
    clearChat,
  } = useChatbot({
    chatContext,
    initialMessages: initialMessagesRef.current,
    selectedLanguage,
    stopSpeaking,
  });

  const {
    analysis: cropDoctorAnalysis,
    analyzing: cropDoctorAnalyzing,
    translating: cropDoctorTranslating,
    treatmentReport: cropDoctorTreatmentReport,
    reportGenerating: cropDoctorReportGenerating,
    sourceImages: cropDoctorSourceImages,
    caseDetails: cropDoctorCaseDetails,
    resetKey: cropDoctorResetKey,
    analyze: handleCropDoctorAnalyze,
    translate: translateCropDoctorResult,
    generateTreatmentReport: handleGenerateTreatmentReport,
    newAnalysis: handleCropDoctorNewAnalysis,
    clear: clearCropDoctor,
  } = useCropDoctor({
    selectedLanguage,
    stopSpeaking,
  });

  useEffect(() => {
    localStorage.setItem("agrisense-language", language);
  }, [language]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const handleSendMessage = async () => {
    const sent = await sendMessage(input);

    if (sent) {
      setInput("");
    }
  };

  const handleSpeak = ({ text, id }) => {
    if (!speechSupported || mode !== "chat" || !text) {
      return;
    }

    if (speakingId === id) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    speak({
      text,
      lang: language,
      id,
    });
  };

  const handleCropDoctorSpeak = (text) => {
    if (!speechSupported || !text) {
      return;
    }

    if (speakingId === "crop-doctor-result") {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    speak({
      text,
      lang: language,
      id: "crop-doctor-result",
    });
  };

  const handleLanguageChange = async (value) => {
    const nextLanguage = SUPPORTED_LANGUAGES.find(
      (item) => item.code === value,
    );

    if (!nextLanguage) {
      return;
    }

    const previousLanguage = selectedLanguage;

    stopSpeaking();

    setLanguage(nextLanguage.code);

    if (
      mode !== "crop-doctor" ||
      !cropDoctorAnalysis ||
      nextLanguage.code === previousLanguage.code
    ) {
      return;
    }

    await translateCropDoctorResult(cropDoctorAnalysis, nextLanguage);
  };

  const handleClearChat = () => {
    stopSpeaking();

    clearChat(recommendationMode ? [] : [initialMessage]);

    setInput("");
  };

  const handleModeChange = (nextMode) => {
    if (
      loading ||
      cropDoctorAnalyzing ||
      cropDoctorTranslating ||
      cropDoctorReportGenerating
    ) {
      return;
    }

    if (nextMode === mode) {
      return;
    }

    stopSpeaking();

    setMode(nextMode);

    if (nextMode === "chat") {
      clearCropDoctor();
    }
  };

  return (
    <div className="relative flex h-[100dvh] min-h-0 w-full flex-col overflow-hidden bg-gradient-to-br from-[#f5fbf7] via-white to-[#eefaf3] dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-green-300/10 blur-3xl dark:bg-green-500/5" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-[450px] w-[450px] rounded-full bg-emerald-300/10 blur-3xl dark:bg-emerald-500/5" />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <ChatHeader
            onClear={handleClearChat}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        <div className="z-10 flex shrink-0 justify-center px-4 py-3 sm:px-6">
          <ChatModeSwitcher
            mode={mode}
            onChange={handleModeChange}
            disabled={
              loading ||
              cropDoctorAnalyzing ||
              cropDoctorTranslating ||
              cropDoctorReportGenerating
            }
          />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {mode === "crop-doctor" ? (
            <div className="h-full min-h-0 overflow-y-auto overscroll-contain">
              <CropDoctorMode
                onAnalyze={handleCropDoctorAnalyze}
                onNewAnalysis={handleCropDoctorNewAnalysis}
                analysis={cropDoctorAnalysis}
                resetKey={cropDoctorResetKey}
                analyzing={cropDoctorAnalyzing}
                translating={cropDoctorTranslating}
                language={language}
                speaking={speakingId === "crop-doctor-result"}
                onSpeak={handleCropDoctorSpeak}
                onStopSpeaking={stopSpeaking}
                treatmentReport={cropDoctorTreatmentReport}
                reportGenerating={cropDoctorReportGenerating}
                onGenerateTreatmentReport={() =>
                  handleGenerateTreatmentReport(cropDoctorCaseDetails)
                }
                sourceImages={cropDoctorSourceImages}
              />
            </div>
          ) : (
            <ChatMessages
              messages={messages}
              loading={loading}
              onSuggestion={setInput}
              onRetry={retryMessage}
              onRegenerate={regenerateLastResponse}
              speakingId={speakingId}
              onSpeak={handleSpeak}
              onStopSpeaking={stopSpeaking}
              recommendationMode={recommendationMode}
              crop={chatContext?.selectedCrop?.crop}
              language={language}
              recommendationContext={recommendationMode ? chatContext : null}
            />
          )}
        </div>

        {mode === "chat" && (
          <div className="shrink-0 border-t border-gray-100/80 bg-white/95 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/95">
            <ChatInput
              input={input}
              setInput={setInput}
              loading={loading}
              onSend={handleSendMessage}
              onStop={stopGenerating}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
