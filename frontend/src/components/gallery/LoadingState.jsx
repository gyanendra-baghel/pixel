import { Loader } from "lucide-react";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center py-32">
      <Loader className="animate-spin mr-2" size={24} />
      <span className="text-gray-600 font-medium">{message}</span>
    </div>
  );
}
