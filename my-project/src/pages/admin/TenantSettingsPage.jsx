import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import InputField from '../../components/InputField'; // Renamed from Input for consistency
import api from '../../utils/api';
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi'; // Icons for add/remove testimonial

const TenantSettingsPage = () => {
    const { token } = useAuth();
    const { siteConfig, loading: tenantConfigLoading } = useTenant();
    const [tenantSettings, setTenantSettings] = useState({
        websiteName: '',
        faviconUrl: '',
        metaApi: {
            wabaId: '',
            accessToken: '',
            appId: '',
            facebookUrl: 'https://graph.facebook.com',
            graphVersion: 'v19.0',
        },
        // NEW FIELDS
        logoUrl: '',
        heroSection: {
            image: '',
            title: '',
            subtitle: '',
            buttonText: '',
            buttonLink: ''
        },
        testimonials: [], // Array of testimonial objects
        aboutUsText: '',
        contactInfo: {
            email: '',
            phone: '',
            address: ''
        },
        socialMediaLinks: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
        },
        privacyPolicyUrl: '',
        termsOfServiceUrl: '',
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!tenantConfigLoading && siteConfig) {
            setTenantSettings({
                websiteName: siteConfig.websiteName || '',
                faviconUrl: siteConfig.faviconUrl || '',
                metaApi: {
                    wabaId: siteConfig.metaApi?.wabaId || '',
                    accessToken: siteConfig.metaApi?.accessToken || '',
                    appId: siteConfig.metaApi?.appId || '',
                    facebookUrl: siteConfig.metaApi?.facebookUrl || 'https://graph.facebook.com',
                    graphVersion: siteConfig.metaApi?.graphVersion || 'v19.0',
                },
                // NEW FIELDS POPULATION
                logoUrl: siteConfig.logoUrl || '',
                heroSection: {
                    image: siteConfig.heroSection?.image || '',
                    title: siteConfig.heroSection?.title || '',
                    subtitle: siteConfig.heroSection?.subtitle || '',
                    buttonText: siteConfig.heroSection?.buttonText || '',
                    buttonLink: siteConfig.heroSection?.buttonLink || '',
                },
                testimonials: siteConfig.testimonials || [],
                aboutUsText: siteConfig.aboutUsText || '',
                contactInfo: {
                    email: siteConfig.contactInfo?.email || '',
                    phone: siteConfig.contactInfo?.phone || '',
                    address: siteConfig.contactInfo?.address || '',
                },
                socialMediaLinks: {
                    facebook: siteConfig.socialMediaLinks?.facebook || '',
                    twitter: siteConfig.socialMediaLinks?.twitter || '',
                    linkedin: siteConfig.socialMediaLinks?.linkedin || '',
                    instagram: siteConfig.socialMediaLinks?.instagram || '',
                },
                privacyPolicyUrl: siteConfig.privacyPolicyUrl || '',
                termsOfServiceUrl: siteConfig.termsOfServiceUrl || '',
            });
        }
    }, [siteConfig, tenantConfigLoading]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setTenantSettings(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleMetaApiChange = (e) => {
        const { name, value } = e.target;
        setTenantSettings(prev => ({
            ...prev,
            metaApi: {
                ...prev.metaApi,
                [name]: value
            }
        }));
    };

    // Handler for nested heroSection fields
    const handleHeroSectionChange = (e) => {
        const { name, value } = e.target;
        setTenantSettings(prev => ({
            ...prev,
            heroSection: {
                ...prev.heroSection,
                [name]: value
            }
        }));
    };

    // Handler for nested contactInfo fields
    const handleContactInfoChange = (e) => {
        const { name, value } = e.target;
        setTenantSettings(prev => ({
            ...prev,
            contactInfo: {
                ...prev.contactInfo,
                [name]: value
            }
        }));
    };

    // Handler for nested socialMediaLinks fields
    const handleSocialMediaLinksChange = (e) => {
        const { name, value } = e.target;
        setTenantSettings(prev => ({
            ...prev,
            socialMediaLinks: {
                ...prev.socialMediaLinks,
                [name]: value
            }
        }));
    };

    // Handlers for testimonials array
    const handleAddTestimonial = () => {
        setTenantSettings(prev => ({
            ...prev,
            testimonials: [...prev.testimonials, { quote: '', author: '', designation: '' }]
        }));
    };

    const handleRemoveTestimonial = (indexToRemove) => {
        setTenantSettings(prev => ({
            ...prev,
            testimonials: prev.testimonials.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleTestimonialChange = (index, field, value) => {
        setTenantSettings(prev => {
            const updatedTestimonials = [...prev.testimonials];
            updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
            return {
                ...prev,
                testimonials: updatedTestimonials
            };
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            
            // Send the entire tenantSettings object, backend will pick relevant fields
            await api.put(`/tenants/${siteConfig._id}`, tenantSettings, config);
            setMessage({ text: 'Settings updated successfully!', type: 'success' });
        } catch (error) {
            console.error('Error updating settings:', error);
            setMessage({ 
                text: `Error: ${error.response?.data?.message || 'Failed to update settings'}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (tenantConfigLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Tenant Settings</h1>
            </div>
            
            {message.text && (
                <div className={`mb-6 p-3 rounded-md ${
                    message.type === 'error' 
                        ? 'bg-red-100 text-red-800' // Changed from error-100/800
                        : 'bg-green-100 text-green-800' // Changed from success-100/800
                }`}>
                    {message.text}
                </div>
            )}

            <Card>
                <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                    {/* General Settings Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">General Website Settings</h3>
                        
                        <div className="space-y-4">
                            <InputField
                                label="Website Name"
                                id="websiteName"
                                value={tenantSettings.websiteName}
                                onChange={handleChange}
                                required
                            />
                            
                            <InputField
                                label="Favicon URL"
                                id="faviconUrl"
                                type="url"
                                value={tenantSettings.faviconUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/favicon.ico"
                            />

                            <InputField
                                label="Logo URL"
                                id="logoUrl"
                                type="url"
                                value={tenantSettings.logoUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                            />
                        </div>
                    </div>

                    {/* Hero Section Settings */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Hero Section Content</h3>
                        <div className="space-y-4">
                            <InputField
                                label="Hero Image URL"
                                id="image"
                                name="image"
                                type="url"
                                value={tenantSettings.heroSection.image}
                                onChange={handleHeroSectionChange}
                                placeholder="https://example.com/hero-bg.jpg"
                            />
                            <InputField
                                label="Hero Title"
                                id="title"
                                name="title"
                                value={tenantSettings.heroSection.title}
                                onChange={handleHeroSectionChange}
                                placeholder="Welcome to Our Amazing Service"
                            />
                            <InputField
                                label="Hero Subtitle"
                                id="subtitle"
                                name="subtitle"
                                value={tenantSettings.heroSection.subtitle}
                                onChange={handleHeroSectionChange}
                                placeholder="Discover how we can help your business grow."
                            />
                            <InputField
                                label="Hero Button Text"
                                id="buttonText"
                                name="buttonText"
                                value={tenantSettings.heroSection.buttonText}
                                onChange={handleHeroSectionChange}
                                placeholder="Get Started"
                            />
                            <InputField
                                label="Hero Button Link"
                                id="buttonLink"
                                name="buttonLink"
                                type="url"
                                value={tenantSettings.heroSection.buttonLink}
                                onChange={handleHeroSectionChange}
                                placeholder="/contact-us"
                            />
                        </div>
                    </div>

                    {/* About Us Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">About Us Content</h3>
                        <InputField
                            label="About Us Text"
                            id="aboutUsText"
                            value={tenantSettings.aboutUsText}
                            onChange={handleChange}
                            textarea // Use textarea for longer text
                            rows="5"
                            placeholder="Tell your story, mission, and values here..."
                        />
                    </div>

                    {/* Testimonials Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4 flex justify-between items-center">
                            Testimonials
                            <Button
                                type="button"
                                onClick={handleAddTestimonial}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                            >
                                <FiPlusCircle className="mr-1" /> Add Testimonial
                            </Button>
                        </h3>
                        {tenantSettings.testimonials.length === 0 && (
                            <p className="text-gray-500 text-sm">No testimonials added yet.</p>
                        )}
                        <div className="space-y-6">
                            {tenantSettings.testimonials.map((testimonial, index) => (
                                <div key={index} className="border p-4 rounded-lg bg-gray-50 relative">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTestimonial(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                    <h4 className="font-semibold mb-3 text-gray-700">Testimonial {index + 1}</h4>
                                    <div className="space-y-3">
                                        <InputField
                                            label="Quote"
                                            value={testimonial.quote}
                                            onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                                            textarea
                                            rows="3"
                                            placeholder="Enter testimonial quote"
                                        />
                                        <InputField
                                            label="Author"
                                            value={testimonial.author}
                                            onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
                                            placeholder="Author's Name"
                                        />
                                        <InputField
                                            label="Designation (Optional)"
                                            value={testimonial.designation}
                                            onChange={(e) => handleTestimonialChange(index, 'designation', e.target.value)}
                                            placeholder="e.g., CEO, Company Name"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                        <div className="space-y-4">
                            <InputField
                                label="Email"
                                id="email"
                                name="email"
                                type="email"
                                value={tenantSettings.contactInfo.email}
                                onChange={handleContactInfoChange}
                                placeholder="contact@example.com"
                            />
                            <InputField
                                label="Phone"
                                id="phone"
                                name="phone"
                                type="tel"
                                value={tenantSettings.contactInfo.phone}
                                onChange={handleContactInfoChange}
                                placeholder="+1234567890"
                            />
                            <InputField
                                label="Address"
                                id="address"
                                name="address"
                                value={tenantSettings.contactInfo.address}
                                onChange={handleContactInfoChange}
                                textarea
                                rows="3"
                                placeholder="123 Main St, City, Country"
                            />
                        </div>
                    </div>

                    {/* Social Media Links Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Social Media Links</h3>
                        <div className="space-y-4">
                            <InputField
                                label="Facebook URL"
                                id="facebook"
                                name="facebook"
                                type="url"
                                value={tenantSettings.socialMediaLinks.facebook}
                                onChange={handleSocialMediaLinksChange}
                                placeholder="https://facebook.com/yourpage"
                            />
                            <InputField
                                label="Twitter URL"
                                id="twitter"
                                name="twitter"
                                type="url"
                                value={tenantSettings.socialMediaLinks.twitter}
                                onChange={handleSocialMediaLinksChange}
                                placeholder="https://twitter.com/yourhandle"
                            />
                            <InputField
                                label="LinkedIn URL"
                                id="linkedin"
                                name="linkedin"
                                type="url"
                                value={tenantSettings.socialMediaLinks.linkedin}
                                onChange={handleSocialMediaLinksChange}
                                placeholder="https://linkedin.com/company/yourcompany"
                            />
                            <InputField
                                label="Instagram URL"
                                id="instagram"
                                name="instagram"
                                type="url"
                                value={tenantSettings.socialMediaLinks.instagram}
                                onChange={handleSocialMediaLinksChange}
                                placeholder="https://instagram.com/yourprofile"
                            />
                        </div>
                    </div>

                    {/* Policy Links Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Policy Links</h3>
                        <div className="space-y-4">
                            <InputField
                                label="Privacy Policy URL"
                                id="privacyPolicyUrl"
                                type="url"
                                value={tenantSettings.privacyPolicyUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/privacy-policy"
                            />
                            <InputField
                                label="Terms of Service URL"
                                id="termsOfServiceUrl"
                                type="url"
                                value={tenantSettings.termsOfServiceUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/terms-of-service"
                            />
                        </div>
                    </div>
                    
                    {/* Meta API Settings Section (Existing) */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Meta (WhatsApp) API Configuration</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Configure your WhatsApp Business API credentials for messaging functionality.
                        </p>
                        
                        <div className="space-y-4">
                            <InputField
                                label="WhatsApp Business Account ID (WABA ID)"
                                id="wabaId"
                                name="wabaId"
                                value={tenantSettings.metaApi.wabaId}
                                onChange={handleMetaApiChange}
                                placeholder="e.g., 123456789012345"
                            />
                            
                            <InputField
                                label="Permanent Access Token"
                                id="accessToken"
                                name="accessToken"
                                type="password"
                                value={tenantSettings.metaApi.accessToken}
                                onChange={handleMetaApiChange}
                                placeholder="Bearer EAAI..."
                                helpText="This sensitive credential will be encrypted when stored."
                            />
                            
                            <InputField
                                label="Facebook App ID"
                                id="appId"
                                name="appId"
                                value={tenantSettings.metaApi.appId}
                                onChange={handleMetaApiChange}
                                placeholder="e.g., 1234567890"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Facebook Graph URL"
                                    id="facebookUrl"
                                    name="facebookUrl"
                                    type="url"
                                    value={tenantSettings.metaApi.facebookUrl}
                                    onChange={handleMetaApiChange}
                                />
                                
                                <InputField
                                    label="Graph API Version"
                                    id="graphVersion"
                                    name="graphVersion"
                                    value={tenantSettings.metaApi.graphVersion}
                                    onChange={handleMetaApiChange}
                                    placeholder="e.g., v19.0"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Actions */}
                    <div className="px-6 py-4 bg-gray-50 text-right">
                        <Button
                            type="submit"
                            loading={isLoading}
                        >
                            Save Settings
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default TenantSettingsPage;
