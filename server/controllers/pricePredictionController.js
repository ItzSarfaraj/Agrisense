const PricePrediction = require("../models/PricePrediction");

exports.savePrediction = async (req, res) => {
  try {
    const prediction = await PricePrediction.create({
      user: req.user.id,
      crop: req.body.crop,
      state: req.body.state,
      district: req.body.district,
      month: req.body.month,
      predictedPrice: req.body.predictedPrice,
    });

    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({
      error: "Failed to save prediction",
    });
  }
};

exports.getPredictionHistory = async (req, res) => {
  try {
    const predictions = await PricePrediction.find({
      user: req.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.json(predictions);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch predictions",
    });
  }
};

exports.getPricePredictionCount = async (req, res) => {
  try {
    const count = await PricePrediction.countDocuments({
      user: req.user.id,
    });

    res.json({
      totalPricePredictions: count,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch stats",
    });
  }
};
