import { Link } from "react-router-dom";
import { FaRegHeart, FaUserFriends } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { IoAlbumsOutline } from "react-icons/io5";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEyeInvisible } from "react-icons/ai";
import { GiPhotoCamera } from "react-icons/gi";
import { RiLinksLine } from "react-icons/ri";
import { Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen fixed bg-white text-gray-900 p-4 shadow-lg border-r mt-24 border-gray-200 flex flex-col">
      <div className="mb-6">
        <h2 className="text-gray-600 text-sm font-semibold mb-2 uppercase">
          Photos
        </h2>
        <ul>
          <li>
            <Link to="/library" className="flex items-center p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <MdOutlinePhotoLibrary className="mr-2 text-blue-500" />
              Library
            </Link>
          </li>
          <li>
            <Link to="/like" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <FaRegHeart className="mr-2 text-red-500" />
              Favourites
            </Link>
          </li>
          <li>
            <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-default">
              <BsClockHistory className="mr-2 text-yellow-500" />
              Recents
            </div>
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-gray-600 text-sm font-semibold mb-2 uppercase">
          Smart Filters
        </h2>
        <ul>
          <li>
            <Link to="/people" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <FaUserFriends className="mr-2 text-green-500" />
              People
            </Link>
          </li>
          <li>
            <Link to="/objects" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <GiPhotoCamera className="mr-2 text-purple-500" />
              Objects
            </Link>
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-gray-600 text-sm font-semibold mb-2 uppercase">
          Collections
        </h2>
        <ul>
          <li>
            <Link to="/albums" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <IoAlbumsOutline className="mr-2 text-purple-500" />
              Albums
            </Link>
          </li>
          <li>
            <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-default">
              <AiOutlineEyeInvisible className="mr-2 text-gray-500" />
              Hidden
            </div>
          </li>
          <li>
            <Link to="/recently-deleted" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <AiOutlineDelete className="mr-2 text-red-600" />
              Recently Deleted
            </Link>
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-gray-600 text-sm font-semibold mb-2 uppercase">
          Sharing
        </h2>
        <ul>
          <li>
            <Link to="/shared" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <IoAlbumsOutline className="mr-2 text-teal-500" />
              Shared Albums
            </Link>
          </li>
          <li>
            <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-default">
              <RiLinksLine className="mr-2 text-blue-500" />
              iCloud Links
            </div>
          </li>
        </ul>
      </div>

      {/* Settings Section */}
      <div className="mt-auto">
        <ul>
          <li>
            <Link to="/settings" className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="mr-2 text-gray-500" />
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
