import DashboardLayout from "../../components/layout/DashboardLayout";
import CropForm from "../../components/adminCrops/CropForm";

import api from "../../api/axios";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

const AddCrop = () => {
  const navigate = useNavigate();

  const handleCreateCrop = async (cropData) => {
    try {
      const response = await api.post("/admin/crops", cropData);

      toast.success(response.data.message);

      navigate("/admin/crops");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add crop");
    }
  };

  return (
    <DashboardLayout>
      <CropForm mode="add" onSubmit={handleCreateCrop} />
    </DashboardLayout>
  );
};

export default AddCrop;
