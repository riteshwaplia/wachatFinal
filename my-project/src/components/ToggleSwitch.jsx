// src/components/ToggleSwitch.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  const sliderStyles = 'block w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out';
  const dotStyles = 'absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out';

  return (
    <div className={`flex items-center  ${className}`}>
      <label htmlFor={id} className="relative inline-block">
        <input
          id={id}
          type="checkbox"
          className="sr-only" // Hide the default checkbox visually
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <div
          className={`${sliderStyles} ${
            checked ? 'bg-primary-500' : 'bg-gray-300'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <span
            className={`${dotStyles} ${
              checked ? 'translate-x-4' : 'translate-x-0'
            }`}
          ></span>
        </div>
      </label>
      {label && (
        <label htmlFor={id} className={`text-gray-800 text-base ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {label}
        </label>
      )}
    </div>
  );
};

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ToggleSwitch;