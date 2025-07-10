// src/pages/phonebook/ContactPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiUploadCloud } from "react-icons/fi";
// Import custom UI components
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import ContactForm from '../components/ContactForm';
import Badge from '../components/Badge';

// Import Lucide icons
import {
    PlusCircle,
    Edit,
    Trash2,
    ArrowLeft,
    Users,
    Ban,
    Upload,
    Phone,
    User,
    Unlink,
    Search,
    Mail,
    ChevronRight,
    Download,
    FileText
} from 'lucide-react';

const ContactPage = () => {
    const { user } = useAuth();
    const { id: projectId } = useParams();
    const navigate = useNavigate();

    // Data states
    const [contacts, setContacts] = useState([]);
    const [blacklistedContacts, setBlacklistedContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // UI states
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [file, setFile] = useState(null);
    const [activeTab, setActiveTab] = useState('contactList');

    // Filter contacts based on search term
    const filteredContacts = contacts.filter(contact =>
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.mobileNumber?.includes(searchTerm)
    );

    const filteredBlacklistedContacts = blacklistedContacts.filter(contact =>
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.mobileNumber?.includes(searchTerm)
    );

    // --- Data Fetching Logic ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setMessage('');
        setMessageType('info');
        try {
            const [contactRes, blacklistRes, groupRes] = await Promise.all([
                api.get(`/projects/${projectId}/contacts/contactList`),
                api.get(`/projects/${projectId}/contacts/blackList`),
                api.get(`/projects/${projectId}/contacts/groupList`)
            ]);

            setContacts(contactRes.data.data || []);
            setBlacklistedContacts(blacklistRes.data.data || []);
            setGroups(groupRes.data.data || []);

            if ((contactRes.data.data || []).length === 0 && (blacklistRes.data.data || []).length === 0) {
                setMessage("No contacts found. Add your first contact below!");
                setMessageType('info');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage(`Error: ${error.response?.data?.message || 'Failed to load contact data.'}`);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (user && projectId) {
            fetchData();
        } else if (!user) {
            navigate('/login', { replace: true });
        }
    }, [user, projectId, navigate, fetchData]);

    // --- Contact Form Submission ---
    const handleContactFormSubmit = async (formData) => {
        setIsSubmitting(true);
        setMessage('');
        setMessageType('info');

        try {
            if (!formData.name || !formData.mobileNumber) {
                setMessage('Name and Mobile Number are required.');
                setMessageType('error');
                return;
            }

            const payload = {
                name: formData.name,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                groupIds: formData.groupIds,
                isBlocked: formData.isBlocked,
            };

            const endpoint = editingContact
                ? `/projects/${projectId}/contacts/updateContact/${editingContact._id}`
                : `/projects/${projectId}/contacts`;

            const method = editingContact ? 'put' : 'post';

            const res = await api[method](endpoint, payload);

            setMessage(res.data.message || `Contact ${editingContact ? 'updated' : 'created'} successfully!`);
            setMessageType('success');
            setIsModalOpen(false);
            setEditingContact(null);
            fetchData();
        } catch (error) {
            console.error('Error saving contact:', error);
            setMessage(`Error: ${error.response?.data?.message || 'Failed to save contact.'}`);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Contact Actions ---
    const handleEditContactClick = (contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (contactId) => {
        setSelectedContactId(contactId);
        setShowConfirmModal(true);
    };

    const handleDeleteContact = async () => {
        try {
            const res = await api.delete(`/projects/${projectId}/contacts/deleteContact/${selectedContactId}`);
            setMessage(res.data.message || 'Contact deleted successfully!');
            setMessageType('success');
            fetchData();
        } catch (error) {
            console.error('Error deleting contact:', error);
            setMessage(`Error: ${error.response?.data?.message || 'Failed to delete contact.'}`);
            setMessageType('error');
        } finally {
            setIsLoading(false);
            setShowConfirmModal(false);
            setSelectedContactId(null);
        }
    };

    const handleBlockUnblockContact = async (contactId, isBlocking) => {
        const confirmMsg = isBlocking ? 'Block this contact?' : 'Unblock this contact?';
        if (window.confirm(confirmMsg)) {
            setIsLoading(true);
            try {
                const endpoint = isBlocking
                    ? `/projects/${projectId}/contacts/blackListContact/${contactId}`
                    : `/projects/${projectId}/contacts/removeBlackListContact/${contactId}`;

                const res = await api.put(endpoint, {});
                setMessage(res.data.message || `Contact ${isBlocking ? 'blocked' : 'unblocked'} successfully!`);
                setMessageType('success');
                fetchData();
            } catch (error) {
                console.error(`Error ${isBlocking ? 'blocking' : 'unblocking'} contact:`, error);
                setMessage(`Error: ${error.response?.data?.message || 'Action failed.'}`);
                setMessageType('error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // --- CSV Upload Logic ---
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadContacts = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload.');
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('excelFile', file);

        try {
            const res = await api.post(`/projects/${projectId}/contacts/uploadContact`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage(res.data.message || 'Contacts imported successfully!');
            setMessageType('success');
            setFile(null);
            document.getElementById('excelFile').value = '';
            fetchData();
            setActiveTab('contactList');
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage(`Error: ${error.response?.data?.message || 'Upload failed.'}`);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return <ErrorMessage fullPage message="Please log in to manage your contacts." />;
    }

    if (isLoading && !message) {
        return <LoadingSpinner fullPage message="Loading contact data..." />;
    }

    return (
        <div className="md:max-w-7xl p-3 w-full mx-auto md:px-6 lg:px-8 py-8">
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Delete Contact"
                size="sm"
            >
                <p className='mb-4 text-xl text-red-500'>Are you sure you want to delete this contact?</p>
                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDeleteContact}>
                        Confirm
                    </Button>
                </div>
            </Modal>

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
                        <p className="mt-2 text-gray-600">
                            Manage your project contacts and communication lists
                        </p>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-3">
                        <Button
                            onClick={() => { setEditingContact(null); setIsModalOpen(true); }}
                            variant="primary"
                            className="flex items-center space-x-2 shadow-sm"
                        >
                            <PlusCircle size={20} />
                            <span>New Contact</span>
                        </Button>
                        <Button
                            onClick={() => setActiveTab('uploadCSV')}
                            variant="secondary"
                            className="flex items-center space-x-2"
                        >
                            <Upload size={20} />
                            <span>Import</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Message Display */}
            {message && (
                <Alert type={messageType} message={message} className="mb-6" />
            )}

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-1 md:space-x-8">
                        <button
                            onClick={() => setActiveTab('contactList')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 lg:space-x-2 ${activeTab === 'contactList'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Users size={18} />
                            <span>Contacts ({contacts.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('blockList')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 lg:space-x-2 ${activeTab === 'blockList'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Ban size={18} />
                            <span>Block List ({blacklistedContacts.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('uploadCSV')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 lg:space-x-2 ${activeTab === 'uploadCSV'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Upload size={18} />
                            <span>Import Contacts</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative rounded-md shadow-sm max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <span className="text-gray-400 hover:text-gray-600">
                                &times;
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto scrollbar-custom overflow-y-scroll">
                {/* Contact List Tab */}
                {activeTab === 'contactList' && (
                    <div>
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <LoadingSpinner message="Loading contacts..." />
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                                    <Users className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    {searchTerm ? 'No matching contacts' : 'No contacts yet'}
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {searchTerm
                                        ? 'Try a different search term'
                                        : 'Get started by adding your first contact'}
                                </p>
                                <Button
                                    onClick={() => { setEditingContact(null); setIsModalOpen(true); }}
                                    variant="primary"
                                    className="flex items-center space-x-2 mx-auto"
                                >
                                    <PlusCircle size={18} />
                                    <span>Add Contact</span>
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 overflow-auto">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredContacts.map((contact) => (
                                            <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-primary-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                            <div className="text-sm text-gray-500">{contact.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            {contact.mobileNumber || '-'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {contact.groupIds?.length > 0 ? (
                                                            contact.groupIds.map(g => (
                                                                <Badge key={g._id || g} type="secondary" size="sm">
                                                                    {g.title || 'N/A'}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            onClick={() => handleEditContactClick(contact)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-600 hover:text-primary-600"
                                                            tooltip="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleBlockUnblockContact(contact._id, true)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-600 hover:text-orange-600"
                                                            tooltip="Block"
                                                        >
                                                            <Ban size={16} />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDeleteClick(contact._id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-600 hover:text-red-600"
                                                            tooltip="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Block List Tab */}
                {activeTab === 'blockList' && (
                    <div>
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <LoadingSpinner message="Loading blocked contacts..." />
                            </div>
                        ) : filteredBlacklistedContacts.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                                    <Ban className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    No blocked contacts
                                </h3>
                                <p className="text-gray-500">
                                    Contacts you block will appear here
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blocked On</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBlacklistedContacts.map((contact) => (
                                            <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                            <Ban className="h-5 w-5 text-red-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                            <div className="text-sm text-gray-500">{contact.mobileNumber}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {contact.updatedAt ? new Date(contact.updatedAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            onClick={() => handleBlockUnblockContact(contact._id, false)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-600 hover:text-green-600"
                                                            tooltip="Unblock"
                                                        >
                                                            <Unlink size={16} />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDeleteClick(contact._id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-600 hover:text-red-600"
                                                            tooltip="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Upload CSV Tab */}
                {activeTab === 'uploadCSV' && (
                    <div className="lg:p-8">
                        <div className="w-full mx-auto">
                            <div className="text-center mb-8">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
                                    <Upload className="h-6 w-6 text-primary-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Contacts</h2>
                                <p className="text-gray-600">
                                    Upload a CSV or Excel file to import multiple contacts at once
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 mb-8">
                                <form onSubmit={handleUploadContacts} className="space-y-6">
                                    <div>
                                        <label className="block text-center text-xl text-sm font-medium text-gray-700 mb-2">
                                            Select file
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 py-3 pt-5 pb-6 border border-gray-300 rounded-md">
                                            <div className="space-y-1 text-center">
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label
                                                        htmlFor="excelFile"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                                                    >
                                                        <div className='border px-2 py-2 bg-blue-100 flex items-center gap-2 rounded inline-block'>Upload a file
                                                            <FiUploadCloud />
                                                        </div>
                                                        <input
                                                            id="excelFile"
                                                            name="excelFile"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                                <div className="pl-1 block text-sm">or drag and drop</div>
                                                <p className="text-xs text-gray-500">
                                                    CSV or Excel files up to 10MB
                                                </p>
                                                {file && (
                                                    <p className="text-sm text-gray-900 mt-2 flex items-center justify-center">
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        {file.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="w-full sm:w-auto px-8"
                                            disabled={!file || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                                                    Importing...
                                                </>
                                            ) : (
                                                'Import Contacts'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">File Format Requirements</h3>
                                <div className="prose prose-sm text-gray-500 mb-6">
                                    <p>Your import file should follow this format:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>First row must contain headers (Name, Email, Phone, Groups)</li>
                                        <li>Each subsequent row represents one contact</li>
                                        <li>Groups should be comma-separated group IDs</li>
                                        <li>Phone numbers should include country code</li>
                                    </ul>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Name</th>
                                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Phone</th>
                                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Groups</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-4 py-2">John Doe</td>
                                                <td className="px-4 py-2">john@example.com</td>
                                                <td className="px-4 py-2">+1234567890</td>
                                                <td className="px-4 py-2">60c72b2f...8765,60c72b3a...1234</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2">Jane Smith</td>
                                                <td className="px-4 py-2">jane@example.com</td>
                                                <td className="px-4 py-2">+1987654321</td>
                                                <td className="px-4 py-2">60c72b3a...1234</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6">
                                    <Button
                                        variant="secondary"
                                        className="flex items-center space-x-2"
                                        onClick={() => {
                                            // In a real app, this would download a template file
                                            alert('Template download would start here');
                                        }}
                                    >
                                        <Download size={16} />
                                        <span>Download Template</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Contact Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingContact(null);
                }}
                title={editingContact ? 'Edit Contact' : 'Create New Contact'}
                size="lg"
            >
                <ContactForm
                    initialData={editingContact}
                    onSubmit={handleContactFormSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingContact(null);
                    }}
                    groups={groups}
                    isLoading={isSubmitting}
                />
            </Modal>
        </div>
    );
};

export default ContactPage;