// src/components/RadioButton.jsx
import React from 'react';
import PropTypes from 'prop-types';

const RadioButton = ({
  label,
  id,
  name, // Crucial for grouping
  value,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'h-5 w-5 text-primary-500 border-gray-300 focus:ring-primary-400 focus:ring-2';
  const labelStyles = 'ml-2 text-gray-800 text-base';
  const disabledStyles = 'opacity-60 cursor-not-allowed';

  return (
    <div className={`flex items-center mb-2 ${className} ${disabled ? disabledStyles : ''}`}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`${baseStyles}`}
        {...props}
      />
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
        </label>
      )}
    </div>
  );
};

RadioButton.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default RadioButton;