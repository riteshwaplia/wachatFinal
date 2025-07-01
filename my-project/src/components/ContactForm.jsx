// src/components/ContactForm.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Import custom UI components
import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import Checkbox from './Checkbox';
import LoadingSpinner from './Loader'; // For button loading state

const ContactForm = ({ initialData, onSubmit, onCancel, groups, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '', // Changed from 'phone' to 'mobileNumber' based on schema
        groupIds: [],
        isBlocked: false, // Include isBlocked in form data if it can be set/unset directly
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                mobileNumber: initialData.mobileNumber || '', // Ensure mobileNumber
                // Map group IDs for multi-select. If groupIds is an array of objects, extract _id.
                groupIds: initialData.groupIds ? initialData.groupIds.map(group => group._id || group) : [],
                isBlocked: initialData.isBlocked || false,
            });
        } else {
            // Reset form for new contact
            setFormData({
                name: '',
                email: '',
                mobileNumber: '',
                groupIds: [],
                isBlocked: false,
            });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, options } = e.target;
        if (type === 'select-multiple') {
            const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
            setFormData(prev => ({
                ...prev,
                [name]: selectedValues,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Prepare options for the groups SelectField
    const groupOptions = groups.map(group => ({
        value: group._id,
        label: group.title,
    }));

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                id="contactName"
                label="Name *"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
            />
            <InputField
                id="contactEmail"
                label="Email"
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
            />
            <InputField
                id="contactPhone"
                label="Mobile Number *" // Updated label
                type="text" // Use text for phone numbers to allow various formats
                name="mobileNumber" // Updated name
                placeholder="+1234567890"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
            />
            <SelectField
                id="contactGroups"
                label="Groups (hold Ctrl/Cmd to select multiple)"
                name="groupIds"
                value={formData.groupIds}
                onChange={handleInputChange}
                options={groupOptions}
                multiple // Enable multi-select
                size={5} // Show 5 options by default
            />
            <Checkbox
                id="isBlocked"
                label="Block Contact"
                name="isBlocked"
                checked={formData.isBlocked}
                onChange={handleInputChange}
            />

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner size="sm" color="white" className="mr-2" />
                            <span>{initialData ? 'Updating...' : 'Creating...'}</span>
                        </>
                    ) : (
                        initialData ? 'Update Contact' : 'Create Contact'
                    )}
                </Button>
            </div>
        </form>
    );
};

ContactForm.propTypes = {
    initialData: PropTypes.object, // Can be null for new contacts
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired, // Array of group objects { _id, title }
    isLoading: PropTypes.bool,
};

export default ContactForm;
