import { RefreshCw, Trash2 } from "lucide-react";
import recentlyDeleted from "../data/RecentlyDeletedPhoto";

const TrashItem = ({ image, deletedDate, expiryDate }) => (
  <div className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
    <img
      src={`${image}?auto=format&fit=crop&w=300&q=80`}
      alt="Deleted photo"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-sm">Deleted: {deletedDate}</p>
        <p className="text-sm text-red-300">Expires: {expiryDate}</p>
        <div className="flex space-x-2 mt-2">
          <button className="flex items-center space-x-1 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Restore</span>
          </button>
          <button className="flex items-center space-x-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const RecentlyDeleted = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Recently Deleted</h2>
        <p className="text-sm text-gray-500">Items are automatically deleted after 30 days</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentlyDeleted.map((photo) => (
          <TrashItem key={photo.id} image={photo.url} deletedDate={photo.deletedDate} expiryDate={photo.expiryDate} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyDeleted;
