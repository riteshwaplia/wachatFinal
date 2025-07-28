import React, { useState, useEffect } from 'react';
import PropTypes, { object } from 'prop-types';

// Custom components
import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import Checkbox from './Checkbox';
import LoadingSpinner from './Loader';
import { MobileNumber } from './MobileNumber';
import CustomSelect from './CustomSelect';

const ContactForm = ({ initialData, onSubmit, onCancel, groups, isLoading, data }) => {
    const [phone, setPhone] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        groupIds: [],
        isBlocked: false,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                groupIds: initialData.groupIds
                    ? initialData.groupIds.map(group => group._id || group)
                    : [],
                isBlocked: initialData.isBlocked || false,
            });
            setPhone(initialData.mobileNumber || '');
        } else {
            setFormData({
                name: '',
                email: '',
                groupIds: [],
                isBlocked: false,
            });
            setPhone('');
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, options } = e.target;
        
        // Clear error for the field being changed
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (type === 'select-multiple') {
            const selectedValues = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
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

    const handlePhoneChange = (number) => {
        // Clear phone error when changing
        if (errors.phone) {
            setErrors(prev => ({ ...prev, phone: '' }));
        }
        setPhone(number);
    };

    const handleGroupChange = (selectedOptions) => {
        // Clear group error when changing
        if (errors.groupIds) {
            setErrors(prev => ({ ...prev, groupIds: '' }));
        }
        
        const selectedIds = Array.isArray(selectedOptions)
            ? selectedOptions.map(opt => opt.value)
            : selectedOptions?.value
                ? [selectedOptions.value]
                : [];
                
        setFormData(prev => ({
            ...prev,
            groupIds: selectedIds,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        if (!phone) {
            newErrors.phone = 'Phone number is required';
        }
        
        if (!formData.groupIds || formData.groupIds.length === 0) {
            newErrors.groupIds = 'Please select at least one group';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        onSubmit({ ...formData, mobileNumber: phone });
    };

    const handleCancel = () => {
        if (!initialData) {
            setFormData({
                name: '',
                email: '',
                groupIds: [],
                isBlocked: false,
            });
            setPhone('');
        }
        setErrors({});
        onCancel();
    };

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
                     value={(formData.name).replace(/[^a-zA-Z0-9]/g, '')}
                onChange={handleInputChange}
                error={errors.name}
            />
            
            <InputField
                id="contactEmail"
                label="Email *"
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
            />
            
            <div>
           
                <MobileNumber
                 
                    value={phone}
                    onChange={handlePhoneChange}
                    country="in"
                    autoattribute={true}
                   
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
            </div>
            
            <CustomSelect
                label="Groups *"
                options={groupOptions}
                placeholder="-- Select Groups --"
                value={groupOptions.filter(opt => formData.groupIds.includes(opt.value))}
                onChange={handleGroupChange}
                isMulti={true}
                error={errors.groupIds}
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
                    onClick={handleCancel}
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
    initialData: PropTypes.object, // Null or existing contact
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired, // [{ _id, title }]
    isLoading: PropTypes.bool,
    data: PropTypes.any,
};

export default ContactForm;