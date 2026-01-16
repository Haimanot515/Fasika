import React, { useEffect, useState } from "react";
// Import your api instance instead of raw axios
import api from "../../api/axios"; 
import { useNavigate, useParams } from "react-router-dom";

const EditFarmerListing = () => {
  const { listing_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    product_name: "",
    product_category: "",
    price_per_unit: "", 
    quantity: "",
    unit: "",
    description: ""
  });

  const styles = {
    page: { backgroundColor: "#F0F2F2", minHeight: "100vh", padding: "40px 20px" },
    container: { maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", padding: "25px", borderRadius: "8px", border: "1px solid #D5D9D9", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
    label: { display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "5px", color: "#0F1111" },
    input: { width: "100%", padding: "8px", marginBottom: "15px", border: "1px solid #888C8C", borderRadius: "3px", boxSizing: "border-box" },
    btnPrimary: { backgroundColor: "#FFD814", border: "1px solid #FCD200", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: "500" }
  };

  useEffect(() => {
    console.log("🔍 Edit Page ID Check:", listing_id);

    if (!listing_id || listing_id === "undefined") {
      console.error("❌ No ID found in URL.");
      return;
    }

    const fetchItem = async () => {
      try {
        // Changed from localhost to use the api instance
        const res = await api.get(`/farmer/listings/item/${listing_id}`);
        
        if (res.data.success) {
          setForm(res.data.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        alert("Failed to load harvest details from Render.");
        navigate("/market/sales");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [listing_id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Changed from localhost to use the api instance
      await api.put(`/farmer/listings/${listing_id}`, form);
      
      alert("Harvest Updated Successfully! ✅");
      navigate("/market/sales");
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.response?.data?.error || "Update failed on Render node.");
    }
  };

  if (loading && listing_id !== "undefined") return <div style={styles.page}>Loading harvest data...</div>;
  if (!listing_id || listing_id === "undefined") return <div style={styles.page}>Error: No Listing ID provided in URL.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={{ marginBottom: "20px", fontSize: "22px" }}>Edit Harvest Listing</h2>
        <form onSubmit={handleUpdate}>
          
          <label style={styles.label}>Product Name</label>
          <input 
            name="product_name"
            style={styles.input}
            value={form.product_name || ""} 
            onChange={handleChange} 
            required 
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Price (ETB) / {form.unit}</label>
              <input 
                name="price_per_unit"
                type="number"
                style={styles.input}
                value={form.price_per_unit || ""} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Quantity</label>
              <input 
                name="quantity"
                type="number"
                style={styles.input}
                value={form.quantity || ""} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <label style={styles.label}>Description</label>
          <textarea 
            name="description"
            style={{ ...styles.input, height: "100px", resize: "none" }}
            value={form.description || ""} 
            onChange={handleChange} 
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" style={styles.btnPrimary}>Save Changes</button>
            <button 
              type="button" 
              style={{ ...styles.btnPrimary, backgroundColor: "#fff", border: "1px solid #D5D9D9" }}
              onClick={() => navigate("/market/sales")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFarmerListing;
