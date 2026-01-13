import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import farmerMenu from '../../menu/farmerMenu';

const FarmerNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Farmer Logout triggered");
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white border-r border-gray-100 w-64 min-h-screen p-8 flex flex-col">
            <div className="mb-12">
                <h2 className="text-2xl font-black text-green-700 tracking-tighter italic">Fasika<span className="text-gray-900">Farmer</span></h2>
            </div>

            <div className="flex-grow space-y-4">
                {farmerMenu.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 rounded-3xl font-bold transition-all ${isActive
                                ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-4 px-6 py-4 rounded-3xl font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
            >
                <span>🚪</span> Logout
            </button>
        </nav>
    );
};

export default FarmerNavbar;
