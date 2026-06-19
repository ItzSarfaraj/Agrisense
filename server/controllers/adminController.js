const User = require("../models/User");
const Prediction = require("../models/Prediction");
const Crop = require("../models/Crop");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalPredictions = await Prediction.countDocuments();

    const quickPredictions = await Prediction.countDocuments({
      mode: "quick",
    });

    const soilPredictions = await Prediction.countDocuments({
      mode: "soil",
    });

    const predictions = await Prediction.find();

    const cropCounts = {};

    predictions.forEach((p) => {
      const crop = p.recommendations?.[0]?.crop;

      if (crop) {
        cropCounts[crop] = (cropCounts[crop] || 0) + 1;
      }
    });

    const topCrop =
      Object.keys(cropCounts).length > 0
        ? Object.keys(cropCounts).reduce((a, b) =>
            cropCounts[a] > cropCounts[b] ? a : b,
          )
        : "N/A";

    res.status(200).json({
      success: true,
      totalUsers,
      totalPredictions,
      quickPredictions,
      soilPredictions,
      topCrop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCropStats = async (req, res) => {
  try {
    const predictions = await Prediction.find();

    const cropCounts = {};

    predictions.forEach((p) => {
      const crop = p.recommendations?.[0]?.crop;

      if (crop) {
        cropCounts[crop] = (cropCounts[crop] || 0) + 1;
      }
    });

    const data = Object.entries(cropCounts)
      .map(([crop, count]) => ({
        crop,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMonthlyPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find();

    const monthlyData = {};

    predictions.forEach((p) => {
      const date = new Date(p.createdAt);

      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    });

    const data = Object.entries(monthlyData)
      .map(([month, count]) => ({
        month,
        count,
        sortDate: new Date(month),
      }))
      .sort((a, b) => a.sortDate - b.sortDate)
      .map(({ month, count }) => ({
        month,
        count,
      }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin deleting himself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      crops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCrop = async (req, res) => {
  try {
    const crop = await Crop.create(req.body);

    res.status(201).json({
      success: true,
      message: "Crop added successfully",
      crop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(
      req.params.id
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.status(200).json({
      success: true,
      crop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Crop updated successfully",
      crop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getCropStats,
  getMonthlyPredictions,
  getAllUsers,
  deleteUser,
  getAllCrops,
  deleteCrop,
  createCrop,
  getCropById,
  updateCrop,
};
