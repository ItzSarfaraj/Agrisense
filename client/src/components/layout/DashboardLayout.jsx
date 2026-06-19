import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";
import { useState } from "react";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className="flex-1 min-h-screen bg-green-50">
        <DashboardNavbar setIsSidebarOpen={setIsSidebarOpen} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
