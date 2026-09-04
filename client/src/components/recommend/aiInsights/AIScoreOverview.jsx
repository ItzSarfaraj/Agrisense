const AIScoreOverview = ({
  weatherMatch,
  soilMatch,
  profitScore,
  riskScore,
}) => {
  const items = [
    {
      label: "Weather Match",
      value: weatherMatch,
      suffix: "%",
    },
    {
      label: "Soil Match",
      value: soilMatch,
      suffix: "%",
    },
    {
      label: "Profit Score",
      value: profitScore,
      suffix: "%",
    },
    {
      label: "Risk Score",
      value: riskScore,
      suffix: "%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6"
        >
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {item.label}
          </p>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
            {item.value != null
              ? `${item.value}${item.suffix}`
              : "N/A"}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default AIScoreOverview;