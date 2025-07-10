import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/InputField';
import api from '../../utils/api';
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
        }
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
                }
            });
        }
    }, [siteConfig, tenantConfigLoading]);

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
                        ? 'bg-error-100 text-error-800' 
                        : 'bg-success-100 text-success-800'
                }`}>
                    {message.text}
                </div>
            )}

            <Card>
                <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                    {/* General Settings Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">General Settings</h3>
                        
                        <div className="space-y-4">
                            <Input
                                label="Website Name"
                                id="websiteName"
                                value={tenantSettings.websiteName}
                                onChange={(e) => setTenantSettings({...tenantSettings, websiteName: e.target.value})}
                                required
                            />
                            
                            <Input
                                label="Favicon URL"
                                id="faviconUrl"
                                type="url"
                                value={tenantSettings.faviconUrl}
                                onChange={(e) => setTenantSettings({...tenantSettings, faviconUrl: e.target.value})}
                                placeholder="https://example.com/favicon.ico"
                            />
                        </div>
                    </div>
                    
                    {/* Meta API Settings Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Meta (WhatsApp) API Configuration</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Configure your WhatsApp Business API credentials for messaging functionality.
                        </p>
                        
                        <div className="space-y-4">
                            <Input
                                label="WhatsApp Business Account ID (WABA ID)"
                                id="wabaId"
                                name="wabaId"
                                value={tenantSettings.metaApi.wabaId}
                                onChange={handleMetaApiChange}
                                placeholder="e.g., 123456789012345"
                            />
                            
                            <Input
                                label="Permanent Access Token"
                                id="accessToken"
                                name="accessToken"
                                type="password"
                                value={tenantSettings.metaApi.accessToken}
                                onChange={handleMetaApiChange}
                                placeholder="Bearer EAAI..."
                                helpText="This sensitive credential will be encrypted when stored."
                            />
                            
                            <Input
                                label="Facebook App ID"
                                id="appId"
                                name="appId"
                                value={tenantSettings.metaApi.appId}
                                onChange={handleMetaApiChange}
                                placeholder="e.g., 1234567890"
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Facebook Graph URL"
                                    id="facebookUrl"
                                    name="facebookUrl"
                                    type="url"
                                    value={tenantSettings.metaApi.facebookUrl}
                                    onChange={handleMetaApiChange}
                                />
                                
                                <Input
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