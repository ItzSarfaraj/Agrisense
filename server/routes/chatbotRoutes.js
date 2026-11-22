const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { createRateLimiter } = require("../middleware/rateLimit");
const { chat, cropDoctor, cropDoctorTranslate, cropDoctorTreatmentReport } =
  require("../controllers/chatbotController");

const router = express.Router();
router.use(authMiddleware);

const chatLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30,
  message: "You are sending messages too quickly. Please wait a minute." });
const cropDoctorLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 15,
  message: "Crop Doctor limit reached. Please wait a few minutes and try again." });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5, fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype))
      return cb(new Error("Only JPG, PNG and WebP images are supported"));
    cb(null, true);
  },
});

const uploadImages = (req, res, next) => {
  upload.array("images", 5)(req, res, (error) => {
    if (!error) return next();
    const messages = {
      LIMIT_FILE_SIZE: "Each image must be 5 MB or smaller",
      LIMIT_FILE_COUNT: "A maximum of 5 images is allowed",
      LIMIT_UNEXPECTED_FILE: "A maximum of 5 images is allowed",
    };
    return res.status(400).json({ message: messages[error.code] || error.message });
  });
};

router.post("/", chatLimiter, chat);
router.post("/crop-doctor", cropDoctorLimiter, uploadImages, cropDoctor);
router.post("/crop-doctor/translate", cropDoctorLimiter, cropDoctorTranslate);
router.post("/crop-doctor/treatment-report", cropDoctorLimiter, cropDoctorTreatmentReport);

module.exports = router;