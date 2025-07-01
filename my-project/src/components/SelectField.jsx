// src/components/SelectField.jsx
import React from 'react';
import PropTypes from 'prop-types';

const SelectField = ({
  label,
  id,
  value,
  onChange,
  options, // Array of { value, label } objects
  error = false,
  helperText,
  className = '',
  ...props
}) => {
  const selectBaseStyles = 'block w-full px-4 py-2 border rounded-lg appearance-none focus:outline-none transition-all duration-200 ease-in-out bg-white pr-8'; // pr-8 for arrow icon space
  const labelStyles = 'block text-gray-700 text-sm font-medium mb-1';
  const errorTextStyles = 'text-error text-xs mt-1';
  const helperTextStyles = 'text-gray-500 text-xs mt-1';

  const selectStateStyles = error
    ? 'border-error focus:ring-1 focus:ring-error focus:border-error'
    : 'border-gray-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-100';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`${selectBaseStyles} ${selectStateStyles}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom arrow for modern look (hides default browser arrow with appearance-none) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338l4.611 4.612z" />
          </svg>
        </div>
      </div>
      {error && helperText && <p className={errorTextStyles}>{helperText}</p>}
      {!error && helperText && <p className={helperTextStyles}>{helperText}</p>}
    </div>
  );
};

SelectField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
};

export default SelectField;