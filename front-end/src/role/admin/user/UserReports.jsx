import React from 'react';

const UserReports = () => {
    const userStats = [
        { metric: "Total Farmers Registered", value: "1,240", change: "+12%" },
        { metric: "Total Buyers Registered", value: "3,892", change: "+8%" },
        { metric: "Active Sessions Today", value: "450", change: "+15%" },
        { metric: "Verification Approval Rate", value: "94%", change: "-2%" },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">User Growth & Activity Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {userStats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.metric}</p>
                            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                        </div>
                        <span className={`text-sm font-bold px-3 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 rounded-3xl p-10 text-white">
                <h4 className="text-xl font-bold mb-6">User Retention Analytics</h4>
                <div className="flex items-end gap-4 h-32">
                    {[40, 65, 80, 55, 90, 75, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-green-500 rounded-t-lg transition-all hover:bg-yellow-400" style={{ height: `${h}%` }}></div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-black uppercase">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                </div>
            </div>
        </div>
    );
};

export default UserReports;
