import { useCallback, useRef, useState } from "react";
import api from "../api/axios";

const useCropDoctor = ({ selectedLanguage, stopSpeaking }) => {
  const [analysis, setAnalysis] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);

  const [translating, setTranslating] = useState(false);

  const [treatmentReport, setTreatmentReport] = useState(null);

  const [reportGenerating, setReportGenerating] = useState(false);

  const [sourceImages, setSourceImages] = useState([]);

  const [resetKey, setResetKey] = useState(0);

  const [caseDetails, setCaseDetails] = useState({
    crop: "",
    symptoms: "",
  });

  const translationRef = useRef(0);
  const reportRef = useRef(0);

  const translate = useCallback(async (currentAnalysis, targetLanguage) => {
    if (!currentAnalysis || !targetLanguage) {
      return;
    }

    const requestId = ++translationRef.current;

    setTranslating(true);

    try {
      const response = await api.post("/chat/crop-doctor/translate", {
        analysis: currentAnalysis,
        language: targetLanguage.label,
        language_code: targetLanguage.code,
      });

      if (requestId !== translationRef.current) {
        return;
      }

      if (response.data.analysis) {
        setAnalysis(response.data.analysis);
        setTreatmentReport(null);
      }
    } catch (error) {
      if (requestId !== translationRef.current) {
        return;
      }

      console.error(
        "Crop Doctor translation error:",
        error.response?.data || error.message,
      );
    } finally {
      if (requestId === translationRef.current) {
        setTranslating(false);
      }
    }
  }, []);

  const analyze = useCallback(
    async ({ images, crop, symptoms }) => {
      if (!images?.length || analyzing) {
        return;
      }

      stopSpeaking?.();

      setAnalyzing(true);
      setAnalysis(null);
      setTreatmentReport(null);
      setSourceImages(images);
      setCaseDetails({
        crop: crop || "",
        symptoms: symptoms || "",
      });

      const requestLanguage = selectedLanguage;

      try {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("images", image);
        });

        if (crop) {
          formData.append("crop", crop);
        }

        formData.append("symptoms", symptoms || "");

        formData.append("language", requestLanguage.label);

        formData.append("language_code", requestLanguage.code);

        const response = await api.post("/chat/crop-doctor", formData);

        const result = response.data.analysis || null;

        setAnalysis(result);
      } catch (error) {
        console.error(
          "Crop Doctor error:",
          error.response?.data || error.message,
        );

        setAnalysis({
          summary: "I couldn't analyze the crop images right now.",
          image_quality: "poor",
          observations: [],
          possible_conditions: [],
          severity: "unclear",
          immediate_actions: [
            "Please try again with a clear image of the affected plant.",
          ],
          treatment_guidance: [],
          prevention: [],
          expert_help:
            "If the problem continues or appears severe, consult a qualified agricultural expert.",
          disclaimer:
            "AI image analysis can be inaccurate and should be confirmed by a qualified agricultural expert when necessary.",
        });
      } finally {
        setAnalyzing(false);
      }
    },
    [analyzing, selectedLanguage, stopSpeaking],
  );

  const generateTreatmentReport = useCallback(
    async ({ crop, symptoms } = {}) => {
      if (!analysis || reportGenerating) {
        return null;
      }

      stopSpeaking?.();

      const requestId = ++reportRef.current;

      setReportGenerating(true);

      try {
        const response = await api.post("/chat/crop-doctor/treatment-report", {
          analysis,
          crop: crop || null,
          symptoms: symptoms || "",
          language: selectedLanguage.label,
          language_code: selectedLanguage.code,
        });

        if (requestId !== reportRef.current) {
          return null;
        }

        const report = response.data.report || null;

        setTreatmentReport(report);

        return report;
      } catch (error) {
        if (requestId !== reportRef.current) {
          return null;
        }

        console.error(
          "Crop Doctor treatment report error:",
          error.response?.data || error.message,
        );

        return null;
      } finally {
        if (requestId === reportRef.current) {
          setReportGenerating(false);
        }
      }
    },
    [analysis, reportGenerating, selectedLanguage, stopSpeaking],
  );

  const newAnalysis = useCallback(() => {
    stopSpeaking?.();

    translationRef.current += 1;
    reportRef.current += 1;

    setAnalysis(null);
    setTreatmentReport(null);
    setReportGenerating(false);
    setTranslating(false);
    setSourceImages([]);

    setResetKey((value) => value + 1);
  }, [stopSpeaking]);

  const clear = useCallback(() => {
    stopSpeaking?.();

    translationRef.current += 1;
    reportRef.current += 1;

    setAnalysis(null);
    setTreatmentReport(null);
    setReportGenerating(false);
    setTranslating(false);
    setSourceImages([]);

    setResetKey((value) => value + 1);
  }, [stopSpeaking]);

  return {
    analysis,
    analyzing,
    translating,
    treatmentReport,
    reportGenerating,
    sourceImages,
    resetKey,
    analyze,
    translate,
    generateTreatmentReport,
    newAnalysis,
    clear,
    caseDetails,
  };
};

export default useCropDoctor;
