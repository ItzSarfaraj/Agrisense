const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createFeedback,
  getAllFeedback,
  updateFeedbackStatus,
} = require("../controllers/feedbackController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, createFeedback);

router.get("/", authMiddleware, adminMiddleware, getAllFeedback);

router.patch("/:id/status",authMiddleware,adminMiddleware,updateFeedbackStatus,);

module.exports = router;
