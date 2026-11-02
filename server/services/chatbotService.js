const axios = require("axios");
const FormData = require("form-data");

const GENAI_SERVICE_URL =
  process.env.GENAI_SERVICE_URL;

// Local models on a CPU can be slow. Raise this (milliseconds) in the
// server .env if Crop Doctor or the treatment report time out.
const GENAI_TIMEOUT_MS =
  Number(process.env.GENAI_TIMEOUT_MS) || 180000;

const sendChatMessage = async (data) => {
  const response = await axios.post(
    `${GENAI_SERVICE_URL}/chat`,
    data,
  );

  return response.data;
};

const sendCropDoctorAnalysis = async ({
  images,
  crop,
  symptoms,
  language,
  languageCode,
}) => {
  const form = new FormData();

  images.forEach((image) => {
    form.append("images", image.buffer, {
      filename: image.originalname,
      contentType: image.mimetype,
      knownLength: image.size,
    });
  });

  if (crop) {
    form.append("crop", crop);
  }

  form.append("symptoms", symptoms || "");
  form.append("language", language || "English");
  form.append("language_code", languageCode || "en-IN");

  const response = await axios.post(
    `${GENAI_SERVICE_URL}/crop-doctor`,
    form,
    {
      headers: form.getHeaders(),
      maxContentLength: 25 * 1024 * 1024,
      maxBodyLength: 25 * 1024 * 1024,
      timeout: GENAI_TIMEOUT_MS,
    },
  );

  return response.data;
};

const translateCropDoctorAnalysis = async ({
  analysis,
  language,
  languageCode,
}) => {
  const response = await axios.post(
    `${GENAI_SERVICE_URL}/crop-doctor/translate`,
    {
      analysis,
      language: language || "English",
      language_code: languageCode || "en-IN",
    },
    {
      timeout: GENAI_TIMEOUT_MS,
    },
  );

  return response.data;
};

const generateCropDoctorTreatmentReport = async ({
  analysis,
  crop,
  symptoms,
  language,
  languageCode,
}) => {
  const response = await axios.post(
    `${GENAI_SERVICE_URL}/crop-doctor/treatment-report`,
    {
      analysis,
      crop: crop || null,
      symptoms: symptoms || "",
      language: language || "English",
      language_code: languageCode || "en-IN",
    },
    {
      timeout: GENAI_TIMEOUT_MS,
    },
  );

  return response.data;
};

module.exports = {
  sendChatMessage,
  sendCropDoctorAnalysis,
  translateCropDoctorAnalysis,
  generateCropDoctorTreatmentReport,
};