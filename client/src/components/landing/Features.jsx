import { TrendingUp, Sparkles } from "lucide-react";
import { FaSeedling, FaChartLine, FaRobot } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: FaSeedling,
      title: "Crop Recommendation",
      desc: "Get the best crops for your district and season.",
    },
    {
      icon: FaChartLine,
      title: "Profit Prediction",
      desc: "Estimate expected profit per hectare.",
    },
    {
      icon: FaRobot,
      title: "AI Insights",
      desc: "Receive intelligent, data-backed farming recommendations.",
    },
    {
      icon: TrendingUp,
      title: "Market Price Prediction",
      desc: "Track and forecast crop prices to time your sales better.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1.5">
            <Sparkles size={14} />
            What We Offer
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-5 sm:mt-6">
            Features
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to plan, predict, and profit from every
            growing season.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="
                  bg-green-50
                  p-6 sm:p-8
                  rounded-2xl
                  border
                  border-green-100
                  hover:shadow-xl
                  hover:-translate-y-2
                  hover:bg-white
                  transition-all
                  duration-300
                "
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
                  <Icon size={28} className="text-green-600 sm:w-8 sm:h-8" />
                </div>

                <h3 className="text-lg sm:text-xl font-semibold mb-2.5 sm:mb-3 text-gray-800">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;