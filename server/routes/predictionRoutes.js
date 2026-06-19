const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  savePrediction,
  getPredictionHistory,
  getPredictionStats,
} = require("../controllers/predictionController");

// Save prediction

router.post("/", authMiddleware, savePrediction);

// Get prediction history

router.get("/history", authMiddleware, getPredictionHistory);

// Get prediction stats for dashboard

router.get("/stats", authMiddleware, getPredictionStats);

module.exports = router;
