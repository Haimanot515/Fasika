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
          padding: 20px; 
          background: #fdfdfd; 
          border: 3px solid #d1d5db; 
          border-radius: 12px; 
          cursor: pointer; 
          text-align: center;
        }
        .asset-btn.active { 
          border-color: #2e7d32; 
          background: #e8f5e9; 
        }
        .asset-btn-text { 
          font-size: 22px; 
          font-weight: bold; 
        }
        .row-container {
          display: flex;
          align-items: flex-end;
          gap: 15px;
          width: 100%;
        }
        .add-action-btn {
          white-space: nowrap;
          height: 52px; /* Adjusted lower height */
          background: #f1f5f9;
          border: 2px solid #cbd5e0;
          padding: 0 25px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          align-self: flex-end;
          margin-bottom: 2px;
        }
      `}</style>

      <div style={styles.fullWidthContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Register New Farm Land</h2>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}>
            CANCEL
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.mainInputsRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Plot Name</label>
              <input type="text" required style={styles.input} placeholder="e.g. North Field" onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Hectares</label>
              <input type="number" step="0.01" required style={styles.input} placeholder="0.00" onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Location</label>
              <input type="text" required style={styles.input} placeholder="Village Name" onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>

          <div style={styles.sectionDivider}>
            <span style={styles.dividerText}>Current Land Usage</span>
          </div>

          <div style={styles.assetBtnRow}>
            <div className={`asset-btn ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>
              <div className="asset-btn-text">CROPS</div>
            </div>
            <div className={`asset-btn ${activeTab === 'animals' ? 'active' : ''}`} onClick={() => setActiveTab('animals')}>
              <div className="asset-btn-text">LIVESTOCK</div>
            </div>
          </div>

          {activeTab === 'crops' && (
            <div style={styles.subFormDrawer}>
               <div style={styles.drawerHeader}>Crop Registry</div>
               {formData.crops.map((crop, index) => (
                 <div key={index} className="row-container" style={{ marginBottom: '15px' }}>
                   <div style={{ flex: 2 }}>
                     <label style={styles.smallLabel}>Variety</label>
                     <input type="text" placeholder="e.g. Maize" style={styles.input} value={crop.name} onChange={(e) => updateCrop(index, 'name', e.target.value)} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <label style={styles.smallLabel}>Quantity</label>
                     <input type="text" placeholder="e.g. 50 Bags" style={styles.input} value={crop.quantity} onChange={(e) => updateCrop(index, 'quantity', e.target.value)} />
                   </div>
                   <button type="button" className="add-action-btn" onClick={addMoreCrop}>+ ADD MORE</button>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'animals' && (
            <div style={styles.subFormDrawer}>
               <div style={styles.drawerHeader}>Livestock Registry</div>
               {formData.animals.map((animal, index) => (
                 <div key={index} className="row-container" style={{ marginBottom: '15px' }}>
                   <div style={{ flex: 2 }}>
                     <label style={styles.smallLabel}>Breed</label>
                     <input type="text" placeholder="e.g. Dairy Cows" style={styles.input} value={animal.breed} onChange={(e) => updateAnimal(index, 'breed', e.target.value)} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <label style={styles.smallLabel}>Count</label>
                     <input type="number" placeholder="0" style={styles.input} value={animal.count} onChange={(e) => updateAnimal(index, 'count', e.target.value)} />
                   </div>
                   <button type="button" className="add-action-btn" onClick={addMoreAnimal}>+ ADD MORE</button>
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #eee", paddingBottom: "15px" },
  title: { fontSize: "32px", color: "#1a202c", margin: 0, fontWeight: "900" },
  closeBtn: { background: "#eee", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "25px" },
  mainInputsRow: { display: "flex", gap: "20px" },
  inputGroup: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "18px", fontWeight: "bold", color: "#4a5568" },
  smallLabel: { fontSize: "14px", fontWeight: "bold", color: "#718096", marginBottom: "4px" },
  input: { padding: "12px 18px", borderRadius: "10px", border: "2px solid #cbd5e0", fontSize: "18px", width: "100%", boxSizing: "border-box" },
  sectionDivider: { textAlign: "center", margin: "15px 0", borderBottom: "1px solid #e2e8f0", lineHeight: "0.1em" },
  dividerText: { background: "#fff", padding: "0 20px", fontSize: "16px", fontWeight: "bold", color: "#718096" },
  assetBtnRow: { display: "flex", gap: "20px" },
  subFormDrawer: { background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "12px", padding: "25px" },
  drawerHeader: { fontSize: "22px", fontWeight: "bold", color: "#2e7d32", marginBottom: "15px" },
  footer: { marginTop: "20px" },
  submitBtn: { width: "100%", background: "#27ae60", color: "white", padding: "18px", border: "none", borderRadius: "12px", fontSize: "22px", fontWeight: "900", cursor: "pointer" }
};

export default AddLand;
