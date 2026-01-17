import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaMapMarkedAlt, FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const AddLand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plot_name: "",
    area_size: "",
    land_status: "Active",
    description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Register the asset in the DROP system
      await api.post("/farmer/farm/land", formData);
      
      // SUCCESS: The form "disappears" because we change the page
      navigate("/my-farm/land/view");
    } catch (err) {
      console.error("Registry Error:", err);
      alert("Failed to sync land to registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageOverlay}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <FaMapMarkedAlt size={24} color="#27ae60" />
            <h2 style={styles.title}>Register New Land Node</h2>
          </div>
          <button onClick={() => navigate("/my-farm/land/view")} style={styles.closeBtn}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Plot Name / Identifier</label>
            <input 
              type="text" 
              placeholder="e.g. Western Ridge Section A" 
              style={styles.input}
              onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Total Area (Hectares)</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              style={styles.input}
              onChange={(e) => setFormData({...formData, area_size: e.target.value})}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Land Status</label>
            <select 
              style={styles.input}
              onChange={(e) => setFormData({...formData, land_status: e.target.value})}
            >
              <option value="Active">Active / Cultivated</option>
              <option value="Fallow">Fallow / Resting</option>
              <option value="Maintenance">Under Maintenance</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            <FaCloudUploadAlt /> {loading ? "Syncing to DROP..." : "DROP TO REGISTRY"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageOverlay: {
    width: "100%",
    minHeight: "100vh",
    background: "#f0f2f5", // Matches the ViewLand background
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "120px" // Space for your top navbar
  },
  formCard: {
    width: "100%",
    maxWidth: "500px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "30px",
    border: "1px solid #e0e0e0"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    borderBottom: "2px solid #f0f2f5",
    paddingBottom: "15px"
  },
  titleGroup: { display: "flex", alignItems: "center", gap: "12px" },
  title: { fontSize: "20px", color: "#333", margin: 0, fontWeight: "700" },
  closeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#999" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "700", color: "#666", textTransform: "uppercase" },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s"
  },
  submitBtn: {
    marginTop: "10px",
    background: "#27ae60",
    color: "white",
    padding: "15px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "background 0.2s"
  }
};

export default AddLand;
