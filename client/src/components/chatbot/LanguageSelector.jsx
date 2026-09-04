import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";

export const SUPPORTED_LANGUAGES = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "Hindi" },
  { code: "mr-IN", label: "Marathi" },
  { code: "pa-IN", label: "Punjabi" },
  { code: "gu-IN", label: "Gujarati" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
  { code: "kn-IN", label: "Kannada" },
  { code: "bn-IN", label: "Bengali" },
  { code: "ml-IN", label: "Malayalam" },
];

const LanguageSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const current =
    SUPPORTED_LANGUAGES.find((language) => language.code === value) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectLanguage = (language) => {
    if (language.code !== value) {
      onChange?.(language.code);
    }

    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
          open
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
            : "border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <Languages size={15} />

        <span className="hidden sm:inline">
          {current.label}
        </span>

        <ChevronDown
          size={14}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-2xl shadow-black/10 dark:border-gray-700 dark:bg-gray-900">
          <div className="px-3 pb-1.5 pt-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
              Response Language
            </p>
          </div>

          <div
            role="listbox"
            className="max-h-72 overflow-y-auto"
          >
            {SUPPORTED_LANGUAGES.map((languageOption) => {
              const selected = languageOption.code === value;

              return (
                <button
                  key={languageOption.code}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectLanguage(languageOption)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    selected
                      ? "bg-emerald-50 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <span>{languageOption.label}</span>

                  {selected && (
                    <Check
                      size={15}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;