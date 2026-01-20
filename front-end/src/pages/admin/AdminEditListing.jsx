import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  HiOutlineShieldCheck, HiOutlineDatabase, HiOutlineUser, 
  HiOutlinePhotograph, HiOutlineTag, HiOutlineArrowLeft,
  HiOutlineSearch, HiOutlineCheckCircle, HiOutlineMail, 
  HiOutlinePhone, HiOutlineX 
} from "react-icons/hi";

const AdminEditListing = () => {
  const { listing_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Farmer Search States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // --- Product Form State ---
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

  useEffect(() => {
    const fetchNode = async () => {
      try {
        const res = await api.get(`/admin/marketplace/listings/${listing_id}`);
        if (res.data.success) {
          const node = res.data.listing;
          setForm({
            seller_internal_id: node.seller_internal_id || "",
            product_category: node.product_category || "CROPS",
            product_name: node.product_name || "",
            quantity: node.quantity || "",
            unit: node.unit || "KG",
            price_per_unit: node.price_per_unit || "",
            description: node.description || "",
            status: node.status || "ACTIVE"
          });
          if (node.primary_image_url) setPrimaryPreview(node.primary_image_url);
          
          // Pre-load the current owner information
          if (node.owner_name) {
            setSelectedFarmer({
              id: node.seller_internal_id,
              full_name: node.owner_name,
              email: node.owner_email,
              phone: node.owner_phone
            });
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        alert("REGISTRY_ERROR: Node not found.");
        navigate("/admin/farmers/market/view");
      } finally {
        setLoading(false);
      }
    };
    fetchNode();
  }, [listing_id, navigate]);

  // Live Search Logic (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
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
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setForm({ ...form, seller_internal_id: farmer.id });
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.seller_internal_id) return alert("Node must have an assigned farmer.");
    setSaving(true);
    
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      if (primaryImage) fd.append("primary_image", primaryImage);
      if (galleryImages.length > 0) {
        galleryImages.forEach(img => fd.append("gallery_images", img));
      }

      await api.put(`/admin/marketplace/listings/${listing_id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("REGISTRY DROP UPDATED: Node changes committed successfully.");
      navigate("/admin/farmers/market/view");
    } catch (err) {
      alert(err.response?.data?.message || "Registry commit failed.");
    } finally {
      setSaving(false);
    }
  };

  const theme = {
    container: { minHeight: "100vh", background: "#f1f5f9", padding: "40px 20px", display: "flex", justifyContent: "center", fontFamily: "'Inter', sans-serif" },
    glassCard: { width: "100%", maxWidth: "800px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", overflow: "hidden" },
    header: { background: "#1e40af", padding: "30px", color: "white", display: "flex", alignItems: "center", gap: "15px" },
    inputField: { width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none", boxSizing: "border-box" },
    label: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px", textTransform: "uppercase" },
    farmerBadge: { background: "#eff6ff", border: "1px solid #3b82f6", borderRadius: "12px", padding: "15px", marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }
  };

  if (loading) return (
    <div style={theme.container}>
      <HiOutlineDatabase className="animate-spin" size={40} color="#1e40af" />
    </div>
  );

  return (
    <div style={theme.container}>
      <div style={theme.glassCard}>
        <div style={theme.header}>
          <HiOutlineShieldCheck size={40} />
          <div>
            <h1 style={{ margin: 0, fontSize: "20px" }}>EDIT REGISTRY NODE</h1>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "11px" }}>AUTHORITY ID: {listing_id}</p>
          </div>
        </div>

        <div style={{ padding: "40px" }}>
          {/* FARMER IDENTITY SEARCH */}
          <h3 style={{ fontSize: "14px", color: "#1e40af", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>Linked Farmer</h3>
          
          {!selectedFarmer ? (
            <div style={{ position: "relative", marginBottom: "30px" }}>
              <div style={{ position: "relative" }}>
                <input 
                  style={theme.inputField} 
                  placeholder="Search to change owner (Name, Email, or Phone)..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiOutlineSearch style={{ position: "absolute", right: "15px", top: "15px", color: "#94a3b8" }} />
              </div>
              {searchResults.length > 0 && (
                <div style={{ position: "absolute", width: "100%", background: "white", zIndex: 10, boxShadow: "0 10px 15px rgba(0,0,0,0.1)", borderRadius: "8px", marginTop: "5px", border: "1px solid #e2e8f0" }}>
                  {searchResults.map(f => (
                    <div key={f.id} onClick={() => handleSelectFarmer(f)} style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
                      <div style={{ fontWeight: "700" }}>{f.full_name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{f.phone} | {f.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={theme.farmerBadge}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#1e40af" }}>{selectedFarmer.full_name}</div>
                <div style={{ fontSize: "12px", color: "#475569" }}>
                  <HiOutlinePhone style={{verticalAlign: 'middle'}}/> {selectedFarmer.phone} | <HiOutlineMail style={{verticalAlign: 'middle'}}/> {selectedFarmer.email}
                </div>
              </div>
              <button onClick={() => setSelectedFarmer(null)} style={{ background: "#dbeafe", border: "none", color: "#1e40af", padding: "8px", borderRadius: "50%", cursor: "pointer" }}>
                <HiOutlineX size={18} />
              </button>
            </div>
          )}

          <form onSubmit={handleUpdate} style={{ opacity: selectedFarmer ? 1 : 0.4, pointerEvents: selectedFarmer ? "auto" : "none" }}>
            <h3 style={{ fontSize: "14px", color: "#1e40af", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>Node Specifications</h3>
            
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
                <label style={theme.label}>Product Name</label>
                <input name="product_name" style={theme.inputField} value={form.product_name} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={theme.label}>Quantity</label>
                <input name="quantity" type="number" step="0.01" style={theme.inputField} value={form.quantity} onChange={handleChange} required />
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
                <input name="price_per_unit" type="number" step="0.01" style={theme.inputField} value={form.price_per_unit} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={theme.label}>Registry Status</label>
              <select name="status" style={{...theme.inputField, fontWeight: "bold", color: "#1e40af"}} value={form.status} onChange={handleChange}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PAUSED">PAUSED</option>
                <option value="ARCHIVED">ARCHIVED (DROP)</option>
              </select>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={theme.label}>Technical Description</label>
              <textarea name="description" style={{ ...theme.inputField, minHeight: "80px", resize: "none" }} value={form.description} onChange={handleChange} />
            </div>

            <label style={theme.label}><HiOutlinePhotograph /> Node Media Override</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
              <div 
                style={{ border: "2px dashed #3b82f6", borderRadius: "12px", padding: "20px", textAlign: "center", cursor: "pointer", background: "#eff6ff" }}
                onClick={() => document.getElementById("p_img_edit").click()}
              >
                {primaryPreview ? (
                  <img src={primaryPreview} alt="Preview" style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                ) : (
                  <div style={{ color: "#3b82f6", fontSize: "12px" }}>Replace Cover Image</div>
                )}
                <input id="p_img_edit" type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if(file) { setPrimaryImage(file); setPrimaryPreview(URL.createObjectURL(file)); }
                }} />
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#64748b" }}>
                Gallery Update: {galleryImages.length} new files
                <input type="file" multiple hidden id="g_img_edit" onChange={(e) => setGalleryImages(Array.from(e.target.files))} />
                <button type="button" onClick={() => document.getElementById("g_img_edit").click()} style={{ marginLeft: "10px", border: "none", background: "none", color: "#3b82f6", fontWeight: "bold", cursor: "pointer" }}>Browse</button>
              </div>
            </div>

            <button type="submit" disabled={saving || !selectedFarmer} style={{ width: "100%", padding: "16px", background: saving ? "#94a3b8" : "#1e40af", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
              {saving ? "COMMITTING CHANGES..." : "SAVE REGISTRY UPDATE"}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate("/admin/farmers/market/view")}
              style={{ width: "100%", background: "none", border: "none", color: "#64748b", cursor: "pointer", marginTop: "15px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
            >
              <HiOutlineArrowLeft /> Abort Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditListing;
