import { useState, useEffect } from "react";
import { Tag, Folder, Loader, Eye, Users, Images } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/api";

export function Dashboard() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  // Fetch galleries from API
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axiosInstance.get("/api/gallery");
        setGalleries(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching galleries:", err);
        setError("Failed to load galleries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Galleries</h2>
        <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 text-sm rounded-full ${selectedTag === null
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            All
          </button>

          {/* We can add tag filtering later if needed */}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="animate-spin mr-2" size={24} />
          <span>Loading galleries...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Folder size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No galleries available</p>
          <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
            Create New Gallery
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gallery Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {galleries.map((gallery) => (
                <tr
                  key={gallery.id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/gallery/${gallery.id}`} className="flex items-center">
                      <Folder size={20} className="text-gray-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {gallery.name}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {gallery.description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(gallery.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(gallery.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex gap-3">
                    <Link
                      to={`/gallery/${gallery.id}/manage-users`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Users />
                    </Link>
                    <Link
                      to={`/gallery/${gallery.id}/review-images`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Images />
                    </Link>
                    <Link
                      to={`/gallery/${gallery.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
