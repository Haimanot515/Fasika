import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../api/axios"; 
import { 
    Plus, Trash2, MapPin, Sprout, Upload, CheckCircle, 
    AlertCircle, Loader2, Search, User, Phone, Mail
} from "lucide-react";

const AdminAddLand = () => {
    const navigate = useNavigate(); // Initialize navigation
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [landImage, setLandImage] = useState(null);
    
    // --- Farmer Search States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);

    // 1. Basic Land Details
    const [formData, setFormData] = useState({
        plot_name: "", area_size: "", soil_type: "Nitosols",
        climate_zone: "Weyna Dega", region: "", zone: "",
        woreda: "", kebele: ""
    });

    // 2. Dynamic Asset States
    const [crops, setCrops] = useState([]);
    const [animals, setAnimals] = useState([]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Search Logic ---
    const handleFarmerSearch = async () => {
        if (!searchQuery) return;
        setSearching(true);
        setStatus({ type: "", message: "" });
        try {
            const response = await api.get(`/admin/farmers/search?query=${searchQuery}`);
            if (response.data.success && response.data.farmer) {
                setSelectedFarmer(response.data.farmer);
            } else {
                setStatus({ type: "error", message: "Farmer not found in registry." });
            }
        } catch (err) {
            setStatus({ type: "error", message: "Search failed. Check connection." });
        } finally {
            setSearching(false);
        }
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
        if (!selectedFarmer) return alert("Please select a farmer first.");
        
        setLoading(true);
        setStatus({ type: "", message: "" });

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append("crops", JSON.stringify(crops));
        data.append("animals", JSON.stringify(animals));
        data.append("farmer_id", selectedFarmer._id); 

        if (landImage) data.append("land_image", landImage);

        try {
            const response = await api.post("/admin/farm/land/drop", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setStatus({ type: "success", message: "Registry Entry successfully DROPPED!" });
                
                // --- REDIRECTION LOGIC ---
                // Wait 1.5 seconds so admin can see the success message, then redirect
                setTimeout(() => {
                    navigate("/admin/farmers/land/view");
                }, 1500);
            }
        } catch (err) {
            setStatus({ type: "error", message: err.response?.data?.error || "DROP operation failed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Sprout size={32} color="#166534" />
                <h2 style={styles.title}>Admin Land Registry DROP</h2>
            </div>

            {/* --- STEP 1: FARMER SEARCH --- */}
            <div style={{...styles.fileUploadBox, marginBottom: '30px', border: selectedFarmer ? '2px solid #166534' : '2px dashed #e2e8f0'}}>
                <label style={styles.label}>Identify Farmer (Email or Phone)</label>
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <input 
                        type="text" 
                        placeholder="Search email or phone..." 
                        style={styles.input} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={!!selectedFarmer}
                    />
                    {!selectedFarmer ? (
                        <button onClick={handleFarmerSearch} style={styles.addBtn}>
                            {searching ? <Loader2 className="animate-spin" size={18}/> : <><Search size={18}/> Find</>}
                        </button>
                    ) : (
                        <button onClick={() => setSelectedFarmer(null)} style={{...styles.removeBtn, border: '1px solid #ef4444', padding: '10px', borderRadius: '8px'}}>Change Farmer</button>
                    )}
                </div>

                {selectedFarmer && (
                    <div style={{marginTop: '15px', display: 'flex', gap: '20px', background: '#f0fdf4', padding: '15px', borderRadius: '12px', border: '1px solid #bbf7d0'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '700'}}>
                            <User size={16}/> {selectedFarmer.full_name}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b'}}>
                            <Mail size={16}/> {selectedFarmer.email}
                        </div>
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

            <form onSubmit={handleSubmit} style={{ opacity: selectedFarmer ? 1 : 0.4, pointerEvents: selectedFarmer ? 'auto' : 'none' }}>
                <div style={styles.sectionHeader}><MapPin size={18} /> Geographic Metadata</div>
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

                {/* Rest of form remains same as your provided code */}
                <div style={styles.grid4}>
                    <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleInputChange} required style={styles.input} />
                    <input type="text" name="zone" placeholder="Zone" value={formData.zone} onChange={handleInputChange} required style={styles.input} />
                    <input type="text" name="woreda" placeholder="Woreda" value={formData.woreda} onChange={handleInputChange} required style={styles.input} />
                    <input type="text" name="kebele" placeholder="Kebele" value={formData.kebele} onChange={handleInputChange} required style={styles.input} />
                </div>

                <hr style={styles.hr} />

                <button type="submit" disabled={loading} style={styles.submitBtn}>
                    {loading ? <><Loader2 className="animate-spin" size={20}/> DROP IN PROGRESS...</> : "DROP INTO REGISTRY"}
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
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '2px dashed #166534', color: '#166534', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' },
    hr: { margin: '40px 0', border: '0', borderTop: '1px solid #f1f5f9' },
    fileUploadBox: { padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', background: '#fcfcfc' },
    submitBtn: { width: '100%', padding: '20px', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s' }
};

export default AdminAddLand;
