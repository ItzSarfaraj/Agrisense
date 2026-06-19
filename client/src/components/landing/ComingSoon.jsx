const ComingSoon = () => {
  const features = [
    {
      title: "AI Disease Detection",
      description:
        "Upload crop leaf images and detect diseases using computer vision.",
      icon: "🦠",
    },
    {
      title: "Crop Yield Prediction",
      description:
        "Estimate expected yield before sowing using soil and weather data.",
      icon: "🌾",
    },
    {
      title: "Fertilizer Recommendation",
      description:
        "Get personalized fertilizer suggestions based on soil nutrients.",
      icon: "🧪",
    },
    {
      title: "Pest Risk Alerts",
      description:
        "Receive warnings about pest outbreaks based on weather conditions.",
      icon: "🐛",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            Future Roadmap
          </span>

          <h2 className="text-4xl font-bold mt-6 text-gray-800">
            🚀 Coming Soon
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            We're continuously improving AgriSense with advanced AI-powered
            tools to help farmers make smarter decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-14">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>

              <h3 className="text-2xl font-bold text-gray-800">
                {feature.title}
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {feature.description}
              </p>

              <span className="inline-block mt-5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
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
