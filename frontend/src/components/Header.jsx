import { useState } from "react";
import user from "../assets/profile_img.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPlus,
  faCalendarDays,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

function Header({ toggleSidebar }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleForIsOpen = () => setIsOpen(!isOpen);

  return (
    <>  
      <header className="fixed top-0 left-0 right-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center gap-4">
            {/* ☰ Sidebar Toggle Button - Works Properly */}
            <FontAwesomeIcon
              icon={faBars}
              onClick={toggleSidebar}
              className="text-lg text-blue-600 cursor-pointer bg-white p-2 rounded-md shadow-sm hover:text-blue-800 transition"
            />
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 font-[opl3] hover:text-indigo-600 transition-all duration-300">
              VisionAI
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <FontAwesomeIcon
              icon={faPlus}
              className="text-xl text-gray-600 cursor-pointer hover:text-gray-800"
            />
            <img
              className="rounded-full w-10 h-10 object-cover cursor-pointer"
              src={user}
              alt="User Profile"
              onClick={toggleForIsOpen}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-16 right-5 bg-white shadow-lg w-64 rounded-lg">
            <div className="bg-gray-200 p-4">
              <p className="font-semibold">Prathit Dode</p>
              <p className="text-gray-500">prathitdode@gmail.com</p>
            </div>
            <div>
              <p className="p-4 font-bold text-red-600 cursor-pointer hover:text-red-800 transition-all flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="text-red-600 text-2xl"
                />
                <span>Sign Out</span>
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;


