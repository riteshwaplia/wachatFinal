import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

// Custom components
import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import Checkbox from './Checkbox';
import LoadingSpinner from './Loader';
import { MobileNumber } from './MobileNumber';
import CustomSelect from './CustomSelect';
import api from '../utils/api';

const ContactForm = ({ initialData, onSubmit, onCancel, groups, isLoading, fields }) => {
    const { id } = useParams();
    const [phone, setPhone] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        groupIds: [],
        isBlocked: false,
    });
    const [errors, setErrors] = useState({});
    const [customFields, setCustomFields] = useState([

    ]
    );

    console.log("fields", fields)

    useEffect(() => {
        // 1. Set initial form data
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                groupIds: initialData.groupIds
                    ? initialData.groupIds.map(group => group._id || group)
                    : [],
                isBlocked: initialData.isBlocked || false,
                ...initialData.customFields, // optional extra fields
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

        const excludedLabels = ["Full Name", "Email Address", "Phone Number", "Country Code"];

        const filteredFields = fields.filter(
            (field) => !excludedLabels.includes(field.label)
        );

        setCustomFields(filteredFields);

        // 2. Simulate API call to fetch fields

    }, [initialData, id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, options } = e.target;
        console.log("chnaged", value)
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }



        if (type === "text" || type === "textarea" || type === "email") {
            const isValid = /^[a-zA-Z0-9@_. ]*$/.test(value); // allow space, @, _, .
            if (!isValid) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "Special characters are not allowed",
                }));
                return; // Stop invalid update
            }
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
        if (errors.phone) {
            setErrors(prev => ({ ...prev, phone: '' }));
        }
        setPhone(number);
    };

    const handleGroupChange = (selectedOptions) => {
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

        if (formData.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters long";
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

        // Validate custom fields
        customFields.forEach(field => {
            if (field.required && !formData[field.label]) {
                newErrors[field.label] = `${field.label} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    console.log("formData>>>>", formData,)

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

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
        <div className="max-h-[700px] overflow-y-auto p-4 border dark:border-dark-border rounded-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    id="contactName"
                    label="Name *"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={(formData.name)}
                    onChange={handleInputChange}
                    error={errors.name}
                    helperText={errors.name}

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
                    helperText={errors.email}
                />

                <div>
                    <MobileNumber
                        value={phone}
                        onChange={handlePhoneChange}
                        country="in"
                        autoattribute={true}
                        isDarkMode={localStorage.getItem('theme')}
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
                    helperText={errors.groupIds}
                />

                {/* Dynamic Custom Fields */}
                {customFields.map(field => (
                    <InputField
                        key={field.label}
                        id={field.label}
                        label={field.label + (field.required ? ' *' : '')}
                        name={field.label}
                        type={field.type}
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.label] || ''}
                        onChange={handleInputChange}
                        error={errors[field.label]}
                        helperText={errors[field.label]}
                    />
                ))}

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
        </div>
    );
};

ContactForm.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    data: PropTypes.any,
};

export default ContactForm;
