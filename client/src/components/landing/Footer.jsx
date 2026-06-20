import { Link } from "react-router-dom";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-green-800 to-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Leaf size={26} />
              <h3 className="text-xl sm:text-2xl font-bold">AgriSense</h3>
            </div>
            <p className="mt-3 text-green-200 text-sm leading-relaxed max-w-xs">
              Smart farming powered by AI — crop recommendations, price
              prediction, and weather insights in one platform.
            </p>

            {/* Socials */}
            
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="GitHub" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <FaGithub size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>  

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-green-200">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button onClick={() => scrollToSection("features")} className="text-green-100 hover:text-white transition-colors">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("how-it-works")} className="text-green-100 hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <Link to="/login" className="text-green-100 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-green-100 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-green-200">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-green-100">
              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0" />
                support@agrisense.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0" />
                +91 00000 00000
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0" />
                Gorakhpur, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-green-200">
          <p>© 2026 AgriSense. All Rights Reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;