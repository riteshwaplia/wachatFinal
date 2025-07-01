import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  error = false,
  helperText,
  rows = 4, // Default rows
  className = '',
  ...props
}) => {
  const textareaBaseStyles = 'block w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-200 ease-in-out resize-y';
  const labelStyles = 'block text-gray-700 text-sm font-medium mb-1';
  const errorTextStyles = 'text-error text-xs mt-1';
  const helperTextStyles = 'text-gray-500 text-xs mt-1';

  const textareaStateStyles = error
    ? 'border-error focus:ring-1 focus:ring-error focus:border-error'
    : 'border-gray-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-100';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`${textareaBaseStyles} ${textareaStateStyles}`}
        {...props}
      ></textarea>
      {error && helperText && <p className={errorTextStyles}>{helperText}</p>}
      {!error && helperText && <p className={helperTextStyles}>{helperText}</p>}
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
};

export default TextArea;