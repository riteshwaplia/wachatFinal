import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { Link as LinkIcon } from 'lucide-react';
import LoadingSpinner from './Loader';
import { FiEdit } from "react-icons/fi";
import Modal from './Modal';
import InputField from './InputField';
import axios from 'axios';
import api from '../utils/api';
import { ErrorToast, SuccessToast } from '../utils/Toast';


const BusinessProfileCard = ({ profile, isSelected, isFetching, onClick, fetchBusinessProfiles }) => {
  const [loading, setLoading] = useState(false);
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
    // ✅ Allow letters, numbers, underscore, and spaces only
    const isValid = /^[a-zA-Z0-9_\s]*$/.test(value);

    if (!isValid) {
      setErrors((prev) => ({ ...prev, [key]: "Only letters, numbers, spaces, and underscore (_) are allowed" }));
      return;
    }

    // ✅ For name field, check minimum 3 characters if not empty
    if (key === "name" && value.trim().length > 0 && value.trim().length < 3) {
      setErrors((prev) => ({ ...prev, [key]: "Name must be at least 3 characters long" }));
    } else {
      // ✅ Clear error if valid
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    // ✅ Update state
    setBusinessData((prev) => ({ ...prev, [key]: value }));
  };


  const updateBusinessProfile = async (id, data) => {
    return api.put(`/users/business-profiles/${id}`, data);
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    const newErrors = {};
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
      newErrors.metaAppId = "Meta App Id is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await updateBusinessProfile(profile._id, businessdata);
      console.log("Response:", res);

      const { success, message } = res.data || {};

      if (success) {
        // ✅ Success toast
        SuccessToast(message || "Business profile updated successfully!");

        // ✅ Refresh data
        await fetchBusinessProfiles();

        // ✅ Close modal after success
        setModelOpen(false);
      } else {
        // ❌ Error toast for backend failure
        ErrorToast(message || "Unable to update business profile.");
      }

    } catch (error) {
      console.error("Error updating business profile:", error);
      // ❌ Error toast for network/exception
      ErrorToast(error.response?.data?.message || "Something went wrong while updating the profile.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className={`p-4 rounded-lg border transition-all  ${isSelected
        ? 'bg-primary-50 border-primary-300 shadow-md'
        : 'border-gray-200 hover:bg-gray-50'
        }`}
    // onClick={onClick}
    >
      {
        modalOpen && <Modal
          isOpen={modalOpen}
          onClose={() => setModelOpen(false)}
          title="Edit Business Profile"
        >
          <div className="text-gray-700">
            {/* Your modal content here */}
            <form onSubmit={submitHandler} className="space-y-4">
              <InputField
                label="Business Name"
                name="name"
                value={businessdata.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., My Main Business"
                error={errros.name}
                helperText={errros.name}
                maxlength={50}


              />
              <InputField
                disabled
                label="WhatsApp Business Account ID"
                name="wabaId"
                value={businessdata.wabaId}
                onChange={(e) => handleChange("wabaId", e.target.value)}
                placeholder="e.g., 123456789012345"
                maxlength={50}
                type='number'
                error={errros.wabaId}
                helperText={errros.wabaId}

              />

              <InputField

                label="WhatsApp metaAppId ID"
                name="metaAppId"
                value={businessdata.metaAppId}
                onChange={(e) => handleChange("metaAppId", e.target.value)}
                placeholder="e.g., 123456789012345"
                maxlength={50}
                type='number'
                error={errros.metaAppId}
                helperText={errros.metaAppId}

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
              <Button loading={loading} type='submit' className='block ml-auto mt-3'>Update</Button>
            </form>
          </div>
        </Modal>
      }
      <div className='flex items-center justify-between'>
        <h4 className="text-lg font-semibold text-primary-700 mb-2">{profile.name?.length > 30 ? profile.name.slice(0, 30) + '…' : profile.name}
        </h4>
        <FiEdit className='cursor-pointer' onClick={(e) => { e.stopPropagation(), setModelOpen(true) }} />
      </div>
      <p className="text-gray-600 text-sm mb-3">WABA ID: {profile.metaBusinessId}</p>
      <Button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
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
  onClick: PropTypes.func.isRequired
};

export default BusinessProfileCard;
