import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineUser, HiOutlinePhotograph, HiOutlineTag, 
  HiOutlinePlusCircle, HiOutlineShieldCheck, HiOutlineSearch,
  HiOutlineCheckCircle, HiOutlineMail, HiOutlinePhone, HiOutlineX,
  HiOutlineRefresh
} from "react-icons/hi";

const AdminAddListing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  // --- LIVE SEARCH LOGIC ---
  // This triggers automatically while the admin is typing
  useEffect(() => {
    const fetchFarmers = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // This hits your backend search endpoint (e.g., searchFarmers controller)
        const { data } = await api.get(`/admin/farmers/search?query=${searchTerm}`);
        setSearchResults(data.farmers || []);
      } catch (err) {
        console.error("Database search failed:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchFarmers, 300); // 300ms delay to prevent spamming the DB
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setForm({ ...form, seller_internal_id: farmer.id });
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleResetFarmer = () => {
    setSelectedFarmer(null);
    setForm({ ...form, seller_internal_id: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.seller_internal_id) return alert("Validation Error: No Farmer Identity Linked.");
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

      alert("REGISTRY DROP SUCCESSFUL: Node published.");
      navigate("/admin/farmers/market/view");
    } catch (err) {
      alert(err.response?.data?.message || "Authority connection error");
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    container: { minHeight: "100vh", background: "#f1f5f9", padding: "40px 20px", display: "flex", justifyContent: "center", fontFamily: "'Inter', sans-serif" },
    glassCard: { width: "100%", maxWidth: "800px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", overflow: "hidden", border: "1px solid #e2e8f0" },
    header: { background: "#1e40af", padding: "30px", color: "white", display: "flex", alignItems: "center", gap: "15px" },
    inputField: { width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none" },
    label: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "8px", textTransform: "uppercase" },
    searchResultItem: { padding: "12px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "0.2s" },
    farmerBadge: { background: "#ecfdf5", border: "1px solid #10b981", borderRadius: "12px", padding: "20px", marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }
  };

  return (
    <div style={theme.container}>
      <div style={theme.glassCard}>
        <div style={theme.header}>
          <HiOutlineShieldCheck size={40} />
          <div>
            <h1 style={{ margin: 0, fontSize: "20px" }}>MARKETPLACE REGISTRY</h1>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "11px" }}>AUTHORITY ACTION: CREATE NODE</p>
          </div>
        </div>

        <div style={{ padding: "40px" }}>
          {/* STEP 1: FARMER SEARCH */}
          <h3 style={{ fontSize: "14px", color: "#1e40af", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>
            1. Farmer Identity Verification
          </h3>
          
          {!selectedFarmer ? (
            <div style={{ position: "relative", marginBottom: "30px" }}>
              <label style={theme.label}>
                <HiOutlineSearch /> 
                Search Farmer Registry
                {isSearching && <span style={{color: '#3b82f6', fontSize: '10px', marginLeft: '10px'}}>Querying Database...</span>}
              </label>
              
              <div style={{ position: "relative" }}>
                <input 
                  style={{...theme.inputField, paddingRight: '40px', borderColor: isSearching ? "#3b82f6" : "#cbd5e1"}}
                  placeholder="Type Name, Email, or Phone number..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isSearching ? (
                  <HiOutlineRefresh className="animate-spin" style={{ position: "absolute", right: "12px", top: "12px", color: "#3b82f6" }} />
                ) : (
                  <HiOutlineSearch style={{ position: "absolute", right: "12px", top: "12px", color: "#94a3b8" }} />
                )}
              </div>

              {/* SEARCH RESULTS DROPDOWN */}
              {searchResults.length > 0 && (
                <div style={{ position: "absolute", width: "100%", background: "white", zIndex: 10, boxShadow: "0 10px 25px rgba(0,0,0,0.15)", borderRadius: "8px", marginTop: "5px", maxHeight: "250px", overflowY: "auto", border: "1px solid #e2e8f0" }}>
                  {searchResults.map(f => (
                    <div key={f.id} onClick={() => handleSelectFarmer(f)} style={theme.searchResultItem} onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                      <div style={{ fontWeight: "700", color: "#1e293b", display: 'flex', justifyContent: 'space-between' }}>
                        {f.full_name}
                        <span style={{fontSize: '10px', color: '#10b981', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px'}}>FOUND</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b", display: "flex", gap: "10px", marginTop: '4px' }}>
                        <span><HiOutlineMail style={{verticalAlign: 'middle'}}/> {f.email}</span>
                        <span><HiOutlinePhone style={{verticalAlign: 'middle'}}/> {f.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={theme.farmerBadge}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#065f46", fontWeight: "800" }}>
                  <HiOutlineCheckCircle size={20} /> IDENTITY LINKED
                </div>
                <div style={{ fontSize: "18px", fontWeight: "700", marginTop: "5px" }}>{selectedFarmer.full_name}</div>
                <div style={{ fontSize: "13px", color: "#374151" }}>{selectedFarmer.phone} | {selectedFarmer.email}</div>
              </div>
              <button onClick={handleResetFarmer} style={{ background: "#fee2e2", border: "none", color: "#991b1b", padding: "8px", borderRadius: "50%", cursor: "pointer" }}>
                <HiOutlineX size={20} />
              </button>
            </div>
          )}

          {/* STEP 2: PRODUCT DETAILS */}
          <form onSubmit={handleSubmit} style={{ opacity: selectedFarmer ? 1 : 0.4, pointerEvents: selectedFarmer ? "auto" : "none" }}>
            <h3 style={{ fontSize: "14px", color: "#1e40af", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>
              2. Product Registry Details
            </h3>
            
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
                <input name="product_name" style={theme.inputField} placeholder="e.g. Teff" value={form.product_name} onChange={handleChange} required />
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

            <div style={{ marginBottom: "25px" }}>
              <label style={theme.label}>Description</label>
              <textarea name="description" style={{...theme.inputField, height: "80px", resize: "none"}} value={form.description} onChange={handleChange} />
            </div>

            <button type="submit" disabled={loading || !selectedFarmer} style={{ width: "100%", padding: "16px", background: loading ? "#94a3b8" : "#1e40af", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: '0.3s' }}>
              {loading ? "COMMITTING TO REGISTRY..." : "PUBLISH REGISTRY NODE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddListing;
