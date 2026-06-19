import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get("/feedback");

      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error(error);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading Feedback...</div>
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

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-8 text-white mb-8 shadow-lg">
          <h1 className="text-4xl font-bold">💬 Feedback Management</h1>

          <p className="mt-2 text-green-100">
            Monitor user satisfaction and track platform improvements.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <p className="text-gray-500">Total Feedback</p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {totalFeedback}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md">
            <p className="text-gray-500">Pending</p>

            <h2 className="text-4xl font-bold text-yellow-500 mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md">
            <p className="text-gray-500">Reviewed</p>

            <h2 className="text-4xl font-bold text-blue-500 mt-2">
              {reviewedCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md">
            <p className="text-gray-500">Average Rating</p>

            <h2 className="text-4xl font-bold text-orange-500 mt-2">
              ⭐ {averageRating}
            </h2>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">User Feedback</h2>

            <p className="text-gray-500 mt-1">
              View all feedback submitted by users.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-green-100">
                <tr>
                  <th className="text-left p-4 font-semibold">User</th>

                  <th className="text-left p-4 font-semibold">Rating</th>

                  <th className="text-left p-4 font-semibold">Message</th>

                  <th className="text-left p-4 font-semibold">Date</th>

                  <th className="text-left p-4 font-semibold">Status</th>

                  <th className="text-left p-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map((feedback) => (
                  <tr
                    key={feedback._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{feedback.user?.name}</td>

                    <td className="p-4">{"⭐".repeat(feedback.rating)}</td>

                    <td className="p-4 text-gray-700">{feedback.message}</td>

                    <td className="p-4 text-gray-600">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          feedback.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : feedback.status === "Reviewed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
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
                        className="border rounded-lg px-3 py-2 text-sm"
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedback;
