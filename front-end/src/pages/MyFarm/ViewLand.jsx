import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewLand = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLands = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/farmer/farm/land', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLands(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching lands:", err);
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (window.confirm("Are you sure you want to DROP this land plot?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/farmer/farm/land/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Update local state to remove the dropped record
                setLands(lands.filter(plot => plot.id !== id));
            } catch (err) {
                alert("Failed to drop land plot.");
            }
        }
    };

    useEffect(() => { fetchLands(); }, []);

    if (loading) return <div className="p-10 text-center">Loading Farm Registry...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Registered Land Plots</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {lands.length} Total Plots
                </span>
            </div>

            {lands.length === 0 ? (
                <div className="bg-white p-10 text-center rounded-lg border-2 border-dashed">
                    <p className="text-gray-500">No land plots found in the registry.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lands.map((plot) => (
                        <div key={plot.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-green-600 p-3">
                                <h3 className="text-white font-bold truncate">{plot.plot_name}</h3>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500 text-sm">Area Size:</span>
                                    <span className="font-semibold">{plot.area_size} Hectares</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-500 text-sm">Status:</span>
                                    <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${plot.land_status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {plot.land_status}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-4 border-t pt-4">
                                    <button className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition">
                                        Edit Details
                                    </button>
                                    <button 
                                        onClick={() => handleDrop(plot.id)}
                                        className="flex-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded font-bold transition"
                                    >
                                        DROP
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewLand;