import React from 'react';

const UserDetail = () => {
    const user = {
        id: "USR-00451",
        name: "Bekele Megersa",
        role: "Farmer",
        email: "bekele.m@example.com",
        phone: "+251 911 223344",
        joined: "Aug 15, 2024",
        address: "Bishoftu, Oromia, Ethiopia",
        verified: true
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto">
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-50">
                    <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center text-4xl text-green-600 font-bold">
                        BM
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">{user.name}</h2>
                        <p className="text-green-700 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Verified {user.role}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                    <InfoBox label="User ID" value={user.id} />
                    <InfoBox label="Registration Date" value={user.joined} />
                    <InfoBox label="Email Address" value={user.email} />
                    <InfoBox label="Phone Number" value={user.phone} />
                    <InfoBox label="Primary Address" value={user.address} fullScreen />
                </div>

                <div className="mt-12 flex gap-4">
                    <button className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors">Edit Profile</button>
                    <button className="flex-1 bg-red-50 text-red-600 py-4 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition-colors">Suspend Account</button>
                </div>
            </div>
        </div>
    );
};

const InfoBox = ({ label, value, fullScreen }) => (
    <div className={fullScreen ? "col-span-2" : ""}>
        <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">{label}</h5>
        <p className="text-gray-800 font-semibold">{value}</p>
    </div>
);

export default UserDetail;
