// src/components/InputField.jsx
import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  helperText,
  className = '',
  ...props
}) => {
  const inputBaseStyles = 'block w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-200 ease-in-out';
  const labelStyles = 'block text-gray-700 text-sm font-medium mb-1';
  const errorTextStyles = 'text-error text-xs mt-1';
  const helperTextStyles = 'text-gray-500 text-xs mt-1';

  const inputStateStyles = error
    ? 'border-error focus:ring-1 focus:ring-error focus:border-error'
    : 'border-gray-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-100';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${inputBaseStyles} ${inputStateStyles}`}
        {...props}
      />
      {error && helperText && <p className={errorTextStyles}>{helperText}</p>}
      {!error && helperText && <p className={helperTextStyles}>{helperText}</p>}
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
};

export default InputField;