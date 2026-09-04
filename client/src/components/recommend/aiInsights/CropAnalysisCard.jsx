const CropAnalysisCard = ({
  strengths,
  weaknesses,
  opportunities,
  risks,
}) => {
  const sections = [
    {
      title: "Strengths",
      icon: "🟢",
      items: strengths,
    },
    {
      title: "Weaknesses",
      icon: "🔴",
      items: weaknesses,
    },
    {
      title: "Opportunities",
      icon: "📈",
      items: opportunities,
    },
    {
      title: "Risks",
      icon: "⚠",
      items: risks,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        🌟 SWOT Analysis
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">
              {section.icon} {section.title}
            </h3>

            <ul className="space-y-2">
              {section.items?.map((item, index) => (
                <li
                  key={index}
                  className="text-gray-700 dark:text-gray-300"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropAnalysisCard;