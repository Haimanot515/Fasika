import React, { useState, useEffect } from 'react';
import { productService } from '../../../api/services/product.service';

const ViewProduct = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        productService.getProducts().then(setProducts);
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-gray-900">My Product Listings</h2>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-100">Post New Product</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-48 bg-gray-100 flex items-center justify-center text-4xl group-hover:bg-green-50 transition-colors">
                            🌱
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>{product.status}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-t border-gray-50 mb-4">
                                <span className="text-gray-400 font-bold">Price</span>
                                <span className="text-xl font-black text-green-700">{product.price} ETB</span>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-colors">Edit</button>
                                <button className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewProduct;
