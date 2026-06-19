const AIConfidenceCard = ({ confidence }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        🎯 AI Confidence
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-4 rounded-full"
          style={{
            width: `${confidence}%`,
          }}
        />
      </div>

      <p className="mt-4 text-3xl font-bold text-indigo-600">
        {confidence}%
      </p>

      <p className="text-gray-500">
        Very High Suitability
      </p>
    </div>
  );
};

export default AIConfidenceCard;