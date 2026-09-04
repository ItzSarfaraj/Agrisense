import { useCallback, useRef, useState } from "react";
import useSpeechRecognition from "./useSpeechRecognition";

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ");

const cleanSpokenValue = (value = "") =>
  normalize(value)
    .replace(/\b(please|select|choose|set|give|show|the|my|crop|state|district|month)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

const findMatch = (spoken, options = []) => {
  const value = normalize(spoken);
  const cleaned = cleanSpokenValue(spoken);

  if (!value || !options.length) return "";

  const normalizedOptions = options.map((item) => ({
    original: item,
    normalized: normalize(item),
  }));

  const exact = normalizedOptions.find(
    (item) =>
      item.normalized === value ||
      item.normalized === cleaned,
  );

  if (exact) return exact.original;

  const partial = normalizedOptions.find(
    (item) =>
      value.includes(item.normalized) ||
      item.normalized.includes(value) ||
      cleaned.includes(item.normalized) ||
      item.normalized.includes(cleaned),
  );

  return partial?.original || "";
};

const monthAliases = {
  january: 1,
  jan: 1,
  जनवरी: 1,
  february: 2,
  feb: 2,
  फरवरी: 2,
  march: 3,
  mar: 3,
  मार्च: 3,
  april: 4,
  apr: 4,
  अप्रैल: 4,
  may: 5,
  मई: 5,
  june: 6,
  jun: 6,
  जून: 6,
  july: 7,
  jul: 7,
  जुलाई: 7,
  august: 8,
  aug: 8,
  अगस्त: 8,
  september: 9,
  sep: 9,
  सितंबर: 9,
  october: 10,
  oct: 10,
  अक्टूबर: 10,
  november: 11,
  nov: 11,
  नवंबर: 11,
  december: 12,
  dec: 12,
  दिसंबर: 12,
};

const parseMonth = (value) => {
  const normalized = normalize(value);

  if (monthAliases[normalized]) {
    return monthAliases[normalized];
  }

  const alias = Object.entries(monthAliases).find(([name]) =>
    normalized.includes(name),
  );

  if (alias) {
    return alias[1];
  }

  const numberMatch = normalized.match(/\b(1[0-2]|[1-9])\b/);

  return numberMatch ? Number(numberMatch[1]) : "";
};

const useMarketPriceVoice = ({
  language = "en-IN",
  crops = [],
  states = [],
  districts = [],
  onCrop,
  onState,
  onDistrict,
  onMonth,
} = {}) => {
  const [activeField, setActiveField] = useState("");
  const activeFieldRef = useRef("");

  const clearActiveField = useCallback(() => {
    activeFieldRef.current = "";
    setActiveField("");
  }, []);

  const handleResult = useCallback(
    (spokenText) => {
      const field = activeFieldRef.current;

      if (!field) return;

      if (field === "crop") {
        const match = findMatch(spokenText, crops);

        if (match) {
          clearActiveField();
          onCrop?.(match);
        }

        return;
      }

      if (field === "state") {
        const match = findMatch(spokenText, states);

        if (match) {
          clearActiveField();
          onState?.(match);
        }

        return;
      }

      if (field === "district") {
        const match = findMatch(spokenText, districts);

        if (match) {
          clearActiveField();
          onDistrict?.(match);
        }

        return;
      }

      if (field === "month") {
        const month = parseMonth(spokenText);

        if (month) {
          clearActiveField();
          onMonth?.(month);
        }
      }
    },
    [
      crops,
      states,
      districts,
      onCrop,
      onState,
      onDistrict,
      onMonth,
      clearActiveField,
    ],
  );

  const {
    isSupported,
    isListening,
    interimTranscript,
    start,
    restart,
    stop,
  } = useSpeechRecognition({
    lang: language,
    onResult: handleResult,
  });

  const toggle = useCallback(
    (field) => {
      if (!isSupported) return;

      if (
        isListening &&
        activeFieldRef.current === field
      ) {
        clearActiveField();
        stop();
        return;
      }

      activeFieldRef.current = field;
      setActiveField(field);

      if (isListening) {
        restart();
        return;
      }

      start();
    },
    [
      isSupported,
      isListening,
      start,
      restart,
      stop,
      clearActiveField,
    ],
  );

  const stopVoice = useCallback(() => {
    clearActiveField();
    stop();
  }, [clearActiveField, stop]);

  return {
    isSupported,
    isListening,
    activeField,
    interimTranscript,
    toggle,
    stop: stopVoice,
  };
};

export default useMarketPriceVoice;