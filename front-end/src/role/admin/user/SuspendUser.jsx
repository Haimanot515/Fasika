import React from 'react';

const SuspendUser = () => {
    return (
        <div className="p-10 flex items-center justify-center min-h-[60vh]">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-red-50 max-w-md text-center">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    ⚠️
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Account Suspension</h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                    You are about to suspend this user's access. They will no longer be able to log in or post new content until reinstated.
                </p>

                <div className="space-y-3">
                    <label className="block text-left text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Reason for Suspension</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:ring-2 ring-red-200 outline-none">
                        <option>Violation of Platform Terms</option>
                        <option>Suspicious Activity Detected</option>
                        <option>User Data Discrepancy</option>
                        <option>Other</option>
                    </select>
                </div>

                <div className="mt-10 flex flex-col gap-3">
                    <button className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95">
                        Confirm Suspension
                    </button>
                    <button className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors">
                        Cancel and Return
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuspendUser;
