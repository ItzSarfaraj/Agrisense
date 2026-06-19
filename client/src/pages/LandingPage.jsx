import Navbar from "../components/landing/Navbar";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Footer from "../components/landing/Footer";
import heroImage from "../assets/heroImage.png";
import ComingSoon from "../components/landing/ComingSoon";

const LandingPage = () => {
  return (
    <>
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className=" bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto px-8 py-20">
          {/* Two-column layout:
              Left -> Content
              Right -> Illustration
          */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              {/* Main Heading */}
              <h1 className="text-6xl font-bold text-green-700 leading-tight">
                Grow Smarter with
                <br />
                AI Powered Agriculture
              </h1>

              {/* Short Description */}
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Empowering farmers with AI-driven crop recommendations, profit
                forecasting, market price prediction, weather insights, and
                smart farming analytics in one platform.
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  🌾 Crop Recommendation
                </span>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  📈 Market Price Prediction
                </span>

                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                  ☁️ Weather Insights
                </span>

                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  🤖 AI Advisory
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex gap-4">
                {/* Primary Button */}
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl">
                  Get Started
                </button>

                {/* Secondary Button */}
                <button className="border border-green-600 text-green-600 px-6 py-3 rounded-xl">
                  Learn More
                </button>
              </div>
            </div>
            {/* Right Illustration Section */}{" "}
            <div className="flex justify-center">
              {" "}
              <div className="relative w-full max-w-[600px] h-[380px] rounded-3xl overflow-hidden shadow-2xl">
                {" "}
                <img
                  src={heroImage}
                  alt="AgriSense"
                  className="w-full  object-cover object-center"
                />{" "}
              </div>{" "}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-green-50 rounded-2xl p-6 text-center">
              <h2 className="text-4xl font-bold text-green-700">30+</h2>

              <p className="text-gray-600 mt-2">Supported Crops</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <h2 className="text-4xl font-bold text-blue-700">AI</h2>

              <p className="text-gray-600 mt-2">Recommendation Engine</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 text-center">
              <h2 className="text-4xl font-bold text-purple-700">2</h2>

              <p className="text-gray-600 mt-2">Recommendation Modes</p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-6 text-center">
              <h2 className="text-4xl font-bold text-yellow-700">Real-Time</h2>

              <p className="text-gray-600 mt-2">Weather Data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* How Application Works */}
      <HowItWorks />

      <ComingSoon />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default LandingPage;
