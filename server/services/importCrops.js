/**
 * Crop Data Import Utility
 *
 * Purpose:
 * Imports all crop records from data/crops.json
 * into the MongoDB crops collection.
 *
 * Usage:
 * node scripts/importCrops.js
 *
 * Notes:
 * - Removes existing crop records before importing
 * - Run whenever crops.json is updated
 */

require("dotenv").config();

const mongoose = require("mongoose");

const Crop = require("../models/Crop");

const crops = require("../data/crops.json");

const importCropData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    await Crop.deleteMany();

    console.log("🗑 Existing crops removed");

    await Crop.insertMany(crops);

    console.log(
      `🌱 ${crops.length} crops imported successfully`
    );

    process.exit();
  } catch (error) {
    console.error(
      "❌ Crop import failed:",
      error.message
    );

    process.exit(1);
  }
};

importCropData();