import React, { useState } from 'react';

const FarmerManagement = () => {
    const [farmers, setFarmers] = useState([
        { id: 1, name: "Bekele Megersa", location: "Debre Zeit", status: "Active", listings: 12 },
        { id: 2, name: "Almaz Belay", location: "Gojjam", status: "Suspended", listings: 5 },
        { id: 3, name: "Tewodros Kassie", location: "Arsi", status: "Active", listings: 8 },
    ]);

    const toggleStatus = (id) => {
        setFarmers(farmers.map(f => {
            if (f.id === id) {
                const newStatus = f.status === 'Active' ? 'Suspended' : 'Active';
                return { ...f, status: newStatus };
            }
            return f;
        }));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Farmer Directory</h2>
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <th className="p-5">Farmer Name</th>
                            <th className="p-5">Region</th>
                            <th className="p-5 text-center">Listings</th>
                            <th className="p-5">Account Status</th>
                            <th className="p-5">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {farmers.map(farmer => (
                            <tr key={farmer.id} className="hover:bg-gray-50">
                                <td className="p-5 font-bold text-green-900">{farmer.name}</td>
                                <td className="p-5 text-gray-600">{farmer.location}</td>
                                <td className="p-5 text-center font-mono">{farmer.listings}</td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${farmer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {farmer.status}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <button
                                        onClick={() => toggleStatus(farmer.id)}
                                        className={`text-sm font-bold ${farmer.status === 'Active' ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                                    >
                                        {farmer.status === 'Active' ? 'Suspend' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FarmerManagement;
