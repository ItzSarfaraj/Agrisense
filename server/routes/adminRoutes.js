const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
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
  getAnalytics
} = require("../controllers/adminController");

router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);

router.get("/crop-stats", authMiddleware, adminMiddleware, getCropStats);

router.get(
  "/monthly-predictions",
  authMiddleware,
  adminMiddleware,
  getMonthlyPredictions,
);

router.get("/analytics", authMiddleware, adminMiddleware, getAnalytics);

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

router.get("/crops", authMiddleware, adminMiddleware, getAllCrops);

router.delete("/crops/:id", authMiddleware, adminMiddleware, deleteCrop);

router.post("/crops", authMiddleware, adminMiddleware, createCrop);

router.get("/crops/:id", authMiddleware, adminMiddleware, getCropById);

router.put("/crops/:id", authMiddleware, adminMiddleware, updateCrop);

module.exports = router;
