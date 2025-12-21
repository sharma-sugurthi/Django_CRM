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
    DollarSign,
    Save,
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
                </div>
                {children}
            </main>
        </div>
    );
};

const Deals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        value: '',
        stage: 'prospecting',
        probability: '50'
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchDeals = async () => {
        try {
            const response = await api.get('deals/');
            setDeals(response.data.results || []);
        } catch (error) {
            console.error("Failed to fetch deals", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
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
                await api.post('deals/', formData);
            } else {
                await api.put(`deals/${selectedId}/`, formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchDeals();
        } catch (error) {
            console.error("Failed to save deal", error);
            alert("Failed to save deal.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this deal?")) {
            try {
                await api.delete(`deals/${id}/`);
                fetchDeals();
            } catch (error) {
                console.error("Failed to delete deal", error);
                alert("Failed to delete deal.");
            }
        }
    };

    const handleEdit = (deal, e) => {
        e.stopPropagation();
        setFormData({
            name: deal.name,
            value: deal.value,
            stage: deal.stage,
            probability: deal.probability
        });
        setSelectedId(deal.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            value: '',
            stage: 'prospecting',
            probability: '50'
        });
        setModalMode('create');
        setSelectedId(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const getStageColor = (stage) => {
        switch (stage) {
            case 'prospecting': return 'bg-blue-500/20 text-blue-400';
            case 'negotiation': return 'bg-yellow-500/20 text-yellow-400';
            case 'closed_won': return 'bg-green-500/20 text-green-400';
            case 'closed_lost': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-700 text-gray-400';
        }
    };

    return (
        <Layout title="Deals" activePage="Deals">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Search deals..." className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Deal
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
                ) : deals.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No deals found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {deals.map((deal) => (
                            <div key={deal.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:bg-gray-700/50 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-white text-lg">{deal.name}</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStageColor(deal.stage)}`}>
                                            {deal.stage.replace('_', ' ')}
                                        </span>
                                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleEdit(deal, e)}
                                                className="p-1 hover:bg-indigo-500/20 rounded text-gray-400 hover:text-indigo-400 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(deal.id, e)}
                                                className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-3xl font-bold text-white flex items-center">
                                        <span className="text-gray-500 text-lg font-normal mr-1">$</span>
                                        {parseFloat(deal.value).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700/50 pt-4">
                                    <span>Prob: {deal.probability}%</span>
                                    <span>{new Date(deal.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? "Add New Deal" : "Edit Deal"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Deal Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Value ($)</label>
                        <input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleInputChange}
                            step="0.01"
                            placeholder="0.00"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Stage</label>
                            <select
                                name="stage"
                                value={formData.stage}
                                onChange={handleInputChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                                <option value="prospecting">Prospecting</option>
                                <option value="negotiation">Negotiation</option>
                                <option value="closed_won">Closed Won</option>
                                <option value="closed_lost">Closed Lost</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Probability (%)</label>
                            <input
                                type="number"
                                name="probability"
                                value={formData.probability}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
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
                            {modalMode === 'create' ? "Save Deal" : "Update Deal"}
                        </button>
                    </div>
                </form>
            </Modal>

        </Layout >
    );
};

export default Deals;
