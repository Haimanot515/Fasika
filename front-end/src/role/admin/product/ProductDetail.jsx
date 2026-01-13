import React from 'react';

const ProductDetail = () => {
    // Mock product data
    const product = {
        id: 1,
        name: "Premium Teff",
        farmer: "Bekele Megersa",
        price: 2500,
        unit: "Quintal",
        category: "Grains",
        description: "High quality white teff from Ada'a region. Cleaned and ready for milling.",
        status: "Active",
        postedDate: "2026-01-01",
        stock: 50
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-green-700 h-32 flex items-end p-8">
                    <h2 className="text-3xl font-bold text-white">{product.name}</h2>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <DetailItem label="Farmer" value={product.farmer} />
                        <DetailItem label="Status" value={product.status} isStatus />
                        <DetailItem label="Stock Level" value={`${product.stock} ${product.unit}`} />
                        <DetailItem label="Posted On" value={product.postedDate} />
                    </div>
                    <div className="space-y-6">
                        <DetailItem label="Price Indicator" value={`${product.price} ETB / ${product.unit}`} />
                        <DetailItem label="Category" value={product.category} />
                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h4>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-6 flex justify-end gap-4">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-white transition-colors">Back to List</button>
                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md shadow-green-200">Edit Details</button>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, isStatus }) => (
    <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</h4>
        {isStatus ? (
            <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">{value}</span>
        ) : (
            <p className="text-lg font-semibold text-gray-900 mt-0.5">{value}</p>
        )}
    </div>
);

export default ProductDetail;
