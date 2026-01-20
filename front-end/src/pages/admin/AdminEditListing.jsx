import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineShieldCheck, HiOutlineDatabase, HiOutlineSearch, HiOutlineMail, HiOutlinePhone, HiOutlineX, HiOutlineArrowLeft, HiOutlinePhotograph, HiOutlineTag } from "react-icons/hi";

const AdminEditListing = () => {
  const { listing_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [form, setForm] = useState({
    seller_internal_id: "", product_category: "CROPS", product_name: "",
    quantity: "", unit: "KG", price_per_unit: "", description: "", status: "ACTIVE"
  });

  const [primaryImage, setPrimaryImage] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);

  // 1. Fetch Existing Node Data
  useEffect(() => {
    const fetchNode = async () => {
      try {
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
          if (node.primary_image_url) setPrimaryPreview(node.primary_image_url);
          if (node.owner_name) {
            setSelectedFarmer({ id: node.seller_internal_id, full_name: node.owner_name, email: node.owner_email, phone: node.owner_phone });
          }
        }
      } catch (err) {
        navigate("/admin/farmers/market/view");
      } finally { setLoading(false); }
    };
    fetchNode();
  }, [listing_id, navigate]);

  // 2. Debounced Discovery Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
          const { data } = await api.get(`/admin/marketplace/farmers/search?query=${searchTerm}`);
          setSearchResults(data.farmers || []);
        } catch (err) { console.error(err); } 
        finally { setIsSearching(false); }
      } else { setSearchResults([]); }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      if (primaryImage) fd.append("primary_image", primaryImage);

      await api.put(`/admin/marketplace/listings/${listing_id}`, fd);
      alert("REGISTRY DROP UPDATED");
      navigate("/admin/farmers/market/view");
    } catch (err) {
      alert("Update Failed");
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}><HiOutlineDatabase className="animate-spin" size={40} /></div>;

  return (
    <div style={{background: "#f1f5f9", padding: "40px", minHeight: "100vh"}}>
      <div style={{maxWidth: "800px", margin: "0 auto", background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"}}>
        <div style={{background: "#1e40af", padding: "20px", color: "white"}}>
          <HiOutlineShieldCheck size={30} />
          <h2 style={{margin: 0}}>AUTHORITY EDIT: {listing_id}</h2>
        </div>

        <div style={{padding: "30px"}}>
          {/* FARMER BADGE */}
          {selectedFarmer ? (
            <div style={{background: "#eff6ff", padding: "15px", borderRadius: "8px", border: "1px solid #3b82f6", display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
              <div>
                <strong>{selectedFarmer.full_name}</strong>
                <div style={{fontSize: "12px"}}>{selectedFarmer.phone}</div>
              </div>
              <button onClick={() => setSelectedFarmer(null)} style={{border: "none", background: "none", cursor: "pointer"}}><HiOutlineX /></button>
            </div>
          ) : (
            <input 
               style={{width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #cbd5e1"}} 
               placeholder="Search new farmer..." 
               value={searchTerm} 
               onChange={(e) => setSearchTerm(e.target.value)} 
            />
          )}

          {/* SEARCH DROPDOWN */}
          {searchResults.length > 0 && (
            <div style={{background: "white", border: "1px solid #e2e8f0", marginBottom: "20px"}}>
              {searchResults.map(f => (
                <div key={f.id} onClick={() => { setSelectedFarmer(f); setForm({...form, seller_internal_id: f.id}); setSearchResults([]); }} style={{padding: "10px", cursor: "pointer", borderBottom: "1px solid #f1f5f9"}}>
                  {f.full_name} ({f.phone})
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <input name="product_name" value={form.product_name} onChange={(e) => setForm({...form, product_name: e.target.value})} style={{width: "100%", padding: "12px", marginBottom: "15px"}} placeholder="Product Name" />
            <div style={{display: "flex", gap: "10px", marginBottom: "15px"}}>
              <input type="number" name="quantity" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} style={{flex: 1, padding: "12px"}} placeholder="Quantity" />
              <input type="number" name="price_per_unit" value={form.price_per_unit} onChange={(e) => setForm({...form, price_per_unit: e.target.value})} style={{flex: 1, padding: "12px"}} placeholder="Price" />
            </div>
            <textarea name="description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={{width: "100%", padding: "12px", height: "100px", marginBottom: "20px"}} placeholder="Description" />
            
            <button type="submit" disabled={saving} style={{width: "100%", padding: "15px", background: "#1e40af", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold"}}>
              {saving ? "COMMITTING..." : "SAVE REGISTRY UPDATE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditListing;
