import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  HiOutlineShieldCheck, 
  HiOutlineDatabase, 
  HiOutlineX, 
  HiOutlineArrowLeft 
} from "react-icons/hi";

const AdminEditListing = () => {
  const { listing_id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  /* ───── 1. REGISTRY FETCH (Load Node Data) ───── */
  useEffect(() => {
    const fetchNode = async () => {
      try {
        // Path matches app.use('/api/admin/marketplace', ...) in app.js
        const res = await api.get(`/admin/marketplace/listings/${listing_id}`);
        
        if (res.data.success) {
          const node = res.data.data;
          setForm({
            seller_internal_id: node.seller_internal_id,
            product_category: node.product_category,
            product_name: node.product_name,
            quantity: node.quantity,
            unit: node.unit,
            price_per_unit: node.price_per_unit,
            description: node.description,
            status: node.status
          });
          
          // Hydrate Farmer Badge from the Join in Controller
          if (node.owner_name) {
            setSelectedFarmer({ 
              id: node.seller_internal_id, 
              full_name: node.owner_name, 
              phone: node.owner_phone 
            });
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        navigate("/admin/farmers/market/view");
      } finally { setLoading(false); }
    };
    fetchNode();
  }, [listing_id, navigate]);

  /* ───── 2. REGISTRY DISCOVERY (The Search Fix) ───── */
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
          /**
           * CRITICAL FIX: 
           * Path must include '/marketplace' to hit adminProductListingRoutes.
           * Controller must return 'farmers' key.
           */
          const { data } = await api.get(`/admin/marketplace/farmers/search?query=${searchTerm}`);
          setSearchResults(data.farmers || []);
        } catch (err) { 
          console.error("Discovery Search Failed:", err); 
        } finally { 
          setIsSearching(false); 
        }
      } else { 
        setSearchResults([]); 
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  /* ───── 3. AUTHORITY UPDATE (DROP Commit) ───── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      // Append all form fields
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      // Append image if new one selected
      if (primaryImage) fd.append("primary_image", primaryImage);

      await api.put(`/admin/marketplace/listings/${listing_id}`, fd);
      alert("REGISTRY DROP UPDATED SUCCESSFULLY");
      navigate("/admin/farmers/market/view");
    } catch (err) {
      alert("Update Failed: " + (err.response?.data?.error || "Unknown Error"));
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{textAlign: 'center', padding: '100px'}}>
      <HiOutlineDatabase className="animate-spin" size={50} color="#1e40af" />
      <p>Accessing Registry...</p>
    </div>
  );

  return (
    <div style={{background: "#f1f5f9", padding: "40px", minHeight: "100vh"}}>
      <button 
        onClick={() => navigate(-1)} 
        style={{display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px", border: "none", background: "none", cursor: "pointer", color: "#64748b"}}
      >
        <HiOutlineArrowLeft /> Back to View
      </button>

      <div style={{maxWidth: "800px", margin: "0 auto", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"}}>
        
        {/* Header */}
        <div style={{background: "#1e40af", padding: "24px", color: "white"}}>
          <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <HiOutlineShieldCheck size={32} />
            <h2 style={{margin: 0, fontSize: "1.5rem"}}>AUTHORITY ACTION: EDIT NODE</h2>
          </div>
          <p style={{margin: "8px 0 0 0", opacity: 0.8, fontSize: "0.875rem"}}>Registry ID: {listing_id}</p>
        </div>

        <div style={{padding: "32px"}}>
          
          {/* FARMER SELECTION BADGE */}
          <label style={{display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155"}}>Linked Producer (Farmer)</label>
          {selectedFarmer ? (
            <div style={{background: "#eff6ff", padding: "16px", borderRadius: "8px", border: "1px solid #3b82f6", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px"}}>
              <div>
                <div style={{fontWeight: "bold", color: "#1e40af"}}>{selectedFarmer.full_name}</div>
                <div style={{fontSize: "12px", color: "#64748b"}}>{selectedFarmer.phone}</div>
              </div>
              <button 
                type="button"
                onClick={() => { setSelectedFarmer(null); setForm({...form, seller_internal_id: ""}); }} 
                style={{background: "#dbeafe", border: "none", padding: "5px", borderRadius: "50%", cursor: "pointer", display: "flex"}}
              >
                <HiOutlineX color="#1e40af" />
              </button>
            </div>
          ) : (
            <div style={{position: "relative", marginBottom: "24px"}}>
              <input 
                 style={{width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e2e8f0", outline: "none", fontSize: "1rem"}} 
                 placeholder="Type name or phone to re-assign farmer..." 
                 value={searchTerm} 
                 onChange={(e) => setSearchTerm(e.target.value)} 
              />
              {isSearching && <div style={{position: "absolute", right: "12px", top: "12px"}}><HiOutlineDatabase className="animate-spin" /></div>}
              
              {/* DROPDOWN RESULTS */}
              {searchResults.length > 0 && (
                <div style={{position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "0 0 8px 8px", zIndex: 10, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"}}>
                  {searchResults.map(f => (
                    <div 
                      key={f.id} 
                      onClick={() => { 
                        setSelectedFarmer(f); 
                        setForm({...form, seller_internal_id: f.id}); 
                        setSearchResults([]); 
                        setSearchTerm("");
                      }} 
                      style={{padding: "12px", cursor: "pointer", borderBottom: "1px solid #f1f5f9", transition: "background 0.2s"}}
                      onMouseOver={(e) => e.target.style.background = "#f8fafc"}
                      onMouseOut={(e) => e.target.style.background = "white"}
                    >
                      <div style={{fontWeight: "600"}}>{f.full_name}</div>
                      <div style={{fontSize: "11px", color: "#64748b"}}>{f.phone} | {f.farm_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleUpdate} style={{display: "flex", flexDirection: "column", gap: "20px"}}>
            
            {/* PRODUCT INFO */}
            <div>
               <label style={{display: "block", marginBottom: "6px", fontSize: "0.875rem", fontWeight: "500"}}>Product Name</label>
               <input 
                 required
                 name="product_name" 
                 value={form.product_name} 
                 onChange={(e) => setForm({...form, product_name: e.target.value})} 
                 style={{width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1"}} 
               />
            </div>

            <div style={{display: "flex", gap: "15px"}}>
              <div style={{flex: 1}}>
                <label style={{display: "block", marginBottom: "6px", fontSize: "0.875rem"}}>Quantity Available</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={form.quantity} 
                  onChange={(e) => setForm({...form, quantity: e.target.value})} 
                  style={{width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1"}} 
                />
              </div>
              <div style={{flex: 1}}>
                <label style={{display: "block", marginBottom: "6px", fontSize: "0.875rem"}}>Price per Unit</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="price_per_unit" 
                  value={form.price_per_unit} 
                  onChange={(e) => setForm({...form, price_per_unit: e.target.value})} 
                  style={{width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1"}} 
                />
              </div>
            </div>

            <div>
               <label style={{display: "block", marginBottom: "6px", fontSize: "0.875rem"}}>Status</label>
               <select 
                 value={form.status}
                 onChange={(e) => setForm({...form, status: e.target.value})}
                 style={{width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white"}}
               >
                 <option value="ACTIVE">ACTIVE</option>
                 <option value="PENDING">PENDING</option>
                 <option value="ARCHIVED">ARCHIVED (DROP)</option>
               </select>
            </div>

            <div>
               <label style={{display: "block", marginBottom: "6px", fontSize: "0.875rem"}}>Product Description</label>
               <textarea 
                 name="description" 
                 value={form.description} 
                 onChange={(e) => setForm({...form, description: e.target.value})} 
                 style={{width: "100%", padding: "12px", height: "120px", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "none"}} 
               />
            </div>

            <div style={{marginTop: "10px"}}>
               <label style={{display: "block", marginBottom: "8px", fontSize: "0.875rem"}}>Update Primary Image (Optional)</label>
               <input 
                 type="file" 
                 onChange={(e) => setPrimaryImage(e.target.files[0])} 
                 accept="image/*"
               />
            </div>
            
            <button 
              type="submit" 
              disabled={saving || !form.seller_internal_id} 
              style={{
                marginTop: "10px",
                padding: "16px", 
                background: saving ? "#94a3b8" : "#1e40af", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                fontWeight: "bold", 
                fontSize: "1rem",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 6px -1px rgba(30, 64, 175, 0.4)"
              }}
            >
              {saving ? "COMMITTING TO REGISTRY..." : "SAVE REGISTRY UPDATE (DROP)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditListing;
