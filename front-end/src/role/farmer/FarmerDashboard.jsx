import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/services/dashboard.service';

const FarmerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await dashboardService.getFarmerStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-6">Loading Farmer Portal...</div>;

    return (
        <div className="p-6 bg-green-50/30 min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-green-900">Farmer Dashboard</h1>
                <p className="text-gray-500 font-medium">Welcome back! Here's your farm's performance overview.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Products</p>
                        <p className="text-4xl font-black text-green-800">{stats?.productCount}</p>
                    </div>
                    <div className="text-4xl bg-green-50 p-4 rounded-2xl">🚜</div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Listings</p>
                        <p className="text-4xl font-black text-blue-800">{stats?.activeListings}</p>
                    </div>
                    <div className="text-4xl bg-blue-50 p-4 rounded-2xl">🌾</div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pending Review</p>
                        <p className="text-4xl font-black text-yellow-600">{stats?.pendingReviews}</p>
                    </div>
                    <div className="text-4xl bg-yellow-50 p-4 rounded-2xl">⏳</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-orange-600 rounded-[40px] p-10 text-white shadow-xl shadow-orange-100">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <span>⛈️</span> Weather Alert
                    </h3>
                    <p className="text-orange-50 text-lg leading-relaxed mb-8">{stats?.weatherAlert}</p>
                    <button className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold hover:bg-yellow-400 transition-colors">See Full Forecast</button>
                </div>

                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Notifications</h3>
                    <div className="space-y-4">
                        {stats?.recentNotifications.map(n => (
                            <div key={n.id} className={`p-4 rounded-2xl flex items-start gap-4 ${n.read ? 'bg-gray-50' : 'bg-green-50 border border-green-100'}`}>
                                <div className={`mt-1 w-2 h-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-green-500'}`}></div>
                                <p className={`text-sm ${n.read ? 'text-gray-500' : 'text-green-900 font-semibold'}`}>{n.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
