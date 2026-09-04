import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();
  const isChatbotPage = location.pathname === "/chatbot";

  return (
    <div className="h-screen overflow-hidden bg-green-50 dark:bg-gray-950 transition-colors duration-300">
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

      <div
        className={`h-screen min-h-0 flex flex-col transition-all duration-300 ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {!isChatbotPage && (
          <DashboardNavbar setIsMobileOpen={setIsMobileOpen} />
        )}

        <main
          className={
            isChatbotPage
              ? "flex-1 min-h-0 overflow-hidden"
              : "flex-1 min-h-0 overflow-y-auto p-4 md:p-6"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;