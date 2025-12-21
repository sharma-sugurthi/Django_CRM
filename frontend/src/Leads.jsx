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
    Save,
    Upload,
    FileText,
    Pencil,
    Trash2
} from 'lucide-react';
import Modal from './Modal';

const Layout = ({ children, title, activePage }) => {
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
                    {/* Placeholder for global actions if any */}
                </div>
                {children}
            </main>
        </div>
    );
};

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'new',
        source: 'website'
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);

    const fetchLeads = async () => {
        try {
            const response = await api.get('leads/');
            setLeads(response.data.results || []);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
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
                await api.post('leads/', formData);
            } else {
                await api.put(`leads/${selectedId}/`, formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchLeads();
        } catch (error) {
            console.error("Failed to save lead", error);
            alert("Failed to save lead. Please check the fields.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await api.delete(`leads/${id}/`);
                fetchLeads();
            } catch (error) {
                console.error("Failed to delete lead", error);
                alert("Failed to delete lead.");
            }
        }
    };

    const handleEdit = (lead) => {
        setFormData({
            first_name: lead.first_name,
            last_name: lead.last_name,
            email: lead.email,
            phone: lead.phone || '',
            status: lead.status,
            source: lead.source || 'website'
        });
        setSelectedId(lead.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            status: 'new',
            source: 'website'
        });
        setModalMode('create');
        setSelectedId(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await api.post('leads/upload_csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.status || "Leads uploaded successfully!");
            fetchLeads();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Ensure CSV has first_name, last_name, and email columns.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <Layout title="Leads" activePage="Leads">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Search leads..." className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="flex space-x-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".csv"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            disabled={uploading}
                            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {uploading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload CSV
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lead
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
                ) : leads.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No leads found. Create one to get started.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-900/50 text-gray-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Source</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{lead.first_name} {lead.last_name}</td>
                                        <td className="px-6 py-4">{lead.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                                lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                                                        'bg-gray-700 text-gray-300'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{lead.source}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(lead)}
                                                className="p-1 hover:bg-indigo-500/20 rounded text-gray-400 hover:text-indigo-400 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lead.id)}
                                                className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? "Add New Lead" : "Edit Lead"}>
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
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Source</label>
                            <select
                                name="source"
                                value={formData.source}
                                onChange={handleInputChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                                <option value="website">Website</option>
                                <option value="referral">Referral</option>
                                <option value="campaign">Campaign</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
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
                            {modalMode === 'create' ? "Save Lead" : "Update Lead"}
                        </button>
                    </div>
                </form>
            </Modal>

        </Layout >
    );
};

export default Leads;
