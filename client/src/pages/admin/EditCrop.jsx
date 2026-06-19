import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CropForm from "../../components/adminCrops/CropForm";

import api from "../../api/axios";
import toast from "react-hot-toast";

const EditCrop = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrop();
  }, []);

  const fetchCrop = async () => {
    try {
      const response = await api.get(`/admin/crops/${id}`);

      setCrop(response.data.crop);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCrop = async (cropData) => {
    try {
      const response = await api.put(`/admin/crops/${id}`, cropData);

      toast.success(response.data.message);

      navigate("/admin/crops");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update crop");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading Crop...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <CropForm mode="edit" initialData={crop} onSubmit={handleUpdateCrop} />
    </DashboardLayout>
  );
};

export default EditCrop;
