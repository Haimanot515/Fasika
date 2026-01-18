import React, { useState, useEffect } from "react";
import api from "../../api/axios"; 
import { X, Loader2, MapPin, Maximize, Sprout, Plus, Trash2, Info, Activity } from "lucide-react";

const UpdateLand = ({ plotId, onUpdateSuccess, onCancel }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [landImage, setLandImage] = useState(null);

    // 1. Basic Land Details (Synced with AddLand structure)
    const [formData, setFormData] = useState({
        plot_name: "",
        area_size: "",
        soil_type: "Nitosols",
        climate_zone: "Weyna Dega",
        region: "",
        zone: "",
        woreda: "",
        kebele: ""
    });

    // 2. Dynamic Asset States (Synced with AddLand)
    const [crops, setCrops] = useState([]);
    const [animals, setAnimals] = useState([]);

    const LAND_PATH = `/farmer/farm/land/${plotId}`;

    // Fetch existing data to populate the form
    useEffect(() => {
        const fetchCurrentPlot = async () => {
            try {
                const res = await api.get('/farmer/farm/land');
                const plot = res.data.data.find(p => p.id === parseInt(plotId));
                if (plot) {
                    setFormData({
                        plot_name: plot.plot_name || "",
                        area_size: plot.area_size || "",
                        soil_type: plot.soil_type_name || "Nitosols",
                        climate_zone: plot.climate_zone || "Weyna Dega",
                        region: plot.region || "",
                        zone: plot.zone || "",
                        woreda: plot.woreda || "",
                        kebele: plot.kebele || ""
                    });
                    // If backend sends specific crop/animal objects, set them here
                    setCrops(plot.crops || []);
                    setAnimals(plot.animals || []);
                }
                setLoading(false);
            } catch (err) {
                console.error("Registry Sync Failed", err);
                setLoading(false);
            }
        };
        fetchCurrentPlot();
        window.scrollTo(0, 0);
    }, [plotId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Dynamic Row Logic (Exact Copy from AddLand) ---
    const addCropRow = () => setCrops([...crops, { crop_name: "", quantity: "" }]);
    const removeCropRow = (index) => setCrops(crops.filter((_, i) => i !== index));
    const updateCrop = (index, field, value) => {
        const updated = [...crops];
        updated[index][field] = value;
        setCrops(updated);
    };

    const addAnimalRow = () => setAnimals([...animals, { animal_type: "", head_count: "" }]);
    const removeAnimalRow = (index) => setAnimals(animals.filter((_, i) => i !== index));
    const updateAnimal = (index, field, value) => {
        const updated = [...animals];
        updated[index][field] = value;
        setAnimals(updated);
    };

    // --- Submit Logic (Exact Copy from AddLand logic) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus({ type: "", message: "" });

        const data = new FormData();
        
        // Append text fields
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // Stringify arrays for the backend
        data.append("crops", JSON.stringify(crops));
        data.append("animals", JSON.stringify(animals));

        if (landImage) data.append("land_image", landImage);

        try {
            const response = await api.put(LAND_PATH, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                alert("Registry node updated successfully!");
                onUpdateSuccess();
            }
        } catch (err) {
            console.error("Update Error:", err);
            setStatus({ type: "error", message: err.response?.data?.error || "Update failed." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={theme.wrapper}>
            <Loader2 style={{ animation: "spin 2s linear infinite", color: "#166534" }} size={40} />
            <p>Syncing Node 0x{plotId}...</p>
        </div>
    );

    return (
        <div style={theme.wrapper}>
            <div style={theme.glassCard}>
                <div style={theme.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Sprout size={32} />
                        <div>
                            <h2 style={{ margin: 0 }}>Update <span style={{fontWeight: "300"}}>Registry</span></h2>
                            <p style={{ margin: 0, fontSize: "11px", opacity: 0.8 }}>IDENTIFIER: {plotId}</p>
                        </div>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={30}/></button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: "40px" }}>
                    {status.message && (
                        <div style={{ padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#ffebee', color: '#c62828' }}>
                            {status.message}
                        </div>
                    )}

                    {/* Section 1: Land Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                        <div>
                            <label style={theme.label}><MapPin size={16}/> Identity Name</label>
                            <input type="text" name="plot_name" value={formData.plot_name} onChange={handleInputChange} required style={theme.inputField} />
                        </div>
                        <div>
                            <label style={theme.label}><Maximize size={16}/> Area (Ha)</label>
                            <input type="number" name="area_size" value={formData.area_size} onChange={handleInputChange} required style={theme.inputField} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                        <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleInputChange} style={theme.inputField} />
                        <input type="text" name="zone" placeholder="Zone" value={formData.zone} onChange={handleInputChange} style={theme.inputField} />
                        <input type="text" name="woreda" placeholder="Woreda" value={formData.woreda} onChange={handleInputChange} style={theme.inputField} />
                        <input type="text" name="kebele" placeholder="Kebele" value={formData.kebele} onChange={handleInputChange} style={theme.inputField} />
                    </div>

                    {/* Section 2: Crops Assets (Synced with AddLand) */}
                    <h4 style={{ color: '#2e7d32', marginBottom: '15px' }}>Biological Assets: Crops</h4>
                    {crops.map((crop, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input type="text" placeholder="Crop Name" value={crop.crop_name} onChange={(e) => updateCrop(index, 'crop_name', e.target.value)} style={theme.inputField} required />
                            <input type="number" placeholder="Quantity" value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} style={theme.inputField} required />
                            <button type="button" onClick={() => removeCropRow(index)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={20}/></button>
                        </div>
                    ))}
                    <button type="button" onClick={addCropRow} style={theme.addBtn}>+ Add Crop Row</button>

                    {/* Section 3: Animals Assets (Synced with AddLand) */}
                    <h4 style={{ color: '#1e40af', marginTop: '30px', marginBottom: '15px' }}>Biological Assets: Livestock</h4>
                    {animals.map((animal, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input type="text" placeholder="Animal Type" value={animal.animal_type} onChange={(e) => updateAnimal(index, 'animal_type', e.target.value)} style={theme.inputField} required />
                            <input type="number" placeholder="Head Count" value={animal.head_count} onChange={(e) => updateAnimal(index, 'head_count', e.target.value)} style={theme.inputField} required />
                            <button type="button" onClick={() => removeAnimalRow(index)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={20}/></button>
                        </div>
                    ))}
                    <button type="button" onClick={addAnimalRow} style={{...theme.addBtn, color: '#1e40af', borderColor: '#1e40af'}}>+ Add Animal Row</button>

                    <hr style={{ margin: '40px 0', border: '0.5px solid #eee' }} />

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Update Image (Optional)</label>
                        <input type="file" onChange={(e) => setLandImage(e.target.files[0])} />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button type="submit" disabled={submitting} style={theme.saveBtn}>
                            {submitting ? "SYNCHRONIZING..." : "DROP UPDATES INTO REGISTRY"}
                        </button>
                        <button type="button" onClick={onCancel} style={theme.cancelBtn}>CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- In-line Styles matching the premium look ---
const theme = {
    wrapper: { position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100vh', background: "rgba(240, 253, 244, 0.95)", zIndex: 1100, display: 'flex', justifyContent: 'center', padding: '100px 0' },
    glassCard: { width: '95%', maxWidth: '1000px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', height: 'fit-content' },
    header: { background: '#166534', padding: '30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#166534', marginBottom: '8px' },
    inputField: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' },
    addBtn: { background: 'none', border: '2px dashed #166534', color: '#166534', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
    saveBtn: { flex: 2, padding: '20px', background: '#166534', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', fontSize: '16px' },
    cancelBtn: { flex: 1, padding: '20px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }
};

export default UpdateLand;
