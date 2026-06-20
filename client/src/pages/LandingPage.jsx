import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Footer from "../components/landing/Footer";
import heroImage from "../assets/heroImage.png";
import ComingSoon from "../components/landing/ComingSoon";

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                <Sparkles size={14} />
                AI-Powered Farming Platform
              </div>

              {/* Main Heading */}
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-green-700 leading-tight">
                Grow Smarter with
                <br className="hidden sm:block" /> AI Powered Agriculture
              </h1>

              {/* Short Description */}
              <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Empowering farmers with AI-driven crop recommendations, profit
                forecasting, market price prediction, weather insights, and
                smart farming analytics in one platform.
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-3 mt-6">
                <span className="bg-green-100 text-green-700 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium">
                  🌾 Crop Recommendation
                </span>
                <span className="bg-blue-100 text-blue-700 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium">
                  📈 Market Price Prediction
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium">
                  ☁️ Weather Insights
                </span>
                <span className="bg-purple-100 text-purple-700 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium">
                  🤖 AI Advisory
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/register")}
                  className="group bg-green-600 text-white px-6 py-3 rounded-xl font-medium
                             flex items-center justify-center gap-2
                             hover:bg-green-700 active:scale-[0.98]
                             shadow-lg shadow-green-600/25 transition-all duration-200"
                >
                  Get Started
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={scrollToFeatures}
                  className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-xl font-medium
                             hover:bg-green-50 active:scale-[0.98] transition-all duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Illustration Section */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-[600px] h-[240px] sm:h-[320px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                <img
                  src={heroImage}
                  alt="AgriSense"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-green-50 rounded-2xl p-5 sm:p-6 text-center hover:shadow-md transition-shadow duration-200">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-700">30+</h2>
              <p className="text-gray-600 mt-2 text-xs sm:text-sm lg:text-base">Supported Crops</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 sm:p-6 text-center hover:shadow-md transition-shadow duration-200">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700">AI</h2>
              <p className="text-gray-600 mt-2 text-xs sm:text-sm lg:text-base">Recommendation Engine</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-5 sm:p-6 text-center hover:shadow-md transition-shadow duration-200">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-700">2</h2>
              <p className="text-gray-600 mt-2 text-xs sm:text-sm lg:text-base">Recommendation Modes</p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-5 sm:p-6 text-center hover:shadow-md transition-shadow duration-200">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-700">Real-Time</h2>
              <p className="text-gray-600 mt-2 text-xs sm:text-sm lg:text-base">Weather Data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — id added so "Learn More" can scroll here */}
      <div id="features">
        <Features />
      </div>

      {/* How Application Works */}
      <HowItWorks />

      <ComingSoon />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default LandingPage;