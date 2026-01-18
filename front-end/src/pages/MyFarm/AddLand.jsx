import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AddLand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  // 1. STATE SYNCED WITH ALL SCHEMAS
  const [formData, setFormData] = useState({
    // Land Plot Table Columns
    plot_name: "",
    area_size: "", // numeric(10,2)
    land_status: "Active",
    
    // Crops Table Columns (Array for multiple entries)
    crops: [{ 
        crop_name: "", 
        crop_variety: "", 
        current_stage: "Seedling" // Default from schema
    }],

    // Animals Table Columns (Array for multiple entries)
    animals: [{ 
        tag_number: "", // Unique Constraint
        species: "", 
        breed: "", 
        health_status: "Healthy" // Default from schema
    }]
  });

  const addMoreCrop = () => {
    setFormData({ ...formData, crops: [...formData.crops, { crop_name: "", crop_variety: "", current_stage: "Seedling" }] });
  };

  const addMoreAnimal = () => {
    setFormData({ ...formData, animals: [...formData.animals, { tag_number: "", species: "", breed: "", health_status: "Healthy" }] });
  };

  const updateEntry = (type, index, field, value) => {
    const list = [...formData[type]];
    list[index][field] = value;
    setFormData({ ...formData, [type]: list });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 2. BACKEND SYNC: DROP TO REGISTRY
      // This sends the full object to your API
      await api.post("/farmer/farm/land", {
        ...formData,
        action: "DROP_TO_REGISTRY" 
      });
      navigate("/my-farm/land/view");
    } catch (err) {
      console.error("DROP Failed:", err);
      alert("Database Registry Sync Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageOverlay}>
      <style>{`
        .asset-btn { flex: 1; padding: 18px; background: #fff; border: 3px solid #cbd5e0; border-radius: 12px; cursor: pointer; text-align: center; }
        .asset-btn.active { border-color: #2e7d32; background: #f0fdf4; }
        .asset-btn-text { font-size: 20px; font-weight: bold; color: #1a202c; }
        .row-container { display: flex; align-items: flex-end; gap: 12px; width: 100%; margin-bottom: 15px; }
        .add-action-btn { white-space: nowrap; height: 48px; background: #f8fafc; border: 2px solid #cbd5e0; padding: 0 18px; border-radius: 10px; font-size: 15px; font-weight: bold; cursor: pointer; }
      `}</style>

      <div style={styles.fullWidthContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Land & Asset Registration</h2>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}>CANCEL</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* LAND PLOT SECTION */}
          <div style={styles.mainInputsRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Plot Name</label>
              <input type="text" required style={styles.input} placeholder="Field Name" onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hectares</label>
              <input type="number" step="0.01" required style={styles.input} placeholder="0.00" onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
            </div>
          </div>

          <div style={styles.sectionDivider}><span style={styles.dividerText}>Registration Tabs</span></div>

          <div style={styles.assetBtnRow}>
            <div className={`asset-btn ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>
              <div className="asset-btn-text">CROPS</div>
            </div>
            <div className={`asset-btn ${activeTab === 'animals' ? 'active' : ''}`} onClick={() => setActiveTab('animals')}>
              <div className="asset-btn-text">ANIMALS</div>
            </div>
          </div>

          {/* CROPS SECTION */}
          {activeTab === 'crops' && (
            <div style={styles.subFormDrawer}>
               <div style={styles.drawerHeader}>Crop Registry</div>
               {formData.crops.map((crop, index) => (
                 <div key={index} className="row-container">
                   <div style={{ flex: 1 }}><label style={styles.smallLabel}>Crop Name</label>
                     <input type="text" placeholder="Maize" style={styles.input} value={crop.crop_name} onChange={(e) => updateEntry('crops', index, 'crop_name', e.target.value)} />
                   </div>
                   <div style={{ flex: 1 }}><label style={styles.smallLabel}>Variety</label>
                     <input type="text" placeholder="Hybrid" style={styles.input} value={crop.crop_variety} onChange={(e) => updateEntry('crops', index, 'crop_variety', e.target.value)} />
                   </div>
                   <button type="button" className="add-action-btn" onClick={addMoreCrop}>+ ADD</button>
                 </div>
               ))}
            </div>
          )}

          {/* ANIMALS SECTION */}
          {activeTab === 'animals' && (
            <div style={styles.subFormDrawer}>
               <div style={styles.drawerHeader}>Livestock Registry</div>
               {formData.animals.map((animal, index) => (
                 <div key={index} className="row-container">
                   <div style={{ flex: 1 }}><label style={styles.smallLabel}>Tag #</label>
                     <input type="text" required placeholder="Unique ID" style={styles.input} value={animal.tag_number} onChange={(e) => updateEntry('animals', index, 'tag_number', e.target.value)} />
                   </div>
                   <div style={{ flex: 1 }}><label style={styles.smallLabel}>Species</label>
                     <input type="text" placeholder="Cattle" style={styles.input} value={animal.species} onChange={(e) => updateEntry('animals', index, 'species', e.target.value)} />
                   </div>
                   <button type="button" className="add-action-btn" onClick={addMoreAnimal}>+ ADD</button>
                 </div>
               ))}
            </div>
          )}

          <div style={styles.footer}>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "SAVING..." : "DROP LAND TO REGISTRY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageOverlay: { width: "100%", minHeight: "100vh", background: "#f0f2f5", display: "flex", justifyContent: "center", padding: "100px 0" },
  fullWidthContainer: { width: "95%", maxWidth: "1200px", background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "15px" },
  title: { fontSize: "30px", color: "#1a202c", margin: 0, fontWeight: "900" },
  closeBtn: { background: "#eee", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  form: { display: "flex", flexDirection: "column", gap: "25px" },
  mainInputsRow: { display: "flex", gap: "20px" },
  inputGroup: { flex: 1, display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "18px", fontWeight: "bold", color: "#4a5568" },
  smallLabel: { fontSize: "13px", fontWeight: "bold", color: "#718096", marginBottom: "2px" },
  input: { padding: "10px 15px", borderRadius: "10px", border: "2px solid #cbd5e0", fontSize: "18px", width: "100%", boxSizing: "border-box" },
  sectionDivider: { textAlign: "center", margin: "10px 0", borderBottom: "1px solid #e2e8f0", lineHeight: "0.1em" },
  dividerText: { background: "#fff", padding: "0 20px", fontSize: "14px", fontWeight: "bold", color: "#cbd5e0" },
  assetBtnRow: { display: "flex", gap: "20px" },
  subFormDrawer: { background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "12px", padding: "20px" },
  drawerHeader: { fontSize: "18px", fontWeight: "bold", color: "#2e7d32", marginBottom: "12px" },
  footer: { marginTop: "15px" },
  submitBtn: { width: "100%", background: "#27ae60", color: "white", padding: "18px", border: "none", borderRadius: "12px", fontSize: "20px", fontWeight: "900", cursor: "pointer" }
};

export default AddLand;
