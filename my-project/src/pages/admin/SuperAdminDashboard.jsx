import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext'; // Corrected import path for useAuth

const SuperAdminDashboard = () => {
    const { token, user } = useAuth();
    const [tenants, setTenants] = useState([]);
    const [newTenant, setNewTenant] = useState({
        name: '',
        domain: '',
        websiteName: '',
        adminUsername: '',
        adminEmail: '',
        adminPassword: ''
    });
    const [message, setMessage] = useState('');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    const fetchTenants = async () => {
        try {
            const res = await api.get('/tenants', config);
            setTenants(res.data);
        } catch (error) {
            console.error('Error fetching tenants:', error.response?.data?.message || error.message);
            setMessage(`Error: ${error.response?.data?.message || 'Failed to fetch tenants.'}`);
        }
    };

    useEffect(() => {
        if (user && user.role === 'super_admin') {
            fetchTenants();
        }
    }, [user, token]);

    const handleCreateTenant = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await api.post('/tenants', newTenant, config);
            setMessage(`Tenant '${res.data.name}' created successfully!`);
            setNewTenant({ name: '', domain: '', websiteName: '', adminUsername: '', adminEmail: '', adminPassword: '' });
            fetchTenants(); // Refresh list
        } catch (error) {
            console.error('Error creating tenant:', error.response?.data?.message || error.message);
            setMessage(`Error creating tenant: ${error.response?.data?.message || 'Unknown error.'}`);
        }
    };

    const handleToggleStatus = async (tenantId, isActive) => {
        setMessage('');
        try {
            await api.put(`/tenants/${tenantId}/status`, { isActive: !isActive }, config);
            setMessage(`Tenant status updated successfully!`);
            fetchTenants(); // Refresh list
        } catch (error) {
            console.error('Error toggling tenant status:', error.response?.data?.message || error.message);
            setMessage(`Error toggling status: ${error.response?.data?.message || 'Unknown error.'}`);
        }
    };

    if (!user || user.role !== 'super_admin') {
        return <p className="text-center text-red-500 py-10">You do not have access to the Super Admin Dashboard.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Super Admin Dashboard</h2>

            {message && (
                <div className={`p-3 mb-4 rounded-md ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Create New Tenant</h3>
                <form onSubmit={handleCreateTenant} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Tenant Name:</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={newTenant.name}
                            onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Domain (e.g., mycompany.com):</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={newTenant.domain}
                            onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Website Name (for display):</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={newTenant.websiteName}
                            onChange={(e) => setNewTenant({ ...newTenant, websiteName: e.target.value })}
                            required
                        />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Admin User for New Tenant:</h4>
                    <div>
                        <label className="block text-gray-700">Admin Username:</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={newTenant.adminUsername}
                            onChange={(e) => setNewTenant({ ...newTenant, adminUsername: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Admin Email:</label>
                        <input
                            type="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={newTenant.adminEmail}
                            onChange={(e) => setNewTenant({ ...newTenant, adminEmail: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Admin Password:</label>
                        <input
                            type="password"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={newTenant.adminPassword}
                            onChange={(e) => setNewTenant({ ...newTenant, adminPassword: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
                    >
                        Create Tenant
                    </button>
                </form>
            </div>

            <div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">All Tenants</h3>
                {tenants.length === 0 ? (
                    <p>No tenants created yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {tenants.map((tenant) => (
                            <li key={tenant._id} className="bg-gray-50 p-4 rounded-md shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-medium">{tenant.name} ({tenant.domain})</p>
                                    <p className="text-sm text-gray-600">Status: {tenant.isActive ? 'Active' : 'Inactive'}</p>
                                    <p className="text-sm text-gray-600">Website Name: {tenant.websiteName}</p>
                                    {tenant.isSuperAdmin && <p className="text-sm text-indigo-700 font-bold">Super Admin Tenant</p>}
                                </div>
                                <button
                                    onClick={() => handleToggleStatus(tenant._id, tenant.isActive)}
                                    className={`px-4 py-2 rounded-md transition duration-300 ${tenant.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                    disabled={tenant.isSuperAdmin} // Prevent deactivating super admin tenant for safety
                                >
                                    {tenant.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
