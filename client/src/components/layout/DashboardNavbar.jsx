import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LogOut,
  User,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { UserContext } from "../auth/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import NotificationBell from "./NotificationBell";

const DashboardNavbar = ({ setIsMobileOpen }) => {
  const { user, logout } = useContext(UserContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <nav className="sticky top-0 z-30 border-b bg-white px-6 py-4 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Open menu"
          >
            <Menu
              size={22}
              className="text-gray-800 dark:text-gray-200"
              aria-hidden="true"
            />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 md:text-xl">
              {currentPage.title}
            </h2>

            <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun
                size={20}
                className="text-yellow-400"
                aria-hidden="true"
              />
            ) : (
              <Moon
                size={20}
                className="text-gray-700 dark:text-gray-300"
                aria-hidden="true"
              />
            )}
          </button>

          <NotificationBell />

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-2"
              aria-label="Open profile menu"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <ChevronDown
                size={18}
                className="text-gray-800 dark:text-gray-200"
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {user?.name}
                  </p>

                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  <User size={18} aria-hidden="true" />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} aria-hidden="true" />
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