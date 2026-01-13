import React from 'react';

const ProductRatings = () => {
    const ratings = [
        { id: 1, product: "Organic Teff", user: "John D.", score: 5, comment: "Exceptional quality, very clean grain." },
        { id: 2, product: "Red Onions", user: "Sara K.", score: 4, comment: "Good size, fast delivery but some were bruised." },
        { id: 3, product: "Haricot Beans", user: "Tadesse W.", score: 3, comment: "Price is a bit high compared to local market." },
    ];

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quality Feedback & Ratings</h2>
                    <p className="text-gray-500 mt-1">Monitor product quality through buyer reviews.</p>
                </div>
                <div className="mt-4 md:mt-0 bg-yellow-50 px-6 py-3 rounded-xl border border-yellow-200">
                    <p className="text-sm font-bold text-yellow-800 uppercase tracking-widest mb-1">Overall Satisfaction</p>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-yellow-600">4.2</span>
                        <div className="text-yellow-400 text-xl">★★★★☆</div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {ratings.map(rating => (
                    <div key={rating.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-extrabold text-green-900 text-lg underline decoration-yellow-400 underline-offset-4">{rating.product}</h4>
                            <div className="flex text-yellow-400 font-bold">
                                {"★".repeat(rating.score)}{"☆".repeat(5 - rating.score)}
                            </div>
                        </div>
                        <p className="text-gray-700 italic border-l-4 border-gray-100 pl-4 py-1 mb-3">"{rating.comment}"</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{rating.user}</span>
                            <span>• Verified Buyer</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductRatings;
