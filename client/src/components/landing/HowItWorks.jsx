import {
  MapPin,
  Calendar,
  Brain,
  Sprout,
  IndianRupee,
  Bot,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Select Location",
      description: "Choose your state and district for localized recommendations.",
    },
    {
      icon: Calendar,
      title: "Choose Season",
      description: "Select the current farming season for accurate analysis.",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "AgriSense analyzes soil, weather, and crop suitability.",
    },
    {
      icon: Sprout,
      title: "Crop Recommendations",
      description: "Receive the most suitable crops ranked by performance.",
    },
    {
      icon: IndianRupee,
      title: "Profit Prediction",
      description: "Estimate expected profit and profitability range.",
    },
    {
      icon: Bot,
      title: "AI Insights",
      description: "Get smart farming advice and actionable recommendations.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
            Simple Process
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mt-5 sm:mt-6">
            How AgriSense Works
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            From crop recommendation to profit forecasting, AgriSense helps
            farmers make smarter decisions using AI and real-world agricultural
            data.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="
                  relative
                  bg-white
                  rounded-3xl
                  p-6 sm:p-8
                  shadow-sm
                  border
                  border-green-100
                  hover:shadow-xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                "
              >
                {/* Step Number */}
                <div className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm sm:text-base">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-5 sm:mb-6">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 mt-2.5 sm:mt-3 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;