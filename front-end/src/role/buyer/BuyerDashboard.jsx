import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/services/dashboard.service';

const BuyerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardService.getBuyerStats().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-6">Loading Market...</div>;

    return (
        <div className="p-8 bg-white min-h-screen">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Marketplace</h1>
                    <p className="text-gray-500 font-medium mt-1">Discover fresh produce directly from local farmers.</p>
                </div>
                <div className="flex gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl">🔍</button>
                    <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl">🛒</button>
                </div>
            </header>

            <section className="mb-16">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-8 h-1 bg-green-600 rounded-full"></span>
                    Featured Today
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {stats?.featuredProducts.map(product => (
                        <div key={product.id} className="relative group cursor-pointer overflow-hidden rounded-[48px] h-80 bg-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 group-hover:scale-110 transition-transform duration-700">
                                {product.name === 'Honey' ? '🍯' : '🌾'}
                            </div>
                            <div className="absolute bottom-10 left-10 z-20">
                                <h3 className="text-3xl font-black text-white mb-2">{product.name}</h3>
                                <p className="text-green-400 font-black text-xl">{product.price} ETB <span className="text-white/60 text-sm font-medium">/ unit</span></p>
                            </div>
                            <button className="absolute bottom-10 right-10 z-20 bg-white text-black px-6 py-3 rounded-2xl font-black opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                View Deal
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <div className="bg-green-50 rounded-[56px] p-12 flex flex-col md:flex-row items-center justify-between border-2 border-green-100/50">
                <div className="max-w-md">
                    <h3 className="text-2xl font-black text-green-900 mb-4">Market Trends</h3>
                    <p className="text-green-800/70 font-medium leading-relaxed">{stats?.marketTrends}</p>
                </div>
                <button className="mt-8 md:mt-0 bg-green-700 text-white px-10 py-5 rounded-[32px] font-black shadow-2xl shadow-green-200 hover:bg-green-800 transition-all">
                    Explore Analytics
                </button>
            </div>
        </div>
    );
};

export default BuyerDashboard;
