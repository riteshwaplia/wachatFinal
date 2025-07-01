// src/components/Avatar.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({
  src,
  alt = 'User Avatar',
  size = 'md', // sm, md, lg, xl
  className = '',
  initials, // Optional: for fallback if src is not provided
  ...props
}) => {
  let sizeClasses = '';
  let fontSize = '';

  switch (size) {
    case 'sm':
      sizeClasses = 'h-8 w-8';
      fontSize = 'text-sm';
      break;
    case 'lg':
      sizeClasses = 'h-16 w-16';
      fontSize = 'text-2xl';
      break;
    case 'xl':
      sizeClasses = 'h-24 w-24';
      fontSize = 'text-4xl';
      break;
    default: // md
      sizeClasses = 'h-12 w-12';
      fontSize = 'text-xl';
      break;
  }

  const baseClasses = `rounded-full flex items-center justify-center font-semibold overflow-hidden flex-shrink-0 ${sizeClasses} ${className}`;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${baseClasses} object-cover`}
        {...props}
      />
    );
  } else {
    // Fallback to initials if no image src is provided
    const bgColor = 'bg-primary-500'; // Default background for initials
    const textColor = 'text-white';
    return (
      <div className={`${baseClasses} ${bgColor} ${textColor} ${fontSize}`} {...props}>
        {initials || alt.substring(0, 1).toUpperCase()}
      </div>
    );
  }
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  initials: PropTypes.string,
};

export default Avatar;