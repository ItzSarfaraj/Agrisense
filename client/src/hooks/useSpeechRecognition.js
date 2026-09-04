import { useCallback, useEffect, useRef, useState } from "react";

const getSpeechRecognitionCtor = () =>
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const useSpeechRecognition = ({ lang = "en-IN", onResult, onError } = {}) => {
  const RecognitionCtor = getSpeechRecognitionCtor();
  const isSupported = Boolean(RecognitionCtor);

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const restartRef = useRef(false);
  const mountedRef = useRef(true);

  const langRef = useRef(lang);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  langRef.current = lang;
  onResultRef.current = onResult;
  onErrorRef.current = onError;

  const clearState = useCallback(() => {
    listeningRef.current = false;

    if (!mountedRef.current) return;

    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const createRecognition = useCallback(() => {
    if (!RecognitionCtor) return null;

    const recognition = new RecognitionCtor();

    recognition.lang = langRef.current;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      if (!mountedRef.current) return;

      recognitionRef.current = recognition;
      listeningRef.current = true;

      setIsListening(true);
      setInterimTranscript("");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];

        const transcript = result?.[0]?.transcript || "";

        if (result.isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (mountedRef.current) {
        setInterimTranscript(interimText);
      }

      if (finalText.trim()) {
        onResultRef.current?.(finalText.trim());

        if (mountedRef.current) {
          setInterimTranscript("");
        }
      }
    };

    recognition.onerror = (event) => {
      const isCurrent = recognitionRef.current === recognition;

      if (isCurrent) {
        recognitionRef.current = null;
      }

      listeningRef.current = false;

      if (mountedRef.current) {
        setIsListening(false);
        setInterimTranscript("");
      }

      if (event.error !== "aborted" && event.error !== "no-speech") {
        onErrorRef.current?.(event.error);
      }
    };

    recognition.onend = () => {
      const shouldRestart = restartRef.current;

      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      listeningRef.current = false;

      if (mountedRef.current) {
        setIsListening(false);
        setInterimTranscript("");
      }

      if (shouldRestart && mountedRef.current) {
        restartRef.current = false;

        window.setTimeout(() => {
          if (
            mountedRef.current &&
            !listeningRef.current &&
            restartRef.current === false
          ) {
            startRecognition();
          }
        }, 80);
      }
    };

    return recognition;
  }, [RecognitionCtor]);

  const startRecognition = useCallback(() => {
    if (!RecognitionCtor || listeningRef.current) {
      return;
    }

    const recognition = createRecognition();

    if (!recognition) return;

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      clearState();
      onErrorRef.current?.(error.name || "start-error");
    }
  }, [RecognitionCtor, createRecognition, clearState]);

  const start = useCallback(() => {
    if (!RecognitionCtor) return;

    restartRef.current = false;

    if (listeningRef.current) return;

    startRecognition();
  }, [RecognitionCtor, startRecognition]);

  const restart = useCallback(() => {
    if (!RecognitionCtor) return;

    restartRef.current = true;

    const recognition = recognitionRef.current;

    if (!recognition) {
      restartRef.current = false;
      startRecognition();
      return;
    }

    try {
      recognition.stop();
    } catch {
      recognition.abort();
    }
  }, [RecognitionCtor, startRecognition]);

  const stop = useCallback(() => {
    restartRef.current = false;

    const recognition = recognitionRef.current;

    if (!recognition) {
      clearState();
      return;
    }

    try {
      recognition.stop();
    } catch {
      try {
        recognition.abort();
      } catch {}

      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      clearState();
    }
  }, [clearState]);

  useEffect(() => {
    if (!isListening) return;

    restartRef.current = true;

    const recognition = recognitionRef.current;

    if (!recognition) return;

    try {
      recognition.stop();
    } catch {
      recognition.abort();
    }
  }, [lang]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      restartRef.current = false;

      const recognition = recognitionRef.current;

      recognitionRef.current = null;

      if (recognition) {
        try {
          recognition.abort();
        } catch {}
      }

      listeningRef.current = false;
    };
  }, []);

  return {
    isSupported,
    isListening,
    interimTranscript,
    start,
    restart,
    stop,
  };
};

export default useSpeechRecognition;