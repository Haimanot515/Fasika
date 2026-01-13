import React, { useState } from 'react';

const PriceManagement = () => {
    const [prices, setPrices] = useState([
        { id: 1, item: "Teff", current: 2500, region: "Addis Ababa" },
        { id: 2, item: "Wheat", current: 1800, region: "Amhara" }
    ]);

    const handleUpdate = (id) => {
        const newPrice = prompt("Enter new market price indicator:");
        if (newPrice && !isNaN(newPrice)) {
            setPrices(prices.map(p => p.id === id ? { ...p, current: Number(newPrice) } : p));
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Price Index Management</h2>
            <div className="grid gap-4 max-w-2xl">
                {prices.map(price => (
                    <div key={price.id} className="bg-white p-5 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                        <div>
                            <h4 className="font-bold text-lg">{price.item}</h4>
                            <p className="text-gray-500 text-sm">{price.region} Standard</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-mono font-bold text-green-700">{price.current} ETB</p>
                            <button
                                onClick={() => handleUpdate(price.id)}
                                className="mt-2 text-sm text-blue-600 hover:underline font-semibold"
                            >
                                Update Index
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriceManagement;
