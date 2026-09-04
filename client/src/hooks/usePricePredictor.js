import { useCallback, useEffect, useMemo, useState } from "react";
import {
  predictPrice,
  getSupportedCrops,
  getStates,
  getDistricts,
  savePrediction,
} from "../api/priceApi";
import api from "../api/axios";
import { SUPPORTED_LANGUAGES } from "../components/chatbot/LanguageSelector";
import useSpeechSynthesis from "./useSpeechSynthesis";
import useMarketPriceVoice from "./useMarketPriceVoice";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const UI_TEXT = {
  "en-IN": {
    badge: "Market Intelligence",
    title: "Market Price Predictor",
    subtitle:
      "Estimate the expected market price using historical mandi data.",
    crop: "Crop",
    state: "State",
    district: "District",
    month: "Month",
    searchCrop: "Search crop...",
    selectState: "Select state",
    selectDistrict: "Select district",
    selectMonth: "Select month",
    predict: "Predict Market Price",
    predicting: "Analyzing Market Data...",
    result: "Price Forecast",
    modalPrice: "Expected market modal price",
    perQuintal: "per quintal",
    details: "Prediction Details",
    speak: "Listen",
    stop: "Stop",
    voice: "Voice input",
    ready: "Ready to predict",
    description:
      "Select your crop, location and month to get an estimated market price.",
    error: "Prediction failed",
  },
  "hi-IN": {
    badge: "बाज़ार जानकारी",
    title: "बाज़ार मूल्य अनुमान",
    subtitle:
      "पिछले मंडी डेटा के आधार पर संभावित बाज़ार मूल्य का अनुमान लगाएं।",
    crop: "फसल",
    state: "राज्य",
    district: "जिला",
    month: "महीना",
    searchCrop: "फसल खोजें...",
    selectState: "राज्य चुनें",
    selectDistrict: "जिला चुनें",
    selectMonth: "महीना चुनें",
    predict: "बाज़ार मूल्य अनुमान करें",
    predicting: "बाज़ार डेटा का विश्लेषण हो रहा है...",
    result: "मूल्य अनुमान",
    modalPrice: "अनुमानित बाज़ार मॉडल मूल्य",
    perQuintal: "प्रति क्विंटल",
    details: "अनुमान विवरण",
    speak: "सुनें",
    stop: "रोकें",
    voice: "आवाज़ से इनपुट",
    ready: "अनुमान के लिए तैयार",
    description:
      "अनुमानित बाज़ार मूल्य प्राप्त करने के लिए फसल, स्थान और महीना चुनें।",
    error: "मूल्य अनुमान विफल हुआ",
  },
};

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en-IN";

  const saved = localStorage.getItem("agrisense-language");

  return SUPPORTED_LANGUAGES.some(
    (item) => item.code === saved,
  )
    ? saved
    : "en-IN";
};

