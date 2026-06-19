import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [rating, setRating] = useState(5);

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/feedback", {
        rating,
        message,
      });

      toast.success("Thank you for your feedback!");

      setRating(5);
      setMessage("");


      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-2">Feedback</h1>

          <p className="text-center text-gray-500 mb-8">
            Help us improve AgriSense by sharing your experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2">Rating</label>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Your Feedback</label>

              <textarea
                rows="6"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
