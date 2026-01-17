import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { 
  FaPlus, FaLeaf, FaPaw, FaMapMarkedAlt, 
  FaCloudUploadAlt, FaTimes, FaMapMarkerAlt 
} from "react-icons/fa";

const AddLand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  const [formData, setFormData] = useState({
    plot_name: "",
    area_size: "",
    location: "",
    land_status: "Active",
    crops: [{ name: "", quantity: "" }],
    animals: [{ breed: "", count: "" }]
  });

  const addMoreCrop = () => {
    setFormData({ ...formData, crops: [...formData.crops, { name: "", quantity: "" }] });
  };

  const addMoreAnimal = () => {
    setFormData({ ...formData, animals: [...formData.animals, { breed: "", count: "" }] });
  };

  const updateCrop = (index, field, value) => {
    const newCrops = [...formData.crops];
    newCrops[index][field] = value;
    setFormData({ ...formData, crops: newCrops });
  };

  const updateAnimal = (index, field, value) => {
    const newAnimals = [...formData.animals];
    newAnimals[index][field] = value;
    setFormData({ ...formData, animals: newAnimals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/farmer/farm/land", formData);
      navigate("/my-farm/land/view");
    } catch (err) {
      console.error("DROP Failed:", err);
      alert("Registry Sync Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageOverlay}>
      <style>{`
        .asset-btn { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 20px; background: #f8f9fa; border: 2px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: 0.3s; color: #475569; }
        .asset-btn.active { border-color: #27ae60; background: #f0fdf4; color: #166534; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(39, 174, 96, 0.1); }
        .asset-btn span { font-size: 14px; font-weight: 800; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .sub-form-drawer { background: #ffffff; border: 2px solid #f0f2f5; border-radius: 12px; padding: 25px; margin-top: 20px; }
        .add-more-btn { background: #e8f5e9; color: #2e7d32; border: 2px dashed #2e7d32; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
        .add-more-btn:hover { background: #c8e6c9; }
      `}</style>

      <div style={styles.fullWidthContainer}>
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <FaMapMarkedAlt size={28} color="#27ae60" />
            <h2 style={styles.title}>Register New Land Node</h2>
          </div>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}>
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.mainInputsRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Plot Name / ID</label>
              <input type="text" required style={styles.input} placeholder="e.g. South Highlands Sector 4" onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Size (Hectares)</label>
              <input type="number" step="0.01" required style={styles.input} placeholder="0.00" onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Location / GPS</label>
              <div style={{ position: 'relative' }}>
                <FaMapMarkerAlt style={styles.inputIcon} />
                <input type="text" required style={{...styles.input, paddingLeft: '45px'}} placeholder="Region or Coordinates" onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={styles.sectionDivider}>
            <span style={styles.dividerText}>Asset Configuration</span>
          </div>

          <div style={styles.assetBtnRow}>
            <div className={`asset-btn ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>
              <FaLeaf size={32} />
              <span>Register Crops</span>
            </div>
            <div className={`asset-btn ${activeTab === 'animals' ? 'active' : ''}`} onClick={() => setActiveTab('animals')}>
              <FaPaw size={32} />
              <span>Register Animals</span>
            </div>
          </div>

          {activeTab === 'crops' && (
            <div className="sub-form-drawer">
               <div style={styles.drawerHeader}>Active Crop Registry</div>
               {formData.crops.map((crop, index) => (
                 <div key={index} style={styles.assetRow}>
                   <input type="text" placeholder="Crop Variety (e.g. Yellow Maize)" style={styles.innerInput} value={crop.name} onChange={(e) => updateCrop(index, 'name', e.target.value)} />
                   <input type="text" placeholder="Est. Quantity" style={{...styles.innerInput, maxWidth: '200px'}} value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} />
                 </div>
               ))}
               <button type="button" className="add-more-btn" onClick={addMoreCrop}><FaPlus /> Add Additional Crop Entry</button>
            </div>
          )}

          {activeTab === 'animals' && (
            <div className="sub-form-drawer">
               <div style={styles.drawerHeader}>Livestock Registry</div>
               {formData.animals.map((animal, index) => (
                 <div key={index} style={styles.assetRow}>
                   <input type="text" placeholder="Livestock Breed" style={styles.innerInput} value={animal.breed} onChange={(e) => updateAnimal(index, 'breed', e.target.value)} />
                   <input type="number" placeholder="Head Count" style={{...styles.innerInput, maxWidth: '200px'}} value={animal.count} onChange={(e) => updateAnimal(index, 'count', e.target.value)} />
                 </div>
               ))}
               <button type="button" className="add-more-btn" onClick={addMoreAnimal}><FaPlus /> Add Additional Animal Entry</button>
            </div>
          )}

          <div style={styles.footer}>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              <FaCloudUploadAlt size={22} /> 
              {loading ? "COMMITTING TO REGISTRY..." : "DROP LAND TO REGISTRY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageOverlay: { width: "100%", minHeight: "100vh", background: "#f0f2f5", display: "flex", justifyContent: "center", padding: "40px 0" },
  fullWidthContainer: { width: "95%", maxWidth: "1400px", background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", height: "fit-content" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", paddingBottom: "20px", borderBottom: "1px solid #eee" },
  titleGroup: { display: "flex", alignItems: "center", gap: "15px" },
  title: { fontSize: "28px", color: "#1a202c", margin: 0, fontWeight: "800" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#cbd5e0", transition: "0.2s" },
  form: { display: "flex", flexDirection: "column", gap: "30px" },
  mainInputsRow: { display: "flex", gap: "25px", flexWrap: "wrap" },
  inputGroup: { flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "13px", fontWeight: "900", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "16px", width: "100%", boxSizing: "border-box", background: "#fcfcfc" },
  inputIcon: { position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#a0aec0", fontSize: "18px" },
  sectionDivider: { position: "relative", textAlign: "center", margin: "10px 0" },
  dividerText: { background: "#fff", padding: "0 20px", fontSize: "14px", fontWeight: "bold", color: "#cbd5e0", textTransform: "uppercase" },
  assetBtnRow: { display: "flex", gap: "20px" },
  drawerHeader: { fontSize: "16px", fontWeight: "bold", color: "#27ae60", marginBottom: "20px", borderLeft: "4px solid #27ae60", paddingLeft: "15px" },
  assetRow: { display: "flex", gap: "15px", marginBottom: "15px" },
  innerInput: { padding: "14px", borderRadius: "8px", border: "1px solid #edf2f7", fontSize: "15px", flex: 1, background: "#fff" },
  footer: { marginTop: "20px", display: "flex", justifyContent: "flex-end" },
  submitBtn: { width: "100%", maxWidth: "400px", background: "#27ae60", color: "white", padding: "20px", border: "none", borderRadius: "12px", fontSize: "18px", fontWeight: "800", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", boxShadow: "0 10px 20px rgba(39, 174, 96, 0.2)" }
};

export default AddLand;
