import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function EmptyState({
  title,
  message,
  icon,
  actionLink,
  actionText,
  actionIcon,
  actionHandler
}) {
  const ActionButton = () => {
    // If we have a link, render a Link component
    if (actionLink) {
      return (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
        >
          {actionIcon && actionIcon}
          {actionText}
        </Link>
      );
    }

    // Otherwise, render a regular button
    return (
      <button
        onClick={actionHandler}
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
      >
        {actionIcon || <X size={18} />}
        {actionText}
      </button>
    );
  };

  return (
    <div className="text-center py-20 bg-white rounded-lg shadow">
      {icon}
      <h3 className="text-xl font-medium text-gray-700">{title}</h3>
      <p className="text-gray-500 mt-2 mb-6">{message}</p>
      {(actionLink || actionHandler) && <ActionButton />}
    </div>
  );
}
