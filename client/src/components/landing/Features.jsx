import { TrendingUp } from "lucide-react";
import {
  FaSeedling,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaSeedling size={40} />,
      title: "Crop Recommendation",
      desc: "Get the best crops for your district and season."
    },
    {
      icon: <FaChartLine size={40} />,
      title: "Profit Prediction",
      desc: "Estimate expected profit per hectare."
    },
    {
      icon: <FaRobot size={40} />,
      title: "AI Insights",
      desc: "Receive intelligent recommendations."
    },
    {
      icon: <TrendingUp size={40} />,
      title: "Market Price Prediction",
      desc: "Receive intelligent recommendations."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-4xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-green-50 p-8 rounded-2xl shadow-md"
            >
              <div className="text-green-600 mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;