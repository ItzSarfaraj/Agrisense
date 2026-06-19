const Prediction = require("../models/Prediction");

const savePrediction = async (req, res) => {
  try {
    const { mode, state, district, season, recommendations } = req.body;

    const prediction = await Prediction.create({
      user: req.user.id,
      mode,
      state,
      district,
      season,
      recommendations,
    });

    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPredictionHistory = async (req, res) => {
  try {
    const history = await Prediction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPredictionStats = async (req, res) => {
  try {
    const predictions = await Prediction.find({
      user: req.user._id,
    });

    const totalPredictions = predictions.length;

    const quickPredictions = predictions.filter(
      (p) => p.mode === "quick"
    ).length;

    const soilPredictions = predictions.filter(
      (p) => p.mode === "soil"
    ).length;

    const cropCounts = {};

    predictions.forEach((p) => {
      const crop = p.recommendations?.[0]?.crop;

      if (crop) {
        cropCounts[crop] =
          (cropCounts[crop] || 0) + 1;
      }
    });

    const topCrop =
      Object.keys(cropCounts).length > 0
        ? Object.keys(cropCounts).reduce((a, b) =>
            cropCounts[a] > cropCounts[b] ? a : b
          )
        : "N/A";

    res.status(200).json({
      totalPredictions,
      quickPredictions,
      soilPredictions,
      topCrop,
      recentPredictions: predictions
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  savePrediction,
  getPredictionHistory,
  getPredictionStats
};
