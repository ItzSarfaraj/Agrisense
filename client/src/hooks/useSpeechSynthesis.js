import { useCallback, useEffect, useRef, useState } from "react";

const MAX_CHUNK_LENGTH = 220;

const getVoices = () =>
  typeof window !== "undefined" ? window.speechSynthesis.getVoices() : [];

const cleanText = (text) =>
  String(text || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();

const splitText = (text) => {
  const chunks = [];
  let remaining = text;

  while (remaining.length > MAX_CHUNK_LENGTH) {
    let splitAt = remaining.lastIndexOf(". ", MAX_CHUNK_LENGTH);

    if (splitAt < 80) {
      splitAt = remaining.lastIndexOf(" ", MAX_CHUNK_LENGTH);
    }

    if (splitAt < 1) {
      splitAt = MAX_CHUNK_LENGTH;
    }

    chunks.push(remaining.slice(0, splitAt + 1).trim());

    remaining = remaining.slice(splitAt + 1).trim();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
};

const getLanguageCandidates = (lang) => {
  const base = String(lang || "en-IN")
    .toLowerCase()
    .split("-")[0];

  const candidates = {
    en: ["en-IN", "en-US", "en-GB"],
    hi: ["hi-IN"],
    mr: ["mr-IN", "hi-IN"],
    pa: ["pa-IN", "hi-IN"],
    gu: ["gu-IN", "hi-IN"],
    ta: ["ta-IN"],
    te: ["te-IN"],
    kn: ["kn-IN"],
    bn: ["bn-IN"],
    ml: ["ml-IN"],
  };

  return candidates[base] || [lang];
};

const getBestVoice = (lang) => {
  const voices = getVoices();

  if (!voices.length) {
    return null;
  }

  const candidates = getLanguageCandidates(lang);

  for (const candidate of candidates) {
    const exact = voices.find(
      (voice) => voice.lang?.toLowerCase() === candidate.toLowerCase(),
    );

    if (exact) {
      return exact;
    }
  }

  const base = String(lang || "en-IN")
    .toLowerCase()
    .split("-")[0];

  const sameLanguage = voices.find(
    (voice) => voice.lang?.toLowerCase().split("-")[0] === base,
  );

  if (sameLanguage) {
    return sameLanguage;
  }

  return null;
};

const useSpeechSynthesis = () => {
  const isSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  const [speakingId, setSpeakingId] = useState(null);

  const queueRef = useRef([]);
  const currentIdRef = useRef(null);
  const stoppedRef = useRef(false);
  const voiceReadyRef = useRef(false);

  useEffect(() => {
    if (!isSupported) return;

    const handleVoicesChanged = () => {
      voiceReadyRef.current = true;
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged,
    );

    window.speechSynthesis.getVoices();

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged,
      );

      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;

    stoppedRef.current = true;
    queueRef.current = [];
    currentIdRef.current = null;

    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [isSupported]);

  const speak = useCallback(
    ({ text, lang = "en-IN", id = "speech" }) => {
      if (!isSupported || !text) return;

      window.speechSynthesis.cancel();

      queueRef.current = splitText(cleanText(text));

      if (!queueRef.current.length) return;

      stoppedRef.current = false;
      currentIdRef.current = id;
      setSpeakingId(id);

      const speakNext = () => {
        if (stoppedRef.current || currentIdRef.current !== id) {
          return;
        }

        const chunk = queueRef.current.shift();

        if (!chunk) {
          currentIdRef.current = null;
          setSpeakingId(null);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunk);

        utterance.lang = lang;

        const voice = getBestVoice(lang);

        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        }

        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onend = () => {
          if (stoppedRef.current || currentIdRef.current !== id) {
            return;
          }

          speakNext();
        };

        utterance.onerror = () => {
          if (stoppedRef.current || currentIdRef.current !== id) {
            return;
          }

          currentIdRef.current = null;
          queueRef.current = [];
          setSpeakingId(null);
        };

        window.speechSynthesis.speak(utterance);
      };

      if (!voiceReadyRef.current && !getVoices().length) {
        window.speechSynthesis.onvoiceschanged = () => {
          voiceReadyRef.current = true;
          speakNext();
        };
      } else {
        speakNext();
      }
    },
    [isSupported],
  );

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      queueRef.current = [];
      currentIdRef.current = null;

      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    isSupported,
    speakingId,
    speak,
    stop,
  };
};

export default useSpeechSynthesis;
