// src/components/Badge.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({
  children,
  type = 'info', // info, primary, success, warning, error, accent, gray
  variant = 'solid', // solid, outline
  size = 'md', // sm, md
  className = '',
  ...props
}) => {
  let baseStyles = 'inline-flex items-center font-medium rounded-full';
  let typeStyles = '';
  let sizeStyles = '';

  // Size styles
  if (size === 'sm') {
    sizeStyles = 'px-2 py-0.5 text-xs';
  } else { // md
    sizeStyles = 'px-2.5 py-0.5 text-sm';
  }

  // Type and variant styles
  if (variant === 'outline') {
    switch (type) {
      case 'primary': typeStyles = 'text-primary-700 border border-primary-400 bg-primary-50'; break;
      case 'secondary': typeStyles = 'text-secondary-700 border border-secondary-400 bg-secondary-50'; break;
      case 'accent': typeStyles = 'text-accent-700 border border-accent-400 bg-accent-50'; break;
      case 'success': typeStyles = 'text-success border border-success/40 bg-success/10'; break;
      case 'warning': typeStyles = 'text-warning border border-warning/40 bg-warning/10'; break;
      case 'error': typeStyles = 'text-error border border-error/40 bg-error/10'; break;
      case 'gray': typeStyles = 'text-gray-700 border border-gray-300 bg-gray-100'; break;
      default: // info
        typeStyles = 'text-info border border-info/40 bg-info/10'; break;
    }
  } else { // solid
    switch (type) {
      case 'primary': typeStyles = 'bg-primary-500 text-white'; break;
      case 'secondary': typeStyles = 'bg-secondary-500 text-white'; break;
      case 'accent': typeStyles = 'bg-accent-500 text-white'; break;
      case 'success': typeStyles = 'bg-success text-white'; break;
      case 'warning': typeStyles = 'bg-warning text-gray-900'; break;
      case 'error': typeStyles = 'bg-error text-white'; break;
      case 'gray': typeStyles = 'bg-gray-300 text-gray-800'; break;
      default: // info
        typeStyles = 'bg-info text-white'; break;
    }
  }

  return (
    <span className={`${baseStyles} ${typeStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'gray']),
  variant: PropTypes.oneOf(['solid', 'outline']),
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string,
};

export default Badge;