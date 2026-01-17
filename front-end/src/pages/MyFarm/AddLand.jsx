import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AddLand = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    plot_name: "",
    area_size: "",
    land_status: "Active"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Drop the new asset into the registry
      await api.post("/farmer/farm/land", formData);
      
      // 2. Redirect to the View page immediately
      // This makes the form "disappear" and shows the cards
      navigate("/my-farm/land/view");
    } catch (err) {
      console.error("DROP Failed:", err);
      alert("Could not register land. Please try again.");
    }
  };

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.title}>Register New Land Node (DROP)</h2>
      <form onSubmit={handleSubmit} style={formStyles.form}>
        <input 
          type="text" 
          placeholder="Plot Name (e.g. North Field)" 
          onChange={(e) => setFormData({...formData, plot_name: e.target.value})}
          required 
          style={formStyles.input}
        />
        <input 
          type="number" 
          placeholder="Area Size (Hectares)" 
          onChange={(e) => setFormData({...formData, area_size: e.target.value})}
          required 
          style={formStyles.input}
        />
        <button type="submit" style={formStyles.button}>DROP TO REGISTRY</button>
        <button 
          type="button" 
          onClick={() => navigate("/my-farm/land/view")} 
          style={formStyles.cancelBtn}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

const formStyles = {
  container: { padding: "40px", maxWidth: "600px", margin: "100px auto", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  title: { color: "#007185", marginBottom: "20px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "4px", border: "1px solid #ddd" },
  button: { background: "#ff9900", color: "#111", padding: "12px", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" },
  cancelBtn: { background: "#f0f2f5", color: "#444", padding: "10px", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "5px" }
};

export default AddLand;
