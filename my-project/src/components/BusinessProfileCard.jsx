import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { Link as LinkIcon } from 'lucide-react';
import LoadingSpinner from './Loader';
import { FiEdit } from 'react-icons/fi';
import Modal from './Modal';
import InputField from './InputField';
import api from '../utils/api';

const BusinessProfileCard = ({ profile, isSelected, isFetching, onClick, fetchBusinessProfiles }) => {
  // const [businessData, setBusinessData] = useState({
  //   name: profile.name || '',
  //   wabaId: profile.metaBusinessId || '',
  //   metaAccessToken: profile.metaAccessToken || '',
  //   metaAppId: profile.metaAppId || '',
  // });

  const [businessdata, setBusinessData] = useState(
    {
      name: profile.name,
      wabaId: profile.metaBusinessId,
      metaAccessToken: profile.metaAccessToken,
      metaAppId: profile.metaAppId
    }

  )
  const [errros, setErrors] = useState({});
  const [modalOpen, setModelOpen] = useState(false);

  const handleChange = (key, value) => {
    setBusinessData(prev => ({ ...prev, [key]: value }));

    if (key === 'name' || key === 'metaAppId') {
      const isValid = /^[a-zA-Z0-9\s]*$/.test(value);
      if (!isValid) {
        setErrors(prev => ({ ...prev, [key]: 'Special characters are not allowed' }));
        return;
      }
    }

    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const updateBusinessProfile = async (id, data) => {
    return api.put(`/users/business-profiles/${id}`, data);
  };

  const submitHandler = async e => {
    e.preventDefault();
    if (!businessdata.name) {
      newErrors.name = "Business name is required";
    }
    if (!businessdata.wabaId) {
      newErrors.wabaId = "Whatsapp Business Id is required";
    }
    if (!businessdata.metaAccessToken) {
      newErrors.metaAccessToken = "Access Token is required";
    }
    if (!businessdata.metaAppId) {
      newErrors.metaAppId = "metaAppId "
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await updateBusinessProfile(profile._id, businessData);

      if (res.data?.success === true) {
        fetchBusinessProfiles?.();
      } else {
        console.log('Unable to update business profile');
      }

      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isSelected ? 'bg-primary-50 border-primary-300 shadow-md' : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit Business Profile">
          <div className="text-gray-700">
            <form onSubmit={submitHandler} className="space-y-4">
              <InputField
                label="Business Name"
                name="name"
                value={businessData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g., My Main Business"
                error={errors.name}
                helperText={errors.name}
              />

              <InputField
                disabled
                label="WhatsApp Business Account ID"
                name="wabaId"
                value={businessData.wabaId}
                onChange={e => handleChange('wabaId', e.target.value)}
                placeholder="e.g., 123456789012345"
                error={errors.wabaId}
                helperText={errors.wabaId}
              />

              <InputField
                label="WhatsApp metaAppId"
                name="metaAppId"
                value={businessData.metaAppId}
                onChange={e => handleChange('metaAppId', e.target.value)}
                placeholder="e.g., 123456789012345"
                error={errors.metaAppId}
                helperText={errors.metaAppId}
              />

              <InputField
                label="Meta Access Token"
                name="metaAccessToken"
                type="password"
                value={businessdata.metaAccessToken}
                onChange={(e) => handleChange("metaAccessToken", e.target.value)}
                placeholder="Bearer EAAI..."
                helperText={errros.metaAccessToken}
                error={errros.metaAccessToken}

              />
              <Button type='submit' className='block ml-auto mt-3'>Update</Button>
            </form>
          </div>
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-primary-700 mb-2">{profile.name}</h4>
        <FiEdit
          className="cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            setModalOpen(true);
          }}
        />
      </div>

      <p className="text-gray-600 text-sm mb-3">WABA ID: {profile.metaBusinessId}</p>

      <Button
        onClick={e => {
          e.stopPropagation();
          onClick();
        }}
        variant={isSelected ? 'primary' : 'outline'}
        size="sm"
        disabled={isFetching}
        className="flex justify-center gap-2 items-center mx-auto w-full"
      >
        {isFetching ? (
          <LoadingSpinner size="sm" color={isSelected ? 'white' : 'primary'} className="mr-2 " />
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
  onClick: PropTypes.func.isRequired,
  fetchBusinessProfiles: PropTypes.func,
};

export default BusinessProfileCard;