const usePricePredictor = () => {
  const [formData, setFormData] = useState({
    crop: "",
    state: "",
    district: "",
    month: "",
  });

  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allCrops, setAllCrops] = useState([]);
  const [cropQuery, setCropQuery] = useState("");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [translatedResult, setTranslatedResult] = useState("");

  const text =
    UI_TEXT[language] || UI_TEXT["en-IN"];

  const {
    isSupported: speechSupported,
    speakingId,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis();

  const {
    isSupported: voiceSupported,
    isListening,
    activeField,
    interimTranscript,
    toggle,
    stop: stopVoice,
  } = useMarketPriceVoice({
    language,
    crops: allCrops,
    states,
    districts,
    onCrop: async (crop) => {
      await selectCrop(crop);
    },
    onState: async (state) => {
      await selectState(state);
    },
    onDistrict: (district) => {
      setFormData((prev) => ({
        ...prev,
        district,
      }));
    },
    onMonth: (month) => {
      setFormData((prev) => ({
        ...prev,
        month,
      }));
    },
  });

  const selectCrop = useCallback(async (crop) => {
    try {
      setCropQuery(crop);

      setFormData((prev) => ({
        ...prev,
        crop,
        state: "",
        district: "",
      }));

      setShowSuggestions(false);
      setFilteredCrops([]);
      setStates([]);
      setDistricts([]);
      setError("");

      const data = await getStates(crop);

      setStates(data.states || []);
    } catch (loadError) {
      console.error(loadError);
      setError("Failed to load states.");
    }
  }, []);

  const selectState = useCallback(
    async (state) => {
      const crop = formData.crop;

      if (!crop) return;

      try {
        setFormData((prev) => ({
          ...prev,
          state,
          district: "",
        }));

        setDistricts([]);
        setError("");

        const data = await getDistricts(
          crop,
          state,
        );

        setDistricts(data.districts || []);
      } catch (loadError) {
        console.error(loadError);
        setError("Failed to load districts.");
      }
    },
    [formData.crop],
  );

  useEffect(() => {
    localStorage.setItem(
      "agrisense-language",
      language,
    );
  }, [language]);

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const data = await getSupportedCrops();
        setAllCrops(data.crops || []);
      } catch (loadError) {
        console.error(loadError);
      }
    };

    loadCrops();
  }, []);

  const handleCropSearch = useCallback(
    (event) => {
      const value = event.target.value;

      setCropQuery(value);

      setFormData((prev) => ({
        ...prev,
        crop: value,
        state: "",
        district: "",
      }));

      setStates([]);
      setDistricts([]);

      if (!value.trim()) {
        setFilteredCrops([]);
        setShowSuggestions(false);
        return;
      }

      const matches = allCrops.filter((crop) =>
        crop
          .toLowerCase()
          .includes(value.toLowerCase()),
      );

      setFilteredCrops(matches.slice(0, 8));
      setShowSuggestions(true);
    },
    [allCrops],
  );

  const handleStateChange = useCallback(
    async (event) => {
      await selectState(event.target.value);
    },
    [selectState],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (
        !formData.crop ||
        !formData.state ||
        !formData.district ||
        !formData.month
      ) {
        setError(
          language === "hi-IN"
            ? "कृपया सभी फ़ील्ड भरें।"
            : "Please fill all fields.",
        );
        return;
      }

      try {
        stopSpeaking();
        stopVoice();

        setLoading(true);
        setPrice(null);
        setTranslatedResult("");
        setError("");

        const response = await predictPrice({
          ...formData,
          month: Number(formData.month),
        });

        setPrice(response.predicted_price);

        await savePrediction({
          crop: formData.crop,
          state: formData.state,
          district: formData.district,
          month: formData.month,
          predictedPrice:
            response.predicted_price,
        });
      } catch (submitError) {
        console.error(submitError);

        setError(
          submitError?.response?.data?.error ||
            text.error,
        );
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      language,
      stopSpeaking,
      stopVoice,
      text.error,
    ],
  );

  const englishResultText = useMemo(() => {
    if (!price) return "";

    return `The predicted market price for ${formData.crop} in ${formData.district}, ${formData.state} for ${MONTHS[formData.month - 1]} is approximately ${Number(price).toLocaleString("en-IN")} rupees per quintal.`;
  }, [price, formData]);

  const handleSpeak = useCallback(async () => {
    if (!speechSupported || !price) return;

    stopSpeaking();

    if (language === "en-IN") {
      speak({
        text: englishResultText,
        lang: language,
        id: "market-price-result",
      });

      return;
    }

    try {
      const selectedLanguage =
        SUPPORTED_LANGUAGES.find(
          (item) => item.code === language,
        );

      const targetLanguage =
        selectedLanguage?.label || "English";

      const response = await api.post(
        "/chat",
        {
          message: `Translate this agriculture market price statement into ${targetLanguage}. Preserve the crop name, location, month, number and unit exactly. Return only the translated statement:\n\n${englishResultText}`,
          history: [],
          context: {
            feature: "market-price",
            crop: formData.crop,
            state: formData.state,
            district: formData.district,
            month: formData.month,
            predictedPrice: price,
          },
          language: targetLanguage,
          languageCode: language,
        },
      );

      const translated =
        response.data.response ||
        englishResultText;

      setTranslatedResult(translated);

      speak({
        text: translated,
        lang: language,
        id: "market-price-result",
      });
    } catch (translationError) {
      console.error(translationError);

      speak({
        text: englishResultText,
        lang: language,
        id: "market-price-result",
      });
    }
  }, [
    speechSupported,
    price,
    language,
    englishResultText,
    formData,
    stopSpeaking,
    speak,
  ]);

  const handleLanguageChange = useCallback(
    (event) => {
      stopSpeaking();
      setLanguage(event.target.value);
      setTranslatedResult("");
    },
    [stopSpeaking],
  );

  const isSpeaking =
    speakingId === "market-price-result";

  return {
    formData,
    price,
    loading,
    allCrops,
    cropQuery,
    filteredCrops,
    showSuggestions,
    error,
    states,
    districts,
    language,
    text,
    translatedResult,
    speechSupported,
    voiceSupported,
    isListening,
    activeField,
    interimTranscript,
    isSpeaking,
    setFormData,
    setShowSuggestions,
    setLanguage,
    selectCrop,
    handleCropSearch,
    handleStateChange,
    handleSubmit,
    handleSpeak,
    handleLanguageChange,
    toggle,
    stopVoice,
    stopSpeaking,
  };
};

export default usePricePredictor;