import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

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
      // Logic for DROP into the local or remote schema
      await api.post("/farmer/farm/land", {
        ...formData,
        action: "DROP_TO_SCHEMA" 
      });
      navigate("/my-farm/land/view");
    } catch (err) {
      console.error("DROP Failed:", err);
      alert("Error saving to registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageOverlay}>
      <style>{`
        .asset-btn { 
          flex: 1; 
          padding: 30px; 
          background: #fdfdfd; 
          border: 3px solid #d1d5db; 
          border-radius: 15px; 
          cursor: pointer; 
          text-align: center;
          transition: 0.2s;
        }
        .asset-btn.active { 
          border-color: #2e7d32; 
          background: #e8f5e9; 
        }
        .asset-btn-text { 
          font-size: 24px; 
          font-weight: bold; 
          color: #1a202c; 
        }
        .sub-form-drawer { 
          background: #ffffff; 
          border: 2px solid #e2e8f0; 
          border-radius: 15px; 
          padding: 30px; 
          margin-top: 20px; 
        }
        .action-buttons-row {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }
        .secondary-btn {
          flex: 1;
          background: #f1f5f9;
          border: 2px solid #cbd5e0;
          padding: 20px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
        }
        .secondary-btn:hover {
          background: #e2e8f0;
        }
      `}</style>

      <div style={styles.fullWidthContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Register New Farm Land</h2>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}>
            CANCEL AND GO BACK
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.mainInputsRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Plot Name / Field Name</label>
              <input 
                type="text" 
                required 
                style={styles.input} 
                placeholder="e.g. North Corn Field" 
                onChange={(e) => setFormData({...formData, plot_name: e.target.value})} 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Total Size (Hectares)</label>
              <input 
                type="number" 
                step="0.01" 
                required 
                style={styles.input} 
                placeholder="0.00" 
                onChange={(e) => setFormData({...formData, area_size: e.target.value})} 
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Location / Village / District</label>
              <input 
                type="text" 
                required 
                style={styles.input} 
                placeholder="Where is the land located?" 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
            </div>
          </div>

          <div style={styles.sectionDivider}>
            <span style={styles.dividerText}>What is on this land?</span>
          </div>

          <div style={styles.assetBtnRow}>
            <div 
              className={`asset-btn ${activeTab === 'crops' ? 'active' : ''}`} 
              onClick={() => setActiveTab('crops')}
            >
              <div className="asset-btn-text">CROPS</div>
            </div>
            <div 
              className={`asset-btn ${activeTab === 'animals' ? 'active' : ''}`} 
              onClick={() => setActiveTab('animals')}
            >
              <div className="asset-btn-text">LIVESTOCK</div>
            </div>
          </div>

          {activeTab === 'crops' && (
            <div className="sub-form-drawer">
               <div style={styles.drawerHeader}>Crop Registry</div>
               {formData.crops.map((crop, index) => (
                 <div key={index} style={styles.assetRow}>
                   <input 
                    type="text" 
                    placeholder="Crop Variety (e.g. Maize)" 
                    style={styles.innerInput} 
                    value={crop.name} 
                    onChange={(e) => updateCrop(index, 'name', e.target.value)} 
                   />
                   <input 
                    type="text" 
                    placeholder="Est. Quantity (e.g. 50 Bags)" 
                    style={{...styles.innerInput, maxWidth: '300px'}} 
                    value={crop.quantity} 
                    onChange={(e) => updateCrop(index, 'quantity', e.target.value)} 
                   />
                 </div>
               ))}
               <button type="button" className="secondary-btn" onClick={addMoreCrop}>+ ADD ANOTHER CROP</button>
            </div>
          )}

          {activeTab === 'animals' && (
            <div className="sub-form-drawer">
               <div style={styles.drawerHeader}>Livestock Registry</div>
               {formData.animals.map((animal, index) => (
                 <div key={index} style={styles.assetRow}>
                   <input 
                    type="text" 
                    placeholder="Livestock Breed (e.g. Dairy Cattle)" 
                    style={styles.innerInput} 
                    value={animal.breed} 
                    onChange={(e) => updateAnimal(index, 'breed', e.target.value)} 
                   />
                   <input 
                    type="number" 
                    placeholder="Head Count" 
                    style={{...styles.innerInput, maxWidth: '300px'}} 
                    value={animal.count} 
                    onChange={(e) => updateAnimal(index, 'count', e.target.value)} 
                   />
                 </div>
               ))}
               <button type="button" className="secondary-btn" onClick={addMoreAnimal}>+ ADD ANOTHER ANIMAL</button>
            </div>
          )}

          <div className="action-buttons-row">
            <button 
                type="submit" 
                disabled={loading} 
                style={{...styles.submitBtn, background: loading ? "#95a5a6" : "#27ae60"}}
            >
              {loading ? "SAVING..." : "DROP LAND TO REGISTRY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageOverlay: { width: "100%", minHeight: "100vh", background: "#f0f2f5", display: "flex", justifyContent: "center", padding: "40px 0" },
  fullWidthContainer: { width: "95%", maxWidth: "1200px", background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "2px solid #eee", paddingBottom: "20px" },
  title: { fontSize: "32px", color: "#1a202c", margin: 0, fontWeight: "900" },
  closeBtn: { background: "#f8d7da", border: "1px solid #f5c6cb", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", color: "#721c24" },
  form: { display: "flex", flexDirection: "column", gap: "30px" },
  mainInputsRow: { display: "flex", gap: "25px", flexWrap: "wrap" },
  inputGroup: { flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" },
  label: { fontSize: "18px", fontWeight: "bold", color: "#4a5568" },
  input: { padding: "20px", borderRadius: "12px", border: "2px solid #cbd5e0", fontSize: "20px", width: "100%", boxSizing: "border-box" },
  sectionDivider: { textAlign: "center", margin: "20px 0", borderBottom: "1px solid #e2e8f0", lineHeight: "0.1em" },
  dividerText: { background: "#fff", padding: "0 20px", fontSize: "18px", fontWeight: "bold", color: "#718096" },
  assetBtnRow: { display: "flex", gap: "25px" },
  drawerHeader: { fontSize: "22px", fontWeight: "bold", color: "#2e7d32", marginBottom: "20px" },
  assetRow: { display: "flex", gap: "20px", marginBottom: "20px" },
  innerInput: { padding: "18px", borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "18px", flex: 1 },
  submitBtn: { flex: 2, color: "white", padding: "25px", border: "none", borderRadius: "15px", fontSize: "22px", fontWeight: "900", cursor: "pointer" }
};

export default AddLand;
