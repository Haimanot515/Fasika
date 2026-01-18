import React, { useState, useEffect } from "react";
import api from "../../api/axios"; 
import { 
    Plus, Trash2, MapPin, 
    Sprout, Upload, CheckCircle, AlertCircle, Loader2, X 
} from "lucide-react";

const UpdateLand = ({ plotId, onUpdateSuccess, onCancel }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [landImage, setLandImage] = useState(null);

    // 1. Same Data Structure as AddLand
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

    // Fetch existing data into the same fields
    useEffect(() => {
        const fetchCurrentPlot = async () => {
            // Safety check: if plotId is missing, we can't fetch
            if (!plotId || plotId === "undefined") {
                setStatus({ type: "error", message: "Registry ID is missing. Cannot load data." });
                setLoading(false);
                return;
            }

            try {
                const res = await api.get('/farmer/farm/land');
                const plot = res.data.data.find(p => String(p.id) === String(plotId));
                
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
                    
                    // Note: Ensure your backend GET includes these arrays, 
                    // otherwise, they will default to empty
                    setCrops(plot.crops || []);
                    setAnimals(plot.animals || []);
                }
                setLoading(false);
            } catch (err) {
                console.error("Registry Sync Failed", err);
                setStatus({ type: "error", message: "Failed to sync with Registry." });
                setLoading(false);
            }
        };
        fetchCurrentPlot();
    }, [plotId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Dynamic Row Logic ---
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

        // Final safety check before sending to backend
        if (!plotId || plotId === "undefined") {
            alert("Error: Plot ID is undefined. Refresh the page and try again.");
            return;
        }

        setSubmitting(true);
        setStatus({ type: "", message: "" });

        const data = new FormData();
        // Append basic metadata
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // DROP and RE-SYNC crops and animals
        data.append("crops", JSON.stringify(crops));
        data.append("animals", JSON.stringify(animals));

        if (landImage) data.append("land_image", landImage);

        try {
            const response = await api.put(`/farmer/farm/land/${plotId}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                alert("Registry Entry successfully DROPPED and UPDATED!");
                onUpdateSuccess();
            }
        } catch (err) {
            console.error("Update Error:", err);
            const errorMsg = err.response?.data?.error || "DROP UPDATE FAILED.";
            setStatus({ type: "error", message: errorMsg });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={styles.fullscreenOverlay}>
            <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#166534' }} size={48} />
        </div>
    );

    return (
        <div style={styles.fullscreenOverlay}>
            <div style={styles.topBar}>
                <div style={styles.headerContent}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Sprout size={32} color="#166534" />
                        <h2 style={styles.title}>Update Secure Land Registry</h2>
                    </div>
                    <button onClick={onCancel} style={styles.closeBtn}><X size={28} /></button>
                </div>
            </div>

            <div style={styles.scrollBody}>
                <div style={styles.formWidthRestrictor}>
                    {status.message && (
                        <div style={{ 
                            ...styles.statusBox, 
                            backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                            color: status.type === 'success' ? '#166534' : '#991b1b',
                            border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                        }}>
                            {status.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.sectionHeader}><MapPin size={18} /> Physical & Geographic Metadata</div>
                        <div style={styles.grid2}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Plot Identity Name</label>
                                <input type="text" name="plot_name" value={formData.plot_name} onChange={handleInputChange} required style={styles.input} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Area Size (Hectares)</label>
                                <input type="number" name="area_size" value={formData.area_size} onChange={handleInputChange} required style={styles.input} />
                            </div>
                        </div>

                        <div style={styles.grid2}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Soil Composition</label>
                                <select name="soil_type" value={formData.soil_type} onChange={handleInputChange} style={styles.input}>
                                    <option value="Nitosols">Nitosols</option>
                                    <option value="Vertisols">Vertisols</option>
                                    <option value="Cambisols">Cambisols</option>
                                    <option value="Fluvisols">Fluvisols</option>
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Climatic Zone</label>
                                <select name="climate_zone" value={formData.climate_zone} onChange={handleInputChange} style={styles.input}>
                                    <option value="Dega">Dega (Cool)</option>
                                    <option value="Weyna Dega">Weyna Dega (Temperate)</option>
                                    <option value="Kolla">Kolla (Hot)</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.grid4}>
                            <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleInputChange} required style={styles.input} />
                            <input type="text" name="zone" placeholder="Zone" value={formData.zone} onChange={handleInputChange} required style={styles.input} />
                            <input type="text" name="woreda" placeholder="Woreda" value={formData.woreda} onChange={handleInputChange} required style={styles.input} />
                            <input type="text" name="kebele" placeholder="Kebele" value={formData.kebele} onChange={handleInputChange} required style={styles.input} />
                        </div>

                        <hr style={styles.hr} />

                        <div style={styles.sectionHeader}><Plus size={18} /> Biological Assets: Crops</div>
                        {crops.map((crop, index) => (
                            <div key={index} style={styles.assetRow}>
                                <input type="text" placeholder="Crop Type" value={crop.crop_name} onChange={(e) => updateCrop(index, 'crop_name', e.target.value)} style={styles.input} required />
                                <input type="number" placeholder="Qty" value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} style={{...styles.input, width: '120px'}} required />
                                <button type="button" onClick={() => removeCropRow(index)} style={styles.removeBtn}><Trash2 size={18}/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addCropRow} style={styles.addBtn}>+ Add Crop Row</button>

                        <div style={{...styles.sectionHeader, marginTop: '30px', color: '#1e40af'}}><Plus size={18} /> Biological Assets: Livestock</div>
                        {animals.map((animal, index) => (
                            <div key={index} style={styles.assetRow}>
                                <input type="text" placeholder="Animal Type" value={animal.animal_type} onChange={(e) => updateAnimal(index, 'animal_type', e.target.value)} style={styles.input} required />
                                <input type="number" placeholder="Head Count" value={animal.head_count} onChange={(e) => updateAnimal(index, 'head_count', e.target.value)} style={{...styles.input, width: '120px'}} required />
                                <button type="button" onClick={() => removeAnimalRow(index)} style={styles.removeBtn}><Trash2 size={18}/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addAnimalRow} style={{...styles.addBtn, color: '#1e40af', borderColor: '#1e40af'}}>+ Add Animal Row</button>

                        <hr style={styles.hr} />

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ ...styles.label, marginBottom: '15px' }}><Upload size={16}/> Replace Registry Image</label>
                            <div style={styles.fileUploadBox}>
                                <input type="file" onChange={(e) => setLandImage(e.target.files[0])} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>

                        <div style={styles.buttonActionArea}>
                            <button type="submit" disabled={submitting} style={styles.submitBtn}>
                                {submitting ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={20}/> : "DROP UPDATES"}
                            </button>
                            <button type="button" onClick={onCancel} style={styles.cancelBtn}>CANCEL</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    fullscreenOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#ffffff', zIndex: 1000000, display: 'flex', flexDirection: 'column' },
    topBar: { width: '100%', padding: '20px 40px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff', position: 'sticky', top: 0 },
    headerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { color: '#0f172a', margin: 0, fontSize: '24px', fontWeight: '800' },
    closeBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
    scrollBody: { flex: 1, overflowY: 'auto', padding: '60px 20px', backgroundColor: '#f8fafc' },
    formWidthRestrictor: { maxWidth: '950px', margin: '0 auto', background: '#ffffff', padding: '40px', borderRadius: '24px', border: '1px solid #f1f5f9' },
    statusBox: { padding: '16px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' },
    sectionHeader: { fontSize: '14px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', fontWeight: '700', color: '#64748b' },
    input: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' },
    assetRow: { display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' },
    addBtn: { background: 'none', border: '2px dashed #166534', color: '#166534', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
    removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' },
    hr: { margin: '40px 0', border: '0', borderTop: '1px solid #f1f5f9' },
    fileUploadBox: { padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center' },
    buttonActionArea: { display: 'flex', gap: '20px', marginTop: '40px' },
    submitBtn: { flex: 2, padding: '18px', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' },
    cancelBtn: { flex: 1, padding: '18px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' }
};

export default UpdateLand;
