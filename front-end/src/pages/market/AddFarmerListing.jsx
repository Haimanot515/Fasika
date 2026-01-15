import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaWeightHanging, FaTags, FaImage, FaCloudUploadAlt } from "react-icons/fa";

const AddFarmerListing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_category: "CROPS",
    product_name: "",
    quantity: "",
    unit: "KG",
    price_per_unit: "",
    description: ""
  });

  const [primaryImage, setPrimaryImage] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  // Amazon/Fresh-inspired Theme
  const theme = {
    container: { marginTop: "80px", minHeight: "calc(100vh - 80px)", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", padding: "40px 20px", display: "flex", justifyContent: "center", fontFamily: "'Inter', sans-serif" },
    glassCard: { width: "100%", maxWidth: "800px", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)", overflow: "hidden" },
    header: { background: "#166534", padding: "30px", color: "white", textAlign: "center" },
    inputField: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #e2e8f0", fontSize: "16px", outline: "none", boxSizing: "border-box", backgroundColor: "#fff" },
    label: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#14532d", marginBottom: "8px" },
    uploadBox: { border: "2px dashed #22c55e", borderRadius: "16px", padding: "20px", textAlign: "center", cursor: "pointer", background: "#f0fdf4", position: "relative", minHeight: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
    submitBtn: { width: "100%", padding: "18px", background: loading ? "#6b7280" : "#15803d", color: "white", border: "none", borderRadius: "14px", fontSize: "18px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", marginTop: "20px", transition: "0.3s" }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePrimaryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrimaryImage(file);
      setPrimaryPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      
      if (primaryImage) fd.append("primary_image", primaryImage);
      if (galleryImages.length > 0) {
        galleryImages.forEach(img => fd.append("gallery_images", img));
      }

      await api.post("/farmer/listings", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Listing published successfully! 🌽");
      navigate("/market/sales");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={theme.container}>
      <div style={theme.glassCard}>
        <div style={theme.header}>
          <FaLeaf size={35} />
          <h1 style={{ margin: "10px 0 5px 0", fontSize: "24px" }}>Post Your Harvest</h1>
          <p style={{ opacity: 0.8, fontSize: "14px" }}>Available to buyers across Ethiopia</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "30px" }}>
          <h3 style={{ color: "#166534", borderBottom: "2px solid #dcfce7", paddingBottom: "10px", marginBottom: "20px" }}>Product Details</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={theme.label}><FaTags /> Category</label>
              <select name="product_category" style={theme.inputField} value={form.product_category} onChange={handleChange}>
                <option value="CROPS">Cereals / Crops</option>
                <option value="VEGETABLES">Vegetables</option>
                <option value="FRUITS">Fruits</option>
                <option value="LIVESTOCK">Livestock</option>
              </select>
            </div>
            <div>
              <label style={theme.label}><FaLeaf /> Product Name</label>
              <input name="product_name" style={theme.inputField} placeholder="e.g. Red Teff" value={form.product_name} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={theme.label}><FaWeightHanging /> Quantity</label>
              <input name="quantity" type="number" step="0.01" style={theme.inputField} placeholder="0.00" value={form.quantity} onChange={handleChange} required />
            </div>
            <div>
              <label style={theme.label}>Unit</label>
              <select name="unit" style={theme.inputField} value={form.unit} onChange={handleChange}>
                <option value="KG">KG</option>
                <option value="QUINTAL">Quintal</option>
                <option value="LITRE">Litre</option>
                <option value="HEAD">Head (Livestock)</option>
              </select>
            </div>
            <div>
              <label style={theme.label}>Price (ETB) / Unit</label>
              <input name="price_per_unit" type="number" step="0.01" style={theme.inputField} placeholder="0.00" value={form.price_per_unit} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={theme.label}>Description</label>
            <textarea name="description" style={{ ...theme.inputField, minHeight: "80px", resize: "none" }} placeholder="Quality details, harvest date, etc..." value={form.description} onChange={handleChange} />
          </div>

          <div style={theme.label}><FaImage /> Product Images</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "10px" }}>
            <div style={theme.uploadBox} onClick={() => document.getElementById("p_img").click()}>
              {primaryPreview ? (
                <img src={primaryPreview} alt="Preview" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
              ) : (
                <>
                  <FaCloudUploadAlt size={24} color="#15803d" />
                  <span style={{ fontSize: "12px", marginTop: "5px" }}>Cover Photo</span>
                </>
              )}
              <input id="p_img" type="file" hidden accept="image/*" onChange={handlePrimaryImageChange} />
            </div>

            <div style={{ ...theme.uploadBox, background: "#f8fafc", borderColor: "#cbd5e1" }} onClick={() => document.getElementById("g_img").click()}>
              <FaImage size={24} color="#64748b" />
              <span style={{ fontSize: "12px", marginTop: "5px" }}>Gallery ({galleryImages.length})</span>
              <input id="g_img" type="file" multiple hidden accept="image/*" onChange={(e) => setGalleryImages(Array.from(e.target.files))} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={theme.submitBtn}>
            {loading ? "🌾 Processing..." : "Publish Harvest"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFarmerListing;
