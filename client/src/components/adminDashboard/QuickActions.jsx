import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-medium transition"
        >
          Users
        </button>

        <button
          onClick={() => navigate("/admin/crops")}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-medium transition"
        >
          Crops
        </button>

        <button
          onClick={() => navigate("/admin/analytics")}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl font-medium transition"
        >
          Analytics
        </button>

        <button
          onClick={() => navigate("/admin/system")}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-medium transition"
        >
          System
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
