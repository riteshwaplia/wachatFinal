import React from "react";
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
  console.log("error", error)
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text dark:text-dark-text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        styles={customSelectStyles}
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isDisabled={disabled}
        name={name}
        className={`w-full dark:bg-dark-surface   rounded-md border 
            ${error
            ? "border-error focus:ring-error focus:border-error"
            : success
              ? "border-success focus:ring-success focus:border-success"
              : "border-gray-200 focus:ring-primary focus:border-primary transition-all"
          } ${disabled
            ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            : "border-gray-300 dark:border-gray-300"
          } text-black placeholder-gray-400 focus:outline-none bg-inputbg focus:ring-2 focus:ring-button transition-colors`}

        classNamePrefix={`custom-select`}
      />
    </div>
  );
};

export default CustomSelect;