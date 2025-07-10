import React, { useEffect, useState } from "react";
import Select from "react-select";
import { customSelectStyles } from "../styles/custom";

const CustomSelect = ({
  label,
  required = false,
  options = [],
  placeholder = "Select...",
  value,
  onChange,
  isMulti = false,
  name,
  error,
  success,
  disabled = false,
  ...rest
}) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
console.log("dark mode:", isDark);
  useEffect(() => {
    // Watch for dark mode changes dynamically
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text dark:text-dark-text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Select
        styles={customSelectStyles(isDark)} // ✅ dynamic theme
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isDisabled={disabled}
        name={name}
        className={`w-full dark:bg-dark-surface rounded-md border 
          ${error
            ? "border-error focus:ring-error"
            : success
            ? "border-success focus:ring-success"
            : "border-gray-200 focus:ring-primary"} 
          ${disabled
            ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            : "border-gray-300 dark:border-gray-300"}
          text-black placeholder-gray-400 focus:outline-none bg-inputbg focus:ring-2 transition-colors`}
        classNamePrefix="custom-select"
        {...rest}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomSelect;
