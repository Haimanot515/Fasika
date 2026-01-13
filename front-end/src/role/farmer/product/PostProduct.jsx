import React, { useState } from 'react';

const PostProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Grains',
        price: '',
        quantity: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Product post submitted for approval!");
        console.log("Product posted:", formData);
    };

    return (
        <div className="p-8 max-w-2xl">
            <h2 className="text-3xl font-black text-green-900 mb-8">Post New Product</h2>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Product Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Organic White Teff"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 p-4 rounded-2xl outline-none font-medium"
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Category</label>
                        <select className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none font-medium appearance-none">
                            <option>Grains</option>
                            <option>Vegetables</option>
                            <option>Fruits</option>
                            <option>Honey & Spices</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Asking Price (ETB)</label>
                        <input
                            type="number"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 p-4 rounded-2xl outline-none font-medium"
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Detailed Description</label>
                    <textarea
                        rows="4"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 p-4 rounded-2xl outline-none font-medium resize-none"
                        placeholder="Tell buyers about the quality, origin, and availability..."
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <button className="w-full bg-green-700 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-green-100 hover:bg-green-800 transition-all active:scale-95">
                    Submit for Approval
                </button>
            </form>
        </div>
    );
};

export default PostProduct;
