/**
 * Crop Routes
 *
 * GET /api/crops
 * GET /api/crops/:name
 */

const express = require("express");

const router = express.Router();

const {
  getAllCrops,
  getCropByName,
  getRelatedCrops
} = require("../controllers/cropController");

router.get("/", getAllCrops);

router.get(
  "/:name/related",
  getRelatedCrops
);

router.get("/:name", getCropByName);

module.exports = router;