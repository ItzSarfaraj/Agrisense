import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Bell, Menu, LogOut, User, ChevronDown } from "lucide-react";
import { UserContext } from "../auth/AuthContext";

const DashboardNavbar = ({ setIsMobileOpen }) => {
  const { user, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pageInfo = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Monitor your farming activities and insights.",
    },

    "/recommend": {
      title: "Crop Recommendation",
      subtitle: "Get AI-powered crop recommendations for your farm.",
    },

    "/history": {
      title: "Prediction History",
      subtitle: "View your previous crop recommendations.",
    },

    "/profile": {
      title: "Profile",
      subtitle: "Manage your account information.",
    },
  };

  const currentPage = pageInfo[location.pathname] || {
    title: "AgriSense",
    subtitle: "Smart Farming Platform",
  };

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {currentPage.title}
            </h2>
            <p className="hidden sm:block text-sm text-gray-500">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} />
          </button>

          {/* Avatar */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <ChevronDown size={18} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{user?.name}</p>

                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                >
                  <User size={18} />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
