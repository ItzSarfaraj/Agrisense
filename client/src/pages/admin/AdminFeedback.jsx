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
} from "lucide-react";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);

  // Holds an error message if fetchFeedbacks() fails, so we can show a banner instead of failing silently
  const [error, setError] = useState("");

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

  // ---- Loading state ----
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-gray-500">
          <Loader2 className="animate-spin mb-3 text-green-600" size={32} />
          <p className="text-sm sm:text-base font-medium">
            Loading feedback...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ---- Error state (fetch failed) ----
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-center px-4">
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl text-sm mb-4 shadow-sm">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
          <button
            onClick={fetchFeedbacks}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-md shadow-green-600/20"
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

  const averageRating =
    totalFeedback > 0
      ? (
          feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
          totalFeedback
        ).toFixed(1)
      : 0;

  const statusBadgeClasses = {
    Pending: "bg-yellow-100 text-yellow-700",
    Reviewed: "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 -m-4 md:-m-6 p-4 md:p-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 rounded-3xl p-5 sm:p-8 text-white mb-6 sm:mb-8 shadow-xl shadow-green-900/10">
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
              <p className="mt-1 text-green-100 text-sm sm:text-base">
                Monitor user satisfaction and track platform improvements.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-2 text-gray-500">
              <MessageSquare size={16} />
              <p className="text-xs sm:text-sm">Total</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-green-600 mt-2">
              {totalFeedback}
            </h2>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={16} />
              <p className="text-xs sm:text-sm">Pending</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-yellow-500 mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-2 text-gray-500">
              <Eye size={16} />
              <p className="text-xs sm:text-sm">Reviewed</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-blue-500 mt-2">
              {reviewedCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-2 text-gray-500">
              <CheckCircle2 size={16} />
              <p className="text-xs sm:text-sm">Resolved</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-green-600 mt-2">
              {resolvedCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-green-100 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-gray-500">
              <Star size={16} />
              <p className="text-xs sm:text-sm">Avg Rating</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-orange-500 mt-2 flex items-center gap-1">
              {averageRating}
              <Star size={20} className="fill-orange-500 text-orange-500" />
            </h2>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-green-100">
            <h2 className="text-xl sm:text-2xl font-bold">User Feedback</h2>

            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              View all feedback submitted by users.
            </p>
          </div>

          {totalFeedback === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <MessageSquare size={28} className="text-green-600" />
              </div>
              <p className="text-gray-700 font-medium">No feedback yet</p>
              <p className="text-gray-400 text-sm mt-1">
                User feedback will appear here once submitted.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-50 to-green-100">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">
                      User
                    </th>

                    <th className="text-left p-4 font-semibold text-sm">
                      Rating
                    </th>

                    <th className="text-left p-4 font-semibold text-sm">
                      Message
                    </th>

                    <th className="text-left p-4 font-semibold text-sm">
                      Date
                    </th>

                    <th className="text-left p-4 font-semibold text-sm">
                      Status
                    </th>

                    <th className="text-left p-4 font-semibold text-sm">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {feedbacks.map((feedback) => (
                    <tr
                      key={feedback._id}
                      className="border-t border-gray-100 hover:bg-green-50/40 transition-colors"
                    >
                      <td className="p-4 font-medium">
                        {feedback.user?.name || (
                          <span className="text-gray-400 italic">
                            Unknown user
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-orange-500 whitespace-nowrap">
                        {"★".repeat(feedback.rating)}
                        <span className="text-gray-200">
                          {"★".repeat(Math.max(0, 5 - feedback.rating))}
                        </span>
                      </td>

                      <td className="p-4 text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{feedback.message}</p>
                      </td>

                      <td className="p-4 text-gray-600 whitespace-nowrap text-sm">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            statusBadgeClasses[feedback.status] ||
                            "bg-gray-100 text-gray-700"
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
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
                        >
                          <option value="Pending">Pending</option>

                          <option value="Reviewed">Reviewed</option>

                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedback;
