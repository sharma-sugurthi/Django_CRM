import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import {
    BarChart3,
    Users,
    Building2,
    LogOut,
    Briefcase,
    TrendingUp,
    Plus,
    Search,
    Loader2,
    Mail,
    MapPin,
    Save,
    Pencil,
    Trash2
} from 'lucide-react';
import Modal from './Modal';

const Layout = ({ children, title, activePage }) => {
    // Duplicated Layout component for simplicity (or should be extracted to a separate file)
    // For now I will copy it to ensure it works without creating more files unless necessary
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: BarChart3 },
        { name: 'Leads', path: '/leads', icon: Users },
        { name: 'Contacts', path: '/contacts', icon: Briefcase },
        { name: 'Deals', path: '/deals', icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            <aside className="w-64 bg-gray-800/30 backdrop-blur-md border-r border-gray-700 flex flex-col hidden md:flex">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        CRM Pro
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activePage === item.name
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">{title}</h2>
                </div>
                {children}
            </main>
        </div>
    );
};

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchContacts = async () => {
        try {
            const response = await api.get('contacts/');
            setContacts(response.data.results || []);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (modalMode === 'create') {
                await api.post('contacts/', formData);
            } else {
                await api.put(`contacts/${selectedId}/`, formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchContacts();
        } catch (error) {
            console.error("Failed to save contact", error);
            alert("Failed to save contact.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent card click if we add logic later
        if (window.confirm("Are you sure you want to delete this contact?")) {
            try {
                await api.delete(`contacts/${id}/`);
                fetchContacts();
            } catch (error) {
                console.error("Failed to delete contact", error);
                alert("Failed to delete contact.");
            }
        }
    };

    const handleEdit = (contact, e) => {
        e.stopPropagation();
        setFormData({
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            address: contact.address || '',
            description: contact.description || ''
        });
        setSelectedId(contact.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            address: '',
            description: ''
        });
        setModalMode('create');
        setSelectedId(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <Layout title="Contacts" activePage="Contacts">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Search contacts..." className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Contact
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
                ) : contacts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No contacts found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {contacts.map((contact) => (
                            <div key={contact.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white mr-4">
                                            {contact.first_name[0]}{contact.last_name[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold group-hover:text-indigo-400 transition-colors">{contact.first_name} {contact.last_name}</h3>
                                            <p className="text-gray-400 text-xs">ID: #{contact.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleEdit(contact, e)}
                                            className="p-1.5 hover:bg-indigo-500/20 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(contact.id, e)}
                                            className="p-1.5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-300">
                                    {contact.email && (
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                            {contact.email}
                                        </div>
                                    )}
                                    {contact.address && (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                            {contact.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? "Add New Contact" : "Edit Contact"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {modalMode === 'create' ? "Save Contact" : "Update Contact"}
                        </button>
                    </div>
                </form>
            </Modal>

        </Layout >
    );
};

export default Contacts;
