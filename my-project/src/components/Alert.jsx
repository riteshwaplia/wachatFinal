// src/components/Alert.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({
  message,
  type = 'info', // info, success, warning, error
  className = '',
  children, // Allows more complex content than just a message string
  ...props
}) => {
  let baseStyles = 'p-4 rounded-lg flex items-center justify-between text-sm';
  let typeStyles = '';
  let icon = null; // You might add actual icons here (e.g., using Heroicons)

  switch (type) {
    case 'success':
      typeStyles = 'bg-success/10 text-success border border-success/30';
      // icon = (/* <svg for success /> */); // Example: Add an SVG icon here
      break;
    case 'warning':
      typeStyles = 'bg-warning/10 text-warning border border-warning/30';
      // icon = (/* <svg for warning /> */);
      break;
    case 'error':
      typeStyles = 'bg-error/10 text-error border border-error/30';
      // icon = (/* <svg for error /> */);
      break;
    default: // info
      typeStyles = 'bg-info/10 text-info border border-info/30';
      // icon = (/* <svg for info /> */);
      break;
  }

  return (
    <div className={`${baseStyles} ${typeStyles} ${className}`} role="alert" {...props}>
      <div className="flex items-center">
        {icon && <span className="mr-3">{icon}</span>}
        {message ? <span>{message}</span> : children}
      </div>
      {/* Optionally add a dismiss button here if needed */}
      {/* <button className="ml-4 text-current opacity-75 hover:opacity-100">X</button> */}
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  className: PropTypes.string,
  children: PropTypes.node, // Can be used instead of message for richer content
};

export default Alert;
