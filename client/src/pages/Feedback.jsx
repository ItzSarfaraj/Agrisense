import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Feedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: "General Feedback",
    rating: 5,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isGeneralFeedback = formData.topic === "General Feedback";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        topic: formData.topic,
        message: formData.message,
        ...(isGeneralFeedback && { rating: formData.rating }),
      };

      await api.post("/feedback", payload);

      toast.success("Thanks! We've received your message.");

      setSubmitted(true);

      setFormData({
        topic: "General Feedback",
        rating: 5,
        message: "",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600";

  const contactInfo = [
    { icon: "📧", title: "Email", lines: ["sarfarajsiddiqui002@gmail.com"] },
    { icon: "📱", title: "Phone", lines: ["+91 XXXXX XXXXX"] },
    { icon: "📍", title: "Location", lines: ["Gorakhpur, UP, India"] },
    { icon: "🕒", title: "Support Hours", lines: ["Monday - Saturday", "9:00 AM - 6:00 PM"] },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 rounded-3xl p-10 text-white shadow-xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/10 rounded-full"></div>

          <div className="relative z-10">
            <p className="uppercase tracking-wider text-green-100 text-sm">
              Feedback & Support
            </p>

            <h1 className="text-5xl font-bold mt-3">We'd Love to Hear From You</h1>

            <p className="text-green-100 text-lg mt-4 max-w-3xl">
              Rate your experience, report a bug, suggest a feature, or just
              say hello — we read every message and reply by email when needed.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="flex items-center gap-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 rounded-2xl p-4">
            <span className="text-2xl">✅</span>
            <p>Thank you! We've received your message and will get back to you by email if a reply is needed.</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="space-y-5">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-6"
              >
                <div className="text-3xl">{item.icon}</div>

                <h3 className="font-bold text-xl mt-3 text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>

                {item.lines.map((line) => (
                  <p key={line} className="text-gray-600 dark:text-gray-300 mt-2">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Unified Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-8">
              <div>
                <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
                  Tell Us What's On Your Mind
                </p>

                <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
                  Send a Message
                </h2>
              </div>

              {user && (
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-xl px-4 py-2">
                  Replying as <span className="font-medium text-gray-700 dark:text-gray-200">{user.email}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                    Topic
                  </label>

                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option>General Feedback</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Partnership Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                {isGeneralFeedback && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                      Overall Rating
                    </label>

                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({ ...formData, rating: Number(e.target.value) })
                      }
                      className={inputClasses}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4)</option>
                      <option value={3}>⭐⭐⭐ (3)</option>
                      <option value={2}>⭐⭐ (2)</option>
                      <option value={1}>⭐ (1)</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Message
                </label>

                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder={
                    isGeneralFeedback
                      ? "Tell us about your experience..."
                      : "Describe the issue, idea, or request in detail..."
                  }
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;