import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 rounded-3xl p-10 text-white shadow-xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full"></div>

          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/10 rounded-full"></div>

          <div className="relative z-10">
            <p className="uppercase tracking-wider text-green-100 text-sm">
              Contact AgriSense
            </p>

            <h1 className="text-5xl font-bold mt-3">
              We'd Love to Hear From You
            </h1>

            <p className="text-green-100 text-lg mt-4 max-w-4xl">
              Have questions, suggestions or feedback? Reach out to us and help
              us improve AgriSense.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-100 border border-green-300 text-green-700 rounded-2xl p-4">
            Thank you for contacting AgriSense. We'll get back to you soon.
          </div>
        )}

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="text-3xl">📧</div>

              <h3 className="font-bold text-xl mt-3">Email</h3>

              <p className="text-gray-600 mt-2">sarfarajsiddiqui002@gmail.com</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="text-3xl">📱</div>

              <h3 className="font-bold text-xl mt-3">Phone</h3>

              <p className="text-gray-600 mt-2">+91 XXXXX XXXXX</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="text-3xl">📍</div>

              <h3 className="font-bold text-xl mt-3">Location</h3>

              <p className="text-gray-600 mt-2">Gorakhpur,UP,India</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="text-3xl">🕒</div>

              <h3 className="font-bold text-xl mt-3">Support Hours</h3>

              <p className="text-gray-600 mt-2">Monday - Saturday</p>

              <p className="text-gray-600">9:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-8">
            <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
              Contact Form
            </p>

            <h2 className="text-3xl font-bold mt-2 mb-8">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>

                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Contact;
