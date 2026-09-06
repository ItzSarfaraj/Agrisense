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
import AgriSenseAvatar from "../AgriSenseAvatar";

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
      {!isUser && <AgriSenseAvatar size={40} className="mt-0.5" />}

      <div
        className={`group relative min-w-0 max-w-[94%] sm:max-w-[82%] ${
          isUser ? "order-1" : ""
        }`}
      >
        <div
          className={`px-5 sm:px-6 py-4 sm:py-5 rounded-[1.25rem] ${
            isUser
              ? "bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white rounded-br-md shadow-lg shadow-green-600/15"
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
          <div className="mt-1.5 flex flex-wrap items-center gap-1 opacity-100 transition-all duration-200 sm:absolute sm:-bottom-9 sm:left-1 sm:mt-0 sm:opacity-0 sm:group-hover:opacity-100">
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
                  {speaking ? <Square size={12} /> : <Volume2 size={13} />}
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
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-sm dark:border-indigo-900/60 dark:from-indigo-950/50 dark:to-violet-950/40">
          👤
        </div>
      )}
    </div>
  );
};

export default ChatMessage;