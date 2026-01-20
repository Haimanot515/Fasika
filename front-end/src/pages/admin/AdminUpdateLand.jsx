import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios"; 
import { 
    Plus, Trash2, MapPin, Sprout, Upload, CheckCircle, 
    AlertCircle, Loader2, User, Mail, Save, RefreshCw
} from "lucide-react";

const AdminUpdateLand = () => {
    const { farmId } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [landImage, setLandImage] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState("");

    // Metadata about the owner (fetched from the registry)
    const [ownerInfo, setOwnerInfo] = useState(null);

    const [formData, setFormData] = useState({
        plot_name: "", area_size: "", soil_type: "Nitosols",
        climate_zone: "Weyna Dega", region: "", zone: "",
        woreda: "", kebele: ""
    });

    const [crops, setCrops] = useState([]);
    const [animals, setAnimals] = useState([]);

    // --- 1. Load Existing Data ---
    useEffect(() => {
        const fetchLandDetails = async () => {
            try {
                // We fetch all farms to find the specific one, or use a specific GET route if available
                const response = await api.get(`/admin/farmers/view-all`);
                const farm = response.data.data.find(f => f.id.toString() === farmId);

                if (farm) {
                    setFormData({
                        plot_name: farm.plot_name || "",
                        area_size: farm.area_size || "",
                        soil_type: farm.soil_type_name || "Nitosols",
                        climate_zone: farm.climate_zone || "Weyna Dega",
                        region: farm.region || "",
                        zone: farm.zone || "",
                        woreda: farm.woreda || "",
                        kebele: farm.kebele || ""
                    });
                    setCrops(farm.crop_list || []);
                    setAnimals(farm.animal_list || []);
                    setExistingImageUrl(farm.land_image_url);
                    setOwnerInfo({
                        name: farm.owner_name,
                        email: farm.owner_email
                    });
                } else {
                    setStatus({ type: "error", message: "Registry node not found." });
                }
            } catch (err) {
                setStatus({ type: "error", message: "Failed to sync with registry." });
            } finally {
                setFetching(false);
            }
        };
        fetchLandDetails();
    }, [farmId]);

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

    // --- 2. Submit Update ---
    // Matches Router: router.put('/land/:farmId/update', ...)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append("crops", JSON.stringify(crops));
        data.append("animals", JSON.stringify(animals));
        
        if (landImage) {
            data.append("land_image", landImage);
        } else {
            data.append("land_image_url", existingImageUrl);
        }

        try {
            const response = await api.put(`/admin/farmers/land/${farmId}/update`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setStatus({ type: "success", message: "Registry node UPDATED and DROPPED by Authority" });
                setTimeout(() => navigate("/admin/farmers/land/view"), 2000);
            }
        } catch (err) {
            setStatus({ type: "error", message: err.response?.data?.error || "Update DROP failed." });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div style={{...styles.container, textAlign: 'center', padding: '100px'}}>
                <Loader2 className="animate-spin" size={48} color="#166534" style={{margin: '0 auto'}} />
                <p style={{marginTop: '20px', fontWeight: '700', color: '#64748b'}}>Syncing with Global Registry...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <RefreshCw size={32} color="#1e40af" />
                <h2 style={styles.title}>Update Registry Authority Node</h2>
            </div>

            {/* OWNER INFO SECTION */}
            <div style={{...styles.fileUploadBox, marginBottom: '30px', border: '2px solid #1e40af', background: '#eff6ff'}}>
                <label style={{...styles.label, color: '#1e40af'}}>Registry Owner Information</label>
                {ownerInfo && (
                    <div style={{marginTop: '10px', display: 'flex', gap: '20px', justifyContent: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: '800'}}><User size={16}/> {ownerInfo.name}</div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a'}}><Mail size={16}/> {ownerInfo.email}</div>
                    </div>
                )}
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
                    <label style={{ ...styles.label, marginBottom: '15px' }}><Upload size={16}/> Update Registry Image (Optional)</label>
                    <div style={styles.fileUploadBox}>
                        <input type="file" onChange={(e) => setLandImage(e.target.files[0])} />
                        {landImage ? (
                             <p style={{ fontSize: '12px', color: '#166534', marginTop: '10px' }}>✓ New image: {landImage.name} selected</p>
                        ) : existingImageUrl && (
                             <p style={{ fontSize: '12px', color: '#1e40af', marginTop: '10px' }}>Current image exists in registry</p>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={loading} style={{...styles.submitBtn, backgroundColor: '#1e40af'}}>
                    {loading ? <><Loader2 className="animate-spin" size={20}/> UPDATING REGISTRY...</> : <><Save size={20}/> COMMIT UPDATE DROP</>}
                </button>
            </form>
        </div>
    );
};

// Styles remain identical to Add component to maintain consistency
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
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '2px dashed #166534', color: '#166534', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' },
    hr: { margin: '40px 0', border: '0', borderTop: '1px solid #f1f5f9' },
    fileUploadBox: { padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', background: '#fcfcfc' },
    submitBtn: { width: '100%', padding: '20px', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s' }
};

export default AdminUpdateLand;
