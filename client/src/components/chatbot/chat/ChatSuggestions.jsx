import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

import {
  GENERAL_SUGGESTION_IDS,
  RECOMMENDATION_SUGGESTION_IDS,
  SUGGESTION_META,
} from "../suggestions/suggestionData";

import en from "../suggestions/translations/en";
import hi from "../suggestions/translations/hi";

const translations = {
  "en-IN": en,
  "hi-IN": hi,
};

const getLanguageKey = (language) =>
  translations[language] ? language : "en-IN";

const replaceCrop = (text, crop) =>
  text.replace(/\{\{crop\}\}/g, crop || "this crop");

const ChatSuggestions = ({
  onSuggestion,
  recommendationMode = false,
  crop,
  language = "en-IN",
}) => {
  const languageKey = getLanguageKey(language);
  const content = translations[languageKey];

  const ids = recommendationMode
    ? RECOMMENDATION_SUGGESTION_IDS
    : GENERAL_SUGGESTION_IDS;

  const [primaryIds, secondaryIds] = [
    ids.slice(0, 6),
    ids.slice(6),
  ];

  const [expanded, setExpanded] = useState(false);

  const renderCard = (id) => {
    const item = content.suggestions[id];
    const meta = SUGGESTION_META[id];

    if (!item || !meta) return null;

    const question = replaceCrop(
      item.question,
      crop,
    );

    return (
      <button
        key={id}
        type="button"
        onClick={() => onSuggestion?.(question)}
        className="group relative flex min-h-[112px] flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5 dark:border-gray-700 dark:bg-gray-900/90 dark:hover:border-emerald-700"
      >
        <div className="mb-3 flex items-start justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-950/50">
            {meta.icon}
          </span>

          <Sparkles
            size={15}
            className="text-emerald-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>

        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {item.title}
        </span>

        <span className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
          {item.description}
        </span>
      </button>
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl dark:bg-emerald-500/5" />

      <div className="pointer-events-none absolute -right-16 bottom-10 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl dark:bg-cyan-500/5" />

      <div className="relative mb-5 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Sparkles
            size={13}
            aria-hidden="true"
          />
          {content.ui.badge}
        </div>

        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {content.ui.title}
        </h2>

        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
          {content.ui.description}
        </p>
      </div>

      {recommendationMode && crop && (
        <div className="mb-4 flex justify-center">
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            🌾 {crop}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {primaryIds.map(renderCard)}
      </div>

      {secondaryIds.length > 0 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() =>
              setExpanded((value) => !value)
            }
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-bold text-gray-600 shadow-sm transition-all hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
          >
            {expanded
              ? content.ui.less
              : content.ui.more}

            {expanded ? (
              <ChevronUp
                size={14}
                aria-hidden="true"
              />
            ) : (
              <ChevronDown
                size={14}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      )}

      {expanded && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryIds.map(renderCard)}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-gray-400 dark:text-gray-500">
        <span>{content.ui.voiceHint}</span>
        <span className="hidden sm:inline">•</span>
        <span>{content.ui.languageHint}</span>
      </div>
    </div>
  );
};

export default ChatSuggestions;