import React, { useState, useEffect } from 'react';
import api from "../../api/axios"; 
import { 
  Plus, X, Save, MapPin, Maximize, 
  Activity, Info, Loader2, Sprout, Trash2
} from 'lucide-react';

const UpdateLand = ({ plotId, onUpdateSuccess, onCancel }) => {
    const [loading, setLoading] = useState(true);
    
    // TEMPORARY STATES FOR ADDING ASSETS
    const [tempCrop, setTempCrop] = useState({ name: "", qty: "" });
    const [tempAnimal, setTempAnimal] = useState({ type: "", count: "" });

    const [formData, setFormData] = useState({
        plot_name: '',
        area_size: '',
        land_status: 'Active',
        crops: [], // Will hold objects { crop_name, quantity }
        animals: [] // Will hold objects { animal_type, head_count }
    });

    const LAND_PATH = `/farmer/farm/land/${plotId}`;

    const theme = {
        wrapper: {
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', minHeight: '100vh',
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            paddingTop: "120px",
            paddingBottom: "80px",
            zIndex: 999, 
            fontFamily: "'Inter', sans-serif",
            display: "flex", justifyContent: "center"
        },
        glassCard: { 
            width: "95%", maxWidth: "1200px",
            background: "rgba(255, 255, 255, 0.98)", 
            borderRadius: "24px", 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", 
            overflow: "hidden"
        },
        header: { 
            background: "#166534", padding: "30px", color: "white", 
            display: "flex", justifyContent: "space-between", alignItems: "center" 
        },
        inputField: { 
            width: "100%", padding: "14px", borderRadius: "10px", 
            border: "2px solid #e2e8f0", fontSize: "15px"
        },
        label: { 
            display: "flex", alignItems: "center", gap: "8px", 
            fontSize: "14px", fontWeight: "600", color: "#14532d", marginBottom: "8px" 
        },
        assetRow: {
            display: "flex", gap: "8px", alignItems: "center",
            padding: "10px", background: "#f8fafc", borderRadius: "8px", marginBottom: "8px",
            border: "1px solid #e2e8f0"
        }
    };

    useEffect(() => {
        const fetchCurrentPlot = async () => {
            try {
                const res = await api.get('/farmer/farm/land/view');
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
                setLoading(false);
            }
        };
        fetchCurrentPlot();
        window.scrollTo(0, 0);
    }, [plotId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Backend expects crops and animals as arrays of objects
            await api.put(LAND_PATH, formData);
            alert("Success! Registry node updated.");
            onUpdateSuccess();
        } catch (err) {
            alert("DROP update failed.");
        }
    };

    // LOGIC: ADD CROP
    const addCrop = () => {
        if(tempCrop.name) {
            setFormData({
                ...formData, 
                crops: [...formData.crops, { crop_name: tempCrop.name, quantity: tempCrop.qty || 0 }]
            });
            setTempCrop({ name: "", qty: "" });
        }
    };

    // LOGIC: ADD ANIMAL
    const addAnimal = () => {
        if(tempAnimal.type) {
            setFormData({
                ...formData, 
                animals: [...formData.animals, { animal_type: tempAnimal.type, head_count: tempAnimal.count || 0 }]
            });
            setTempAnimal({ type: "", count: "" });
        }
    };

    if (loading) return <div style={theme.wrapper}><Loader2 style={{ animation: "spin 2s linear infinite" }} /></div>;

    return (
        <div style={theme.wrapper}>
            <div style={theme.glassCard}>
                <div style={theme.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Sprout size={32} />
                        <div>
                            <h2 style={{ margin: 0 }}>Update <span style={{fontWeight: "400"}}>Registry</span></h2>
                            <p style={{ margin: 0, fontSize: "11px" }}>ID: {plotId}</p>
                        </div>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white' }}><X size={30}/></button>
                </div>

                <form onSubmit={handleUpdate} style={{ padding: "40px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                        <div>
                            <label style={theme.label}><MapPin size={16}/> Identity Name</label>
                            <input style={theme.inputField} value={formData.plot_name} onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
                        </div>
                        <div>
                            <label style={theme.label}><Maximize size={16}/> Area (Ha)</label>
                            <input style={theme.inputField} type="number" value={formData.area_size} onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                        {/* CROPS SECTION */}
                        <div>
                            <label style={theme.label}>Add Crop (Name & Quantity)</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
                                <input style={theme.inputField} placeholder="Name" value={tempCrop.name} onChange={(e) => setTempCrop({...tempCrop, name: e.target.value})}/>
                                <input style={{...theme.inputField, width: "80px"}} placeholder="Qty" value={tempCrop.qty} onChange={(e) => setTempCrop({...tempCrop, qty: e.target.value})}/>
                                <button type="button" onClick={addCrop} style={{ padding: "0 15px", background: "#15803d", color: "white", border: "none", borderRadius: "8px" }}><Plus /></button>
                            </div>
                            {formData.crops.map((c, i) => (
                                <div key={i} style={theme.assetRow}>
                                    <span style={{flex: 1}}>{c.crop_name}</span>
                                    <span style={{background: "#dcfce7", padding: "2px 8px", borderRadius: "5px"}}>{c.quantity}</span>
                                    <Trash2 size={16} color="red" style={{cursor: "pointer"}} onClick={() => setFormData({...formData, crops: formData.crops.filter((_, idx) => idx !== i)})} />
                                </div>
                            ))}
                        </div>

                        {/* ANIMALS SECTION */}
                        <div>
                            <label style={theme.label}>Add Animal (Type & Count)</label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
                                <input style={theme.inputField} placeholder="Type" value={tempAnimal.type} onChange={(e) => setTempAnimal({...tempAnimal, type: e.target.value})}/>
                                <input style={{...theme.inputField, width: "80px"}} placeholder="Heads" value={tempAnimal.count} onChange={(e) => setTempAnimal({...tempAnimal, count: e.target.value})}/>
                                <button type="button" onClick={addAnimal} style={{ padding: "0 15px", background: "#0369a1", color: "white", border: "none", borderRadius: "8px" }}><Plus /></button>
                            </div>
                            {formData.animals.map((a, i) => (
                                <div key={i} style={{...theme.assetRow, borderLeft: "4px solid #0369a1"}}>
                                    <span style={{flex: 1}}>{a.animal_type}</span>
                                    <span style={{background: "#e0f2fe", padding: "2px 8px", borderRadius: "5px"}}>{a.head_count}</span>
                                    <Trash2 size={16} color="red" style={{cursor: "pointer"}} onClick={() => setFormData({...formData, animals: formData.animals.filter((_, idx) => idx !== i)})} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
                        <button type="submit" style={{ flex: 2, padding: "20px", background: "#15803d", color: "white", borderRadius: "14px", fontWeight: "bold", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                            <Activity /> DROP UPDATES INTO REGISTRY
                        </button>
                        <button type="button" onClick={onCancel} style={{ flex: 1, background: "#f1f5f9", borderRadius: "14px", border: "none" }}>CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateLand;
