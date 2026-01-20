import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineDatabase, HiOutlineUser, HiOutlinePhotograph, 
  HiOutlineTag, HiOutlinePlusCircle, HiOutlineShieldCheck,
  HiOutlineSearch, HiOutlineCheckCircle
} from "react-icons/hi";

const AdminAddListing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [form, setForm] = useState({
    seller_internal_id: "", 
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

  // Handle Search for Farmers
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
          // Adjust this endpoint based on your backend search route
          const { data } = await api.get(`/admin/farmers/search?query=${searchTerm}`);
          setSearchResults(data.farmers || []);
        } catch (err) {
          console.error("Search error", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const selectFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setForm({ ...form, seller_internal_id: farmer.id || farmer.user_id });
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.seller_internal_id) return alert("You must select a Farmer from the registry.");
    setLoading(true);
    
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      if (primaryImage) fd.append("primary_image", primaryImage);
      if (galleryImages.length > 0) {
        galleryImages.forEach(img => fd.append("gallery_images", img));
      }

      await api.post("/admin/marketplace/listings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("REGISTRY NODE CREATED: DROP action successful.");
      // FIXED PATH: Synced with App.jsx
      navigate("/admin/farmers/market/view");
    } catch (err) {
      alert(err.response?.data?.message || "Authority connection error");
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    container: { minHeight: "100vh", background: "#f1f5f9", padding: "40px 20px", display: "flex", justifyContent: "center", fontFamily: "'Inter', sans-serif" },
    glassCard: { width: "100%", maxWidth: "850px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", overflow: "hidden", border: "1px solid #e2e8f0" },
    header: { background: "#1e40af", padding: "30px", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "15px" },
    inputField: { width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none", boxSizing: "border-box" },
    label: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px", textTransform: "uppercase" },
    uploadBox: { border: "2px dashed #3b82f6", borderRadius: "12px", padding: "20px", textAlign: "center", cursor: "pointer", background: "#eff6ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
    submitBtn: { width: "100%", padding: "16px", background: loading ? "#94a3b8" : "#1e40af", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", marginTop: "20px" },
    searchDropdown: { position: "absolute", width: "100%", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", zIndex: 10, marginTop: "5px", maxHeight: "200px", overflowY: "auto" }
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
          <h3 style={{ fontSize: "14px", color: "#1e40af", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>Identity Assignment</h3>
          
          {/* SEARCH FARMER SECTION */}
          <div style={{ marginBottom: "30px", position: "relative" }}>
            <label style={theme.label}><HiOutlineUser /> Link Farmer (Search Name, Email, or Phone)</label>
            
            {selectedFarmer ? (
              <div style={{ ...theme.inputField, background: "#ecfdf5", borderColor: "#10b981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><HiOutlineCheckCircle color="#10b981" /> <strong>{selectedFarmer.full_name}</strong> ({selectedFarmer.phone})</span>
                <button type="button" onClick={() => setSelectedFarmer(null)} style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontWeight: "bold" }}>Change</button>
              </div>
            ) : (
              <>
                <div style={{ position: "relative" }}>
                  <input 
                    style={theme.inputField} 
                    placeholder="Start typing farmer details..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <HiOutlineSearch style={{ position: "absolute", right: "15px", top: "15px", color: "#94a3b8" }} />
                </div>
                {isSearching && <small>Searching DROP registry...</small>}
                {searchResults.length > 0 && (
                  <div style={theme.searchDropdown}>
                    {searchResults.map(f => (
                      <div 
                        key={f.id} 
                        onClick={() => selectFarmer(f)}
                        style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}
                        onMouseOver={(e) => e.target.style.background = "#f8fafc"}
                        onMouseOut={(e) => e.target.style.background = "transparent"}
                      >
                        <div style={{ fontWeight: "700", fontSize: "14px" }}>{f.full_name}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{f.email} | {f.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <input type="hidden" name="seller_internal_id" value={form.seller_internal_id} required />
          </div>

          {/* PRODUCT DATA SECTION */}
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

          {/* MEDIA SECTION */}
          <label style={theme.label}><HiOutlinePhotograph /> Node Media</label>
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
