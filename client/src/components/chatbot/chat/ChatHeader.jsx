import { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";
import LanguageSelector from "../LanguageSelector";

const ChatHeader = ({ onClear, language, onLanguageChange }) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="relative z-20 shrink-0 border-b border-gray-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 sm:px-7 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-xl shadow-lg shadow-green-500/20">
            🌱
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-green-500 dark:border-gray-900" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                AgriSense AI
              </h1>

              <span className="hidden rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-600 dark:bg-green-950/50 dark:text-green-400 sm:inline-flex">
                AI Assistant
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <p className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                Your intelligent agriculture companion
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageSelector
            value={language}
            onChange={onLanguageChange}
          />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-600 transition hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:h-10 sm:w-10"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;