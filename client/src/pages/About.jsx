import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Crop Recommendations",
      description:
        "Get intelligent crop suggestions based on location, season and agricultural data.",
      icon: "🌱",
    },
    {
      title: "Crop Knowledge Library",
      description:
        "Explore detailed cultivation guides, diseases, fertilizers and market insights.",
      icon: "📚",
    },
    {
      title: "Weather Intelligence",
      description:
        "Stay informed with current weather conditions and farming-relevant insights.",
      icon: "☁️",
    },
    {
      title: "Profit Insights",
      description:
        "Compare crop opportunities and understand expected profitability.",
      icon: "📈",
    },
  ];

  const steps = [
    "Select Location & Season",
    "Enter Soil Information",
    "Get Crop Recommendations",
    "Explore Crop Intelligence Reports",
    "Make Better Farming Decisions",
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 rounded-3xl p-10 text-white shadow-xl">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full"></div>

          <div className="absolute bottom-0 left-1/3 w-36 h-36 bg-white/10 rounded-full"></div>

          <div className="relative z-10">
            <p className="uppercase tracking-wider text-green-100 text-sm">
              About AgriSense
            </p>

            <h1 className="text-5xl font-bold mt-4 leading-tight">
              Empowering Smarter Farming Decisions
            </h1>

            <p className="text-green-100 text-lg mt-5 max-w-4xl leading-8">
              AgriSense helps farmers make informed decisions through crop
              recommendations, weather intelligence and detailed agricultural
              knowledge.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate("/crops")}
                className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                Explore Crop Library
              </button>

              <button
                onClick={() => navigate("/recommendation")}
                className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                Get Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-6 text-center">
            <h3 className="text-4xl font-bold text-green-600 dark:text-green-400">29+</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Crop Guides</p>
          </div>

          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-6 text-center">
            <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">100%</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Data Driven</p>
          </div>

          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-6 text-center">
            <h3 className="text-4xl font-bold text-orange-600 dark:text-orange-400">24/7</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Accessibility</p>
          </div>

          <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-6 text-center">
            <h3 className="text-4xl font-bold text-purple-600 dark:text-purple-400">Smart</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Recommendations</p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">
          <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
            Our Mission
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
            Helping Farmers Grow Better
          </h2>

          <p className="text-gray-600 dark:text-gray-300 leading-8 mt-5 text-lg">
            Our mission is to support farmers with accessible, data-driven
            agricultural insights. By combining crop intelligence, weather
            information and modern decision support tools, AgriSense aims to
            simplify farming decisions and improve productivity.
          </p>
        </div>

        {/* Features */}
        <div>
          <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
            What We Offer
          </p>

          <h2 className="text-3xl font-bold mt-2 mb-6 text-gray-800 dark:text-gray-100">
            Platform Features
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-6 hover:shadow-xl dark:hover:border-gray-600 transition"
              >
                <div className="text-4xl">{feature.icon}</div>

                <h3 className="font-bold text-xl mt-4 text-gray-800 dark:text-gray-100">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mt-3 leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">
          <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
            Workflow
          </p>

          <h2 className="text-3xl font-bold mt-2 mb-8 text-gray-800 dark:text-gray-100">
            How AgriSense Works
          </h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold dark:ring-4 dark:ring-gray-800">
                  {index + 1}
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border dark:border-green-900 rounded-2xl p-4 flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-3xl shadow-md dark:shadow-none p-8">
          <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider text-sm">
            Future Vision
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
            Building the Future of Digital Agriculture
          </h2>

          <p className="text-gray-600 dark:text-gray-300 leading-8 mt-5 text-lg">
            We envision AgriSense as a trusted digital agriculture companion
            that helps farmers improve productivity, reduce uncertainty and make
            better decisions through technology, data and agricultural
            intelligence.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-10 text-center text-white shadow-xl">
          <h2 className="text-4xl font-bold">
            Ready to Explore Smarter Farming?
          </h2>

          <p className="text-green-100 mt-4 text-lg">
            Discover crop intelligence, recommendations and agricultural
            insights with AgriSense.
          </p>

          <div className="flex justify-center flex-wrap gap-4 mt-8">
            <button
              onClick={() => navigate("/crops")}
              className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold"
            >
              Browse Crop Library
            </button>

            <button
              onClick={() => navigate("/recommendation")}
              className="border border-white px-6 py-3 rounded-xl font-semibold"
            >
              Get Recommendation
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default About;