import { useState, useEffect } from "react";
import { Tag, Folder, Loader, Eye, Users, Images, Pencil, Plus, Filter, Search, Download, Trash2, Star, Settings, Grid, List } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/api";

export function Dashboard() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterAccess, setFilterAccess] = useState("all"); // all, owner, editor, viewer
  const [selectedGalleries, setSelectedGalleries] = useState([]);

  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  // Fetch galleries from API
  useEffect(() => {
    fetchGalleries();
  }, [filterAccess]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      // Use the filterAccess to get specific galleries
      const accessParam = filterAccess !== "all" ? filterAccess : "viewer";
      const response = await axiosInstance.get(`/api/gallery/access/my-galleries?access=${accessParam}`);
      setGalleries(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching galleries:", err);
      setError("Failed to load galleries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle gallery creation
  const handleCreateGallery = async (data) => {
    try {
      const response = await axiosInstance.post("/api/gallery", data);
      setGalleries([...galleries, response.data]);
      setShowCreateModal(false);
      navigate(`/gallery/${response.data.id}/edit`);
    } catch (err) {
      console.error("Error creating gallery:", err);
      setError("Failed to create gallery. Please try again.");
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedGalleries.length} galleries?`)) {
      try {
        await Promise.all(
          selectedGalleries.map(id => axiosInstance.delete(`/api/gallery/${id}`))
        );
        fetchGalleries();
        setSelectedGalleries([]);
      } catch (err) {
        console.error("Error deleting galleries:", err);
        setError("Failed to delete galleries. Please try again.");
      }
    }
  };

  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Filter galleries based on search and sorting
  const filteredGalleries = galleries
    .filter(gallery =>
      gallery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gallery.description && gallery.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

  // Toggle gallery selection
  const toggleSelection = (id) => {
    if (selectedGalleries.includes(id)) {
      setSelectedGalleries(selectedGalleries.filter(galleryId => galleryId !== id));
    } else {
      setSelectedGalleries([...selectedGalleries, id]);
    }
  };

  return (
    <div className="">
      {/* Header section with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Galleries</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 px-5 text-sm rounded-2xl bg-gray-800 text-white flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Create Gallery
          </button>
          {userRole === "ADMIN" && (
            <button className="p-2 px-5 text-sm rounded-2xl bg-blue-600 text-white flex items-center">
              <Settings size={16} className="mr-1" />
              Admin Settings
            </button>
          )}
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search galleries..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            value={filterAccess}
            onChange={(e) => setFilterAccess(e.target.value)}
          >
            <option value="all">All Access</option>
            <option value="owner">Owner</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${viewMode === "table" ? "bg-gray-200" : "bg-white"}`}
              title="Table View"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-200" : "bg-white"}`}
              title="Grid View"
            >
              <Grid size={20} />
            </button>
          </div>
          {selectedGalleries.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-500 text-white rounded-md flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              Delete ({selectedGalleries.length})
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow">
          <Loader className="animate-spin mr-2" size={24} />
          <span>Loading galleries...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : filteredGalleries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Folder size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No galleries available</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Create New Gallery
          </button>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGalleries(filteredGalleries.map(g => g.id));
                      } else {
                        setSelectedGalleries([]);
                      }
                    }}
                    checked={selectedGalleries.length === filteredGalleries.length && filteredGalleries.length > 0}
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Gallery Name
                    {sortBy === "name" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Created
                    {sortBy === "createdAt" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("updatedAt")}
                >
                  <div className="flex items-center">
                    Last Updated
                    {sortBy === "updatedAt" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGalleries.map((gallery) => (
                <tr
                  key={gallery.id}
                  className={`hover:bg-gray-50 ${selectedGalleries.includes(gallery.id) ? "bg-blue-50" : ""}`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedGalleries.includes(gallery.id)}
                      onChange={() => toggleSelection(gallery.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/gallery/${gallery.id}`} className="flex items-center">
                      <Folder size={20} className="text-gray-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {gallery.name}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-md truncate">
                      {gallery.description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(gallery.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(gallery.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex gap-2">
                      <Link
                        to={`/gallery/${gallery.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                        title="View Gallery"
                      >
                        <Eye size={18} />
                      </Link>
                      {userRole === "ADMIN" && (
                        <Link
                          to={`/gallery/${gallery.id}/manage-users`}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded"
                          title="Manage Users"
                        >
                          <Users size={18} />
                        </Link>
                      )}
                      {userRole === "ADMIN" && (
                        <Link
                          to={`/gallery/${gallery.id}/review-images`}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded"
                          title="Review Images"
                        >
                          <Images size={18} />
                        </Link>
                      )}
                      <Link
                        to={`/gallery/${gallery.id}/edit`}
                        className="p-1.5 text-amber-600 hover:bg-amber-100 rounded"
                        title="Edit Gallery"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => toggleSelection(gallery.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                        title="Select"
                      >
                        {selectedGalleries.includes(gallery.id) ?
                          <Star size={18} fill="currentColor" /> :
                          <Star size={18} />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Grid view for galleries
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGalleries.map(gallery => (
            <div
              key={gallery.id}
              className={`bg-white rounded-lg shadow overflow-hidden border ${selectedGalleries.includes(gallery.id) ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                }`}
            >
              <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                <Folder size={64} className="text-gray-300" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => toggleSelection(gallery.id)}
                    className={`p-1.5 rounded-full ${selectedGalleries.includes(gallery.id)
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-500 border border-gray-300"
                      }`}
                  >
                    <Star size={16} className={selectedGalleries.includes(gallery.id) ? "fill-current" : ""} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <Link to={`/gallery/${gallery.id}`}>
                  <h3 className="font-medium text-gray-900 mb-1">{gallery.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 h-10">
                  {gallery.description || "No description"}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Updated {formatDate(gallery.updatedAt)}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex gap-1">
                    <Link
                      to={`/gallery/${gallery.id}`}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                      title="View Gallery"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/gallery/${gallery.id}/edit`}
                      className="p-1.5 text-amber-600 hover:bg-amber-100 rounded"
                      title="Edit Gallery"
                    >
                      <Pencil size={16} />
                    </Link>
                  </div>
                  {userRole === "ADMIN" && (
                    <div className="flex gap-1">
                      <Link
                        to={`/gallery/${gallery.id}/manage-users`}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded"
                        title="Manage Users"
                      >
                        <Users size={16} />
                      </Link>
                      <Link
                        to={`/gallery/${gallery.id}/review-images`}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded"
                        title="Review Images"
                      >
                        <Images size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Gallery Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Gallery</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleCreateGallery({
                name: formData.get("name"),
                description: formData.get("description"),
              });
            }}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Gallery Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter gallery name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter gallery description"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  Create Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
