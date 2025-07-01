// src/components/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Building } from 'lucide-react'; // Ensure lucide-react is installed
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { siteConfig } = useTenant(); // Access siteConfig

    const navItems = [
        { label: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={18} /> },
        // Show 'All Tenants' link only for super_admin
        ...(user?.role === 'super_admin'
            ? [{ label: 'All Tenants', path: '/add-tenant-admin', icon: <Building size={18} /> }]
            : []),
        { label: 'Users', path: '/users', icon: <Users size={18} /> },
        { label: 'Tenant Settings', path: '/tenant-settings', icon: <Settings size={18} /> },
        // Add more admin-specific navigation items as needed
    ];

    // Function to check if the current path is active
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="bg-white w-64 min-h-screen shadow-lg fixed top-0 left-0 flex flex-col p-4 border-r border-gray-100 z-30">
            <h2 className="text-xl font-bold font-heading text-primary-700 mb-6">{siteConfig?.websiteName || 'Admin Panel'}</h2>
            <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive(item.path)
                                ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm' // Active state with custom colors
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Inactive state
                        }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;