// src/components/EmptyState.jsx
import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ title, description, icon, className = '', children }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      {title && <h3 className="text-lg font-medium dark:text-dark-text-primary
 text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {children}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node
};

export default EmptyState;