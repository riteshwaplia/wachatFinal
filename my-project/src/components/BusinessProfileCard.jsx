// src/components/BusinessProfileCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Button  from './Button';
import { Link as LinkIcon } from 'lucide-react';
import LoadingSpinner from './Loader';

const BusinessProfileCard = ({ profile, isSelected, isFetching, onClick }) => {
  return (
    <div
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'bg-primary-50 border-primary-300 shadow-md'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <h4 className="text-lg font-semibold text-primary-700 mb-2">{profile.name}</h4>
      <p className="text-gray-600 text-sm mb-3">WABA ID: {profile.metaBusinessId}</p>
      <Button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        variant={isSelected ? 'primary' : 'outline'}
        size="sm"
        className="w-full"
        disabled={isFetching}
      >
        {isFetching ? (
          <LoadingSpinner size="sm" color={isSelected ? 'white' : 'primary'} className="mr-2" />
        ) : (
          <LinkIcon size={16} className="mr-2" />
        )}
        {isFetching ? 'Fetching...' : 'Fetch Numbers'}
      </Button>
    </div>
  );
};

BusinessProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  isFetching: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default BusinessProfileCard;