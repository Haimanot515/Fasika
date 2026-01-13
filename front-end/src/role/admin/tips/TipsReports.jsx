import React from 'react';

const TipsReports = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-black text-gray-800 mb-10">Tip Engagement Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-8">Engagement Trend (Last 7 Days)</h4>
                    <div className="flex items-end gap-3 h-48 mb-6">
                        {[45, 60, 55, 85, 95, 75, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-green-100 rounded-t-2xl hover:bg-green-500 transition-colors" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Weekly engagement is up by <span className="text-green-600 font-bold">14.2%</span> compared to last month.</p>
                </div>

                <div className="bg-green-900 rounded-[40px] p-10 text-white flex flex-col justify-between">
                    <div>
                        <h5 className="text-green-400 text-xs font-black uppercase tracking-widest mb-4">Total Reads</h5>
                        <h2 className="text-5xl font-black mb-2">12.5k</h2>
                        <p className="text-green-200 opacity-60 text-sm">Unique sessions in education portal.</p>
                    </div>
                    <button className="w-full bg-white text-green-900 py-4 rounded-2xl font-black hover:bg-yellow-400 transition-colors">Export Tip Insights</button>
                </div>
            </div>
        </div>
    );
};

export default TipsReports;
