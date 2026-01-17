import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { 
  FaPlus, FaLeaf, FaPaw, FaMapMarkedAlt, 
  FaCloudUploadAlt, FaTimes, FaCheckCircle 
} from "react-icons/fa";

const AddLand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // 'crops' or 'animals'

  const [formData, setFormData] = useState({
    plot_name: "",
    area_size: "",
    land_status: "Active",
    crops: [], // Array for linked crop assets
    animals: [] // Array for linked animal assets
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/farmer/farm/land", formData);
      // Immediately disappear and show the view page
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
        .asset-btn { 
          flex: 1; display: flex; flex-direction: column; align-items: center; 
          padding: 12px; background: #f8f9fa; border: 2px solid #e2e8f0; 
          border-radius: 10px; cursor: pointer; transition: 0.3s; color: #475569;
        }
        .asset-btn.active { border-color: #27ae60; background: #f0fdf4; color: #166534; }
        .asset-btn span { font-size: 12px; font-weight: 700; margin-top: 6px; text-transform: uppercase; }
        
        .sub-form-drawer {
          background: #fdfdfd; border: 1px dashed #27ae60; 
          border-radius: 8px; padding: 15px; margin-top: 10px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div style={styles.formCard}>
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <FaMapMarkedAlt size={22} color="#27ae60" />
            <h2 style={styles.title}>New Land Registration</h2>
          </div>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Plot Name</label>
            <input 
              type="text" 
              required 
              style={styles.input}
              placeholder="Enter plot name..."
              onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Size (Ha)</label>
            <input 
              type="number" 
              required 
              style={styles.input}
              placeholder="0.00"
              onChange={(e) => setFormData({...formData, area_size: e.target.value})}
            />
          </div>

          {/* ASSET SELECTION BUTTONS ONLY */}
          <div style={styles.assetLabel}>Link Initial Assets (Optional)</div>
          <div style={styles.assetBtnRow}>
            <div 
              className={`asset-btn ${activeTab === 'crops' ? 'active' : ''}`}
              onClick={() => setActiveTab(activeTab === 'crops' ? null : 'crops')}
            >
              <FaLeaf size={24} />
              <span>Crops</span>
            </div>
            <div 
              className={`asset-btn ${activeTab === 'animals' ? 'active' : ''}`}
              onClick={() => setActiveTab(activeTab === 'animals' ? null : 'animals')}
            >
              <FaPaw size={24} />
              <span>Animals</span>
            </div>
          </div>

          {/* SUB-FORM DRAWERS */}
          {activeTab === 'crops' && (
            <div className="sub-form-drawer">
               <div style={styles.drawerTitle}>Add Crop to this Plot</div>
               <input type="text" placeholder="Crop Type (e.g. Maize)" style={styles.innerInput} />
               <input type="number" placeholder="Quantity" style={styles.innerInput} />
            </div>
          )}

          {activeTab === 'animals' && (
            <div className="sub-form-drawer">
               <div style={styles.drawerTitle}>Add Animals to this Plot</div>
               <input type="text" placeholder="Breed (e.g. Friesian)" style={styles.innerInput} />
               <input type="number" placeholder="Head Count" style={styles.innerInput} />
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Registering..." : "DROP TO REGISTRY"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageOverlay: { width: "100%", minHeight: "100vh", background: "#f0f2f5", display: "flex", justifyContent: "center", paddingTop: "100px" },
  formCard: { width: "90%", maxWidth: "450px", background: "#fff", borderRadius: "15px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", height: "fit-content" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  titleGroup: { display: "flex", alignItems: "center", gap: "10px" },
  title: { fontSize: "18px", color: "#1a202c", margin: 0 },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#a0aec0" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", fontWeight: "800", color: "#718096", textTransform: "uppercase" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" },
  assetLabel: { fontSize: "12px", fontWeight: "800", color: "#718096", marginTop: "10px", textAlign: "center" },
  assetBtnRow: { display: "flex", gap: "12px" },
  drawerTitle: { fontSize: "13px", fontWeight: "bold", color: "#27ae60", marginBottom: "10px" },
  innerInput: { width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "13px", boxSizing: "border-box" },
  submitBtn: { marginTop: "15px", background: "#27ae60", color: "white", padding: "15px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }
};

export default AddLand;
