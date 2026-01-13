import React, { useState } from 'react';

const UpdateProduct = () => {
    // Mocking pre-filled data for "Premium Teff"
    const [formData, setFormData] = useState({
        name: 'Premium Teff',
        category: 'Grains',
        price: '2500',
        quantity: '50',
        description: 'High quality white teff from Ada\'a region. Cleaned and ready.'
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        alert("Changes saved successfully!");
    };

    return (
        <div className="p-8 max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">←</button>
                <h2 className="text-3xl font-black text-gray-900">Update Listing</h2>
            </div>

            <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Product Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 p-4 rounded-2xl outline-none font-bold text-gray-800"
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Current Price (ETB)</label>
                        <input
                            type="number"
                            value={formData.price}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 p-4 rounded-2xl outline-none font-bold text-green-700"
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Stock Level</label>
                        <input
                            type="number"
                            value={formData.quantity}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 p-4 rounded-2xl outline-none font-bold text-gray-800"
                            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                        />
                    </div>
                </div>

                <button className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg transition-all hover:bg-green-700">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
