import { useState } from "react";
import {
  Check,
  Copy,
  RotateCcw,
  RefreshCw,
  Volume2,
  Square,
} from "lucide-react";
import ChatResponse from "./ChatResponse";

const cleanSpeechText = (content) => {
  return content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/svgCopy/gi, "")
    .replace(/•/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const ChatMessage = ({
  message,
  isLastAssistant,
  onRetry,
  onRegenerate,
  speaking,
  onSpeak,
  onStopSpeaking,
}) => {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";

  const copyResponse = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleSpeak = () => {
    if (speaking) {
      onStopSpeaking?.();
      return;
    }

    onSpeak?.({
      text: cleanSpeechText(message.content),
      id: message.id,
    });
  };

  return (
    <div
      className={`flex gap-3 sm:gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-lg shadow-md shadow-emerald-500/15">
          🤖
        </div>
      )}

      <div
        className={`group relative min-w-0 max-w-[94%] sm:max-w-[82%] ${
          isUser ? "order-1" : ""
        }`}
      >
        <div
          className={`px-5 sm:px-6 py-4 sm:py-5 rounded-[1.25rem] ${
            isUser
              ? "bg-gradient-to-br from-emerald-600 via-green-600 to-green-700 text-white rounded-br-md shadow-lg shadow-green-600/15"
              : message.error
                ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-md"
                : "bg-[#fbfefc] dark:bg-gray-800 text-slate-700 dark:text-gray-200 rounded-bl-md border border-emerald-100 dark:border-gray-700 shadow-[0_4px_20px_rgba(16,185,129,0.06)]"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words text-[15px] leading-7 font-medium">
              {message.content}
            </p>
          ) : (
            <ChatResponse content={message.content} />
          )}
        </div>

        {!isUser && (
          <div className="absolute -bottom-9 left-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {message.error ? (
              <button
                type="button"
                onClick={() => onRetry?.(message.retryMessage)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
              >
                <RotateCcw size={13} />
                Retry
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSpeak}
                  title={speaking ? "Stop speaking" : "Read response aloud"}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    speaking
                      ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950/30"
                      : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-gray-800"
                  }`}
                >
                  {speaking ? (
                    <Square size={12} />
                  ) : (
                    <Volume2 size={13} />
                  )}
                  {speaking ? "Stop" : "Listen"}
                </button>

                <button
                  type="button"
                  onClick={copyResponse}
                  title={copied ? "Copied" : "Copy response"}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-gray-800"
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </button>

                {isLastAssistant && (
                  <button
                    type="button"
                    onClick={onRegenerate}
                    title="Regenerate response"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-gray-800"
                  >
                    <RefreshCw size={13} />
                    Regenerate
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 flex items-center justify-center text-lg">
          👤
        </div>
      )}
    </div>
  );
};

export default ChatMessage;