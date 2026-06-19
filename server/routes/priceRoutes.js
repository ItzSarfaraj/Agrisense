const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");

const {
  savePrediction,
  getPredictionHistory,
  getPricePredictionCount
} = require("../controllers/pricePredictionController");

const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/price/predict",
      req.body,
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Price prediction failed",
    });
  }
});

router.get("/crops", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8000/price/crops");

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch crops",
    });
  }
});

router.get("/states/:crop", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/price/states/${req.params.crop}`,
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch states",
    });
  }
});

router.get("/districts/:crop/:state", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/price/districts/${req.params.crop}/${req.params.state}`,
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch districts",
    });
  }
});

// Save prediction

router.post("/save", authMiddleware, savePrediction);

// Get prediction history

router.get("/history", authMiddleware, getPredictionHistory);

router.get("/stats",authMiddleware,getPricePredictionCount);


module.exports = router;
