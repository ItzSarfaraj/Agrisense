import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Recommend from "../pages/Recommend";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import HistoryPage from "../pages/HistoryPage";
import CropDetails from "../pages/CropDetails";
import CropLibrary from "../pages/CropLibrary";
import About from "../pages/About";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCrops from "../pages/admin/AdminCrops";
import AddCrop from "../pages/admin/AddCrop";
import EditCrop from "../pages/admin/EditCrop";
import Feedback from "../pages/Feedback";
import AdminFeedback from "../pages/admin/AdminFeedback";
import AdminAnalytics from "../pages/admin/AnalyticsPage";
import AdminSystemStatus from "../pages/admin/SystemStatusPage";
import AIInsightsPage from "../pages/AIInsightsPage";
import MarketPrice from "../pages/MarketPrice";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const AppRoutes = () => {
  return (
    // <div className="h-screen bg-green-600 text-white flex items-center justify-center text-5xl font-bold">
    //   AgriSense
    // </div>

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recommend"
        element={
          <ProtectedRoute>
            <Recommend />
          </ProtectedRoute>
        }
      />
      <Route
        path="/price-predictor"
        element={
          <ProtectedRoute>
            <MarketPrice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <AIInsightsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/crops"
        element={
          <AdminRoute>
            <AdminCrops />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/crops/add"
        element={
          <AdminRoute>
            <AddCrop />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/crops/edit/:id"
        element={
          <AdminRoute>
            <EditCrop />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <AdminRoute>
            <AdminFeedback />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/system"
        element={
          <AdminRoute>
            <AdminSystemStatus />
          </AdminRoute>
        }
      />
      <Route
        path="/crops"
        element={
          <ProtectedRoute>
            <CropLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crops/:cropName"
        element={
          <ProtectedRoute>
            <CropDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
