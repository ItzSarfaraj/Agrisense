import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatSuggestions from "./ChatSuggestions";
import RecommendationContext from "../RecommendationContext";
import TypingIndicator from "../TypingIndicator";

const NEAR_BOTTOM_THRESHOLD = 120;

const ChatMessages = ({
  messages,
  loading,
  onSuggestion,
  onRetry,
  onRegenerate,
  speakingId,
  onSpeak,
  onStopSpeaking,
  recommendationMode = false,
  crop,
  language = "en-IN",
  recommendationContext = null,
}) => {
  const containerRef = useRef(null);

  const [showScrollButton, setShowScrollButton] =
    useState(false);

  const isEmptyChat =
    messages.length === 0;

  const isWelcomeOnly =
    messages.length === 1 &&
    messages[0]?.id === "welcome" &&
    messages[0]?.role === "assistant";

  const showSuggestions =
    isEmptyChat || isWelcomeOnly;

  const lastAssistantIndex = [...messages]
    .reverse()
    .findIndex(
      (message) =>
        message.role === "assistant",
    );

  const lastAssistantAbsoluteIndex =
    lastAssistantIndex === -1
      ? -1
      : messages.length -
        1 -
        lastAssistantIndex;

  const scrollToBottom = (
    behavior = "smooth",
  ) => {
    const container =
      containerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    if (
      distanceFromBottom <=
      NEAR_BOTTOM_THRESHOLD
    ) {
      scrollToBottom(
        loading ? "auto" : "smooth",
      );
    }
  }, [messages, loading]);

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) return;

    const updateScrollState = () => {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      setShowScrollButton(
        distanceFromBottom >
          NEAR_BOTTOM_THRESHOLD,
      );
    };

    updateScrollState();

    container.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true },
    );

    return () => {
      container.removeEventListener(
        "scroll",
        updateScrollState,
      );
    };
  }, []);

  const suggestions = (
    <ChatSuggestions
      onSuggestion={onSuggestion}
      recommendationMode={
        recommendationMode
      }
      crop={crop}
      language={language}
    />
  );

  return (
    <section
      ref={containerRef}
      aria-live="polite"
      className="relative h-full min-h-0 w-full overflow-y-auto overscroll-contain"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        {recommendationContext && (
          <RecommendationContext
            context={
              recommendationContext
            }
          />
        )}

        {messages.length > 0 && (
          <div className="space-y-5">
            {messages.map(
              (message, index) => (
                <ChatMessage
                  key={
                    message.id ||
                    `${message.role}-${index}`
                  }
                  message={message}
                  isLastAssistant={
                    index ===
                      lastAssistantAbsoluteIndex &&
                    !loading
                  }
                  onRetry={onRetry}
                  onRegenerate={
                    onRegenerate
                  }
                  speaking={
                    speakingId ===
                    message.id
                  }
                  onSpeak={onSpeak}
                  onStopSpeaking={
                    onStopSpeaking
                  }
                />
              ),
            )}

            {showSuggestions && (
              <div className="py-2 sm:py-3">
                {suggestions}
              </div>
            )}

            {loading && (
              <TypingIndicator />
            )}
          </div>
        )}

        {isEmptyChat && (
          <div className="flex min-h-[55vh] items-center justify-center">
            {suggestions}
          </div>
        )}
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={() =>
            scrollToBottom()
          }
          aria-label="Scroll to latest message"
          className="absolute bottom-5 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/90 bg-white/95 text-gray-500 shadow-lg shadow-gray-900/10 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-600 dark:border-gray-700 dark:bg-gray-800/95 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400 sm:right-8"
        >
          <ArrowDown
            size={16}
            aria-hidden="true"
          />
        </button>
      )}
    </section>
  );
};

export default ChatMessages;