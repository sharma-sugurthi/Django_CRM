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
    Activity,
    Loader2
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        leads: 0,
        deals: 0,
        organizations: 0,
        revenue: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [user, setUser] = useState({ first_name: '', username: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel requests for efficiency
                const [
                    leadsRes,
                    dealsRes,
                    orgsRes,
                    userRes,
                    activitiesRes
                ] = await Promise.all([
                    api.get('leads/'),
                    api.get('deals/'),
                    api.get('organizations/'),
                    api.get('auth/me/'),
                    api.get('activities/') // Assuming activities endpoint exists
                ]);

                // Calculate Revenue (Sum of Deal values)
                // Note: Pagination might limit this if not handled, but for MVP we sum current page
                const totalRevenue = dealsRes.data.results
                    ? dealsRes.data.results.reduce((acc, deal) => acc + parseFloat(deal.value || 0), 0)
                    : 0;

                setStats({
                    leads: leadsRes.data.count || 0,
                    deals: dealsRes.data.count || 0,
                    organizations: orgsRes.data.count || 0,
                    revenue: totalRevenue
                });

                setUser(userRes.data);

                // Map activities if available
                if (activitiesRes.data.results) {
                    setRecentActivity(activitiesRes.data.results.slice(0, 5));
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                // Clean logout on 401
                if (error.response && error.response.status === 401) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl hover:bg-gray-800/70 transition-all duration-300 group">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                        {loading ? <div className="h-8 w-16 bg-gray-700 animate-pulse rounded"></div> : value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800/30 backdrop-blur-md border-r border-gray-700 flex flex-col hidden md:flex">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        CRM Pro
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button onClick={() => navigate('/')} className="w-full flex items-center px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-all">
                        <BarChart3 className="w-5 h-5 mr-3" />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <button onClick={() => navigate('/leads')} className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all">
                        <Users className="w-5 h-5 mr-3" />
                        <span className="font-medium">Leads</span>
                    </button>
                    <button onClick={() => navigate('/contacts')} className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all">
                        <Briefcase className="w-5 h-5 mr-3" />
                        <span className="font-medium">Contacts</span>
                    </button>
                    <button onClick={() => navigate('/deals')} className="w-full flex items-center px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all">
                        <TrendingUp className="w-5 h-5 mr-3" />
                        <span className="font-medium">Deals</span>
                    </button>
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

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                        <p className="text-gray-400 mt-1">
                            {loading ? "Loading..." : `Welcome back, ${user.first_name || user.username}`}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold uppercase hover:ring-2 hover:ring-indigo-400 transition-all cursor-pointer"
                        >
                            {user.username ? user.username[0] : 'U'}
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Leads" value={stats.leads} icon={Users} color="bg-blue-500" />
                    <StatCard title="Active Deals" value={stats.deals} icon={Briefcase} color="bg-emerald-500" />
                    <StatCard title="Organizations" value={stats.organizations} icon={Building2} color="bg-orange-500" />
                    <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={TrendingUp} color="bg-purple-500" />
                </div>

                {/* Recent Activity Section */}
                <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Recent Activity</h3>
                        <Activity className="w-5 h-5 text-gray-400" />
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-500" /></div>
                    ) : recentActivity.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No recent activity found.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mr-4"></div>
                                    <p className="text-gray-300">
                                        <span className="text-white font-medium capitalize">{activity.activity_type}</span>: {activity.summary}
                                    </p>
                                    <span className="ml-auto text-sm text-gray-500">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;