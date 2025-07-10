import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // or any other icon library

export const BackButton = ({
  text = "Back",
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 rounded-md px-3 py-2 dark:text-white text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{text}</span>
    </button>
  );
};