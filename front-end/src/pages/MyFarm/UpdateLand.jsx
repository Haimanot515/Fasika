import React, { useState, useEffect } from "react";
import api from "../../api/axios"; 
import { 
    Plus, Trash2, MapPin, Maximize, 
    Sprout, Upload, CheckCircle, AlertCircle, Loader2, X 
} from "lucide-react";

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
        setStatus({ type: "", message: "" });

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
                alert("Registry Entry successfully DROPPED!");
                onUpdateSuccess();
            }
        } catch (err) {
            setStatus({ type: "error", message: err.response?.data?.error || "DROP UPDATE FAILED." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={styles.overlay}>
            <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#fff' }} size={40} />
        </div>
    );

    return (
        <div style={styles.overlay}>
            <div style={styles.container}>
                <button onClick={onCancel} style={styles.closeIcon}><X size={28} /></button>

                <div style={styles.header}>
                    <Sprout size={36} color="#166534" />
                    <h2 style={styles.title}>Update Secure Land Registry Registration</h2>
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

                <form onSubmit={handleSubmit} style={styles.formPadding}>
                    <div style={styles.sectionHeader}>
                        <MapPin size={18} /> Physical & Geographic Metadata
                    </div>
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

                    <div style={styles.sectionHeader}>
                        <Plus size={18} /> Biological Assets: Crops
                    </div>
                    {crops.map((crop, index) => (
                        <div key={index} style={styles.assetRow}>
                            <input type="text" placeholder="Crop Type" value={crop.crop_name} onChange={(e) => updateCrop(index, 'crop_name', e.target.value)} style={styles.input} required />
                            <input type="number" placeholder="Qty" value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} style={{...styles.input, width: '150px'}} required />
                            <button type="button" onClick={() => removeCropRow(index)} style={styles.removeBtn}><Trash2 size={20}/></button>
                        </div>
                    ))}
                    <button type="button" onClick={addCropRow} style={styles.addBtn}>+ Add Crop Row</button>

                    <div style={{...styles.sectionHeader, marginTop: '40px', color: '#1e40af'}}>
                        <Plus size={18} /> Biological Assets: Livestock
                    </div>
                    {animals.map((animal, index) => (
                        <div key={index} style={styles.assetRow}>
                            <input type="text" placeholder="Animal Type" value={animal.animal_type} onChange={(e) => updateAnimal(index, 'animal_type', e.target.value)} style={styles.input} required />
                            <input type="number" placeholder="Head Count" value={animal.head_count} onChange={(e) => updateAnimal(index, 'head_count', e.target.value)} style={{...styles.input, width: '150px'}} required />
                            <button type="button" onClick={() => removeAnimalRow(index)} style={styles.removeBtn}><Trash2 size={20}/></button>
                        </div>
                    ))}
                    <button type="button" onClick={addAnimalRow} style={{...styles.addBtn, color: '#1e40af', borderColor: '#1e40af'}}>+ Add Animal Row</button>

                    <hr style={styles.hr} />

                    <div style={{ marginBottom: '40px' }}>
                        <label style={{ ...styles.label, marginBottom: '15px' }}><Upload size={18}/> Replace Registry Image</label>
                        <div style={styles.fileUploadBox}>
                            <input type="file" onChange={(e) => setLandImage(e.target.files[0])} style={{ cursor: 'pointer' }} />
                            {landImage && <p style={{ fontSize: '14px', color: '#166534', marginTop: '10px' }}>✓ {landImage.name} selected</p>}
                        </div>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button type="submit" disabled={submitting} style={styles.submitBtn}>
                            {submitting ? (
                                <><Loader2 style={{ animation: 'spin 1s linear infinite' }} size={22}/> SYNCING REGISTRY...</>
                            ) : (
                                "DROP UPDATES INTO REGISTRY"
                            )}
                        </button>
                        <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000000, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto'
    },
    container: { 
        position: 'relative',
        width: '100%', // 🚀 Full Width
        minHeight: '100vh',
        background: '#ffffff', 
        padding: '60px 10%', // Keeps internal content centered with breathing room
    },
    closeIcon: {
        position: 'absolute',
        top: '30px',
        right: '5%',
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer'
    },
    header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '50px', justifyContent: 'center' },
    title: { color: '#0f172a', margin: 0, fontSize: '32px', fontWeight: '800' },
    formPadding: { maxWidth: '1200px', margin: '0 auto' }, // Centers the actual form fields
    statusBox: { padding: '20px', borderRadius: '12px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: '600' },
    sectionHeader: { fontSize: '16px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '14px', fontWeight: '700', color: '#64748b' },
    input: { width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '16px' },
    assetRow: { display: 'flex', gap: '20px', marginBottom: '15px', alignItems: 'center' },
    addBtn: { background: 'none', border: '2px dashed #166534', color: '#166534', padding: '12px 25px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' },
    removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' },
    hr: { margin: '50px 0', border: '0', borderTop: '2px solid #f1f5f9' },
    fileUploadBox: { padding: '40px', border: '3px dashed #e2e8f0', borderRadius: '20px', textAlign: 'center', background: '#fcfcfc' },
    buttonContainer: { display: 'flex', gap: '20px', marginTop: '50px' },
    submitBtn: { flex: 2, padding: '22px', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '18px', cursor: 'pointer', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' },
    cancelBtn: { flex: 1, padding: '22px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '18px', cursor: 'pointer', fontWeight: '800', fontSize: '18px' }
};

export default UpdateLand;
