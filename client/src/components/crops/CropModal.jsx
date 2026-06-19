import { X } from "lucide-react";

const CropModal = ({ crop, onClose }) => {
  if (!crop) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-3xl font-bold capitalize">
            {crop.crop}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Crop Image */}
          <div className="flex justify-center">
            <img
              src={`/crops/${crop.crop.toLowerCase()}.png`}
              alt={crop.crop}
              onError={(e) => {
                e.target.src = "/crops/default.png";
              }}
              className="w-40 h-40 object-cover rounded-2xl border"
            />
          </div>

          {/* Recommendation Info */}
          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-green-50 p-4 rounded-2xl">
              <p className="text-sm text-gray-500">
                Crop
              </p>

              <p className="text-xl font-bold capitalize">
                {crop.crop}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="text-sm text-gray-500">
                Expected Profit
              </p>

              <p className="text-xl font-bold text-blue-700">
                ₹{crop.expected_profit?.toLocaleString()}
              </p>
            </div>

          </div>

          {/* Placeholder Section */}
          <div className="bg-amber-50 p-5 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">
              Coming Soon
            </h3>

            <p className="text-gray-600">
              Detailed crop information such as soil
              requirements, season, rainfall, diseases,
              fertilizers, cultivation guide and market
              insights will be available here.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CropModal;