const axios = require("axios");
const FormData = require("form-data");

const GENAI_SERVICE_URL =
  process.env.GENAI_SERVICE_URL;

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
      timeout: 180000,
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
      timeout: 120000,
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
      timeout: 180000,
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