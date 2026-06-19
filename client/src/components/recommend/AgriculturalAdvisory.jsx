import { AlertTriangle } from "lucide-react";

const AgriculturalAdvisory = ({ advisory }) => {
  if (!advisory?.length) return null;

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-green-100 p-2 rounded-xl">
          <AlertTriangle size={22} className="text-green-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">Agricultural Advisory</h2>

          <p className="text-gray-500 text-sm">
            Based on current weather conditions
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {advisory.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-green-50 rounded-xl p-4"
          >
            <span className="text-green-600 font-bold">•</span>

            <p className="text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgriculturalAdvisory;
