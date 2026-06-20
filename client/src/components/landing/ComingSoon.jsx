const ComingSoon = () => {
  const features = [
    {
      title: "AI Disease Detection",
      description: "Upload crop leaf images and detect diseases using computer vision.",
      icon: "🦠",
    },
    {
      title: "Crop Yield Prediction",
      description: "Estimate expected yield before sowing using soil and weather data.",
      icon: "🌾",
    },
    {
      title: "Fertilizer Recommendation",
      description: "Get personalized fertilizer suggestions based on soil nutrients.",
      icon: "🧪",
    },
    {
      title: "Pest Risk Alerts",
      description: "Receive warnings about pest outbreaks based on weather conditions.",
      icon: "🐛",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
            Future Roadmap
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold mt-5 sm:mt-6 text-gray-800">
            🚀 Coming Soon
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            We're continuously improving AgriSense with advanced AI-powered
            tools to help farmers make smarter decisions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 mt-10 sm:mt-14">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                {feature.title}
              </h3>

              <p className="text-gray-600 mt-2.5 sm:mt-3 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>

              <span className="inline-block mt-4 sm:mt-5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm font-medium">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;