// src/components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiLoader } from 'react-icons/fi'; // Using Feather Icons for spinner

const Button = ({
  type='button',
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  let baseStyles = 'font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 flex items-center justify-center';
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

  // Variant styles
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

  // Disabled and loading styles
  if (disabled || loading) {
    variantStyles = 'bg-gray-300 text-gray-500 cursor-not-allowed';
  }

  // Handle click with loading state
  const handleClick = (e) => {
    if (!loading && !disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <FiLoader className="animate-spin mr-2" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'text']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;