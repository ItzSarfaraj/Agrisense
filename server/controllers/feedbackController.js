const Feedback = require("../models/Feedback");
const Notification = require("../models/Notification");

const createFeedback = async (req, res) => {
  try {
    const { rating, topic, message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (topic === "General Feedback" && !rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required for general feedback",
      });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      topic: topic || "General Feedback",
      rating: rating || undefined,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      },
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback status updated",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const replyToFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const feedback = await Feedback.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    if (!feedback.user?._id) {
      return res.status(400).json({
        success: false,
        message: "This feedback has no associated user",
      });
    }

    feedback.reply = {
      message,
      repliedAt: new Date(),
    };

    // Auto-advance Pending -> Reviewed on first reply. Leave Resolved alone if
    // admin already marked it resolved. Adjust if you want different behavior.
    if (feedback.status === "Pending") {
      feedback.status = "Reviewed";
    }

    await feedback.save();

    await Notification.create({
      user: feedback.user._id,
      type: "feedback_reply",
      title: `Reply to your ${feedback.topic}`,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  replyToFeedback,
};