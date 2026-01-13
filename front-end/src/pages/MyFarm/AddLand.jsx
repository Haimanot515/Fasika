import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Trash2, Map, Maximize, Activity, Search, 
  MapPin, Info, Loader2, Wheat, TreePine, 
  Settings2, Layers, AlertCircle
} from 'lucide-react';

// Configure Axios globally to handle cookies for all requests
axios.defaults.withCredentials = true;

const AddLand = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [authError, setAuthError] = useState(false);
    const [formData, setFormData] = useState({
        plot_name: '',
        area_size: '',
        land_status: 'Active'
    });

    // Explicitly pointing to your verified server endpoint
    const API_URL = 'http://localhost:5000/api/farmer/farm/land';

    const fetchLands = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            // Ensure we handle the standard { success, data } response format
            setLands(res.data.data || []);
            setAuthError(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            if (err.response?.status === 401) setAuthError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLand = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            setFormData({ plot_name: '', area_size: '', land_status: 'Active' });
            fetchLands(); // Refresh registry
            alert("Success! Asset DROPPED into the registry.");
        } catch (err) {
            console.error("Post Error:", err);
            alert(err.response?.data?.message || "Registry entry failed.");
        }
    };

    const handleDropLand = async (id) => {
        if (window.confirm("Are you sure you want to DROP this plot from the registry?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchLands();
            } catch (err) {
                alert("DROP failed: Permission denied or server error.");
            }
        }
    };

    useEffect(() => { fetchLands(); }, []);

    const filteredLands = lands.filter(plot => 
        plot.plot_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex flex-col md:flex-row font-sans text-slate-900">
            
            {/* --- LEFT SIDE: CONTROL PANEL --- */}
            <div className="w-full md:w-[420px] bg-white border-r border-slate-100 p-10 flex flex-col shadow-xl z-20">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3 text-emerald-600 font-bold text-xs uppercase tracking-[0.2em]">
                        <Layers size={14} /> <span>Smart Farm OS</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                        DROP <br /> 
                        <span className="text-emerald-500 font-light italic">Registry</span>
                    </h1>
                </div>

                {authError && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-medium">
                        <AlertCircle size={18} />
                        <span>Session expired. Please login.</span>
                    </div>
                )}

                <form onSubmit={handleAddLand} className="space-y-8">
                    <div className="space-y-6">
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Plot Name</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    value={formData.plot_name}
                                    onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent p-5 pl-14 rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-700 outline-none" 
                                    placeholder="e.g. North Valley" required 
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Area Size (Hectares)</label>
                            <div className="relative">
                                <Maximize className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input 
                                    type="number" 
                                    value={formData.area_size}
                                    onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent p-5 pl-14 rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-700 outline-none" 
                                    placeholder="0.00" step="0.01" required 
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-6 rounded-[2rem] transition-all transform hover:-translate-y-1 shadow-2xl shadow-slate-200 flex justify-center items-center gap-3">
                        <Plus size={22} /> REGISTER ASSET
                    </button>
                </form>

                <div className="mt-auto pt-10">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start gap-4">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-emerald-600"><Info size={20} /></div>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                            Data synced with the <b>Secure DROP Node</b>.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: LANDSCAPE VIEW --- */}
            <div className="flex-1 p-8 md:p-16 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    
                    <div className="flex flex-col md:flex-row gap-8 justify-between items-end mb-16">
                        <div className="w-full md:w-[450px]">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Registry Explorer</h2>
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={22} />
                                <input 
                                    type="text"
                                    placeholder="Filter by plot identity..."
                                    className="w-full bg-white border-none shadow-2xl shadow-slate-100 p-6 pl-16 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/5 font-bold text-lg outline-none transition-all"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-4 bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                             <div className="text-right">
                                <p className="text-[10px] font-black text-emerald-600/60 uppercase">System Status</p>
                                <p className="text-sm font-black text-emerald-700 uppercase tracking-tighter">Verified Node</p>
                             </div>
                             <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Activity size={24} />
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {loading ? (
                            <div className="col-span-2 flex flex-col items-center justify-center py-32">
                                <Loader2 className="animate-spin text-emerald-500 mb-6" size={60} />
                                <span className="font-black text-slate-300 uppercase tracking-widest text-sm">Synchronizing...</span>
                            </div>
                        ) : filteredLands.length === 0 ? (
                            <div className="col-span-2 flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-50">
                                <Map className="text-slate-200 mb-4" size={48} />
                                <span className="font-black text-slate-400 uppercase tracking-widest text-xs">No assets in registry.</span>
                            </div>
                        ) : filteredLands.map((plot, index) => (
                            <div key={plot.id} className="group bg-white p-10 rounded-[4rem] shadow-xl shadow-slate-200/30 border border-transparent hover:border-emerald-100 transition-all relative overflow-hidden">
                                <div className="absolute top-10 right-10">
                                    <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                </div>

                                <div className="flex items-center gap-6 mb-10">
                                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center ${index % 2 === 0 ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>
                                        {index % 2 === 0 ? <Wheat size={36} /> : <TreePine size={36} />}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{plot.plot_name}</h3>
                                        <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">REG: {plot.id.slice(0, 8)}</p>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Calculated Area</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-slate-900 tracking-tighter italic">{plot.area_size}</span>
                                            <span className="text-emerald-500 font-black text-lg uppercase italic">Ha</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button className="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 rounded-[1.5rem] transition-all">
                                            <Settings2 size={24} />
                                        </button>
                                        <button 
                                            onClick={() => handleDropLand(plot.id)}
                                            className="w-14 h-14 flex items-center justify-center bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-[1.5rem] transition-all shadow-lg shadow-rose-100"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute -bottom-16 -right-16 opacity-[0.02] group-hover:opacity-[0.06] group-hover:-rotate-12 transition-all text-black pointer-events-none">
                                    <Map size={280} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLand;