import { motion } from "framer-motion";
import "./LoadingOverlay.css"; // Import the CSS file

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <motion.div
        className="loading-spinner"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
      <span className="loading-text">Loading...</span>
    </div>
  );
};

export default LoadingOverlay;
