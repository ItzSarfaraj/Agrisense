import DashboardLayout from "../../components/layout/DashboardLayout";
import ComingSoon from "../../components/common/ComingSoon";

const AdminSystemStatus = () => {
  return (
    <DashboardLayout>
      <ComingSoon
        title="System Status"
        description="Real-time monitoring of backend services, database health, weather APIs, and ML services will be available here."
      />
    </DashboardLayout>
  );
};

export default AdminSystemStatus;