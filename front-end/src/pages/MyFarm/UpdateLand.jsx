import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Leaf, Map, Ruler, Activity, X, Save } from 'lucide-react';

const UpdateLand = ({ plotId, onUpdateSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        plot_name: '',
        area_size: '',
        land_status: 'Active'
    });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchCurrentPlot = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/farmer/farm/land', config);
                const currentPlot = res.data.data.find(p => p.id === parseInt(plotId));
                if (currentPlot) {
                    setFormData({
                        plot_name: currentPlot.plot_name,
                        area_size: currentPlot.area_size,
                        land_status: currentPlot.land_status
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("Error loading plot details", err);
                setLoading(false);
            }
        };
        fetchCurrentPlot();
    }, [plotId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/farmer/farm/land/${plotId}`, formData, config);
            onUpdateSuccess(); 
        } catch (err) {
            alert("Update failed. Please check the registry connection.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
            {/* Header Section */}
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Map className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Update Land Registry</h3>
                        <p className="text-emerald-100 text-sm">Editing Plot ID: #{plotId}</p>
                    </div>
                </div>
                <button onClick={onCancel} className="hover:bg-emerald-700 p-2 rounded-full transition">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
                {/* Plot Name */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        Plot Name / Designation
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g. North Orchard"
                        value={formData.plot_name}
                        onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50"
                        required 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Area Size */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Ruler className="w-4 h-4 text-emerald-600" />
                            Area Size (Hectares)
                        </label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={formData.area_size}
                            onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50"
                            required 
                        />
                    </div>

                    {/* Status Select */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            Current Status
                        </label>
                        <select 
                            value={formData.land_status}
                            onChange={(e) => setFormData({...formData, land_status: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50 appearance-none cursor-pointer"
                        >
                            <option value="Active">🟢 Active Production</option>
                            <option value="Fallow">🟡 Fallow (Resting)</option>
                            <option value="Under Maintenance">🟠 Under Maintenance</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                        type="submit" 
                        className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-emerald-700 transform hover:-translate-y-0.5 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="flex-1 bg-gray-100 text-gray-600 py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateLand;