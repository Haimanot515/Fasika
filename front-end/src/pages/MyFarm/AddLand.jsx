import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { 
  FaPlus, FaLeaf, FaPaw, FaMapMarkedAlt, 
  FaCloudUploadAlt, FaTimes, FaMapMarkerAlt, FaTrash 
} from "react-icons/fa";

const AddLand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  const [formData, setFormData] = useState({
    plot_name: "",
    area_size: "",
    location: "", // Added Location
    land_status: "Active",
    crops: [{ name: "", quantity: "" }], // Initialize with one empty crop
    animals: [{ breed: "", count: "" }]  // Initialize with one empty animal
  });

  // Dynamic Array Handlers
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
        .asset-btn { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 12px; background: #f8f9fa; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; transition: 0.3s; color: #475569; }
        .asset-btn.active { border-color: #27ae60; background: #f0fdf4; color: #166534; }
        .asset-btn span { font-size: 11px; font-weight: 800; margin-top: 6px; text-transform: uppercase; }
        .sub-form-drawer { background: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-top: 10px; }
        .add-more-btn { background: #e8f5e9; color: #2e7d32; border: 1px dashed #2e7d32; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 5px; }
      `}</style>

      <div style={styles.formCard}>
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <FaMapMarkedAlt size={22} color="#27ae60" />
            <h2 style={styles.title}>Register New Land Node</h2>
          </div>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Plot Name</label>
            <input type="text" required style={styles.input} placeholder="e.g. North Ridge" onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
          </div>

          <div style={styles.twoCol}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Size (Ha)</label>
              <input type="number" required style={styles.input} placeholder="0.00" onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Location</label>
              <div style={{ position: 'relative' }}>
                <FaMapMarkerAlt style={styles.inputIcon} />
                <input type="text" required style={{...styles.input, paddingLeft: '35px'}} placeholder="Region/GPS" onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={styles.assetLabel}>Link Initial Assets</div>
          <div style={styles.assetBtnRow}>
            <div className={`asset-btn ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>
              <FaLeaf size={20} /><span>Crops</span>
            </div>
            <div className={`asset-btn ${activeTab === 'animals' ? 'active' : ''}`} onClick={() => setActiveTab('animals')}>
              <FaPaw size={20} /><span>Animals</span>
            </div>
          </div>

          {/* DYNAMIC CROP SECTION */}
          {activeTab === 'crops' && (
            <div className="sub-form-drawer">
               {formData.crops.map((crop, index) => (
                 <div key={index} style={styles.assetRow}>
                   <input type="text" placeholder="Crop (Maize)" style={styles.innerInput} value={crop.name} onChange={(e) => updateCrop(index, 'name', e.target.value)} />
                   <input type="text" placeholder="Qty" style={{...styles.innerInput, width: '80px'}} value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} />
                 </div>
               ))}
               <button type="button" className="add-more-btn" onClick={addMoreCrop}><FaPlus /> Add More Crops</button>
            </div>
          )}

          {/* DYNAMIC ANIMAL SECTION */}
          {activeTab === 'animals' && (
            <div className="sub-form-drawer">
               {formData.animals.map((animal, index) => (
                 <div key={index} style={styles.assetRow}>
                   <input type="text" placeholder="Breed" style={styles.innerInput} value={animal.breed} onChange={(e) => updateAnimal(index, 'breed', e.target.value)} />
                   <input type="number" placeholder="Count" style={{...styles.innerInput, width: '80px'}} value={animal.count} onChange={(e) => updateAnimal(index, 'count', e.target.value)} />
                 </div>
               ))}
               <button type="button" className="add-more-btn" onClick={addMoreAnimal}><FaPlus /> Add More Animals</button>
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            <FaCloudUploadAlt /> {loading ? "Syncing..." : "DROP TO REGISTRY"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageOverlay: { width: "100%", minHeight: "100vh", background: "#f0f2f5", display: "flex", justifyContent: "center", paddingTop: "80px" },
  formCard: { width: "95%", maxWidth: "480px", background: "#fff", borderRadius: "15px", padding: "25px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", height: "fit-content" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  titleGroup: { display: "flex", alignItems: "center", gap: "10px" },
  title: { fontSize: "18px", color: "#1a202c", margin: 0, fontWeight: "700" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#cbd5e0" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  twoCol: { display: "flex", gap: "12px" },
  inputGroup: { flex: 1, display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "11px", fontWeight: "800", color: "#718096", textTransform: "uppercase" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", width: "100%", boxSizing: "border-box" },
  inputIcon: { position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#a0aec0" },
  assetLabel: { fontSize: "11px", fontWeight: "800", color: "#718096", marginTop: "10px", textAlign: "center" },
  assetBtnRow: { display: "flex", gap: "10px" },
  assetRow: { display: "flex", gap: "8px", marginBottom: "8px" },
  innerInput: { padding: "8px", borderRadius: "6px", border: "1px solid #edf2f7", fontSize: "13px", flex: 1 },
  submitBtn: { marginTop: "15px", background: "#27ae60", color: "white", padding: "14px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }
};

export default AddLand;
