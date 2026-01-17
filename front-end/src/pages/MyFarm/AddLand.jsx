import React, { useState, useEffect } from 'react';
import api from "../../api/axios"; 
import { 
  Plus, Activity, Search, 
  MapPin, Loader2, TreePine, 
  CloudSun, Sprout, 
  Navigation, Trash, Map
} from 'lucide-react';

const AddLand = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({ temp: '24', condition: 'Scanning...' });
    const [searchTerm, setSearchTerm] = useState("");
    
    const [formData, setFormData] = useState({ 
        plot_name: '', 
        area_size: '', 
        land_status: 'Active',
        crops: [], 
        animals: [] 
    });

    const [tempCrop, setTempCrop] = useState("");
    const [tempAnimal, setTempAnimal] = useState("");

    const LAND_PATH = '/farmer/farm/land';

    const theme = {
        container: { 
            marginTop: "80px", 
            minHeight: "calc(100vh - 80px)", 
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", 
            padding: "40px 20px", 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "'Inter', sans-serif" 
        },
        glassCard: { 
            width: "100%", 
            maxWidth: "900px", 
            background: "rgba(255, 255, 255, 0.95)", 
            backdropFilter: "blur(10px)", 
            borderRadius: "24px", 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)", 
            overflow: "hidden",
            marginBottom: "40px"
        },
        header: { 
            background: "#166534", 
            padding: "30px", 
            color: "white", 
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        },
        inputField: { 
            width: "100%", 
            padding: "14px 16px", 
            borderRadius: "12px", 
            border: "2px solid #e2e8f0", 
            fontSize: "16px", 
            outline: "none", 
            boxSizing: "border-box", 
            backgroundColor: "#fff",
            transition: "0.3s"
        },
        label: { 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            fontSize: "14px", 
            fontWeight: "600", 
            color: "#14532d", 
            marginBottom: "8px" 
        },
        submitBtn: { 
            width: "100%", 
            padding: "18px", 
            background: "#15803d", 
            color: "white", 
            border: "none", 
            borderRadius: "14px", 
            fontSize: "18px", 
            fontWeight: "bold", 
            cursor: "pointer", 
            marginTop: "20px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "10px" 
        },
        listItem: { 
            padding: "10px 15px", 
            background: "#f0fdf4", 
            borderRadius: "10px", 
            fontSize: "15px", 
            color: "#166534", 
            fontWeight: "500",
            borderLeft: "4px solid #22c55e"
        }
    };

    useEffect(() => {
        setTimeout(() => setWeather({ temp: '28', condition: 'Optimal' }), 2000);
        fetchLands();
    }, []);

    const fetchLands = async () => {
        setLoading(true);
        try {
            const res = await api.get(LAND_PATH);
            setLands(res.data.data || []);
        } catch (err) {
            console.error("Registry Sync Failed");
        } finally {
            setLoading(false);
        }
    };

    const addCropToForm = () => {
        if (tempCrop) {
            setFormData({ ...formData, crops: [...formData.crops, tempCrop] });
            setTempCrop("");
        }
    };

    const addAnimalToForm = () => {
        if (tempAnimal) {
            setFormData({ ...formData, animals: [...formData.animals, tempAnimal] });
            setTempAnimal("");
        }
    };

    const handleAddLand = async (e) => {
        e.preventDefault();
        try {
            await api.post(LAND_PATH, formData);
            alert("Success! Asset & Biology DROPPED into the registry.");
            setFormData({ plot_name: '', area_size: '', land_status: 'Active', crops: [], animals: [] });
            fetchLands();
        } catch (err) {
            alert(err.response?.data?.message || "Registry entry failed.");
        }
    };

    const handleDropLand = async (id) => {
        if (window.confirm("DROP this asset from the registry?")) {
            try {
                await api.delete(`${LAND_PATH}/${id}`);
                fetchLands();
            } catch (err) { alert("DROP failed."); }
        }
    };

    return (
        <div style={theme.container}>
            <div style={theme.glassCard}>
                <div style={theme.header}>
                    <Sprout size={40} />
                    <h1 style={{ margin: "10px 0 5px 0", fontSize: "28px", fontWeight: "800" }}>
                        ASSET <span style={{ fontWeight: "400" }}>Registry</span>
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: "14px" }}>Register your land plot and biological assets</p>
                </div>

                <form onSubmit={handleAddLand} style={{ padding: "40px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "25px" }}>
                        <div>
                            <label style={theme.label}><MapPin size={16}/> Plot Identity</label>
                            <input 
                                style={theme.inputField} 
                                value={formData.plot_name}
                                onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                                placeholder="e.g. Sector-7 Delta" required 
                            />
                        </div>
                        <div>
                            <label style={theme.label}><Map size={16}/> Area Size (Hectares)</label>
                            <input 
                                style={theme.inputField} 
                                type="number" 
                                value={formData.area_size}
                                onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                                placeholder="0.00" required 
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                        {/* CROPS SECTION */}
                        <div>
                            <label style={theme.label}>Add Crops ({formData.crops.length})</label>
                            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                                <input 
                                    style={theme.inputField} 
                                    value={tempCrop}
                                    onChange={(e) => setTempCrop(e.target.value)}
                                    placeholder="Crop name..."
                                />
                                <button type="button" onClick={addCropToForm} style={{ ...theme.submitBtn, marginTop: 0, width: "60px" }}>
                                    <Plus size={24} />
                                </button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {formData.crops.map((c, i) => (
                                    <div key={i} style={theme.listItem}>{c}</div>
                                ))}
                            </div>
                        </div>

                        {/* ANIMALS SECTION */}
                        <div>
                            <label style={theme.label}>Add Livestock ({formData.animals.length})</label>
                            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                                <input 
                                    style={theme.inputField} 
                                    value={tempAnimal}
                                    onChange={(e) => setTempAnimal(e.target.value)}
                                    placeholder="Animal species..."
                                />
                                <button type="button" onClick={addAnimalToForm} style={{ ...theme.submitBtn, marginTop: 0, width: "60px", background: "#166534" }}>
                                    <Plus size={24} />
                                </button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {formData.animals.map((a, i) => (
                                    <div key={i} style={{ ...theme.listItem, background: "#f0f9ff", color: "#0369a1", borderLeft: "4px solid #0ea5e9" }}>{a}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" style={theme.submitBtn}>
                        <Activity size={22} /> DROP INTO REGISTRY
                    </button>
                </form>
            </div>

            {/* EXPLORER SECTION */}
            <div style={{ width: "100%", maxWidth: "900px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
                    <div>
                        <h2 style={{ color: "#166534", margin: 0 }}>Registry Explorer</h2>
                        <div style={{ position: "relative", marginTop: "10px" }}>
                            <Search style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} size={20} />
                            <input 
                                style={{ ...theme.inputField, paddingLeft: "45px", width: "300px" }}
                                placeholder="Filter assets..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ background: "#fff", padding: "10px 20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "10px" }}>
                        <CloudSun color="#f59e0b" />
                        <span style={{ fontWeight: "700", color: "#1e293b" }}>{weather.temp}°C • {weather.condition}</span>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                    {loading ? (
                        <Loader2 style={{ animation: "spin 2s linear infinite", color: "#15803d" }} size={40} />
                    ) : lands.filter(l => l.plot_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((plot) => (
                        <div key={plot.id} style={{ background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                            <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "12px", color: "#15803d" }}>
                                    <TreePine size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>{plot.plot_name}</h4>
                                    <span style={{ fontSize: "13px", color: "#64748b" }}>{plot.area_size} Hectares</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <div style={{ flex: 1, background: "#f8fafc", padding: "10px", borderRadius: "10px", textAlign: "center" }}>
                                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#15803d" }}>{plot.crops?.length || 0}</div>
                                    <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Crops</div>
                                </div>
                                <div style={{ flex: 1, background: "#f8fafc", padding: "10px", borderRadius: "10px", textAlign: "center" }}>
                                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#0369a1" }}>{plot.animals?.length || 0}</div>
                                    <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>Livestock</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDropLand(plot.id)} 
                                style={{ width: "100%", marginTop: "15px", padding: "10px", border: "1px solid #fee2e2", background: "none", color: "#ef4444", borderRadius: "10px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
                            >
                                <Trash size={14} /> DROP ASSET
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddLand;
