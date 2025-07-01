// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types'; // Recommended for type checking props

const Button = ({
  children,
  onClick,
  variant = 'primary', // primary, secondary, accent, outline, text
  size = 'md', // sm, md, lg
  disabled = false,
  className = '', // For additional custom classes
  ...props
}) => {
  let baseStyles = 'font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75';
  let variantStyles = '';
  let sizeStyles = '';

  // Size styles
  if (size === 'sm') {
    sizeStyles = 'py-2 px-4 text-sm';
  } else if (size === 'lg') {
    sizeStyles = 'py-3 px-8 text-lg';
  } else { // md
    sizeStyles = 'py-2.5 px-6 text-base';
  }

  // Variant styles based on our custom Tailwind colors
  switch (variant) {
    case 'secondary':
      variantStyles = 'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-white focus:ring-secondary-500';
      break;
    case 'accent':
      variantStyles = 'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white focus:ring-accent-500';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50 hover:text-primary-600 active:bg-primary-100 focus:ring-primary-500';
      break;
    case 'text':
      variantStyles = 'bg-transparent text-primary-500 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500';
      break;
    default: // primary
      variantStyles = 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white focus:ring-primary-500';
      break;
  }

  // Disabled styles
  if (disabled) {
    variantStyles = 'bg-gray-300 text-gray-500 cursor-not-allowed';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// PropTypes for better development experience and validation
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'text']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;