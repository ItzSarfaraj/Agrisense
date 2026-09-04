import { Mic, MicOff } from "lucide-react";

const VoiceInputButton = ({
  field,
  label,
  isSupported,
  isListening,
  activeField,
  onToggle,
  disabled = false,
  className = "",
}) => {
  const active = isListening && activeField === field;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle(field);
      }}
      disabled={disabled || !isSupported}
      aria-label={
        active
          ? `Stop voice input for ${label}`
          : `Use voice input for ${label}`
      }
      title={
        !isSupported
          ? "Voice input is not supported in this browser"
          : active
            ? "Stop listening"
            : `Speak ${label}`
      }
      className={`absolute right-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl transition ${
        active
          ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
          : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
      } ${
        disabled || !isSupported ? "cursor-not-allowed opacity-40" : ""
      } ${className}`}
    >
      {active ? (
        <MicOff size={16} aria-hidden="true" />
      ) : (
        <Mic size={16} aria-hidden="true" />
      )}
    </button>
  );
};

export default VoiceInputButton;