import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ✅ Sidebar visible initially

  return (
    <div className="flex h-screen">
 
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${isSidebarOpen ? "w-64" : "w-0"}`}>
        {isSidebarOpen && <Sidebar />}
      </div>

   
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <Header toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} /> {/* ✅ Pass toggle function */}
        <div className="flex-1 px-6 pt-20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;




