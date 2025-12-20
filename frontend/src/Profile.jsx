import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import {
    BarChart3,
    Users,
    Briefcase,
    TrendingUp,
    LogOut,
    User,
    Building2,
    Key,
    RefreshCw,
    Copy,
    Check,
    Loader2,
    Shield
} from 'lucide-react';

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

const Profile = () => {
    const [user, setUser] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingKey, setGeneratingKey] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, orgsRes] = await Promise.all([
                    api.get('auth/me/'),
                    api.get('organizations/')
                ]);
                setUser(userRes.data);
                if (orgsRes.data.results && orgsRes.data.results.length > 0) {
                    setOrganization(orgsRes.data.results[0]);
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerateKey = async () => {
        if (!organization) return;
        setGeneratingKey(true);
        try {
            const response = await api.post(`organizations/${organization.id}/regenerate-key/`);
            setOrganization({ ...organization, api_key: response.data.api_key });
            setShowKey(true);
        } catch (error) {
            console.error("Failed to generate key", error);
        } finally {
            setGeneratingKey(false);
        }
    };

    const copyToClipboard = () => {
        if (organization?.api_key) {
            navigator.clipboard.writeText(organization.api_key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <Layout title="Profile" activePage="Profile">
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div>
            </Layout>
        );
    }

    return (
        <Layout title="Your Profile" activePage="Profile">
            <div className="max-w-4xl space-y-8">
                {/* User Info Card */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                            {user?.username ? user.username[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user?.first_name} {user?.last_name}</h2>
                            <p className="text-gray-400">@{user?.username}</p>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Role</label>
                            <div className="flex items-center mt-2 text-white">
                                <Shield className="w-4 h-4 mr-2 text-indigo-400" />
                                Administrator
                            </div>
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">User ID</label>
                            <div className="flex items-center mt-2 text-white">
                                <User className="w-4 h-4 mr-2 text-indigo-400" />
                                {user?.id}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organization API Key Card */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Key className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">API Access</h3>
                            <p className="text-gray-400 text-sm">Manage your organization's API keys</p>
                        </div>
                    </div>

                    {organization ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Organization Name</label>
                                <div className="flex items-center text-white text-lg">
                                    <Building2 className="w-5 h-5 mr-3 text-gray-500" />
                                    {organization.name}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
                                <div className="flex items-center space-x-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showKey ? "text" : "password"}
                                            readOnly
                                            value={organization.api_key || "No API Key generated yet"}
                                            className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                        <button
                                            onClick={() => setShowKey(!showKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                        >
                                            {showKey ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-white"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-700/50">
                                <button
                                    onClick={handleGenerateKey}
                                    disabled={generatingKey}
                                    className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generatingKey ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-5 h-5 mr-2" />
                                    )}
                                    {organization.api_key ? "Regenerate API Key" : "Generate API Key"}
                                </button>
                                <p className="mt-3 text-xs text-red-300">
                                    Warning: Regenerating your key will invalidate any existing keys immediately.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No organization found for this user.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
