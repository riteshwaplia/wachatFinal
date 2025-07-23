// src/pages/phonebook/ContactPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiUnlock, FiUploadCloud } from "react-icons/fi";
import * as XLSX from 'xlsx';


// Import custom UI components
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import ContactForm from '../components/ContactForm';
import Badge from '../components/Badge';
import CustomSelect from '../components/CustomSelect';
import axios from 'axios';

// Import Lucide icons
import {
    FiEdit2,
    FiTrash2,
    FiArchive,
    FiRotateCcw,
    FiPlus,
    FiCheck,
    FiX,
    FiChevronDown,
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
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
import { object } from 'prop-types';
import AddCustomFieldModal from './TeamMembers';

const ContactPage = () => {
    const { user, token } = useAuth();
    const { id: projectId } = useParams();
    const navigate = useNavigate();

    // Data states
    const [contacts, setContacts] = useState([]);

    const [blacklistedContacts, setBlacklistedContacts] = useState([]);
    const [groups, setGroups] = useState([]);


    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [columnMapping, setColumnMapping] = useState({
        Name: '',
        Email: '',
        mobileNumber: '',
        dont_use: ''
    });
    const availableFields = ['name', 'email', 'phone', 'dont use'];
    const [columns, setColumns] = useState([]);
    console.log("columnssssss", columns);




    const [selectedContactId, setSelectedContactId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // UI states

    const [parsedContacts, setParsedContacts] = useState([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [messageType, setMessageType] = useState('info');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedBlockId, setSelectedBlockId] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockModel, setShowBlockModel] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [selectedrows, setSelectedrows] = useState([]);
    const [blcakListSelectedrows, setBlackListSelectedrows] = useState([]);
    const [file, setFile] = useState(null);
    const [activeTab, setActiveTab] = useState('contactList');
    const [selectedGroups, setSelectedGroups] = useState("");
    const [finalSelectedGroups, setFinalSelectedGroups] = useState([]);
    const [isbulkOption, setIsbulkOption] = useState(false);
    console.log("selectedGroups", selectedGroups);
    console.log("finalselect", finalSelectedGroups);
    const [fields, setFields] = useState([])
    const [isFiledOpen, setIsFIledOpen] = useState(false);

    const handleOpenModal = () => setIsFIledOpen(true);
    const handleCloseModal = () => setIsFIledOpen(false);

    const handleSuccess = (newField) => {
        console.log('New custom field added:', newField);
        setIsFIledOpen(false);
        // Optionally update local state with newField
    };


    // useEffect(() => {
    //     const fetchFields = async () => {
    //         try {
    //             const res = await api.get(`/projects/${id}/contacts/fields`);
    //             const rawFields = res.data.data || [];

    //             const updatedFields = rawFields.map((field) => {
    //                 const lowerLabel = field.label.toLowerCase();

    //                 // Set required to true for specific labels
    //                 if (
    //                     lowerLabel === 'full name' ||
    //                     lowerLabel === 'email address' ||
    //                     lowerLabel === 'phone number'
    //                 ) {
    //                     return { ...field, required: true };
    //                 }

    //                 // Otherwise, mark as not required
    //                 return { ...field, required: false };
    //             });

    //             setFields(updatedFields);
    //         } catch (error) {
    //             console.error('Failed to fetch custom fields', error);
    //         }
    //     };

    //     fetchFields();
    // }, []);

    useEffect(() => {
        const trimmed = searchTerm.trim();
        if (searchTerm && trimmed === '') return;
        setIsLoading(true)
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(trimmed);
            setPagination(prev => ({ ...prev, currentPage: 1 }));
            setIsLoading(false)

        }, 1000);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if (selectedGroups && selectedGroups.length > 0) {
            const names = selectedGroups.map(group => group.label); // change to .id if needed
            setFinalSelectedGroups(names);
        } else {
            setFinalSelectedGroups([]); // reset when selectedGroups is empty
        }
    }, [selectedGroups]);


    // Pagination state based on API response structure
    const [pagination, setPagination] = useState({
        currentPage: 1,
        total: 1,
        totalPages: 1,
        limit: 10
    });

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    const handleSelectAll = (e) => {
        if (e.target.checked) {

            const allIds = filteredContacts.map((contact) => contact._id);
            setSelectedrows(allIds);

        }
        else {
            setSelectedrows([]);
        }
    }

    const handleRowSelect = (id) => {
        if (selectedrows.includes(id)) {

            setSelectedrows(selectedrows.filter((rowid) => (rowid !== id)));
        }
        else {
            setSelectedrows([...selectedrows, id]);
        }

    }
    const handleBlackListSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = filteredBlacklistedContacts.map((contact) => contact._id);
            setBlackListSelectedrows(allIds);
        }
        else {
            setBlackListSelectedrows([]);
        }
    }
    const handleBlackListRowSelect = (id) => {
        if (blcakListSelectedrows.includes(id)) {
            setBlackListSelectedrows(blcakListSelectedrows.filter((rowid) => (rowid !== id)));
        }
        else {
            setBlackListSelectedrows([...blcakListSelectedrows, id]);
        }
    }





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
    const handleEditContactClick = (contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };
    // --- Data Fetching Logic ---
    // const fetchData = useCallback(async () => {
    //     setIsLoading(true);
    //     setMessage('');
    //     setMessageType('info');
    //     try {
    //         const params = {
    //             page: pagination.currentPage,
    //             limit: pagination.limit,
    //             search: debouncedSearchTerm


    //         };
    //         const [contactRes, blacklistRes, groupRes] = await Promise.all([
    //             api.get(`/projects/${projectId}/contacts/contactList`, {
    //                 ...config,
    //                 params
    //             }),
    //             api.get(`/projects/${projectId}/contacts/blackList`, {
    //                 params
    //             }),
    //             api.get(`/projects/${projectId}/contacts/groupList`)
    //         ]);
    //         setContacts(contactRes.data.data || []);
    //         setBlacklistedContacts(blacklistRes.data.data || []);
    //         setGroups(groupRes.data.data || []);

    //         // Update pagination from the contact response
    //         setPagination(prev => ({
    //             ...prev,
    //             currentPage: contactRes.data.pagination?.currentPage || 1,
    //             total: contactRes.data.pagination?.total || 0,
    //             totalPages: contactRes.data.pagination?.totalPages || 1,
    //             limit: contactRes.data.pagination?.limit || prev.limit
    //         }));

    //         if ((contactRes.data.data || []).length === 0 && (blacklistRes.data.data || []).length === 0) {
    //             setMessage("No contacts found. Add your first contact below!");
    //             setMessageType('info');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         setMessage(`Error: ${error.response?.data?.message || 'Failed to load contact data.'}`);
    //         setMessageType('error');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [projectId, pagination.currentPage, pagination.limit, debouncedSearchTerm, token]);

    const bulkDeleteContact = async () => {
        try {
            const response = await api.put(
                `/projects/${projectId}/contacts/bulkContactUpdate/delete`,
                {
                    ids: selectedrows
                }


            );

            if (response.status === 200) {

                setIsbulkOption(false);
                fetchData();


            }

        } catch (error) {
            console.log("error", error.message);
        }
    }


    const handleBlockContact = async () => {
        try {
            let endpoint = '';

            if (activeTab === 'contactList') {
                // /api/projects/:projectId/groups/bulk-block
                endpoint = `/projects/${projectId}/contacts/bulk-block`;
            } else {
                endpoint = `/projects/${projectId}/contacts/bulkContactUpdate`;
            }

            const response = await api.post(endpoint, {
                ids: selectedrows
            });

            if (response.status === 200) {
                setIsbulkOption(false);
                fetchData();
            }
        } catch (error) {
            setIsbulkOption(false);
            console.log("error", error.message);
        }
    };


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setMessage('');
        setMessageType('info');

        try {
            const params = {
                page: pagination.currentPage,
                limit: pagination.limit,
                search: debouncedSearchTerm
            };

            // Variables to hold the response
            let contactRes = null;
            let blacklistRes = null;
            let groupRes = null;

            // Call API based on activeTab
            if (activeTab === "contactList") {
                contactRes = await api.get(`/projects/${projectId}/contacts/contactList`, {
                    ...config,
                    params
                });

                setContacts(contactRes.data.data || []);

                // Update pagination only for contacts
                setPagination(prev => ({
                    ...prev,
                    currentPage: contactRes.data.pagination?.currentPage || 1,
                    total: contactRes.data.pagination?.total || 0,
                    totalPages: contactRes.data.pagination?.totalPages || 1,
                    limit: contactRes.data.pagination?.limit || prev.limit
                }));
            }

            if (activeTab === "blockList") {
                blacklistRes = await api.get(`/projects/${projectId}/contacts/blackList`, {
                    params
                });
                setBlacklistedContacts(blacklistRes.data.data || []);
            }

            if (activeTab === "uploadCSV" || activeTab === "contactList") {
                groupRes = await api.get(`/projects/${projectId}/contacts/groupList`);
                setGroups(groupRes.data.data || []);
            }

            // Show empty message if no results
            if (
                (activeTab === "contactList" && (!contactRes?.data.data || contactRes.data.data.length === 0)) ||
                (activeTab === "blockList" && (!blacklistRes?.data.data || blacklistRes.data.data.length === 0))
            ) {
                setMessage("No contacts found. Add your first contact below!");
                setMessageType('info');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage(`Error: ${error.response?.data?.message || "Failed to load contact data."}`);
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, pagination.currentPage, pagination.limit, debouncedSearchTerm, projectId, config]);

    // useEffect(() => {
    //     if (user && projectId) {
    //         fetchData();
    //     } else if (!user) {
    //         navigate('/login', { replace: true });
    //     }
    // }, [user, projectId, navigate, pagination.currentPage, pagination.limit, token, debouncedSearchTerm]);
    //handle page change
    useEffect(() => {
        if (user && projectId) {
            fetchData();
        } else if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, projectId, activeTab, debouncedSearchTerm, pagination.limit, pagination.currentPage]);


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({
                ...prev,
                currentPage: newPage
            }));
        }
    };

    // Handle limit change
    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value);
        setPagination(prev => ({
            ...prev,
            limit: newLimit,
            currentPage: 1 // Reset to first page when changing limit
        }));

    };

    // --- Contact Form Submission ---
    // const handleContactFormSubmit = async (formData) => {
    //     setIsSubmitting(true);
    //     setMessage('');
    //     setMessageType('info');

    //     try {
    //         if (!formData.name || !formData.mobileNumber) {
    //             setMessage('Name and Mobile Number are required.');
    //             setMessageType('error');
    //             return;
    //         }




    //         const payload = {
    //             name: formData.name,
    //             email: formData.email,
    //             mobileNumber: formData.mobileNumber,
    //             groupIds: formData.groupIds,
    //             isBlocked: formData.isBlocked,
    //         };

    //         const endpoint = editingContact
    //             ? `/projects/${projectId}/contacts/updateContact/${editingContact._id}`
    //             : `/projects/${projectId}/contacts`;

    //         const method = editingContact ? 'put' : 'post';

    //         const res = await api[method](endpoint, payload);

    //         setMessage(res.data.message || `Contact ${editingContact ? 'updated' : 'created'} successfully!`);
    //         setMessageType('success');
    //         setIsModalOpen(false);
    //         setEditingContact(null);
    //         fetchData();
    //     } catch (error) {
    //         console.error('Error saving contact:', error);
    //         setMessage(`Error: ${error.response?.data?.message || 'Failed to save contact.'}`);
    //         setMessageType('error');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };  

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
                ...formData, // includes all custom fields dynamically added
                name: formData.name,
                email: formData.email,
                mobileNumber: formData.mobileNumber, // explicitly set from MobileNumber component
                groupIds: formData.groupIds || [],
                isBlocked: formData.isBlocked ?? false,
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
    //groupoptions
    const groupOptions = groups.map(group => ({
        value: group._id,
        label: group.title,
    }));
    // --- Contact Actions ---
    const handleDeleteClick = (contactId) => {
        setSelectedContactId(contactId);
        setShowConfirmModal(true);
    };
    const handleBlockClick = (contactId) => {
        setSelectedBlockId(contactId);
        setShowBlockModel(true);
    }

    const handleDeleteContact = async () => {
        // if (window.confirm('Are you sure you want to delete this contact?')) {
        //     setIsLoading(true);
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
    }
    // };

    const handleBlockUnblockContact = async (contact_id, isBlocking) => {
        const confirmMsg = isBlocking ? 'Block this contact?' : 'Unblock this contact?';

        setIsLoading(true);
        try {
            const endpoint = isBlocking
                ? `/projects/${projectId}/contacts/blackListContact/${selectedBlockId}`
                : `/projects/${projectId}/contacts/removeBlackListContact/${contact_id}`;

            const res = await api.put(endpoint, {});
            setMessage(res.data.message || `Contact ${isBlocking ? 'blocked' : 'unblocked'} successfully!`);
            setMessageType('success');
            fetchData();
            setShowBlockModel(false);
        } catch (error) {
            console.error(`Error ${isBlocking ? 'blocking' : 'unblocking'} contact:`, error);
            setMessage(`Error: ${error.response?.data?.message || 'Action failed.'}`);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }

    };

    // --- CSV Upload Logic ---
    // const handleFileChange = (e) => {
    //     setFile(e.target.files[0]);
    // };
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                if (jsonData.length > 0) {
                    const headers = Object.keys(jsonData[0]);
                    setColumns(headers);
                    setParsedContacts(jsonData);
                }
            } catch (err) {
                console.error('Error parsing file', err);
                alert('Failed to parse file');
            }
        };

        reader.readAsBinaryString(uploadedFile);
    };


    const handleUploadContacts = async (e) => {
        let newErrors = {};
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload.');
            setMessageType('error');
            return;
        }
        if (!finalSelectedGroups || finalSelectedGroups.length === 0) {
            newErrors.groups = "please select group first"
        }
        if (!columnMapping.Name) newErrors.name = "please select the fields first";
        if (!columnMapping.Email) newErrors.name = "please select the fields first";
        if (!columnMapping.mobileNumber) newErrors.name = "please select the fields first";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        console.log("columnmapping", columnMapping);
        const formattedArray = Object.values(columnMapping).filter(
            (val) => val && val !== "dont use"
        );

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('excelFile', file);
        formData.append("groupName", JSON.stringify(finalSelectedGroups));
        formData.append("projectId", JSON.stringify(projectId));
        formData.append("mapping", JSON.stringify(formattedArray));


        console.log("excelfile", file);
        console.log("formdata", formattedArray);
        try {
            const res = await api.post(`/projects/${projectId}/contacts/uploadContact`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(res.data.message || 'Contacts imported successfully!');
            setMessageType('success');
            setFile(null);
            document.getElementById('excelFile').value = '';
            fetchData();
            setParsedContacts("");
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

    // if (isLoading && !message) {
    //     return <LoadingSpinner fullPage message="Loading contact data..." />;
    // }

    return (
        <div className="md:max-w-7xl  p-3 w-full  mx-auto  md:px-6 lg:px-8 py-8">
            {
                <Modal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    title="Delete Contact"
                    size="sm" // Can be 'sm', 'md', 'lg'
                >
                    <p className='mb-4  text-xl text-red-500 '>Are you sure you want to delete this contact?</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => handleDeleteContact()}>
                            Confirm
                        </Button>
                    </div>
                </Modal>

            }
            {
                blockModel &&
                <Modal
                    isOpen={blockModel}
                    onClose={() => setShowBlockModel(false)}
                    title="Block Contact"
                    size="sm" // Can be 'sm', 'md', 'lg'
                >
                    <p className='mb-4  text-xl text-red-500 '>Are you sure you want to block this contact?</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setShowBlockModel(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => handleBlockUnblockContact(null, true)}>
                            Confirm
                        </Button>
                    </div>
                </Modal>
            }

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
            <div className="mb-6 flex justify-between items-center">
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
                        onKeyDown={(e) => {
                            if (e.key === ' ') {
                                e.preventDefault(); // Prevent typing space
                            }
                        }}
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
                <div className='flex flex-row gap-6'>
                    <Button onClick={handleOpenModal}>Add New Field</Button>

                    {isFiledOpen && (
                        <AddCustomFieldModal
                            isOpen={isFiledOpen}
                            onClose={handleCloseModal}
                            onSuccess={handleSuccess}
                        />
                    )}
                    <Button onClick={handleOpenModal}>Show All Field</Button>

                </div>

                {(selectedrows.length > 0 || blcakListSelectedrows.length > 0) && (
                    <div className="relative">
                        <Button
                            variant="secondary"
                            onClick={() => setIsbulkOption(!isbulkOption)}
                            className="flex items-center space-x-2"
                        >
                            <span>Bulk Actions</span>
                            <FiChevronDown
                                className={`transition-transform ${isbulkOption ? "transform rotate-180" : ""
                                    }`}
                            />
                        </Button>



                        {/* 
                               <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Are you sure you want to delete ${selectedGroups.length} group(s)?`
                                        )
                                      ) {
                                        // handleBulkAction("delete");
                                        // setIsBulkActionsOpen(false);
                                      }
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                  >
                                    <FiTrash2 className="mr-2" /> Delete
                                  </button> */}
                        {isbulkOption

                            && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <button
                                        onClick={() => {
                                            handleBlockContact();
                                            setIsBulkActionsOpen(false);
                                        }}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        {activeTab === 'contactList' ? <><FiArchive className="mr-2" /> Block contacts </> : <><FiUnlock className="mr-2" /> UnBlock contacts</>}
                                    </button>


                                    <button
                                        onClick={() => {
                                            bulkDeleteContact()
                                            //   if (
                                            //     window.confirm(
                                            //       `Are you sure you want to delete ${selectedGroups.length} group(s)?`
                                            //     )
                                            //   ) {
                                            //     // handleBulkAction("delete");
                                            //     // setIsBulkActionsOpen(false);
                                            //   }
                                        }}
                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                        <FiTrash2 className="mr-2" /> Delete
                                    </button>
                                </div>
                            )}
                    </div>
                )}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto scrollbar-custom overflow-y-scroll">

                {/* Contact List Tab */}

                {activeTab === 'contactList' && (
                    <>

                        {isLoading ? (
                            (<div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                            </div>)
                        ) : (<div>
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
                                <div >

                                    {isLoading ? (<div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                                    </div>) : (
                                        <table onClick={() => setIsbulkOption(false)} className="min-w-full   divide-gray-200">

                                            <thead className="bg-gray-50   overflow-auto">
                                                <tr>
                                                    <th
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"><input type="checkbox" onChange={handleSelectAll} /></th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups</th>
                                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y  divide-gray-200">
                                                {filteredContacts.map((contact) => (
                                                    <tr key={contact._id} className="hover:bg-gray-50  transition-colors">
                                                        <td><input type="checkbox" checked={selectedrows.includes(contact._id)} className='w-14' onChange={() => handleRowSelect(contact._id)} /></td>
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
                                                                    className="text-gray-600 hover:text-red-500"
                                                                    tooltip="Edit"
                                                                >
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleBlockClick(contact._id)}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-gray-600 hover:text-orange-600"
                                                                    tooltip="Block"
                                                                >
                                                                    <Ban size={16} />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleDeleteClick(contact._id)
                                                                        //  handleDeleteContact(contact._id)
                                                                    }
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
                                    )}
                                </div>
                            )}
                        </div>)}
                    </>
                )}

                {/* Block List Tab */}
                {activeTab === 'blockList' && (
                    <div>
                        {isLoading ? (
                            (<div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                            </div>)
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
                                    <thead className="bg-gray-50  ">
                                        <tr>

                                            <th className='w-14'><input type="checkbox" onChange={handleBlackListSelectAll} /></th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blocked On</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBlacklistedContacts.map((contact) => (
                                            <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                                                <td><input type="checkbox" className='w-14' checked={blcakListSelectedrows.includes(contact._id)} onChange={(e) => handleBlackListRowSelect(contact._id)} /></td>
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
                                                            className="text-gray-600 hover:text-red-600"
                                                            tooltip="Unblock"
                                                        >
                                                            <Unlink size={16} />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDeleteClick(contact._id)
                                                                //  handleDeleteContact(contact._id)
                                                            }
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
                            {/* <div>Hello</div> */}



                            <CustomSelect options={groupOptions} isMulti onChange={(opt) => {
                                setSelectedGroups(opt); setErrors((prev) => ({
                                    ...prev,
                                    groups: ""
                                }));
                            }

                            } placeholder='please select Group...' className="mb-5 " />
                            {errors &&
                                <div className='text-red-500 text-sm ml-1'>{errors.groups}</div>
                            }
                            {parsedContacts.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
                                    <h3 className="text-lg font-medium mb-4 text-gray-900">Map Fields to Columns</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {columns.map((col, colIndex) => (
                                                        <th key={colIndex} className="px-4 py-2 text-left text-gray-600">
                                                            <select
                                                                value={columnMapping[col] || ''}
                                                                onChange={(e) => {
                                                                    const newField = e.target.value;
                                                                    setColumnMapping((prev) => ({
                                                                        ...prev,
                                                                        [col]: newField,
                                                                    }));
                                                                    setErrors((prev) => (
                                                                        {
                                                                            ...prev,
                                                                            name: ""

                                                                        }))
                                                                }}
                                                                disabled={!!columnMapping[col]}
                                                                className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                                                            >
                                                                <option value="">-- Select For --</option>
                                                                {availableFields
                                                                    .filter((field) => {
                                                                        if (field === 'dont use') return true; // allow "dont use" always
                                                                        return (
                                                                            !Object.values(columnMapping).includes(field) || columnMapping[col] === field
                                                                        );
                                                                    })
                                                                    .map((field) => (
                                                                        <option key={field} value={field}>
                                                                            {field}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                        </th>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    {/* {columns.map((col, colIndex) => (
              <th
                key={colIndex}
                className="px-4 py-2 text-left font-medium text-gray-500 uppercase"
              >
                {col}
              </th>
            ))} */}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {parsedContacts.slice(0, 5).map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        {columns.map((col, colIndex) => (
                                                            <td key={colIndex} className="px-4 py-2 text-gray-800">
                                                                {row[col]}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}



                            <div className="bg-gray-50 rounded-lg mt-5  border-2 border-dashed border-gray-300  mb-3  ">
                                <form onSubmit={handleUploadContacts} >
                                    <div>
                                        {/* <label className="block text-center text-xl text-sm font-medium text-gray-700 mb-2">
                                            Select file
                                        </label> */}
                                        <div className=" flex bg-white   justify-center px-6   border-gray-300 rounded-md">
                                            <div className="space-y-1 text-center">
                                                <div className=" text-sm text-gray-600 justify-center">
                                                    <div className="text-center mb-8 mt-3">
                                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
                                                            <Upload className="h-6 w-6 text-primary-600" />
                                                        </div>

                                                        <h2 className="text-2xl font-bold text-gray-900 mb-2 ">Import Contacts</h2>
                                                        <p className="text-gray-600">
                                                            Upload a CSV or Excel file to import multiple contacts at once
                                                        </p>
                                                    </div>
                                                    <label
                                                        htmlFor="excelFile"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                                                    >

                                                        {!file && (
                                                            <div className='border  px-2 py-2 bg-blue-100 flex items-center justify-center mb-4 gap-2 rounded inline-block'>Upload a file
                                                                <FiUploadCloud size={18} />
                                                            </div>
                                                        )}
                                                        <input
                                                            id="excelFile"
                                                            name="excelFile"
                                                            type="file"
                                                            className="sr-only "
                                                            onChange={handleFileChange}
                                                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                            required
                                                        />
                                                    </label>


                                                </div>
                                                {/* <div className="pl-1 block text-sm ">or drag and drop</div>
                                                <p className="text-xs text-gray-500">
                                                    CSV or Excel files up to 10MB
                                                </p> */}
                                                {file && (
                                                    <p className="text-sm text-gray-900 py-2 mt-2 flex items-center justify-center">
                                                        <FileText className="h-4  w-4 mr-2" />
                                                        {file.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">

                                    </div>

                                </form>
                            </div>
                            {
                                errors &&
                                (
                                    <div className='text-red-500 text-sm'>{errors.name}</div>
                                )
                            }
                            <form onSubmit={handleUploadContacts}>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full flex justify-between mb-3 sm:w-auto px-8 mx-auto"
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
                            </form>



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
            {/* <TablePagination currentPage={3} totalPages={4}/> */}

            {(activeTab === "contactList" || activeTab === "blockList") && pagination.total > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
                    {/* Pagination info + limit selector */}
                    <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                        <span className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">
                                {Math.min((pagination.currentPage - 1) * pagination.limit + 1, pagination.total)}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(pagination.currentPage * pagination.limit, pagination.total)}
                            </span>{" "}
                            of <span className="font-medium">{pagination.total}</span> results
                        </span>

                        <select
                            value={pagination.limit}
                            onChange={handleLimitChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                            {[5, 10, 20, 50].map((num) => (
                                <option key={num} value={num}>
                                    {num} per page
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pagination controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="flex items-center"
                            >
                                <FiChevronLeft size={16} className="mr-1" />
                                Previous
                            </Button>

                            {/* Page numbers */}
                            <div className="flex space-x-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum;
                                    const maxVisiblePages = 5;

                                    if (pagination.totalPages <= maxVisiblePages) {
                                        pageNum = i + 1;
                                    } else if (pagination.currentPage <= Math.ceil(maxVisiblePages / 2)) {
                                        pageNum = i + 1;
                                    } else if (pagination.currentPage >= pagination.totalPages - Math.floor(maxVisiblePages / 2)) {
                                        pageNum = pagination.totalPages - maxVisiblePages + 1 + i;
                                    } else {
                                        pageNum = pagination.currentPage - Math.floor(maxVisiblePages / 2) + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={pagination.currentPage === pageNum ? "primary" : "outline"}
                                            onClick={() => handlePageChange(pageNum)}
                                            className="w-10 h-10 flex items-center justify-center"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage >= pagination.totalPages}
                                className="flex items-center"
                            >
                                Next
                                <FiChevronRight size={16} className="ml-1" />
                            </Button>
                        </div>
                    )}
                </div>
            )}






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
                // fileds={fields}
                />
            </Modal>
        </div>
    );
};

export default ContactPage;
