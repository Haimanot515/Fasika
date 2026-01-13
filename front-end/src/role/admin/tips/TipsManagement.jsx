import React, { useState } from 'react';

const TipsManagement = () => {
    const [tips, setTips] = useState([
        { id: 1, title: "Effective Pest Control", category: "Crop Protection", views: 4500 },
        { id: 2, title: "Soil Enrichment Guide", category: "Soil Health", views: 2300 },
    ]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-green-900">Expert Tips Repository</h2>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                    Publish New Tip
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tips.map(tip => (
                    <div key={tip.id} className="bg-white p-8 rounded-[32px] border-2 border-transparent hover:border-green-100 shadow-sm transition-all group">
                        <div className="flex justify-between mb-6">
                            <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{tip.category}</span>
                            <span className="text-gray-300 font-bold group-hover:text-green-200">#{tip.id}</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{tip.title}</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed font-medium">Educational content designed to improve yield and sustainability.</p>
                        <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">📈</span>
                                <span className="text-sm font-bold text-gray-900">{tip.views} Readers</span>
                            </div>
                            <button className="text-green-600 font-black text-sm uppercase tracking-wider hover:underline">Edit Content</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TipsManagement;
