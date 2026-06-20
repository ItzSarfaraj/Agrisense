const User = require("../models/User");
const Prediction = require("../models/Prediction");
const PricePrediction = require("../models/PricePrediction");
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

// ---- Analytics ----

// Builds the last `count` months as { year, month, label } going back from today,
// oldest first — used so charts always show a continuous timeline even for
// months with zero activity.
const getLastNMonths = (count = 6) => {
  const months = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1, // 1-indexed to match Mongo's $month
      label: d.toLocaleString("default", { month: "short" }),
    });
  }

  return months;
};

// Groups documents by year/month using their createdAt timestamp, then maps
// the aggregation result onto a continuous list of months (filling gaps with 0).
const groupByMonth = async (Model, dateField = "createdAt") => {
  const months = getLastNMonths(6);
  const earliest = new Date(months[0].year, months[0].month - 1, 1);

  const results = await Model.aggregate([
    { $match: { [dateField]: { $gte: earliest } } },
    {
      $group: {
        _id: {
          year: { $year: `$${dateField}` },
          month: { $month: `$${dateField}` },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  return months.map(({ year, month, label }) => {
    const match = results.find(
      (r) => r._id.year === year && r._id.month === month
    );
    return { month: label, count: match ? match.count : 0 };
  });
};

const getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCrops,
      totalPredictions,
      totalPricePredictions,
      userGrowthRaw,
      predictionsOverTimeRaw,
      cropCategoryDistribution,
      modeSplitRaw,
      topCropsRaw,
    ] = await Promise.all([
      User.countDocuments(),
      Crop.countDocuments(),
      Prediction.countDocuments(),
      PricePrediction.countDocuments(),
      groupByMonth(User),
      groupByMonth(Prediction),
      Crop.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Prediction.aggregate([
        { $group: { _id: "$mode", count: { $sum: 1 } } },
      ]),
      PricePrediction.aggregate([
        { $group: { _id: "$crop", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const summary = {
      totalUsers,
      totalCrops,
      totalPredictions,
      totalPricePredictions,
    };

    const userGrowth = userGrowthRaw.map((m) => ({
      month: m.month,
      users: m.count,
    }));

    const predictionsOverTime = predictionsOverTimeRaw.map((m) => ({
      month: m.month,
      predictions: m.count,
    }));

    const cropCategories = cropCategoryDistribution.map((c) => ({
      category: c._id || "Uncategorized",
      count: c.count,
    }));

    const modeLabels = { quick: "Quick Mode", soil: "Soil-Based" };
    const modeSplit = modeSplitRaw.map((m) => ({
      name: modeLabels[m._id] || m._id,
      value: m.count,
    }));

    const topCrops = topCropsRaw.map((c) => ({
      crop: c._id,
      count: c.count,
    }));

    res.json({
      summary,
      userGrowth,
      predictionsOverTime,
      cropCategoryDistribution: cropCategories,
      modeSplit,
      topCrops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics data" });
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
  getAnalytics,
};