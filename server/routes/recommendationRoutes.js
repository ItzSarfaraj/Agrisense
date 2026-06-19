const express = require("express");

const router = express.Router();

const {
  getQuickRecommendation,
  getSoilRecommendation,
} = require("../controllers/recommendationController");

router.post("/quick", getQuickRecommendation);

router.post("/soil", getSoilRecommendation);

module.exports = router;
