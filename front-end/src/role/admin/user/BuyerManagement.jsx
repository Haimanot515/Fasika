import React, { useState } from 'react';

const BuyerManagement = () => {
    const [buyers, setBuyers] = useState([
        { id: 1, name: "Kidus Daniel", type: "Wholesaler", orders: 45, status: "Active" },
        { id: 2, name: "Sara Abraham", type: "Retailer", orders: 12, status: "Active" },
        { id: 3, name: "Fasil Legese", type: "Individual", orders: 2, status: "Pending" },
    ]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Buyer Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buyers.map(buyer => (
                    <div key={buyer.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl text-2xl">👤</div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${buyer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{buyer.status}</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{buyer.name}</h4>
                        <p className="text-gray-500 font-medium text-sm mb-4">{buyer.type} Profile</p>
                        <div className="flex justify-between items-center py-3 border-t border-gray-50 text-sm">
                            <span className="text-gray-400">Total Orders</span>
                            <span className="font-bold text-gray-800">{buyer.orders}</span>
                        </div>
                        <button className="w-full mt-2 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-lg text-sm transition-colors">View Transaction History</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyerManagement;
