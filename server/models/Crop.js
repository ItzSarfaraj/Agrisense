const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema(
  {
    name: String,
    scientificName: String,
    category: String,
    overview: String,
    season: String,
    cropDuration: String,
    bestSowingMonths: [String],
    bestHarvestMonths: [String],

    soil: {
      type: Object,
      default: {},
    },

    climate: {
      type: Object,
      default: {},
    },

    waterRequirement: String,

    yield: {
      type: Object,
      default: {},
    },

    marketDemand: String,

    fertilizers: [Object],

    majorDiseases: [Object],

    pests: [Object],

    cultivationProcess: [Object],

    advantages: [String],

    challenges: [String],

    suitableStates: [String],

    intercroppingOptions: [String],

    storageGuidelines: String,

    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Crop", CropSchema);