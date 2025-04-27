import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin"; // Redirect to login page
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userRole="admin"
      />
      <div className={`flex flex-col flex-1 overflow-hidden`}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} onLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;




