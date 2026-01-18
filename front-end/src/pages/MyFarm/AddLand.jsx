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
    location: "", 
    land_status: "Active",
    land_image: null, // New field for photo taker
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
    
    // Using FormData to handle image file upload + JSON data
    const data = new FormData();
    data.append("plot_name", formData.plot_name);
    data.append("area_size", formData.area_size);
    data.append("action", "DROP_TO_REGISTRY");
    if (formData.land_image) data.append("image", formData.land_image);
    data.append("crops", JSON.stringify(formData.crops));
    data.append("animals", JSON.stringify(formData.animals));

    try {
      await api.post("/farmer/farm/land", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
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
        .asset-btn { flex: 1; padding: 18px; background: #fff; border: 3px solid #cbd5e0; border-radius: 12px; cursor: pointer; text-align: center; transition: 0.2s; }
        .asset-btn.active { border-color: #2e7d32; background: #f0fdf4; }
        .row-container { display: flex; align-items: flex-end; gap: 12px; width: 100%; margin-bottom: 15px; }
        .add-action-btn { white-space: nowrap; height: 48px; background: #f8fafc; border: 2px solid #cbd5e0; padding: 0 18px; border-radius: 10px; font-size: 15px; font-weight: bold; cursor: pointer; }
        .photo-uploader { border: 2px dashed #cbd5e0; border-radius: 12px; padding: 20px; text-align: center; background: #f9fafb; cursor: pointer; position: relative; }
        .photo-preview { width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; margin-top: 10px; }
      `}</style>

      <div style={styles.fullWidthContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Register Land Plot</h2>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}>CANCEL</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.mainInputsRow}>
            <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Plot Name</label>
                <input type="text" required style={styles.input} placeholder="Field Identification" onChange={(e) => setFormData({...formData, plot_name: e.target.value})} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Hectares</label>
                <input type="number" step="0.01" required style={styles.input} placeholder="0.00" onChange={(e) => setFormData({...formData, area_size: e.target.value})} />
              </div>
            </div>

            {/* PHOTO TAKER SECTION */}
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Land Photo</label>
              <div className="photo-uploader" onClick={() => document.getElementById('land-img').click()}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#718096' }}>
                  {preview ? "CHANGE PHOTO" : "TAP TO TAKE PHOTO"}
                </span>
                <input id="land-img" type="file" accept="image/*" capture="environment" hidden onChange={handleImageChange} />
                {preview && <img src={preview} alt="Preview" className="photo-preview" />}
              </div>
            </div>
          </div>

          <div style={styles.sectionDivider}><span style={styles.dividerText}>Asset Registry</span></div>

          <div style={styles.assetBtnRow}>
            <div className={`asset-btn ${activeTab === 'crops' ? 'active' : ''}`} onClick={() => setActiveTab('crops')}>
              <span className="asset-btn-text" style={{ fontSize: '18px', fontWeight: 'bold' }}>CROPS</span>
            </div>
            <div className={`asset-btn ${activeTab === 'animals' ? 'active' : ''}`} onClick={() => setActiveTab('animals')}>
              <span className="asset-btn-text" style={{ fontSize: '18px', fontWeight: 'bold' }}>ANIMALS</span>
            </div>
          </div>

          {activeTab === 'crops' && (
            <div style={styles.subFormDrawer}>
               {formData.crops.map((crop, index) => (
                 <div key={index} className="row-container">
                   <div style={{ flex: 1 }}><label style={styles.smallLabel}>Crop Name</label>
                     <input type="text" style={styles.input} value={crop.crop_name} onChange={(e) => updateEntry('crops', index, 'crop_name', e.target.value)} />
                   </div>
                   <div style={{ flex: 1 }}><label style={styles.smallLabel}>Variety</label>
                     <input type="text" style={styles.input} value={crop.crop_variety} onChange={(e) => updateEntry('crops', index, 'crop_variety', e.target.value)} />
                   </div>
                   <button type="button" className="add-action-btn" onClick={addMoreCrop}>+ ADD</button>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'animals' && (
            <div style={styles.subFormDrawer}>
               {formData.animals.map((animal, index) => (
                 <div key={index} className="row-container">
                   <div style={{ flex: 1 }}><label style={styles.smallLabel}>Tag #</label>
                     <input type="text" style={styles.input} value={animal.tag_number} onChange={(e) => updateEntry('animals', index, 'tag_number', e.target.value)} />
                   </div>
                   <div style={{ flex: 1 }}><label style={styles.smallLabel}>Species</label>
                     <input type="text" style={styles.input} value={animal.species} onChange={(e) => updateEntry('animals', index, 'species', e.target.value)} />
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #eee", paddingBottom: "15px" },
  title: { fontSize: "28px", color: "#1a202c", margin: 0, fontWeight: "900" },
  closeBtn: { background: "#eee", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  mainInputsRow: { display: "flex", gap: "25px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "16px", fontWeight: "bold", color: "#4a5568", marginBottom: "4px" },
  smallLabel: { fontSize: "12px", fontWeight: "bold", color: "#718096", marginBottom: "2px" },
  input: { padding: "10px 15px", borderRadius: "10px", border: "2px solid #cbd5e0", fontSize: "18px", width: "100%", boxSizing: "border-box" },
  sectionDivider: { textAlign: "center", margin: "10px 0", borderBottom: "1px solid #e2e8f0", lineHeight: "0.1em" },
  dividerText: { background: "#fff", padding: "0 20px", fontSize: "13px", fontWeight: "bold", color: "#cbd5e0" },
  assetBtnRow: { display: "flex", gap: "20px" },
  subFormDrawer: { background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "12px", padding: "15px" },
  footer: { marginTop: "15px" },
  submitBtn: { width: "100%", background: "#27ae60", color: "white", padding: "16px", border: "none", borderRadius: "12px", fontSize: "20px", fontWeight: "900", cursor: "pointer" }
};

export default AddLand;
