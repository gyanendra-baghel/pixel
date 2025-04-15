import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import General from "../components/General";

const Home = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      if (mobileView) setIsSidebarVisible(false); 
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) setIsSidebarVisible(false);
  };

  return (
    <div className="relative w-full transition-all duration-300 flex">
      
      {isSidebarVisible && (
        <div
          className={`fixed top-0 left-0 h-full transition-all duration-300 bg-white shadow-lg z-50 ${
            isMobile ? "w-full" : "w-[250px]"
          }`}
        >
          <Sidebar onSidebarItemClick={closeSidebarOnMobile} />
        </div>
      )}

      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header toggleSidebar={toggleSidebar} />
        <div className={`mt-16 flex justify-center items-center min-h-screen transition-all duration-300 ${isSidebarVisible && !isMobile ? "ml-[250px]" : "ml-0"}`}>
          <General />
        </div>
      </div>
    </div>
  );
};

export default Home;








