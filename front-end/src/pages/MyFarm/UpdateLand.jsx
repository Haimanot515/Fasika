import React, { useState, useEffect } from 'react';
import api from "../../api/axios"; 
import { 
  Plus, X, Save, MapPin, Maximize, 
  Activity, Info, Loader2, Sprout
} from 'lucide-react';

const UpdateLand = ({ plotId, onUpdateSuccess, onCancel }) => {
    const [loading, setLoading] = useState(true);
    const [tempCrop, setTempCrop] = useState("");
    const [tempAnimal, setTempAnimal] = useState("");
    const [formData, setFormData] = useState({
        plot_name: '',
        area_size: '',
        land_status: 'Active',
        crops: [],
        animals: []
    });

    const LAND_PATH = `/farmer/farm/land/${plotId}`;

    const theme = {
        wrapper: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            // Increased padding significantly to force it below any navbar
            paddingTop: "160px", 
            overflowY: "auto",
            // Lower z-index than a typical navbar (usually 1000+) but high enough to cover content
            zIndex: 999, 
            display: "flex", 
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif"
        },
        glassCard: { 
            width: "100%", 
            maxWidth: "800px", 
            background: "rgba(255, 255, 255, 0.98)", 
            backdropFilter: "blur(10px)", 
            borderRadius: "24px", 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)", 
            overflow: "hidden",
            height: "fit-content",
            // Extra margin to ensure it never touches the top
            marginTop: "20px",
            marginBottom: "100px" 
        },
        header: { 
            background: "#166534", 
            padding: "25px 30px", 
            color: "white", 
            display: "flex", 
            justifyContent: "space-between", 
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
            backgroundColor: "#fff" 
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
        listItem: { 
            padding: "10px 15px", 
            background: "#f0fdf4", 
            borderRadius: "10px", 
            fontSize: "14px", 
            color: "#166534", 
            fontWeight: "600",
            borderLeft: "4px solid #22c55e",
            marginBottom: "4px"
        },
        saveBtn: { 
            flex: 2, 
            padding: "18px", 
            background: "#15803d", 
            color: "white", 
            border: "none", 
            borderRadius: "14px", 
            fontSize: "18px", 
            fontWeight: "bold", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "10px" 
        }
    };

    useEffect(() => {
        const fetchCurrentPlot = async () => {
            try {
                const res = await api.get('/farmer/farm/land');
                const plot = res.data.data.find(p => p.id === parseInt(plotId));
                if (plot) {
                    setFormData({
                        plot_name: plot.plot_name,
                        area_size: plot.area_size,
                        land_status: plot.land_status || 'Active',
                        crops: plot.crops || [],
                        animals: plot.animals || []
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("Registry Sync Failed", err);
                setLoading(false);
            }
        };
        fetchCurrentPlot();
    }, [plotId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(LAND_PATH, formData);
            alert("Success! Registry node updated.");
            onUpdateSuccess();
        } catch (err) {
            alert("DROP update failed. Check node connection.");
        }
    };

    const addCrop = () => { if(tempCrop) { setFormData({...formData, crops: [...formData.crops, tempCrop]}); setTempCrop(""); } };
    const addAnimal = () => { if(tempAnimal) { setFormData({...formData, animals: [...formData.animals, tempAnimal]}); setTempAnimal(""); } };

    if (loading) return (
        <div style={theme.wrapper}>
            <div style={{ textAlign: 'center' }}>
                <Loader2 style={{ animation: "spin 2s linear infinite", color: "#15803d" }} size={40} />
                <p style={{ color: "#166534", fontWeight: "600" }}>Syncing Node...</p>
            </div>
        </div>
    );

    return (
        <div style={theme.wrapper}>
            <div style={theme.glassCard}>
                <div style={theme.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Sprout size={28} />
                        <div>
                            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>Update <span style={{fontWeight: "400"}}>Registry</span></h2>
                            <p style={{ margin: 0, fontSize: "11px", opacity: 0.8 }}>NODE ID: {plotId}</p>
                        </div>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                </div>

                <form onSubmit={handleUpdate} style={{ padding: "30px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        <div>
                            <label style={theme.label}><MapPin size={16}/> Identity Name</label>
                            <input 
                                style={theme.inputField}
                                value={formData.plot_name}
                                onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={theme.label}><Maximize size={16}/> Area (Ha)</label>
                            <input 
                                style={theme.inputField}
                                type="number"
                                value={formData.area_size}
                                onChange={(e) => setFormData({...formData, area_size: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "25px" }}>
                        <label style={theme.label}>Node Status</label>
                        <select 
                            style={theme.inputField}
                            value={formData.land_status}
                            onChange={(e) => setFormData({...formData, land_status: e.target.value})}
                        >
                            <option value="Active">Active Production</option>
                            <option value="Fallow">Fallow (Resting)</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "25px" }}>
                        {/* VERTICAL CROP LIST */}
                        <div>
                            <label style={theme.label}>Crops ({formData.crops.length})</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                                <input style={theme.inputField} value={tempCrop} onChange={(e) => setTempCrop(e.target.value)} placeholder="Add..."/>
                                <button type="button" onClick={addCrop} style={{ padding: "10px", background: "#15803d", color: "white", border: "none", borderRadius: "10px" }}><Plus size={20}/></button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {formData.crops.map((c, i) => (
                                    <div key={i} style={theme.listItem}>{c}</div>
                                ))}
                            </div>
                        </div>

                        {/* VERTICAL ANIMAL LIST */}
                        <div>
                            <label style={theme.label}>Livestock ({formData.animals.length})</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                                <input style={theme.inputField} value={tempAnimal} onChange={(e) => setTempAnimal(e.target.value)} placeholder="Add..."/>
                                <button type="button" onClick={addAnimal} style={{ padding: "10px", background: "#0369a1", color: "white", border: "none", borderRadius: "10px" }}><Plus size={20}/></button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {formData.animals.map((a, i) => (
                                    <div key={i} style={{...theme.listItem, background: "#f0f9ff", color: "#0369a1", borderLeft: "4px solid #0ea5e9"}}>{a}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", padding: "15px", backgroundColor: "#f0fdf4", borderRadius: "12px", marginBottom: "20px" }}>
                        <Info size={18} color="#15803d" />
                        <p style={{ fontSize: "12px", color: "#166534", margin: 0 }}>Updating this node will synchronize all biological assets across the registry.</p>
                    </div>

                    <div style={{ display: "flex", gap: "15px" }}>
                        <button type="submit" style={theme.saveBtn}>
                            <Activity size={20} /> SAVE UPDATES
                        </button>
                        <button type="button" onClick={onCancel} style={{ flex: 1, padding: "18px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "14px", fontWeight: "bold", cursor: "pointer" }}>
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateLand;
