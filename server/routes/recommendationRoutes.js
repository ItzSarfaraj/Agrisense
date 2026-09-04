const express = require("express");

const router = express.Router();

const {
  getQuickRecommendation,
  getSoilRecommendation,
  getRecommendationInsights
} = require("../controllers/recommendationController");

router.post("/quick", getQuickRecommendation);

router.post("/soil", getSoilRecommendation);

router.post("/insights", getRecommendationInsights);

module.exports = router;
