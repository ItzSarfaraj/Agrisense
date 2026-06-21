import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";
import { useState } from "react";

const DashboardLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);   // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false);     // desktop collapse

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-950 transition-colors duration-300">
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* margin matches sidebar width: 64 normally, 20 when collapsed */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <DashboardNavbar setIsMobileOpen={setIsMobileOpen} />
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;