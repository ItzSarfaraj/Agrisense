const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    topic: {
      type: String,
      enum: [
        "General Feedback",
        "Bug Report",
        "Feature Request",
        "Partnership Inquiry",
        "Other",
      ],
      default: "General Feedback",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved"],
      default: "Pending",
    },

    reply: {
      message: { type: String, trim: true },
      repliedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Feedback", feedbackSchema);