import { useNavigate } from "react-router-dom";

const CropTable = ({ crops, onView, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Crops List</h2>

        <p className="text-green-600 text-sm mt-1">
          Showing {crops.length} crops
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-50 to-green-100">
            <tr>
              <th className="text-left p-4">Image</th>

              <th className="text-left p-4">Crop</th>

              <th className="text-left p-4">Scientific Name</th>

              <th className="text-left p-4">Category</th>

              <th className="text-left p-4">Season</th>

              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {crops.map((crop) => (
              <tr key={crop._id} className="border-t hover:bg-green-50">
                <td className="p-4">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                </td>

                <td className="p-4 font-medium">{crop.name}</td>

                <td className="p-4">{crop.scientificName}</td>

                <td className="p-4">{crop.category}</td>

                <td className="p-4">{crop.season}</td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(crop)}
                      className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600"
                    >
                      View
                    </button>

                    
                    <button
                      onClick={() => navigate(`/admin/crops/edit/${crop._id}`)}
                      className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(crop)}
                      className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CropTable;
