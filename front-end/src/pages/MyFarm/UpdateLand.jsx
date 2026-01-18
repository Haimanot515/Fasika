import React, { useState, useEffect } from "react";
import api from "../../api/axios"; 
import { X, Loader2, MapPin, Maximize, Sprout, Plus, Trash2 } from "lucide-react";

const UpdateLand = ({ plotId, onUpdateSuccess, onCancel }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [landImage, setLandImage] = useState(null);

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

    const [crops, setCrops] = useState([]);
    const [animals, setAnimals] = useState([]);

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
    }, [plotId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append("crops", JSON.stringify(crops));
        data.append("animals", JSON.stringify(animals));
        if (landImage) data.append("land_image", landImage);

        try {
            const response = await api.put(`/farmer/farm/land/${plotId}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data.success) {
                alert("Registry node updated successfully!");
                onUpdateSuccess();
            }
        } catch (err) {
            setStatus({ type: "error", message: err.response?.data?.error || "Update failed." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={theme.wrapper}>
            <Loader2 style={{ animation: "spin 2s linear infinite", color: "#fff" }} size={40} />
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
                            <p style={{ margin: 0, fontSize: "11px", opacity: 0.8 }}>ID: {plotId}</p>
                        </div>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={30}/></button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: "40px" }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                        <div>
                            <label style={theme.label}><MapPin size={14} style={{marginRight: '5px'}}/> Plot Name</label>
                            <input type="text" name="plot_name" value={formData.plot_name} onChange={handleInputChange} required style={theme.inputField} />
                        </div>
                        <div>
                            <label style={theme.label}><Maximize size={14} style={{marginRight: '5px'}}/> Area (Ha)</label>
                            <input type="number" name="area_size" value={formData.area_size} onChange={handleInputChange} required style={theme.inputField} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
                        <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleInputChange} style={theme.inputField} />
                        <input type="text" name="zone" placeholder="Zone" value={formData.zone} onChange={handleInputChange} style={theme.inputField} />
                        <input type="text" name="woreda" placeholder="Woreda" value={formData.woreda} onChange={handleInputChange} style={theme.inputField} />
                        <input type="text" name="kebele" placeholder="Kebele" value={formData.kebele} onChange={handleInputChange} style={theme.inputField} />
                    </div>

                    <h4 style={{ color: '#166534', marginBottom: '15px' }}>Biological Assets: Crops</h4>
                    {crops.map((crop, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input type="text" placeholder="Name" value={crop.crop_name} onChange={(e) => updateCrop(index, 'crop_name', e.target.value)} style={theme.inputField} />
                            <input type="number" placeholder="Qty" value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} style={theme.inputField} />
                            <button type="button" onClick={() => removeCropRow(index)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={20}/></button>
                        </div>
                    ))}
                    <button type="button" onClick={addCropRow} style={theme.addBtn}>+ Add Crop</button>

                    <h4 style={{ color: '#1e40af', marginTop: '30px', marginBottom: '15px' }}>Biological Assets: Livestock</h4>
                    {animals.map((animal, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input type="text" placeholder="Type" value={animal.animal_type} onChange={(e) => updateAnimal(index, 'animal_type', e.target.value)} style={theme.inputField} />
                            <input type="number" placeholder="Count" value={animal.head_count} onChange={(e) => updateAnimal(index, 'head_count', e.target.value)} style={theme.inputField} />
                            <button type="button" onClick={() => removeAnimalRow(index)} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}><Trash2 size={20}/></button>
                        </div>
                    ))}
                    <button type="button" onClick={addAnimalRow} style={{...theme.addBtn, borderColor: '#1e40af', color: '#1e40af'}}>+ Add Animal</button>

                    <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                        <button type="submit" disabled={submitting} style={theme.saveBtn}>
                            {submitting ? "SYNCING..." : "DROP UPDATES INTO REGISTRY"}
                        </button>
                        <button type="button" onClick={onCancel} style={theme.cancelBtn}>CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const theme = {
    wrapper: { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        background: "rgba(0, 0, 0, 0.75)", 
        backdropFilter: 'blur(10px)',
        // 🚀 HIGHEST Z-INDEX
        zIndex: 1000000, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        padding: '60px 0', 
        overflowY: 'auto' 
    },
    glassCard: { 
        width: '90%', 
        maxWidth: '850px', 
        background: 'white', 
        borderRadius: '24px', 
        height: 'fit-content', 
        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
        marginBottom: '100px' 
    },
    header: { 
        background: '#166534', 
        padding: '25px 40px', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderTopLeftRadius: '24px', 
        borderTopRightRadius: '24px' 
    },
    label: { fontSize: '13px', fontWeight: '800', color: '#166534', marginBottom: '8px', display: 'flex', alignItems: 'center' },
    inputField: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' },
    addBtn: { background: 'none', border: '2px dashed #166534', color: '#166534', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    saveBtn: { flex: 2, padding: '18px', background: '#166534', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
    cancelBtn: { flex: 1, padding: '18px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }
};

export default UpdateLand;
