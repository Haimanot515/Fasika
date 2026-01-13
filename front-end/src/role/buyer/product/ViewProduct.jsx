import React, { useState, useEffect } from 'react';
import { productService } from '../../../api/services/product.service';

const ViewProduct = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        productService.getProducts().then(setProducts);
    }, []);

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <h2 className="text-3xl font-black text-gray-900">Browse Produce</h2>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-2 overflow-x-auto whitespace-nowrap">
                    {['All', 'Grains', 'Vegetables', 'Honey', 'Coffee'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filter === cat ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <div key={product.id} className="bg-white group">
                        <div className="aspect-square bg-gray-50 rounded-[40px] mb-6 flex items-center justify-center text-6xl group-hover:bg-green-50 transition-colors duration-500 overflow-hidden relative border border-gray-100 shadow-sm">
                            <div className="absolute bottom-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <button className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-xl shadow-xl">🛒</button>
                            </div>
                            {product.name.includes('Honey') ? '🍯' : '🌾'}
                        </div>
                        <div className="px-4">
                            <h4 className="font-extrabold text-gray-900 text-lg mb-1">{product.name}</h4>
                            <p className="text-gray-400 text-sm font-medium mb-4">Farmer: <span className="text-green-600 underline underline-offset-4 decoration-green-100">Grade A Source</span></p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Price</p>
                                    <p className="text-xl font-black text-gray-900">{product.price} <span className="text-xs">ETB</span></p>
                                </div>
                                <button className="text-xs font-black uppercase text-green-700 hover:underline">Details →</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewProduct;
