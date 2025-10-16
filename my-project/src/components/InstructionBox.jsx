import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const InstructionBox = ({ title, points = [], className = "" }) => {
  if (!points.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl shadow-sm border border-gray-200 bg-white dark:bg-dark-card dark:border-gray-700 mb-4 ${className}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <h3 className="text-base font-semibold text-gray-800 dark:text-dark-text-primary">
          {title}
        </h3>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-dark-text-secondary">
        {points.map((point, i) => (
          <li
            key={i}
            dangerouslySetInnerHTML={{ __html: point }}
            className="leading-relaxed"
          />
        ))}
      </ul>
    </motion.div>
  );
};

export default InstructionBox;
