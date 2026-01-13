import React, { useState } from 'react';

const WeatherManagement = () => {
    const [advisories, setAdvisories] = useState([
        { id: 1, title: "Looming Frost Alert", region: "Northern Highlands", date: "Jan 04, 2026", status: "Published" },
        { id: 2, title: "Optimized Planting Window", region: "Arsi Zone", date: "Jan 02, 2026", status: "Published" }
    ]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Weather & Climate Advisory Hub</h2>
                    <p className="text-gray-500">Coordinate and publish weather data for farmers.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                    + New Advisory
                </button>
            </div>

            <div className="grid gap-6">
                {advisories.map(adv => (
                    <div key={adv.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-colors">
                        <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-3xl">⛅</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">{adv.title}</h4>
                                <p className="text-sm font-medium text-gray-400">{adv.region} • {adv.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{adv.status}</span>
                            <button className="text-gray-400 hover:text-gray-900 font-bold transition-colors">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherManagement;
