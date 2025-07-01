import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlusCircle, Link as LinkIcon, Building, Phone, ChevronLeft } from 'lucide-react';

// Import UI components
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/Loader';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import BusinessProfileCard from '../components/BusinessProfileCard';
import PhoneNumberCard from '../components/PhoneNumberCard';

const WhatsappNumberRegistrationPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State management
    const [state, setState] = useState({
        businessProfiles: [],
        selectedProfile: null,
        phoneNumbers: [],
        isLoading: false,
        isFetchingNumbers: false,
        message: '',
        messageType: 'info'
    });

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        wabaId: '',
        accessToken: ''
    });

    const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);

    // Helper function to update state
    const updateState = (updates) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    // --- Fetch Business Profiles ---
    const fetchBusinessProfiles = useCallback(async () => {
        updateState({
            isLoading: true,
            message: '',
            messageType: 'info'
        });

        try {
            const res = await api.get('/users/business-profiles');
            const profiles = res.data.data || [];
            
            updateState({
                businessProfiles: profiles,
                isLoading: false,
                message: profiles.length ? '' : 'No business profiles found',
                messageType: profiles.length ? 'info' : 'info'
            });
            
        } catch (error) {
            console.error('Error fetching business profiles:', error);
            updateState({
                isLoading: false,
                message: `Error fetching business profiles: ${error.response?.data?.message || 'Failed to fetch profiles.'}`,
                messageType: 'error'
            });
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchBusinessProfiles();
        } else {
            navigate('/login', { replace: true });
        }
    }, [user, navigate, fetchBusinessProfiles]);

    // --- Fetch Phone Numbers ---
    const fetchPhoneNumbers = async (profile) => {
        if (!profile?.metaBusinessId || !profile?.metaAccessToken) {
            updateState({
                message: 'Selected profile is missing required credentials',
                messageType: 'warning'
            });
            return;
        }

        updateState({
            selectedProfile: profile,
            isFetchingNumbers: true,
            message: '',
            phoneNumbers: []
        });

        try {
            const res = await api.post('/whatsapp/phone-numbers', {
                wabaId: profile.metaBusinessId,
                accessToken: profile.metaAccessToken
            });

            updateState({
                phoneNumbers: res.data.data || [],
                isFetchingNumbers: false,
                message: res.data.message || (res.data.data?.length 
                    ? `${res.data.data.length} numbers found` 
                    : 'No numbers found'),
                messageType: res.data.data?.length ? 'success' : 'info'
            });
            
        } catch (error) {
            console.error('Error fetching numbers:', error);
            updateState({
                isFetchingNumbers: false,
                message: `Error fetching WhatsApp numbers: ${error.response?.data?.message || 'Failed to fetch numbers.'}`,
                messageType: 'error'
            });
        }
    };

    // --- Create New Business Profile ---
    const createBusinessProfile = async (e) => {
        e.preventDefault();
        updateState({ isLoading: true });

        try {
            const res = await api.post('/users/business-profiles', {
                name: formData.name,
                metaBusinessId: formData.wabaId,
                metaAccessToken: formData.accessToken
            });

            updateState({
                isLoading: false,
                message: res.data.message || 'Business profile created successfully!',
                messageType: 'success'
            });
            
            // Refresh profiles and reset form
            await fetchBusinessProfiles();
            setFormData({ name: '', wabaId: '', accessToken: '' });
            setIsAddBusinessModalOpen(false);
            
        } catch (error) {
            console.error('Error creating profile:', error);
            updateState({
                isLoading: false,
                message: `Error creating business profile: ${error.response?.data?.message || 'Failed to create profile.'}`,
                messageType: 'error'
            });
        }
    };

    // --- Connect Number ---
    const connectNumber = async (numberData) => {
        if (!state.selectedProfile) {
            updateState({
                message: 'No business profile selected',
                messageType: 'error'
            });
            return;
        }

        updateState({ isLoading: true });

        try {
            const projectRes = await api.post('/project', {
                name: numberData.verified_name || `WhatsApp - ${numberData.display_phone_number}`,
                description: `Connected to ${numberData.display_phone_number}`,
                businessProfileId: state.selectedProfile._id,
                isWhatsappVerified: true,
                assistantName: `Bot for ${numberData.display_phone_number}`,
                metaPhoneNumberID: numberData.id,
                whatsappNumber: numberData.display_phone_number,
                activePlan: 'Standard',
                planDuration: 365
            });

            updateState({
                isLoading: false,
                message: projectRes.data.message || 'Number connected successfully!',
                messageType: 'success'
            });
            
            // Redirect after short delay
            setTimeout(() => navigate('/projects'), 1500);
            
        } catch (error) {
            console.error('Error connecting number:', error);
            updateState({
                isLoading: false,
                message: `Error: ${error.response?.data?.message || 'Failed to connect WhatsApp number.'}`,
                messageType: 'error'
            });
        }
    };

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Loading state
    if (state.isLoading && !state.businessProfiles.length && !isAddBusinessModalOpen) {
        return <LoadingSpinner fullPage message="Loading business profiles..." />;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        WhatsApp Business Integration
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Connect your WhatsApp Business Account to manage phone numbers
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/projects')}
                    variant="outline"
                    size="sm"
                    className="mt-4 md:mt-0"
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Projects
                </Button>
            </div>

            {/* Status Alert */}
            {state.message && (
                <Alert 
                    type={state.messageType} 
                    message={state.message}
                    className="mb-6"
                    onDismiss={() => updateState({ message: '', messageType: 'info' })}
                />
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Business Profiles */}
                <div className="lg:col-span-1 space-y-4">
                    <Button
                        onClick={() => setIsAddBusinessModalOpen(true)}
                        variant="primary"
                        size="lg"
                        className="w-full"
                        icon={<PlusCircle size={18} className="mr-2" />}
                    >
                        Add Business Profile
                    </Button>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Building size={18} className="text-primary-600 mr-2" />
                            Your Business Profiles
                        </h2>

                        {state.businessProfiles.length === 0 ? (
                            <EmptyState
                                title="No Business Profiles"
                                description="Add your first business profile to get started"
                                icon={<Building size={24} className="text-gray-400" />}
                            />
                        ) : (
                            <div className="space-y-3">
                                {state.businessProfiles.map(profile => (
                                    <BusinessProfileCard
                                        key={profile._id}
                                        profile={profile}
                                        isSelected={state.selectedProfile?._id === profile._id}
                                        isFetching={state.isFetchingNumbers && state.selectedProfile?._id === profile._id}
                                        onClick={() => fetchPhoneNumbers(profile)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Phone Numbers */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <Phone size={18} className="text-primary-600 mr-2" />
                                WhatsApp Numbers
                            </h2>
                            {state.selectedProfile && (
                                <span className="text-sm text-gray-600">
                                    {state.selectedProfile.name}
                                </span>
                            )}
                        </div>

                        {state.isFetchingNumbers && !state.phoneNumbers.length ? (
                            <LoadingSpinner message="Fetching WhatsApp numbers..." className="py-8" />
                        ) : state.phoneNumbers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {state.phoneNumbers.map(number => (
                                    <PhoneNumberCard
                                        key={number.id}
                                        number={number}
                                        onConnect={connectNumber}
                                        isLoading={state.isLoading}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title={state.selectedProfile 
                                    ? "No WhatsApp Numbers Found" 
                                    : "Select a Business Profile"}
                                description={state.selectedProfile
                                    ? "No phone numbers available for this business account"
                                    : "Choose a business profile from the left to view associated numbers"}
                                icon={<Phone size={24} className="text-gray-400" />}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Add Business Profile Modal */}
            <Modal
                isOpen={isAddBusinessModalOpen}
                onClose={() => setIsAddBusinessModalOpen(false)}
                title="Add Business Profile"
                size="md"
            >
                <form onSubmit={createBusinessProfile} className="space-y-4">
                    <InputField
                        label="Business Name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="e.g., My Main Business"
                        required
                    />
                    <InputField
                        label="WhatsApp Business Account ID"
                        name="wabaId"
                        value={formData.wabaId}
                        onChange={handleFormChange}
                        placeholder="e.g., 123456789012345"
                        required
                    />
                    <InputField
                        label="Meta Access Token"
                        name="accessToken"
                        type="password"
                        value={formData.accessToken}
                        onChange={handleFormChange}
                        placeholder="Bearer EAAI..."
                        required
                    />
                    <div className="flex justify-end space-x-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddBusinessModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={state.isLoading}
                            className="min-w-[120px]"
                        >
                            {state.isLoading ? (
                                <LoadingSpinner size="sm" color="white" className="mr-2" />
                            ) : null}
                            {state.isLoading ? 'Creating...' : 'Create Profile'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default WhatsappNumberRegistrationPage;