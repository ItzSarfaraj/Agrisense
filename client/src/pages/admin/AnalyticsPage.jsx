import DashboardLayout from "../../components/layout/DashboardLayout";
import ComingSoon from "../../components/common/ComingSoon";

const AdminAnalytics = () => {
  return (
    <DashboardLayout>
      <ComingSoon
        title="Analytics Dashboard"
        description="Advanced insights including crop trends, prediction statistics, user activity, and recommendation analytics will be available here."
      />
    </DashboardLayout>
  );
};

export default AdminAnalytics;