import React, { useState } from "react";
import api from "../../api/axios"; 
import { 
    Plus, Trash2, MapPin, Sprout, 
    Upload, CheckCircle, AlertCircle, Loader2 
} from "lucide-react";

const AddLand = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [landImage, setLandImage] = useState(null);

    // 1. Basic Land Details
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

    // 2. Dynamic Asset States
    const [crops, setCrops] = useState([]);
    const [animals, setAnimals] = useState([]);

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
        setLoading(true);
        setStatus({ type: "", message: "" });

        const data = new FormData();
        
        // Append text fields
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // Stringify arrays for backend processing
        data.append("crops", JSON.stringify(crops));
        data.append("animals", JSON.stringify(animals));

        if (landImage) data.append("land_image", landImage);

        try {
            const response = await api.post("/farmer/farm/land", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setStatus({ type: "success", message: "Registry Entry successfully DROPPED!" });
                // Reset form state
                setFormData({ plot_name: "", area_size: "", soil_type: "Nitosols", climate_zone: "Weyna Dega", region: "", zone: "", woreda: "", kebele: "" });
                setCrops([]);
                setAnimals([]);
                setLandImage(null);
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.error("DROP Error:", err);
            setStatus({ type: "error", message: err.response?.data?.error || "DROP failed. Server connection error." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Sprout size={32} color="#166534" />
                <h2 style={styles.title}>Secure Land Registry DROP</h2>
            </div>
            
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
                {/* Section 1: Land Details */}
                <div style={styles.sectionHeader}>
                    <MapPin size={18} /> Physical & Geographic Metadata
                </div>
                <div style={styles.grid2}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Plot Identity Name</label>
                        <input type="text" name="plot_name" placeholder="e.g. North Plateau" value={formData.plot_name} onChange={handleInputChange} required style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Area Size (Hectares)</label>
                        <input type="number" name="area_size" placeholder="e.g. 2.5" value={formData.area_size} onChange={handleInputChange} required style={styles.input} />
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

                {/* Section 2: Crops Assets */}
                <div style={styles.sectionHeader}>
                    <Plus size={18} /> Biological Assets: Crops
                </div>
                {crops.map((crop, index) => (
                    <div key={index} style={styles.assetRow}>
                        <input type="text" placeholder="Crop Type" value={crop.crop_name} onChange={(e) => updateCrop(index, 'crop_name', e.target.value)} style={styles.input} required />
                        <input type="number" placeholder="Qty" value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} style={{...styles.input, width: '120px'}} required />
                        <button type="button" onClick={() => removeCropRow(index)} style={styles.removeBtn}><Trash2 size={18}/></button>
                    </div>
                ))}
                <button type="button" onClick={addCropRow} style={styles.addBtn}>+ Add Crop Row</button>

                {/* Section 3: Animals Assets */}
                <div style={{...styles.sectionHeader, marginTop: '30px', color: '#1e40af'}}>
                    <Plus size={18} /> Biological Assets: Livestock
                </div>
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
                    <label style={{ ...styles.label, marginBottom: '15px' }}><Upload size={16}/> Upload Registry Image</label>
                    <div style={styles.fileUploadBox}>
                        <input type="file" onChange={(e) => setLandImage(e.target.files[0])} style={{ cursor: 'pointer' }} />
                        {landImage && <p style={{ fontSize: '12px', color: '#166534', marginTop: '10px' }}>✓ {landImage.name} selected</p>}
                    </div>
                </div>

                <button type="submit" disabled={loading} style={styles.submitBtn}>
                    {loading ? (
                        <><Loader2 style={{ animation: 'spin 1s linear infinite' }} size={20}/> COMMITTING DROP...</>
                    ) : (
                        "DROP INTO REGISTRY"
                    )}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '950px', margin: '50px auto', padding: '40px', background: '#ffffff', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px', justifyContent: 'center' },
    title: { color: '#0f172a', margin: 0, fontSize: '26px', fontWeight: '800' },
    statusBox: { padding: '16px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', fontSize: '14px' },
    sectionHeader: { fontSize: '14px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', fontWeight: '700', color: '#64748b' },
    input: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', transition: 'all 0.2s' },
    assetRow: { display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' },
    addBtn: { background: 'none', border: '2px dashed #166534', color: '#166534', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' },
    hr: { margin: '40px 0', border: '0', borderTop: '1px solid #f1f5f9' },
    fileUploadBox: { padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', background: '#fcfcfc' },
    submitBtn: { width: '100%', padding: '20px', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s' }
};

export default AddLand;
