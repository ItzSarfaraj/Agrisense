const Feedback = require("../models/Feedback");
const sendEmail = require("../services/sendEmail");

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

    if (!feedback.user?.email) {
      return res.status(400).json({
        success: false,
        message: "This feedback has no associated user email",
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

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #15803d, #10b981); padding: 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: #ffffff; margin: 0;">AgriSense Support</h2>
        </div>
        <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #374151; font-size: 15px;">
            Hi ${feedback.user.name || "there"},
          </p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Thanks for reaching out about <strong>${feedback.topic}</strong>. Here's our reply:
          </p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #166534; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
            This was sent in response to your message submitted via the AgriSense feedback form. Reply to this email if you have follow-up questions.
          </p>
        </div>
      </div>
    `;

    await sendEmail(
      feedback.user.email,
      `Re: Your ${feedback.topic} to AgriSense`,
      html,
    );

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