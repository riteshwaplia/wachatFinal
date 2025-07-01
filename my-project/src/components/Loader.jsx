// src/components/Loader.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({
  size = 'md', // sm, md, lg
  color = 'primary', // primary, secondary, accent, gray
  className = '',
  ...props
}) => {
  let sizeClasses = '';
  let colorClasses = '';

  switch (size) {
    case 'sm':
      sizeClasses = 'h-5 w-5 border-2';
      break;
    case 'lg':
      sizeClasses = 'h-12 w-12 border-4';
      break;
    default: // md
      sizeClasses = 'h-8 w-8 border-3';
      break;
  }

  switch (color) {
    case 'secondary':
      colorClasses = 'border-secondary-500';
      break;
    case 'accent':
      colorClasses = 'border-accent-500';
      break;
    case 'gray':
      colorClasses = 'border-gray-500';
      break;
    default: // primary
      colorClasses = 'border-primary-500';
      break;
  }

  return (
    <div
      className={`inline-block rounded-full animate-spin border-t-transparent ${sizeClasses} ${colorClasses} ${className}`}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span> {/* Screen reader only text */}
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'gray']),
  className: PropTypes.string,
};

export default Loader;