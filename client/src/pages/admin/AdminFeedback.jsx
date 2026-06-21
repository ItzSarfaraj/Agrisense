import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  Clock,
  Eye,
  CheckCircle2,
  Star,
  Reply,
  Send,
  X,
} from "lucide-react";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [replyTarget, setReplyTarget] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/feedback");

      setFeedbacks(response.data.feedbacks);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load feedback. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (feedbackId, status) => {
    try {
      const response = await api.patch(`/feedback/${feedbackId}/status`, {
        status,
      });

      toast.success(response.data.message);

      fetchFeedbacks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const openReplyModal = (feedback) => {
    setReplyTarget(feedback);
    setReplyMessage(feedback.reply?.message || "");
  };

  const closeReplyModal = () => {
    setReplyTarget(null);
    setReplyMessage("");
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    try {
      setSendingReply(true);

      const response = await api.patch(`/feedback/${replyTarget._id}/reply`, {
        message: replyMessage,
      });

      toast.success(response.data.message);

      closeReplyModal();
      fetchFeedbacks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin mb-3 text-green-600 dark:text-green-400" size={32} />
          <p className="text-sm sm:text-base font-medium">
            Loading feedback...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-center px-4">
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-5 py-3 rounded-2xl text-sm mb-4 shadow-sm">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
          <button
            onClick={fetchFeedbacks}
            className="px-6 py-2.5 rounded-xl bg-green-600 dark:bg-green-700 text-white text-sm font-semibold hover:bg-green-700 dark:hover:bg-green-600 active:scale-95 transition-all shadow-md shadow-green-600/20 dark:shadow-green-900/30"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const totalFeedback = feedbacks.length;

  const pendingCount = feedbacks.filter(
    (feedback) => feedback.status === "Pending",
  ).length;

  const reviewedCount = feedbacks.filter(
    (feedback) => feedback.status === "Reviewed",
  ).length;

  const resolvedCount = feedbacks.filter(
    (feedback) => feedback.status === "Resolved",
  ).length;

  const ratedFeedbacks = feedbacks.filter(
    (feedback) => typeof feedback.rating === "number",
  );

  const averageRating =
    ratedFeedbacks.length > 0
      ? (
          ratedFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
          ratedFeedbacks.length
        ).toFixed(1)
      : "—";

  const statusBadgeClasses = {
    Pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    Reviewed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    Resolved: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  };

  const topicBadgeClasses = {
    "General Feedback": "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
    "Bug Report": "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
    "Feature Request": "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
    "Partnership Inquiry": "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    Other: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -m-4 md:-m-6 p-4 md:p-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 dark:from-gray-900 dark:via-green-900 dark:to-green-700 rounded-3xl p-5 sm:p-8 text-white mb-6 sm:mb-8 shadow-xl shadow-green-900/10 dark:shadow-black/30">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl">
              <MessageSquare size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Feedback Management
              </h1>
              <p className="mt-1 text-green-100 dark:text-green-200/90 text-sm sm:text-base">
                Monitor user satisfaction and track platform improvements.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <MessageSquare size={16} />
              <p className="text-xs sm:text-sm">Total</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
              {totalFeedback}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock size={16} />
              <p className="text-xs sm:text-sm">Pending</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-yellow-500 dark:text-yellow-400 mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Eye size={16} />
              <p className="text-xs sm:text-sm">Reviewed</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-blue-500 dark:text-blue-400 mt-2">
              {reviewedCount}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <CheckCircle2 size={16} />
              <p className="text-xs sm:text-sm">Resolved</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
              {resolvedCount}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 p-5 sm:p-6 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Star size={16} />
              <p className="text-xs sm:text-sm">Avg Rating</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-orange-500 dark:text-orange-400 mt-2 flex items-center gap-1">
              {averageRating}
              {averageRating !== "—" && (
                <Star size={20} className="fill-orange-500 text-orange-500 dark:fill-orange-400 dark:text-orange-400" />
              )}
            </h2>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-green-100 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">User Feedback</h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
              View all feedback submitted by users.
            </p>
          </div>

          {totalFeedback === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full mb-4">
                <MessageSquare size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium">No feedback yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                User feedback will appear here once submitted.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      User
                    </th>

                    <th className="text-left p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      Topic
                    </th>

                    <th className="text-left p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      Rating
                    </th>

                    <th className="text-left p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      Message
                    </th>

                    <th className="text-left p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      Date
                    </th>

                    <th className="text-left p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      Status
                    </th>

                    <th className="text-left p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      Action
                    </th>

                    <th className="text-left p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      Reply
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {feedbacks.map((feedback) => (
                    <tr
                      key={feedback._id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-green-50/40 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                        {feedback.user?.name ? (
                          feedback.user.name
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Unknown user
                          </span>
                        )}
                        {feedback.user?.email && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">
                            {feedback.user.email}
                          </p>
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            topicBadgeClasses[feedback.topic] ||
                            "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {feedback.topic}
                        </span>
                      </td>

                      <td className="p-4 text-orange-500 dark:text-orange-400 whitespace-nowrap">
                        {typeof feedback.rating === "number" ? (
                          <>
                            {"★".repeat(feedback.rating)}
                            <span className="text-gray-200 dark:text-gray-600">
                              {"★".repeat(Math.max(0, 5 - feedback.rating))}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600 text-sm">N/A</span>
                        )}
                      </td>

                      <td className="p-4 text-gray-700 dark:text-gray-200 max-w-xs">
                        <p className="line-clamp-2">{feedback.message}</p>
                      </td>

                      <td className="p-4 text-gray-600 dark:text-gray-300 whitespace-nowrap text-sm">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            statusBadgeClasses[feedback.status] ||
                            "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {feedback.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={feedback.status}
                          onChange={(e) =>
                            handleStatusChange(feedback._id, e.target.value)
                          }
                          className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
                        >
                          <option value="Pending">Pending</option>

                          <option value="Reviewed">Reviewed</option>

                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => openReplyModal(feedback)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                            feedback.reply?.message
                              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          <Reply size={14} />
                          {feedback.reply?.message ? "View Reply" : "Reply"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {replyTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl dark:shadow-black/40 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Reply to Feedback
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Notifying{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {replyTarget.user?.name || "this user"}
                  </span>{" "}
                  in-app
                </p>
              </div>

              <button
                onClick={closeReplyModal}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Original message</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3">
                {replyTarget.message}
              </p>
            </div>

            {replyTarget.reply?.message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-3 mb-4">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                  Previously replied on{" "}
                  {new Date(replyTarget.reply.repliedAt).toLocaleString()}
                </p>
              </div>
            )}

            <textarea
              rows="5"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Write your reply..."
              className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 resize-none"
            />

            <button
              onClick={handleSendReply}
              disabled={sendingReply || !replyMessage.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
            >
              {sendingReply ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {sendingReply ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminFeedback;