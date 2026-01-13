import React from 'react';

const ProductAnalytics = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Product Analytics Snapshot</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-6">Top Performing Categories</h3>
                    <div className="space-y-4">
                        <AnalyticsBar label="Grains" percentage={65} color="bg-amber-400" />
                        <AnalyticsBar label="Vegetables" percentage={20} color="bg-green-400" />
                        <AnalyticsBar label="Spices" percentage={10} color="bg-red-400" />
                        <AnalyticsBar label="Fruits" percentage={5} color="bg-blue-400" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-6">Regional Supply Volume</h3>
                    <div className="space-y-4">
                        <AnalyticsBar label="Oromia" percentage={52} color="bg-green-600" />
                        <AnalyticsBar label="Amhara" percentage={38} color="bg-green-500" />
                        <AnalyticsBar label="SNNPR" percentage={10} color="bg-green-400" />
                    </div>
                </div>
            </div>

            <div className="bg-green-900 text-white p-8 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-2">Market Sentiment: <span className="text-yellow-400">Positive</span></h3>
                    <p className="text-green-100 opacity-80">Supply levels are currently meeting demand for 85% of primary staples.</p>
                </div>
                <button className="bg-white text-green-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">Download Full Data</button>
            </div>
        </div>
    );
};

const AnalyticsBar = ({ label, percentage, color }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm font-bold text-gray-900">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

export default ProductAnalytics;
