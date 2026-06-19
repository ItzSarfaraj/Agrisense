const AIVerdictCard = ({ bestCrop }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white mb-6">
      <h2 className="text-2xl font-bold mb-3">🎯 AI Verdict</h2>

      <p className="leading-relaxed">
        Based on profitability, weather conditions, cultivation requirements,
        and market demand, AI strongly recommends
        <span className="font-bold"> {bestCrop?.crop}</span> as the most
        suitable crop.
      </p>
    </div>
  );
};

export default AIVerdictCard;
