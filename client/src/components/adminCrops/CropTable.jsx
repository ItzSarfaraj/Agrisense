import { useNavigate } from "react-router-dom";

const CropTable = ({ crops, onView, onDelete, deletingId }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-black/30 border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Crops List</h2>

        <p className="text-green-600 dark:text-green-400 text-sm mt-1">
          Showing {crops.length} crops
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Image</th>

              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Crop</th>

              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Scientific Name</th>

              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Category</th>

              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Season</th>

              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {crops.map((crop) => (
              <tr
                key={crop._id}
                className="border-t border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700/50"
              >
                <td className="p-4">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                </td>

                <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{crop.name}</td>

                <td className="p-4 text-gray-700 dark:text-gray-300">{crop.scientificName}</td>

                <td className="p-4 text-gray-700 dark:text-gray-300">{crop.category}</td>

                <td className="p-4 text-gray-700 dark:text-gray-300">{crop.season}</td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(crop)}
                      className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60"
                    >
                      View
                    </button>


                    <button
                      onClick={() => navigate(`/admin/crops/edit/${crop._id}`)}
                      disabled={deletingId === crop._id}
                      className="px-3 py-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/60"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(crop)}
                      disabled={deletingId === crop._id}
                      className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === crop._id ? "Deleting..." : "Delete"}
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