const RiskAnalysisCard = ({ bestCrop, cropDetails, risks }) => {
  const details = cropDetails?.[0]?.details;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        ⚠ Risk Analysis
      </h2>

      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p>🌱 Crop: {bestCrop?.crop || "N/A"}</p>

        <p>
          💧 Water Requirement:{" "}
          {details?.waterRequirement || "N/A"}
        </p>

        <p>
          ⏳ Crop Duration:{" "}
          {details?.cropDuration || "N/A"}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          AI-Identified Risks
        </p>

        {risks?.length ? (
          <ul className="space-y-2">
            {risks.map((risk, index) => (
              <li
                key={index}
                className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-gray-700 dark:text-gray-300"
              >
                ⚠ {risk}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No significant risks identified from the supplied data.
          </p>
        )}
      </div>
    </div>
  );
};

export default RiskAnalysisCard;