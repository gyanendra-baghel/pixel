import { Calendar } from "lucide-react";
import { formatDate } from "../../lib/utils";

export default function ImageGroups({ images, onImageClick }) {
  // Group images by date
  const groupImagesByDate = () => {
    const groups = {};

    images.forEach(image => {
      const dateGroup = getDateGroup(image.uploadedAt);
      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
      }
      groups[dateGroup].push(image);
    });

    // Convert to array and sort by date (newest first)
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([date, dateImages]) => ({
        date,
        displayDate: formatDate(date),
        images: dateImages
      }));
  };

  // Get date for grouping (just YYYY-MM-DD)
  const getDateGroup = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const imageGroups = groupImagesByDate();

  return (
    <div className="space-y-8">
      {imageGroups.map(group => (
        <div key={group.date} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center gap-2 bg-gray-50 p-3 border-b">
            <Calendar size={18} className="text-gray-500" />
            <h2 className="font-medium text-gray-700">{group.displayDate}</h2>
            <span className="text-sm text-gray-500 ml-2">({group.images.length} images)</span>
          </div>

          {/* Ultra-responsive grid: 2-6 columns based on screen size */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-1 p-1">
            {group.images.map((image) => {
              // Find the actual index in the images array
              const globalIndex = images.findIndex(img => img.id === image.id);

              return (
                <div
                  key={image.id}
                  className="aspect-square relative overflow-hidden cursor-pointer"
                  onClick={() => onImageClick(image, globalIndex)}
                >
                  <img
                    src={`http://localhost:5002${image.fileUrl}`}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
