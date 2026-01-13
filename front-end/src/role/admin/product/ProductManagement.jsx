import React, { useState, useEffect } from 'react';
import { productService } from '../../../api/services/product.service';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await productService.getProducts();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await productService.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        }
    };

    if (loading) return <div className="p-6">Loading products...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Add New Product</button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-left">
                    <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500 tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Product Name</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4">{product.price} ETB</td>
                                <td className="px-6 py-4">{product.stock} units</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-3">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;
