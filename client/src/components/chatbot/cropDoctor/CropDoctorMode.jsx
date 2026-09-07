import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mic,
  MicOff,
  Stethoscope,
} from "lucide-react";
import CropDoctorHeader from "./CropDoctorHeader";
import CropDoctorSteps from "./CropDoctorSteps";
import CropDoctorUploader from "./CropDoctorUploader";
import CropDoctorImageGrid from "./CropDoctorImageGrid";
import CropDoctorDetails from "./CropDoctorDetails";
import CropDoctorResult from "./result/CropDoctorResult";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";
import generateId from "../../common/generateId";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 20 * 1024 * 1024;
const MAX_SYMPTOMS_LENGTH = 500;

const CropDoctorMode = ({
  onAnalyze,
  onNewAnalysis,
  analysis = null,
  resetKey = 0,
  analyzing = false,
  translating = false,
  language = "en-IN",
  speaking = false,
  onSpeak,
  onStopSpeaking,
  treatmentReport = null,
  reportGenerating = false,
  onGenerateTreatmentReport,
  sourceImages = [],
}) => {
  const inputRef = useRef(null);
  const dragCounterRef = useRef(0);
  const imagesRef = useRef([]);

  const [images, setImages] = useState([]);
  const [crop, setCrop] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const {
    isSupported: speechSupported,
    isListening,
    interimTranscript,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    lang: language,
    onResult: (text) => {
      setSymptoms((current) =>
        `${current}${current.trim() ? " " : ""}${text}`.slice(
          0,
          MAX_SYMPTOMS_LENGTH,
        ),
      );

      setSubmitted(false);
    },
  });

  const revokeImageUrl = useCallback((image) => {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
  }, []);

  const clearImages = useCallback(() => {
    setImages((current) => {
      current.forEach(revokeImageUrl);
      return [];
    });
  }, [revokeImageUrl]);

  const reset = useCallback(() => {
    stopListening();
    clearImages();

    setCrop("");
    setSymptoms("");
    setErrors([]);
    setSubmitted(false);
    setDragActive(false);

    dragCounterRef.current = 0;

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [clearImages, stopListening]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    reset();
  }, [resetKey, reset]);

  useEffect(() => {
    return () => {
      stopListening();
      imagesRef.current.forEach(revokeImageUrl);
    };
  }, [revokeImageUrl, stopListening]);

  const totalSize = images.reduce((total, image) => total + image.file.size, 0);

  const addFiles = useCallback(
    (fileList) => {
      const incoming = Array.from(fileList || []);

      if (!incoming.length) return;

      const availableSlots = MAX_IMAGES - images.length;

      if (availableSlots <= 0) {
        setErrors([`You can upload a maximum of ${MAX_IMAGES} images.`]);
        return;
      }

      const existingKeys = new Set(
        images.map(
          (item) =>
            `${item.file.name}-${item.file.size}-${item.file.lastModified}`,
        ),
      );

      const validFiles = [];
      const validationErrors = [];

      for (const file of incoming) {
        if (validFiles.length >= availableSlots) {
          validationErrors.push(`Only ${MAX_IMAGES} images are allowed.`);
          break;
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          validationErrors.push(`${file.name} is not a supported image.`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          validationErrors.push(`${file.name} is larger than 5 MB.`);
          continue;
        }

        const key = `${file.name}-${file.size}-${file.lastModified}`;

        if (existingKeys.has(key)) {
          validationErrors.push(`${file.name} is already selected.`);
          continue;
        }

        const projectedSize =
          totalSize +
          validFiles.reduce((sum, item) => sum + item.size, 0) +
          file.size;

        if (projectedSize > MAX_TOTAL_SIZE) {
          validationErrors.push("Total image size cannot exceed 20 MB.");
          break;
        }

        validFiles.push(file);
        existingKeys.add(key);
      }

      if (validFiles.length) {
        const preparedImages = validFiles.map((file) => ({
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
        }));

        setImages((current) => [...current, ...preparedImages]);

        setSubmitted(false);
      }

      setErrors(validationErrors);
    },
    [images, totalSize],
  );

  const removeImage = (id) => {
    setImages((current) => {
      const target = current.find((item) => item.id === id);

      revokeImageUrl(target);

      return current.filter((item) => item.id !== id);
    });

    setSubmitted(false);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current += 1;
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current -= 1;

    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setDragActive(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current = 0;
    setDragActive(false);

    addFiles(event.dataTransfer.files);
  };

  const handleAnalyze = () => {
    if (!images.length) {
      setErrors([
        "Upload at least one crop photo before starting the analysis.",
      ]);
      return;
    }

    stopListening();
    setErrors([]);
    setSubmitted(true);

    onAnalyze?.({
      images: images.map((item) => item.file),
      crop: crop || null,
      symptoms: symptoms.trim(),
    });
  };

  const handleNewAnalysis = () => {
    reset();
    onNewAnalysis?.();
  };

  const toggleListening = () => {
    if (!speechSupported) {
      setErrors(["Speech recognition is not supported in this browser."]);
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      setErrors([]);
      startListening();
    }
  };

  if (analysis) {
    return (
      <section className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 lg:px-7">
        <div className="mx-auto w-full max-w-6xl space-y-4 pb-6">
          <CropDoctorHeader />

          {translating && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              Updating the result in the selected language...
            </div>
          )}

          <div
            className={
              translating
                ? "pointer-events-none opacity-60 transition-opacity"
                : "transition-opacity"
            }
          >
            <CropDoctorResult
              analysis={analysis}
              onNewAnalysis={handleNewAnalysis}
              speaking={speaking}
              onSpeak={onSpeak}
              onStopSpeaking={onStopSpeaking}
              language={language}
              treatmentReport={treatmentReport}
              reportGenerating={reportGenerating}
              onGenerateTreatmentReport={onGenerateTreatmentReport}
              sourceImages={sourceImages}
            />
          </div>
        </div>
      </section>
    );
  }

  const activeStep = images.length === 0 ? 1 : crop || symptoms ? 3 : 2;

  return (
    <section className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 lg:px-7">
      <div className="mx-auto w-full max-w-6xl space-y-3.5 pb-6">
        <CropDoctorHeader />

        <CropDoctorSteps activeStep={activeStep} />

        {errors.length > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/20">
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />

            <div className="space-y-1">
              {errors.map((error, index) => (
                <p
                  key={`${error}-${index}`}
                  className="text-xs font-medium text-red-700 dark:text-red-300"
                >
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}

        {!images.length ? (
          <CropDoctorUploader
            inputRef={inputRef}
            dragActive={dragActive}
            imageCount={images.length}
            onFiles={addFiles}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ) : (
          <div className="rounded-[1.75rem] border border-gray-100 bg-white/90 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/90 sm:p-5">
            <CropDoctorImageGrid
              images={images}
              onRemove={removeImage}
              onAdd={() => inputRef.current?.click()}
              maxImages={MAX_IMAGES}
            />

            <div className="mt-5">
              <CropDoctorUploader
                inputRef={inputRef}
                dragActive={dragActive}
                imageCount={images.length}
                onFiles={addFiles}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            </div>
          </div>
        )}

        <CropDoctorDetails
          crop={crop}
          symptoms={symptoms}
          onCropChange={(value) => {
            setCrop(value);
            setSubmitted(false);
          }}
          onSymptomsChange={(value) => {
            setSymptoms(value.slice(0, MAX_SYMPTOMS_LENGTH));
            setSubmitted(false);
          }}
        />

        <div className="rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/90">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                Voice Input
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Describe the symptoms in {language}.
              </p>
            </div>

            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={analyzing || translating}
                aria-label={
                  isListening ? "Stop voice input" : "Start voice input"
                }
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                  isListening
                    ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                    : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                }`}
              >
                {isListening ? (
                  <MicOff size={17} aria-hidden="true" />
                ) : (
                  <Mic size={17} aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          {isListening && (
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Listening...
              {interimTranscript && (
                <span className="truncate text-emerald-600/70 dark:text-emerald-300/70">
                  {interimTranscript}
                </span>
              )}
            </div>
          )}

          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Selected language: {language}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-cyan-50/50 p-3 dark:border-emerald-900/50 dark:from-emerald-950/20 dark:via-gray-900 dark:to-cyan-950/10 sm:p-4">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!images.length || analyzing || translating}
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <span className="absolute inset-0 translate-x-[-100%] skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[100%]" />

            <span className="relative flex items-center gap-2.5">
              {analyzing ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Stethoscope size={18} aria-hidden="true" />
              )}

              {analyzing ? "Analyzing crop..." : "Analyze Crop"}

              {!analyzing && (
                <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              )}
            </span>
          </button>

          {submitted && !analyzing && !translating && (
            <div className="mt-3 flex items-start gap-2.5 px-1">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />

              <p className="text-[11px] leading-5 text-emerald-700 dark:text-emerald-400">
                Your crop photos and case details are ready for Vision AI
                analysis.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-start justify-center gap-2 px-2 text-center">
          <span className="text-xs">💡</span>

          <p className="max-w-2xl text-[10px] leading-5 text-gray-400 dark:text-gray-500">
            For better results, include a clear close-up of the affected area
            and, when possible, another photo showing the whole plant.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CropDoctorMode;
