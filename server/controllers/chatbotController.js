const {
  sendChatMessage,
  sendCropDoctorAnalysis,
  translateCropDoctorAnalysis,
  generateCropDoctorTreatmentReport,
} = require("../services/chatbotService");

const { sendUpstreamError } = require("../utils/upstreamError");

const chat = async (req, res) => {
  try {
    const response = await sendChatMessage(req.body);

    res.status(200).json(response);
  } catch (error) {
    sendUpstreamError(res, error, "Failed to process chatbot request");
  }
};

const cropDoctor = async (req, res) => {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
        message: "At least one crop image is required",
      });
    }

    const totalSize = files.reduce((total, file) => total + file.size, 0);

    if (totalSize > 20 * 1024 * 1024) {
      return res.status(400).json({
        message: "Total image size must be 20 MB or smaller",
      });
    }

    const response = await sendCropDoctorAnalysis({
      images: files,
      crop: req.body.crop,
      symptoms: req.body.symptoms,
      language: req.body.language,
      languageCode: req.body.language_code,
    });

    res.status(200).json(response);
  } catch (error) {
    sendUpstreamError(res, error, "Failed to analyze crop images");
  }
};

const cropDoctorTranslate = async (req, res) => {
  try {
    if (!req.body?.analysis) {
      return res.status(400).json({
        message: "Crop Doctor analysis is required",
      });
    }

    const response = await translateCropDoctorAnalysis({
      analysis: req.body.analysis,
      language: req.body.language,
      languageCode: req.body.language_code,
    });

    res.status(200).json(response);
  } catch (error) {
    sendUpstreamError(res, error, "Failed to translate crop doctor analysis");
  }
};

const cropDoctorTreatmentReport = async (req, res) => {
  try {
    if (!req.body?.analysis) {
      return res.status(400).json({
        message: "Crop Doctor analysis is required",
      });
    }

    const response = await generateCropDoctorTreatmentReport({
      analysis: req.body.analysis,
      crop: req.body.crop,
      symptoms: req.body.symptoms,
      language: req.body.language,
      languageCode: req.body.language_code,
    });

    res.status(200).json(response);
  } catch (error) {
    sendUpstreamError(res, error, "Failed to generate treatment report!");
}
};

module.exports = {
  chat,
  cropDoctor,
  cropDoctorTranslate,
  cropDoctorTreatmentReport,
};