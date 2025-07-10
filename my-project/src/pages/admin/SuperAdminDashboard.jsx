import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/InputField';
import Table from '../../components/Table';

const SuperAdminDashboard = () => {
    const { token, user } = useAuth();
    const [tenants, setTenants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [form, setForm] = useState({
        name: '',
        domain: '',
        websiteName: '',
        adminUsername: '',
        adminEmail: '',
        adminPassword: ''
    });

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
            setMessage({
                text: `Error: ${error.response?.data?.message || 'Failed to fetch tenants.'}`,
                type: 'error'
            });
        }
    };

    useEffect(() => {
        if (user && user.role === 'super_admin') {
            fetchTenants();
        }
    }, [user, token]);

    const handleCreateTenant = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            const res = await api.post('/tenants', form, config);
            setMessage({
                text: `Tenant '${res.data.name}' created successfully!`,
                type: 'success'
            });
            setForm({
                name: '',
                domain: '',
                websiteName: '',
                adminUsername: '',
                adminEmail: '',
                adminPassword: ''
            });
            setIsModalOpen(false);
            fetchTenants();
        } catch (error) {
            setMessage({
                text: `Error creating tenant: ${error.response?.data?.message || 'Unknown error.'}`,
                type: 'error'
            });
        }
    };

    const handleToggleStatus = async (tenantId, isActive) => {
        setMessage({ text: '', type: '' });
        try {
            await api.put(`/tenants/${tenantId}/status`, { isActive: !isActive }, config);
            setMessage({
                text: 'Tenant status updated successfully!',
                type: 'success'
            });
            fetchTenants();
        } catch (error) {
            setMessage({
                text: `Error toggling status: ${error.response?.data?.message || 'Unknown error.'}`,
                type: 'error'
            });
        }
    };

    const columns = [
        {
            header: 'Name',
            accessor: 'name',
            cell: (value, row) => (
                <div>
                    <p className="font-medium">{value}</p>
                    {row.isSuperAdmin && (
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                            Super Admin
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Domain',
            accessor: 'domain'
        },
        {
            header: 'Website Name',
            accessor: 'websiteName'
        },
        {
            header: 'Status',
            accessor: 'isActive',
            cell: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    value ? 'bg-secondary-100 text-secondary-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            cell: (_, row) => (
                <div className="flex space-x-2">
                    <Button
                        size="sm"
                        variant={row.isActive ? 'danger' : 'success'}
                        onClick={() => handleToggleStatus(row._id, row.isActive)}
                        disabled={row.isSuperAdmin}
                    >
                        {row.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </div>
            )
        }
    ];

    if (!user || user.role !== 'super_admin') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-error">You do not have access to the Super Admin Dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
                    <Button onClick={() => setIsModalOpen(true)}>
                        Create New Tenant
                    </Button>
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

                <Table
                    columns={columns}
                    data={tenants}
                    emptyMessage="No tenants found"
                    rowClassName="hover:bg-primary-50 transition-colors"
                />
            </div>

            {/* Create Tenant Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Tenant"
            >
                <form onSubmit={handleCreateTenant} className="space-y-4">
                    <Input
                        label="Tenant Name"
                        name="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Domain (e.g., mycompany.com)"
                        name="domain"
                        value={form.domain}
                        onChange={(e) => setForm({ ...form, domain: e.target.value })}
                        required
                    />
                    <Input
                        label="Website Name (for display)"
                        name="websiteName"
                        value={form.websiteName}
                        onChange={(e) => setForm({ ...form, websiteName: e.target.value })}
                        required
                    />
                    <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-lg font-medium mb-3">Admin User for New Tenant</h4>
                        <Input
                            label="Admin Username"
                            name="adminUsername"
                            value={form.adminUsername}
                            onChange={(e) => setForm({ ...form, adminUsername: e.target.value })}
                            required
                        />
                        <Input
                            label="Admin Email"
                            type="email"
                            name="adminEmail"
                            value={form.adminEmail}
                            onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                            required
                        />
                        <Input
                            label="Admin Password"
                            type="password"
                            name="adminPassword"
                            value={form.adminPassword}
                            onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create Tenant
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SuperAdminDashboard;