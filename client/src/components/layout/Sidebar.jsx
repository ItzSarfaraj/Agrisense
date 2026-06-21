import {
  LayoutDashboard, Sprout, History, Info, Phone, Leaf,
  BookOpen, Shield, Users, BarChart3, Database,
  ClipboardList, MessageSquare, TrendingUp, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth();

  const userMenuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Recommend Crop", path: "/recommend", icon: Sprout },
    { name: "Price Predictor", path: "/price-predictor", icon: TrendingUp },
    { name: "History", path: "/history", icon: History },
    { name: "Crop Library", path: "/crops", icon: BookOpen },
    { name: "Feedback", path: "/feedback", icon: MessageSquare },
    { name: "About Us", path: "/about", icon: Info }
  ];

  const adminMenuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Feedback", path: "/admin/feedback", icon: MessageSquare },
    { name: "Crop Management", path: "/admin/crops", icon: Sprout },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 }
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  // labels show on mobile always (drawer is never collapsed), and on desktop only when not collapsed
  const showLabels = isMobileOpen || !isCollapsed;

  return (
  <aside
    className={`fixed top-0 left-0 z-50 h-screen
      bg-gradient-to-b from-green-950 to-green-700 text-white
      transition-all duration-300 ease-in-out
      w-64 ${isCollapsed ? "md:w-20" : "md:w-64"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0`}
  >
    {/* Mobile close (X) — direct child of aside, never clipped */}
    <button
      onClick={() => setIsMobileOpen(false)}
      className="md:hidden absolute top-4 right-4 p-1 rounded-lg hover:bg-green-800 z-10"
    >
      <X size={20} />
    </button>

    {/* Desktop collapse toggle — direct child of aside, never clipped */}
    <button
      onClick={() => setIsCollapsed((prev) => !prev)}
      className="hidden md:flex absolute -right-3 top-8 w-6 h-6 items-center justify-center
                 rounded-full bg-green-600 hover:bg-green-500 shadow-md z-10"
    >
      {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
    </button>

    {/* Scrollable content wrapper — overflow lives HERE, not on <aside> */}
    <div className="h-full overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-green-800">
        <div className="flex items-center gap-2">
          <Leaf size={32} className="shrink-0" />
          {showLabels && (
            <h1 className="text-2xl md:text-3xl font-bold">
              {user?.role === "admin" ? "Agrisense admin" : "AgriSense"}
            </h1>
          )}
        </div>
        {showLabels && (
          <p className="text-sm text-green-200 mt-2">
            {user?.role === "admin" ? "System Management" : "Smart Farming, Better Future"}
          </p>
        )}
      </div>

      {/* Role Badge */}
      {showLabels && (
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
              onClick={() => setIsMobileOpen(false)}
              title={!showLabels ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center ${showLabels ? "gap-3 px-4" : "justify-center"} py-3 rounded-xl transition ${
                  isActive ? "bg-green-600 shadow-lg" : "hover:bg-green-800"
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              {showLabels && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  </aside>
);
};

export default Sidebar;