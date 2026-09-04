import { useCallback, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const findBestOption = (text, options) => {
  const normalized = normalizeText(text);

  if (!normalized) return null;

  const exact = options.find(
    (option) => normalizeText(option.label) === normalized,
  );

  if (exact) return exact;

  const contains = options.find((option) => {
    const optionText = normalizeText(option.label);

    return optionText.includes(normalized) || normalized.includes(optionText);
  });

  if (contains) return contains;

  const words = normalized.split(" ");

  return (
    options.find((option) => {
      const optionWords = normalizeText(option.label).split(" ");

      return words.some((word) =>
        word.length > 2
          ? optionWords.some(
              (optionWord) =>
                optionWord.startsWith(word) || word.startsWith(optionWord),
            )
          : false,
      );
    }) || null
  );
};

const parseSpokenNumber = (text) => {
  const normalized = normalizeText(text);

  const directNumber = normalized.match(/-?\d+(?:\.\d+)?/);

  if (directNumber) {
    return directNumber[0];
  }

  const numberWords = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
    hundred: 100,
  };

  const tokens = normalized.split(" ");

  let total = 0;
  let current = 0;
  let found = false;

  tokens.forEach((token) => {
    if (numberWords[token] === undefined) return;

    found = true;

    if (numberWords[token] === 100) {
      current = (current || 1) * 100;
    } else {
      current += numberWords[token];
    }
  });

  total += current;

  return found ? String(total) : "";
};

const useRecommendationVoice = ({
  language = "en-IN",
  stateOptions = [],
  districtOptions = [],
  seasonOptions = [],
  setSelectedState,
  setSelectedDistrict,
  setSeason,
  setN,
  setP,
  setK,
  setPH,
}) => {
  const activeFieldRef = useRef("");

  const handleResult = useCallback(
    (text) => {
      const field = activeFieldRef.current;

      if (!field) return;

      if (field === "state") {
        const match = findBestOption(text, stateOptions);

        if (!match) {
          toast.error("State not recognized. Please try again.");
          return;
        }

        setSelectedState(match.value);
        setSelectedDistrict("");
        activeFieldRef.current = "";
        return;
      }

      if (field === "district") {
        const match = findBestOption(text, districtOptions);

        if (!match) {
          toast.error("District not recognized. Please try again.");
          return;
        }

        setSelectedDistrict(match.value);
        activeFieldRef.current = "";
        return;
      }

      if (field === "season") {
        const match = findBestOption(text, seasonOptions);

        if (!match) {
          toast.error("Season not recognized. Say Kharif, Rabi or Zaid.");
          return;
        }

        setSeason(match.value);
        activeFieldRef.current = "";
        return;
      }

      const number = parseSpokenNumber(text);

      if (!number) {
        toast.error("I couldn't understand the number.");
        return;
      }

      if (field === "N") setN(number);
      if (field === "P") setP(number);
      if (field === "K") setK(number);
      if (field === "pH") setPH(number);

      activeFieldRef.current = "";
    },
    [
      stateOptions,
      districtOptions,
      seasonOptions,
      setSelectedState,
      setSelectedDistrict,
      setSeason,
      setN,
      setP,
      setK,
      setPH,
    ],
  );

  const { isSupported, isListening, interimTranscript, start, stop } =
    useSpeechRecognition({
      lang: language,
      onResult: handleResult,
      onError: (error) => {
        activeFieldRef.current = "";

        if (error !== "aborted" && error !== "no-speech") {
          toast.error("Voice input could not be started.");
        }
      },
    });

  const toggle = useCallback(
    (field) => {
      if (!isSupported) {
        toast.error("Voice input is not supported in this browser.");
        return;
      }

      if (isListening && activeFieldRef.current === field) {
        activeFieldRef.current = "";
        stop();
        return;
      }

      if (isListening) {
        stop();
      }

      activeFieldRef.current = field;
      start();
    },
    [isSupported, isListening, start, stop],
  );

  useEffect(() => {
    if (
      isListening &&
      activeFieldRef.current === "district" &&
      !districtOptions.length
    ) {
      activeFieldRef.current = "";
      stop();
    }
  }, [districtOptions.length, isListening, stop]);

  useEffect(() => {
    return () => {
      activeFieldRef.current = "";
      stop();
    };
  }, [stop]);

  return useMemo(
    () => ({
      isSupported,
      isListening,
      interimTranscript,
      activeField: activeFieldRef.current,
      toggle,
    }),
    [isSupported, isListening, interimTranscript, toggle],
  );
};

export default useRecommendationVoice;
