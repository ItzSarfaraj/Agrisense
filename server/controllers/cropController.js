/**
 * Crop Controller
 *
 * Handles crop knowledge retrieval
 * for Crop Details pages.
 */

const Crop = require("../models/Crop");

// Get all crops
const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find()
      .select("name category image")
      .sort({ name: 1 });

    res.json({
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

// Get single crop by name
const getCropByName = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      name: {
        $regex: new RegExp(
          `^${req.params.name}$`,
          "i"
        ),
      },
    });

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

const getRelatedCrops = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      name: {
        $regex: new RegExp(`^${req.params.name}$`, "i"),
      },
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    const related = await Crop.find({
      category: crop.category,
      _id: { $ne: crop._id },
    })
      .select("name image category")
      .limit(4);

    res.json({
      success: true,
      related,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCrops,
  getCropByName,
  getRelatedCrops
};