import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/services/dashboard.service';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getAdminStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-green-900 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats?.totalUsers} icon="👥" color="blue" />
                <StatCard title="Active Farmers" value={stats?.activeFarmers} icon="🚜" color="green" />
                <StatCard title="Total Products" value={stats?.totalProducts} icon="🌾" color="yellow" />
                <StatCard title="Pending Approvals" value={stats?.pendingApprovals} icon="⏳" color="red" />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 italic text-gray-500">
                                <th className="py-3 px-4">Action</th>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentActivity.map(activity => (
                                <tr key={activity.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">{activity.action} {activity.item && <span className="font-medium">({activity.item})</span>}</td>
                                    <td className="py-3 px-4">{activity.user}</td>
                                    <td className="py-3 px-4 text-gray-500 text-sm">{activity.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value || 0}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
