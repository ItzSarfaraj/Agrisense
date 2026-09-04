import { useRef, useState } from "react";
import { Mic, Square, ArrowUp } from "lucide-react";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";

const ChatInput = ({ input, setInput, loading, onSend, onStop, language }) => {
  const textareaRef = useRef(null);
  const [micError, setMicError] = useState(null);

  const resizeTextarea = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const {
    isSupported: micSupported,
    isListening,
    interimTranscript,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    lang: language,
    onResult: (finalText) => {
      setInput((prev) => (prev ? `${prev} ${finalText}` : finalText).trim());
      // resize on the next tick once the value has actually updated
      requestAnimationFrame(() => resizeTextarea(textareaRef.current));
    },
    onError: (err) => {
      setMicError(
        err === "not-allowed"
          ? "Microphone access was blocked. Allow it in your browser settings."
          : "Couldn't hear that clearly. Please try again."
      );
      setTimeout(() => setMicError(null), 4000);
    },
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && !loading) onSend();
    }
  };

  const handleChange = (event) => {
    setInput(event.target.value);
    resizeTextarea(event.target);
  };

  const handleSend = () => {
    onSend();
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    }, 0);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    // p-3 sm:p-4 (was p-4 sm:p-5): the input bar's own padding was
    // adding to the overall "too much space" feeling on top of the
    // bulky cards above it — trimmed alongside those.
    <div className="relative shrink-0 border-t border-gray-200/70 dark:border-gray-800 p-3 sm:p-4 bg-white/60 dark:bg-gray-900/60">
      {(isListening || micError) && (
        <div
          className={`absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium shadow-md ${
            micError
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-green-600 text-white"
          }`}
        >
          {micError || `Listening… ${interimTranscript ? `"${interimTranscript}"` : "speak now"}`}
        </div>
      )}

      <div
        className={`flex items-end gap-1.5 p-1.5 rounded-2xl border bg-gray-50/90 dark:bg-gray-800/90 transition shadow-sm ${
          isListening
            ? "border-green-500 ring-4 ring-green-500/10"
            : "border-gray-200 dark:border-gray-700 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10"
        }`}
      >
        <button
          type="button"
          onClick={toggleMic}
          disabled={!micSupported || loading}
          title={
            !micSupported
              ? "Voice input isn't supported in this browser"
              : isListening
                ? "Stop listening"
                : "Speak your question"
          }
          aria-label="Voice input"
          aria-pressed={isListening}
          className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition ${
            !micSupported || loading
              ? "text-gray-400 bg-gray-200/60 dark:bg-gray-700/60 cursor-not-allowed"
              : isListening
                ? "text-white bg-red-500 shadow-lg shadow-red-500/25 animate-pulse"
                : "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-900/40"
          }`}
        >
          <Mic size={17} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={
            isListening ? "Listening…" : "Ask about crops, soil, fertilizers, pests..."
          }
          aria-label="Type your farming question"
          className="flex-1 resize-none bg-transparent outline-none border-0 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-2 py-2.5 max-h-32 overflow-y-auto"
        />

        {loading ? (
          <button
            type="button"
            onClick={onStop}
            title="Stop generating"
            aria-label="Stop generating"
            className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
          >
            <Square size={14} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition ${
              input.trim()
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:-translate-y-0.5 hover:shadow-green-500/30"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ArrowUp size={17} />
          </button>
        )}
      </div>

      <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-2">
        AgriSense AI may make mistakes. Verify important agricultural
        decisions with reliable local guidance.
      </p>
    </div>
  );
};

export default ChatInput;