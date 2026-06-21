const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const cropRoutes = require("./routes/cropRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const priceRoutes = require("./routes/priceRoutes");
const notificationRoutes = require("./routes/notificationRoutes")

const connectDB = require("./config/db");
connectDB();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/price", priceRoutes);


//admin routes
app.use("/api/admin", adminRoutes);

//feedback routes
app.use("/api/feedback", feedbackRoutes);

//notification routes
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("AgriSense Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
