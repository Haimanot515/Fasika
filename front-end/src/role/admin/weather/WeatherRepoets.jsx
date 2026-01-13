import React from 'react';

const WeatherReports = () => {
    const history = [
        { period: "December 2025", avgTemp: "22°C", precipitation: "Low", warnings: 2 },
        { period: "November 2025", avgTemp: "19°C", precipitation: "High", warnings: 8 },
        { period: "October 2025", avgTemp: "24°C", precipitation: "Moderate", warnings: 4 },
    ];

    return (
        <div className="p-6 text-gray-800">
            <h2 className="text-2xl font-black mb-10 text-gray-900 tracking-tight">Weather History & Analytics</h2>

            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">
                                <th className="pb-8">Recording Period</th>
                                <th className="pb-8">Average Temperature</th>
                                <th className="pb-8">Precipitation Levels</th>
                                <th className="pb-8 text-center">Alerts Issued</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {history.map((h, i) => (
                                <tr key={i} className="group">
                                    <td className="py-6 font-bold group-hover:text-blue-600 transition-colors">{h.period}</td>
                                    <td className="py-6 font-mono text-gray-500">{h.avgTemp}</td>
                                    <td className="py-6">
                                        <span className={`px-3 py-1 rounded text-xs font-bold ${h.precipitation === 'High' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                            }`}>{h.precipitation}</span>
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="w-8 h-8 rounded-full bg-gray-50 inline-flex items-center justify-center font-black text-sm">{h.warnings}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WeatherReports;
