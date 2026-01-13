import React from 'react';
import { Link } from 'react-router-dom';

const Management = () => {
    const managementModules = [
        { title: "Product Hub", desc: "Approve listings and manage price indexes", link: "/admin/product", icon: "🌾" },
        { title: "User Control", desc: "Manage farmers, buyers and staff accounts", link: "/admin/user", icon: "👥" },
        { title: "Weather Center", desc: "Publish advisories and climate data", link: "/admin/weather", icon: "⛅" },
        { title: "Expert Tips", desc: "Educational content for farmers", link: "/admin/tips", icon: "💡" },
    ];

    return (
        <div className="p-8 bg-white min-h-screen">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-green-900 tracking-tight">Management Hub</h1>
                <p className="text-gray-500 mt-2 text-lg">Central control for all Fasika platform operations.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {managementModules.map((module) => (
                    <Link
                        key={module.link}
                        to={module.link}
                        className="group flex items-start p-8 bg-gray-50 hover:bg-green-50 rounded-2xl border-2 border-transparent hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="bg-white p-4 rounded-xl shadow-sm text-4xl mr-6 group-hover:scale-110 transition-transform">
                            {module.icon}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-800">{module.title}</h3>
                            <p className="text-gray-600 mt-2 leading-relaxed">{module.desc}</p>
                            <span className="inline-flex items-center mt-4 text-green-700 font-semibold group-hover:translate-x-1 transition-transform">
                                Open Module <span className="ml-2">→</span>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Management;
