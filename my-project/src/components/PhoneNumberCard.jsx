// src/components/PhoneNumberCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import  Button  from './Button';
import LoadingSpinner from './Loader';

const PhoneNumberCard = ({ number, onConnect, isLoading }) => {
  return (
    <div className="p-4 border border-gray-200 dark:text-white rounded-lg hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{number.display_phone_number}</h4>
        <p className="text-gray-700 dark:text-white text-sm mb-1">
          <span className="font-medium dark:text-white">Name:</span> {number.verified_name || 'N/A'}
        </p>
        <p className="text-gray-700 text-sm dark:text-white">
          <span className="font-medium">Status:</span> {number.status || 'N/A'}
        </p>
      </div>
      <Button
        onClick={() => onConnect(number)}
        variant="primary"
        size="md"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingSpinner size="sm" color="white" className="mr-2" />
        ) : null}
        {isLoading ? 'Connecting...' : 'Connect to Project'}
      </Button>
    </div>
  );
};

PhoneNumberCard.propTypes = {
  number: PropTypes.object.isRequired,
  onConnect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default PhoneNumberCard;