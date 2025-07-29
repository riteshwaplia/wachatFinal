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
import { ErrorToast, SuccessToast } from '../utils/Toast';
import { useTranslation } from 'react-i18next';

const WhatsappNumberRegistrationPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

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
        accessToken: '',
        metaAppId: ""
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
            console.log("first, res", res.data)
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
        console.log("clicked11111")
        if (!profile?.metaBusinessId || !profile?.metaAccessToken) {
            ErrorToast('Selected profile is missing required credentials');
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
            console.log("clicked")
            const res = await api.post('/whatsapp/phone-numbers', {
                wabaId: profile.metaBusinessId,
                accessToken: profile.metaAccessToken
            });

            if (res.data.success) {
                updateState({
                    phoneNumbers: res.data.data || [],
                    isFetchingNumbers: false,
                    message: res.data.message || (res.data.data?.length
                        ? `${res.data.data.length} numbers found`
                        : 'No numbers found'),
                    messageType: res.data.data?.length ? 'success' : 'info'
                });
                SuccessToast('Successfully fetched phone numbers');
            }
        } catch (error) {
            console.error('Error fetching numbers:', error);
            ErrorToast(`Error fetching WhatsApp numbers: ${error.response?.data?.message || 'Failed to fetch numbers.'}`);
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
                metaAccessToken: formData.accessToken,
                metaAppId: formData.metaAppId
            });
            if (res.data.success) {
                SuccessToast('Business profile created successfully!');
            }

            updateState({
                isLoading: false,
                message: res.data.message || 'Business profile created successfully!',
                messageType: 'success'
            });

            // Refresh profiles and reset form
            await fetchBusinessProfiles();
            setFormData({ name: '', wabaId: '', accessToken: '', metaAppId: '' });
            setIsAddBusinessModalOpen(false);

        } catch (error) {
            console.error('Error creating profile:', error);
            ErrorToast(`Error creating business profile: ${error.response?.data?.message || 'Failed to create profile.'}`);
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

            if (projectRes.data.success) {
                SuccessToast('WhatsApp number connected successfully!');
            }

            updateState({
                isLoading: false,
                message: projectRes.data.message || 'Number connected successfully!',
                messageType: 'success'
            });

            // Redirect after short delay
            setTimeout(() => navigate('/projects'), 1500);

        } catch (error) {
            ErrorToast(`Error connecting WhatsApp number: ${error.response?.data?.message || 'Failed to connect number.'}`);
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
        // Allow only alphanumeric characters, spaces, @ and _
        const isValid = /^[a-zA-Z0-9@_]*$/.test(value);
        if (!isValid) {
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // Loading state
    if (state.isLoading && !state.businessProfiles.length && !isAddBusinessModalOpen) {
        return <LoadingSpinner fullPage message={t('loadingBusinessProfiles')} />;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {t('whatsappBusinessIntegration')}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        {t('connectYourWhatsappBusinessAccount')}
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/projects')}
                    variant="outline"
                    size="sm"
                    className="mt-4 md:mt-0"
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    {t('backToProjects')}
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
                        {t('addBusinessProfile')}
                    </Button>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Building size={18} className="text-primary-600 mr-2" />
                            {t('yourBusinessProfiles')}
                        </h2>

                        {state.businessProfiles.length === 0 ? (
                            <EmptyState
                                title={t('noBusinessProfiles')}
                                description={t('addYourFirstBusinessProfile')}
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
                                        fetchBusinessProfiles={() => fetchBusinessProfiles()}
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
                                {t('whatsappNumbers')}
                            </h2>
                            {state.selectedProfile && (
                                <span className="text-sm text-gray-600">
                                    {state.selectedProfile.name}
                                </span>
                            )}
                        </div>

                        {state.isFetchingNumbers && !state.phoneNumbers.length ? (
                            <LoadingSpinner message={t('fetchingWhatsappNumbers')} className="py-8" />
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
                                    ? t('noWhatsappNumbersFound')
                                    : t('selectBusinessProfile')}
                                description={state.selectedProfile
                                    ? t('noPhoneNumbersAvailable')
                                    : t('chooseBusinessProfileToViewNumbers')}
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
                title={t('addBusinessProfile')}
                size="md"
            >
                <form onSubmit={createBusinessProfile} className="space-y-4">
                    <InputField
                        label={t('businessName')}
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder={t('businessNamePlaceholder')}
                        maxlength={50}
                        required
                    />
                    <InputField
                        label={t('whatsappBusinessAccountId')}
                        name="wabaId"
                        value={formData.wabaId}
                        onChange={handleFormChange}
                        placeholder={t('whatsappBusinessAccountIdPlaceholder')}
                        maxlength={60}
                        required
                    />
                    <InputField
                        label={t('whatsappBusinessAppId')}
                        name="metaAppId"
                        value={formData.metaAppId}
                        onChange={handleFormChange}
                        placeholder={t('whatsappBusinessAppIdPlaceholder')}
                        required
                        maxlength={60}

                    />
                    <InputField
                        label={t('metaAccessToken')}
                        name="accessToken"
                        type="password"
                        value={formData.accessToken}
                        onChange={handleFormChange}
                        placeholder={t('metaAccessTokenPlaceholder')}
                        required
                        // maxlength={500}
                    />
                    <div className="flex justify-end space-x-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddBusinessModalOpen(false)}
                        >
                            {t('cancel')}
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
                            {state.isLoading ? t('creating') : t('createProfile')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default WhatsappNumberRegistrationPage;