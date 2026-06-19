import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CropSearch from "../../components/adminCrops/CropSearch";
import CropTable from "../../components/adminCrops/CropTable";
import CropModal from "../../components/adminCrops/CropModal";
import api from "../../api/axios";
import CropStats from "../../components/adminCrops/CropStats";
import CropCategoryChart from "../../components/adminCrops/CropCategoryChart";
import { useNavigate } from "react-router-dom";

const AdminCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await api.get("/admin/crops");

      setCrops(response.data.crops);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrop = async (crop) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${crop.name}"?`,
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/admin/crops/${crop._id}`);

      toast.success(response.data.message);

      fetchCrops();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete crop");
    }
  };

  const filteredCrops = crops.filter(
    (crop) =>
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      crop.category.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading Crops...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-8 text-white shadow-xl mb-8">
          <h1 className="text-4xl font-bold">🌱 Crop Management</h1>

          <p className="mt-2 text-green-100">
            Manage crop information used by the AgriSense platform.
          </p>
        </div>
        <CropStats crops={crops} />
        <CropCategoryChart crops={crops} />
        {/* Search + Add Crop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="w-full md:max-w-md">
            <CropSearch search={search} setSearch={setSearch} />
          </div>

          <button
            onClick={() => navigate("/admin/crops/add")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-md"
          >
            + Add Crop
          </button>
        </div>
        {/* Table */}
        <CropTable
          crops={filteredCrops}
          onView={(crop) => {
            setSelectedCrop(crop);
            setShowModal(true);
          }}
          onDelete={handleDeleteCrop}
        />{" "}
      </div>
      {showModal && (
        <CropModal crop={selectedCrop} onClose={() => setShowModal(false)} />
      )}
     </DashboardLayout>
  );
};

export default AdminCrops;
