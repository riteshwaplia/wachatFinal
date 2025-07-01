// src/components/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, title, footer, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-custom-card overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  footer: PropTypes.node, // Can be string or JSX
  className: PropTypes.string,
};

export default Card;