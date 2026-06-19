import {
  LayoutDashboard,
  Sprout,
  History,
  Info,
  Phone,
  Leaf,
  BookOpen,
  Shield,
  Users,
  BarChart3,
  Database,
  ClipboardList,
  MessageSquare,
  TrendingUp
} from "lucide-react";

import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isSidebarOpen }) => {
  const { user } = useAuth();

  const userMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Recommend Crop",
      path: "/recommend",
      icon: Sprout,
    },
    {
      name: "Price Predictor",
      path: "/price-predictor",
      icon: TrendingUp,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
    {
      name: "Crop Library",
      path: "/crops",
      icon: BookOpen,
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: MessageSquare,
    },
    {
      name: "About Us",
      path: "/about",
      icon: Info,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: Phone,
    },
  ];

  const adminMenuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Feedback",
      path: "/admin/feedback",
      icon: MessageSquare,
    },
    {
      name: "Crop Management",
      path: "/admin/crops",
      icon: Sprout,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "System Status",
      path: "/admin/system",
      icon: Database,
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <aside
      className={`min-h-screen bg-gradient-to-b from-green-950 to-green-700 text-white transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-green-800">
        <div className="flex items-center gap-2">
          <Leaf size={32} />

          {isSidebarOpen && (
            <h1 className="text-3xl font-bold">
              {user?.role === "admin" ? "Agrisense admin" : "AgriSense"}
            </h1>
          )}
        </div>

        {isSidebarOpen && (
          <p className="text-sm text-green-200 mt-2">
            {user?.role === "admin"
              ? "System Management"
              : "Smart Farming, Better Future"}
          </p>
        )}
      </div>

      {/* Role Badge */}
      {isSidebarOpen && (
        <div className="px-4 pt-4">
          <div className="bg-green-800/50 rounded-xl px-3 py-2 text-sm flex items-center gap-2">
            <Shield size={16} />
            <span className="capitalize">{user?.role || "user"}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center ${
                  isSidebarOpen ? "gap-3 px-4" : "justify-center"
                } py-3 rounded-xl transition ${
                  isActive ? "bg-green-600 shadow-lg" : "hover:bg-green-800"
                }`
              }
            >
              <Icon size={20} />

              {isSidebarOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
