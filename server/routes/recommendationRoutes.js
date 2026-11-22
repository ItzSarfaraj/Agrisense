const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getQuickRecommendation,
  getSoilRecommendation,
  getRecommendationInsights,
} = require("../controllers/recommendationController");

// Every route here calls the ML service, the weather API or the AI model,
// so a login is required for all of them.
router.use(authMiddleware);

router.post("/quick", getQuickRecommendation);

router.post("/soil", getSoilRecommendation);

router.post("/insights", getRecommendationInsights);

module.exports = router;
