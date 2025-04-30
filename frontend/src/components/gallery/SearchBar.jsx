import { useRef } from "react";
import { Search, XCircle, Loader, Camera, X, Filter } from "lucide-react";

export default function SearchBar({
  textQuery,
  onTextQueryChange,
  onTextSearch,
  onImageSearch,
  onClearSearch,
  isSearching,
  searchResults,
  searchLoading
}) {
  const fileInputRef = useRef(null);

  const handleImageSearchClick = (event) => {
    if (fileInputRef.current) {
      const file = event.target.files[0];
      if (file) {
        onImageSearch(file);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Text search */}
        <div className="flex flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={textQuery}
            onChange={(e) => onTextQueryChange(e.target.value)}
            placeholder="Search gallery"
            className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          {textQuery && (
            <button
              onClick={() => onTextQueryChange("")}
              className="absolute inset-y-0 right-10 flex items-center pr-3"
            >
              <XCircle size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <button
            onClick={() => onTextSearch()}
            disabled={searchLoading}
            className="absolute right-0 top-0 bottom-0 px-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            {searchLoading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
          </button>
        </div>

        {/* Image search */}
        <div className="flex">
          <label
            htmlFor="image-search"
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer transition-colors"
          >
            <Camera size={18} />
            <span>Search by Image</span>
            <input
              id="image-search"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSearchClick}
            />
          </label>
        </div>

        {/* Clear search */}
        {isSearching && (
          <button
            onClick={onClearSearch}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
          >
            <X size={18} />
            Clear Search
          </button>
        )}
      </div>

      {/* Search results info */}
      {searchResults && (
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <Filter size={16} className="mr-2" />
          {searchResults.type === 'text' ? (
            <span>Found <strong>{searchResults.count}</strong> {searchResults.count === 1 ? 'result' : 'results'} for "<strong>{searchResults.query}</strong>"</span>
          ) : (
            <span>Found <strong>{searchResults.count}</strong> {searchResults.count === 1 ? 'image' : 'images'} similar to "<strong>{searchResults.query}</strong>"</span>
          )}
        </div>
      )}
    </div>
  );
}
