import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-green-700">
            AgriSense
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                location.pathname === "/login"
                  ? "text-green-700 bg-green-50"
                  : "text-gray-600 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 rounded-lg text-sm font-medium bg-green-600 text-white
                         shadow-sm shadow-green-600/20 transition-all duration-200
                         hover:bg-green-700 hover:shadow-md active:scale-[0.97]"
            >
              Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden flex flex-col gap-1 pb-4">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                location.pathname === "/login"
                  ? "text-green-700 bg-green-50"
                  : "text-gray-600 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white text-center
                         hover:bg-green-700 transition-colors duration-200"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;