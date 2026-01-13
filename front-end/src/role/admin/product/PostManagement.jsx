import React, { useState } from 'react';

const PostManagement = () => {
    const [pendingPosts, setPendingPosts] = useState([
        { id: 1, farmer: "Abebe Kassahun", product: "Fresh Organic Carrots", date: "2026-01-04" },
        { id: 2, farmer: "Almaz Belay", product: "High Quality Barley", date: "2026-01-03" }
    ]);

    const handleAction = (id, action) => {
        alert(`Post ${id} has been ${action}ed.`);
        setPendingPosts(pendingPosts.filter(p => p.id !== id));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Post Approval Queue</h2>
            <div className="space-y-4">
                {pendingPosts.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 italic bg-gray-50 rounded-xl">No pending posts for review.</div>
                ) : (
                    pendingPosts.map(post => (
                        <div key={post.id} className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
                            <div className="mb-4 md:mb-0">
                                <h4 className="font-bold text-lg text-green-900">{post.product}</h4>
                                <p className="text-gray-600">Posted by: <span className="font-medium text-gray-800">{post.farmer}</span></p>
                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{post.date}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction(post.id, 'Approve')}
                                    className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(post.id, 'Reject')}
                                    className="bg-red-50 text-red-600 px-5 py-2 rounded-lg font-bold border border-red-200 hover:bg-red-100 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PostManagement;
