import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineDatabase, HiOutlineUser, HiOutlinePhotograph, 
  HiOutlineTag, HiOutlinePlusCircle, HiOutlineShieldCheck 
} from "react-icons/hi";

const AdminAddListing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    seller_internal_id: "", // REQUIRED for Admin to link to a farmer
    product_category: "CROPS",
    product_name: "",
    quantity: "",
    unit: "KG",
    price_per_unit: "",
    description: "",
    status: "ACTIVE"
  });

  const [primaryImage, setPrimaryImage] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const theme = {
    container: { minHeight: "100vh", background: "#f1f5f9", padding: "40px 20px", display: "flex", justifyContent: "center", fontFamily: "'Inter', sans-serif" },
    glassCard: { width: "100%", maxWidth: "850px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", overflow: "hidden", border: "1px solid #e2e8f0" },
    header: { background: "#1e40af", padding: "30px", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" },
    inputField: { width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none", boxSizing: "border-box" },
    label: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px", textTransform: "uppercase" },
    uploadBox: { border: "2px dashed #3b82f6", borderRadius: "12px", padding: "20px", textAlign: "center", cursor: "pointer", background: "#eff6ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
    submitBtn: { width: "100%", padding: "16px", background: loading ? "#94a3b8" : "#1e40af", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", marginTop: "20px" }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.seller_internal_id) return alert("You must provide a Farmer Internal ID");
    setLoading(true);
    
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      if (primaryImage) fd.append("primary_image", primaryImage);
      if (galleryImages.length > 0) {
        galleryImages.forEach(img => fd.append("gallery_images", img));
      }

      // ADMIN ROUTE MOUNTED IN server.js
      await api.post("/admin/marketplace/listings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("REGISTRY NODE CREATED: DROP action successful.");
      navigate("/admin/marketplace");
    } catch (err) {
      alert(err.response?.data?.message || "Authority connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={theme.container}>
      <div style={theme.glassCard}>
        <div style={theme.header}>
          <HiOutlineShieldCheck size={40} />
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", letterSpacing: "0.5px" }}>MARKETPLACE REGISTRY</h1>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "12px" }}>AUTHORITY ACTION: CREATE NODE</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "40px" }}>
          {/* SECTION 1: AUTHORITY & OWNER */}
          <h3 style={{ fontSize: "14px", color: "#1e40af", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>Identity Assignment</h3>
          <div style={{ marginBottom: "30px" }}>
            <label style={theme.label}><HiOutlineUser /> Farmer Internal ID (Target ID)</label>
            <input 
              name="seller_internal_id" 
              style={{...theme.inputField, borderColor: "#1e40af", background: "#f0f7ff"}} 
              placeholder="Enter User ID (e.g. 102)" 
              value={form.seller_internal_id} 
              onChange={handleChange} 
              required 
            />
            <small style={{color: "#64748b"}}>Assign this product node to a specific registry user.</small>
          </div>

          {/* SECTION 2: PRODUCT DATA */}
          <h3 style={{ fontSize: "14px", color: "#1e40af", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>Product Specifications</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={theme.label}><HiOutlineTag /> Category</label>
              <select name="product_category" style={theme.inputField} value={form.product_category} onChange={handleChange}>
                <option value="CROPS">Cereals / Crops</option>
                <option value="VEGETABLES">Vegetables</option>
                <option value="FRUITS">Fruits</option>
                <option value="LIVESTOCK">Livestock</option>
              </select>
            </div>
            <div>
              <label style={theme.label}><HiOutlinePlusCircle /> Product Name</label>
              <input name="product_name" style={theme.inputField} placeholder="e.g. White Teff" value={form.product_name} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={theme.label}>Quantity</label>
              <input name="quantity" type="number" style={theme.inputField} value={form.quantity} onChange={handleChange} required />
            </div>
            <div>
              <label style={theme.label}>Unit</label>
              <select name="unit" style={theme.inputField} value={form.unit} onChange={handleChange}>
                <option value="KG">KG</option>
                <option value="QUINTAL">Quintal</option>
                <option value="HEAD">Head</option>
              </select>
            </div>
            <div>
              <label style={theme.label}>Price (ETB)</label>
              <input name="price_per_unit" type="number" style={theme.inputField} value={form.price_per_unit} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={theme.label}>Node Status</label>
            <select name="status" style={theme.inputField} value={form.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING">PENDING</option>
              <option value="PAUSED">PAUSED</option>
            </select>
          </div>

          {/* SECTION 3: MEDIA */}
          <label style={theme.label}><HiOutlinePhotograph /> Node Media (Images)</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            <div style={theme.uploadBox} onClick={() => document.getElementById("p_img").click()}>
              {primaryPreview ? (
                <img src={primaryPreview} alt="Preview" style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
              ) : (
                <><HiOutlinePhotograph size={24} color="#3b82f6" /><span>Primary Image</span></>
              )}
              <input id="p_img" type="file" hidden accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if(file) { setPrimaryImage(file); setPrimaryPreview(URL.createObjectURL(file)); }
              }} />
            </div>
            <div style={{ ...theme.uploadBox, background: "#f8fafc", borderColor: "#cbd5e1" }}>
               <HiOutlineDatabase size={24} color="#64748b" />
               <span style={{fontSize: "12px"}}>Gallery Images: {galleryImages.length}</span>
               <input type="file" multiple accept="image/*" onChange={(e) => setGalleryImages(Array.from(e.target.files))} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={theme.submitBtn}>
            {loading ? "COMMITTING TO REGISTRY..." : "PUBLISH REGISTRY NODE"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddListing;
