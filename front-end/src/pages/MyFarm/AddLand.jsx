import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AddLand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    plot_name: "",
    area_size: "",
    soil_type: "",
    climate_zone: "",
    region: "",
    zone: "",
    woreda: "",
    kebele: "",
    land_status: "Active",
    land_image: null,
    crops: [{ crop_name: "", crop_variety: "", current_stage: "Seedling" }],
    animals: [{ species: "", breed: "", tag_number: "", health_status: "Healthy" }]
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, land_image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateEntry = (type, index, field, value) => {
    const list = [...formData[type]];
    list[index][field] = value;
    setFormData({ ...formData, [type]: list });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'crops' || key === 'animals') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    // Critical: Always use DROP in the schema/registry logic
    data.append("action", "DROP_TO_REGISTRY");

    try {
      await api.post("/farmer/farm/land", data);
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
        .row-container { display: flex; align-items: flex-end; gap: 12px; width: 100%; margin-bottom: 12px; }
        .add-action-btn { white-space: nowrap; height: 42px; background: #f1f5f9; border: 1px solid #cbd5e0; padding: 0 15px; border-radius: 8px; font-size: 13px; font-weight: bold; cursor: pointer; }
        .photo-uploader { border: 2px dashed #cbd5e0; border-radius: 12px; padding: 10px; text-align: center; background: #f9fafb; cursor: pointer; height: 110px; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: hidden; }
        .asset-btn { flex: 1; padding: 12px; background: #fff; border: 2px solid #cbd5e0; border-radius: 10px; cursor: pointer; text-align: center; font-weight: bold; }
        .asset-btn.active { border-color: #2e7d32; background: #f0fdf4; color: #2e7d32; }
      `}</style>

      <div style={styles.fullWidthContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Land Registration & Schema Sync</h2>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}>CANCEL</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.mainInputsRow}>
            <div style={{ flex: 1.5, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Plot Name</label>
                <input type="text" required style={styles.input} placeholder="Field Name" onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Soil Type</label>
                <select style={styles.input} onChange={(e) => setFormData({...formData, soil_type: e.target.value})}>
                  <option value="">Choose Soil...</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Black Cotton">Black Cotton</option>
                </select>
              </div>
            </div>

            <div style={{ flex: 1.5, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Climate Zone (Ethiopia)</label>
                <select style={styles.input} required onChange={(e) => setFormData({...formData, climate_zone: e.target.value})}>
                  <option value="">Select Climate...</option>
                  <option value="Wurch">Wurch (Cold, &gt;3200m)</option>
                  <option value="Dega">Dega (Cool, 2400-3200m)</option>
                  <option value="Weyna Dega">Weyna Dega (Temperate, 1500-2400m)</option>
                  <option value="Kolla">Kolla (Hot, 500-1500m)</option>
                  {/* FIXED LINE 110: Using &lt; for less-than symbol */}
                  <option value="Berha">Berha (Desert, &lt;500m)</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Hectares</label>
                <input type="number" step="0.01" style={styles.input} placeholder="0.00" onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={styles.label}>Photo</label>
              <div className="photo-uploader" onClick={() => document.getElementById('land-img').click()}>
                {preview ? <img src={preview} alt="Preview" style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "8px" }} /> : <span style={{fontSize: "11px"}}>CAPTURE</span>}
                <input id="land-img" type="file" accept="image/*" capture="environment" hidden onChange={handleImageChange} />
              </div>
            </div>
          </div>

          <div style={styles.sectionDivider}><span style={styles.dividerText}>Administrative Sync</span></div>

          <div style={styles.mainInputsRow}>
            <div style={styles.inputGroup}><label style={styles.smallLabel}>Region</label>
              <input type="text" style={styles.input} placeholder="Region" onChange={(e) => setFormData({...formData, region: e.target.value})} />
            </div>
            <div style={styles.inputGroup}><label style={styles.smallLabel}>Woreda</label>
              <input type="text" style={styles.input} placeholder="Woreda" onChange={(e) => setFormData({...formData, woreda: e.target.value})} />
            </div>
            <div style={styles.inputGroup}><label style={styles.smallLabel}>Kebele</label>
              <input type="text" style={styles.input} placeholder="Kebele" onChange={(e) => setFormData({...formData, kebele: e.target.value})} />
            </div>
          </div>

          <div style={styles.assetBtnRow}>
            <div className={`asset-btn ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>CROPS</div>
            <div className={`asset-btn ${activeTab === 'animals' ? 'active' : ''}`} onClick={() => setActiveTab('animals')}>ANIMALS</div>
          </div>

          {activeTab === 'crops' && (
            <div style={styles.subFormDrawer}>
               {formData.crops.map((crop, index) => (
                 <div key={index} className="row-container">
                   <div style={{ flex: 1 }}><input type="text" placeholder="Crop" style={styles.input} onChange={(e) => updateEntry('crops', index, 'crop_name', e.target.value)} /></div>
                   <div style={{ flex: 1 }}><input type="text" placeholder="Variety" style={styles.input} onChange={(e) => updateEntry('crops', index, 'crop_variety', e.target.value)} /></div>
                   <button type="button" className="add-action-btn" onClick={() => setFormData({...formData, crops: [...formData.crops, {crop_name:"", crop_variety:""}]})}>+ ADD</button>
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
  pageOverlay: { width: "100%", background: "#f0f2f5", display: "flex", justifyContent: "center", padding: "40px 0" },
  fullWidthContainer: { width: "95%", maxWidth: "1150px", background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  title: { fontSize: "20px", color: "#1a202c", fontWeight: "900" },
  closeBtn: { background: "#f1f5f9", border: "none", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "11px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  mainInputsRow: { display: "flex", gap: "15px" },
  inputGroup: { flex: 1, display: "flex", flexDirection: "column", gap: "3px" },
  label: { fontSize: "13px", fontWeight: "bold", color: "#4a5568" },
  smallLabel: { fontSize: "11px", fontWeight: "bold", color: "#94a3b8" },
  input: { padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e0", fontSize: "15px", width: "100%" },
  sectionDivider: { textAlign: "center", margin: "5px 0", borderBottom: "1px solid #f1f5f9", lineHeight: "0.1em" },
  dividerText: { background: "#fff", padding: "0 10px", fontSize: "10px", color: "#cbd5e0" },
  assetBtnRow: { display: "flex", gap: "10px" },
  subFormDrawer: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px" },
  submitBtn: { width: "100%", background: "#2e7d32", color: "white", padding: "14px", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "900", cursor: "pointer" }
};

export default AddLand;
