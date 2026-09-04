const express = require("express");
const multer = require("multer");

const {
  chat,
  cropDoctor,
  cropDoctorTranslate,
  cropDoctorTreatmentReport,
} = require("../controllers/chatbotController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Only JPG, PNG and WebP images are supported"));
    }

    callback(null, true);
  },
});

router.post("/", chat);

router.post("/crop-doctor", upload.array("images", 5), cropDoctor);

router.post("/crop-doctor/translate", cropDoctorTranslate);

router.post("/crop-doctor/treatment-report", cropDoctorTreatmentReport);

module.exports = router;
