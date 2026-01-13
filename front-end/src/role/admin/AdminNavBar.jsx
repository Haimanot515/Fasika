import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import adminMenu from '../../menu/adminMenu';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Member 2 is NOT responsible for auth logic, just the trigger
        console.log("Logout triggered from Admin Navbar");
        // navigate('/login'); // Mock navigation
        window.location.href = '/login'; // Force redirect for now
    };

    return (
        <nav className="bg-green-900 text-white w-64 min-h-screen p-6 flex flex-col">
            <div className="mb-10 text-2xl font-bold tracking-tight text-yellow-400">
                FASIKA <span className="text-white">Admin</span>
            </div>

            <div className="flex-grow space-y-2">
                {adminMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `block py-3 px-4 rounded-lg transition-all ${isActive
                                ? 'bg-yellow-500 text-green-950 font-semibold shadow-inner'
                                : 'hover:bg-green-800 text-green-100'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="pt-6 border-t border-green-800">
                <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-4 rounded-lg text-red-300 hover:bg-red-900/30 hover:text-red-100 transition-colors flex items-center gap-2"
                >
                    <span>🚪</span> Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
