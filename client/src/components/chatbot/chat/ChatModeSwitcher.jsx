import { MessageCircle, Stethoscope } from "lucide-react";

const ChatModeSwitcher = ({ mode, onChange, disabled = false }) => {
  return (
    <div className="inline-flex items-center rounded-2xl border border-gray-200/80 bg-white/90 p-1 shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange?.("chat")}
        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:px-4 ${
          mode === "chat"
            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <MessageCircle size={15} />
        <span>Chat</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange?.("crop-doctor")}
        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:px-4 ${
          mode === "crop-doctor"
            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <Stethoscope size={15} />
        <span>Crop Doctor</span>
      </button>
    </div>
  );
};

export default ChatModeSwitcher;