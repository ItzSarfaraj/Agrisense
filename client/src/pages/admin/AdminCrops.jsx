import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CropSearch from "../../components/adminCrops/CropSearch";
import CropTable from "../../components/adminCrops/CropTable";
import CropModal from "../../components/adminCrops/CropModal";
import api from "../../api/axios";
import CropStats from "../../components/adminCrops/CropStats";
import CropCategoryChart from "../../components/adminCrops/CropCategoryChart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, Loader2, Sprout, Plus, Search } from "lucide-react";

const AdminCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Holds an error message if fetchCrops() fails, so we can show a banner instead of failing silently
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Tracks which crop is currently being deleted (by _id), so we can
  // disable just that row's delete button instead of locking the whole table
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/crops");

      setCrops(response.data.crops);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load crops. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrop = async (crop) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${crop.name}"?`,
    );

    if (!confirmDelete) return;

    setDeletingId(crop._id);

    try {
      const response = await api.delete(`/admin/crops/${crop._id}`);

      toast.success(response.data.message);

      fetchCrops();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete crop");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCrops = crops.filter(
    (crop) =>
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      crop.category.toLowerCase().includes(search.toLowerCase()),
  );

  // ---- Loading state ----
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-gray-500">
          <Loader2 className="animate-spin mb-3 text-green-600" size={32} />
          <p className="text-sm sm:text-base font-medium">Loading crops...</p>
        </div>
      </DashboardLayout>
    );
  }

  // ---- Error state (fetch failed) ----
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 text-center px-4">
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl text-sm mb-4 shadow-sm">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
          <button
            onClick={fetchCrops}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-md shadow-green-600/20"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 -m-4 md:-m-6 p-4 md:p-6">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-green-900/10 mb-6 sm:mb-8">
          <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl">
              <Sprout size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Crop Management
              </h1>
              <p className="mt-1 text-green-100 text-sm sm:text-base">
                Manage crop information used by the AgriSense platform.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <CropStats crops={crops} />
        </div>

        <div className="mb-6 sm:mb-8">
          <CropCategoryChart crops={crops} />
        </div>

        {/* Search + Add Crop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
          <div className="w-full md:max-w-md bg-white rounded-2xl shadow-sm border border-green-100 px-1">
            <CropSearch search={search} setSearch={setSearch} />
          </div>

          <button
            onClick={() => navigate("/admin/crops/add")}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-md shadow-green-600/20 font-semibold"
          >
            <Plus size={18} />
            Add Crop
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
          {filteredCrops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <Search size={28} className="text-green-600" />
              </div>
              <p className="text-gray-700 font-medium">No crops found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search
                  ? "Try a different search term."
                  : "Add a crop to get started."}
              </p>
            </div>
          ) : (
            <CropTable
              crops={filteredCrops}
              onView={(crop) => {
                setSelectedCrop(crop);
                setShowModal(true);
              }}
              onDelete={handleDeleteCrop}
              deletingId={deletingId}
            />
          )}
        </div>
      </div>

      {showModal && (
        <CropModal crop={selectedCrop} onClose={() => setShowModal(false)} />
      )}
    </DashboardLayout>
  );
};

export default AdminCrops;