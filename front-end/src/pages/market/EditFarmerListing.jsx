import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaLeaf, FaWeightHanging, FaTags, FaImage, FaCloudUploadAlt } from "react-icons/fa";

const EditFarmerListing = () => {
  const { listing_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Same Premium Theme as AddListing
  const theme = {
    container: { marginTop: "80px", minHeight: "calc(100vh - 80px)", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", padding: "40px 20px", display: "flex", justifyContent: "center", fontFamily: "'Inter', sans-serif" },
    glassCard: { width: "100%", maxWidth: "800px", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)", overflow: "hidden" },
    header: { background: "#166534", padding: "30px", color: "white", textAlign: "center" },
    inputField: { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #e2e8f0", fontSize: "16px", outline: "none", boxSizing: "border-box", backgroundColor: "#fff" },
    label: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#14532d", marginBottom: "8px" },
    uploadBox: { border: "2px dashed #22c55e", borderRadius: "16px", padding: "20px", textAlign: "center", cursor: "pointer", background: "#f0fdf4", position: "relative", minHeight: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
    submitBtn: { width: "100%", padding: "18px", background: saving ? "#6b7280" : "#15803d", color: "white", border: "none", borderRadius: "14px", fontSize: "18px", fontWeight: "bold", cursor: saving ? "not-allowed" : "pointer", marginTop: "20px", transition: "0.3s" }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/farmer/listings/item/${listing_id}`);
        if (res.data.success) {
          const item = res.data.data;
          setForm({
            product_category: item.product_category || "CROPS",
            product_name: item.product_name || "",
            quantity: item.quantity || "",
            unit: item.unit || "KG",
            price_per_unit: item.price_per_unit || "",
            description: item.description || ""
          });
          // Set existing image as preview if it exists
          if (item.primary_image_url) setPrimaryPreview(item.primary_image_url);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        alert("Failed to load harvest details.");
        navigate("/market/sales");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [listing_id, navigate]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const fd = new FormData();
      // Append text fields
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      
      // Append new images if they were selected
      if (primaryImage) fd.append("primary_image", primaryImage);
      if (galleryImages.length > 0) {
        galleryImages.forEach(img => fd.append("gallery_images", img));
      }

      await api.put(`/farmer/listings/${listing_id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Harvest Updated Successfully! ✅");
      navigate("/market/sales");
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.response?.data?.error || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={theme.container}><h3>🌾 Loading harvest data...</h3></div>;

  return (
    <div style={theme.container}>
      <div style={theme.glassCard}>
        <div style={theme.header}>
          <FaLeaf size={35} />
          <h1 style={{ margin: "10px 0 5px 0", fontSize: "24px" }}>Edit Your Harvest</h1>
          <p style={{ opacity: 0.8, fontSize: "14px" }}>Modify your listing details below</p>
        </div>

        <form onSubmit={handleUpdate} style={{ padding: "30px" }}>
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
              <input name="product_name" style={theme.inputField} value={form.product_name} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={theme.label}><FaWeightHanging /> Quantity</label>
              <input name="quantity" type="number" step="0.01" style={theme.inputField} value={form.quantity} onChange={handleChange} required />
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
              <input name="price_per_unit" type="number" step="0.01" style={theme.inputField} value={form.price_per_unit} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={theme.label}>Description</label>
            <textarea name="description" style={{ ...theme.inputField, minHeight: "80px", resize: "none" }} value={form.description} onChange={handleChange} />
          </div>

          <div style={theme.label}><FaImage /> Update Images (Optional)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "10px" }}>
            <div style={theme.uploadBox} onClick={() => document.getElementById("p_img_edit").click()}>
              {primaryPreview ? (
                <img src={primaryPreview} alt="Preview" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
              ) : (
                <>
                  <FaCloudUploadAlt size={24} color="#15803d" />
                  <span style={{ fontSize: "12px", marginTop: "5px" }}>Change Cover Photo</span>
                </>
              )}
              <input id="p_img_edit" type="file" hidden accept="image/*" onChange={handlePrimaryImageChange} />
            </div>

            <div style={{ ...theme.uploadBox, background: "#f8fafc", borderColor: "#cbd5e1" }} onClick={() => document.getElementById("g_img_edit").click()}>
              <FaImage size={24} color="#64748b" />
              <span style={{ fontSize: "12px", marginTop: "5px" }}>Add to Gallery ({galleryImages.length})</span>
              <input id="g_img_edit" type="file" multiple hidden accept="image/*" onChange={(e) => setGalleryImages(Array.from(e.target.files))} />
            </div>
          </div>

          <button type="submit" disabled={saving} style={theme.submitBtn}>
            {saving ? "🌾 Updating..." : "Save Changes"}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate("/market/sales")}
            style={{ ...theme.submitBtn, background: "transparent", color: "#666", marginTop: "10px", fontSize: "14px" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFarmerListing;
