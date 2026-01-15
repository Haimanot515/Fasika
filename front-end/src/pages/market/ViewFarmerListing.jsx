import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios"; // Points to https://fasika-yg5m.onrender.com/api
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, FaStar, FaShieldAlt, FaSearch, FaCaretDown, 
  FaEllipsisV, FaEdit, FaTrash, FaArchive, FaPause, FaPlay 
} from "react-icons/fa";

const ViewFarmerListing = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenuId]);

  useEffect(() => { fetchMyListings(); }, []);

  const fetchMyListings = async () => {
    try {
      // Using your api instance for secure cookie handshake with Render
      const { data } = await api.get("/farmer/listings/my-listings");
      setListings(data.data || []);
      setFilteredListings(data.data || []);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    const results = listings.filter(item =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredListings(results);
  }, [searchTerm, listings]);

  const handleEdit = (id) => {
    navigate(`/market/sales/edit-listing/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`/farmer/listings/${id}`);
        setListings(prev => prev.filter(item => item.id !== id));
        alert("Listing removed successfully.");
      } catch (err) { console.error(err); }
    }
  };

  // ✅ FUNCTIONAL PAUSE / RESUME
  const handlePauseToggle = async (item) => {
    const action = item.status === "PAUSED" ? "resume" : "pause";
    try {
      await api.patch(`/farmer/listings/${item.id}/${action}`);
      
      setListings(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: item.status === "PAUSED" ? "ACTIVE" : "PAUSED" } : i
      ));
      setShowMenuId(null);
    } catch (err) {
      console.error("Status Update Error:", err);
      alert("Failed to update status on Render node.");
    }
  };

  // ✅ FUNCTIONAL ARCHIVE
  const handleArchive = async (id) => {
    if (window.confirm("Move this listing to archives? It will be hidden from your active list.")) {
      try {
        await api.patch(`/farmer/listings/${id}/archive`);
        setListings(prev => prev.filter(item => item.id !== id));
        setShowMenuId(null);
      } catch (err) {
        console.error("Archive Error:", err);
      }
    }
  };

  if (loading) return <div style={premiumStyles.loader}>🌾 Accessing Secure Registry...</div>;

  return (
    <div style={premiumStyles.pageWrapper} onClick={() => setShowMenuId(null)}>
      <style>{`
        body, html { margin: 0; padding: 0; overflow-x: hidden; }
        .amazon-search-row { display: flex; justify-content: center; align-items: center; padding: 20px 0px; width: 100%; gap: 15px; }
        .search-wrapper { display: flex; width: 700px; height: 42px; border-radius: 4px; border: 1px solid #888; overflow: hidden; background: #fff; transition: border-color 0.2s; }
        .search-wrapper:focus-within { border-color: #e77600; box-shadow: 0 0 3px 2px rgba(228, 121, 17, 0.5); }
        .category-dropdown { background: #f3f3f3; border-right: 1px solid #bbb; padding: 0 15px; display: flex; align-items: center; font-size: 13px; color: #555; cursor: pointer; }
        .search-input { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 15px; }
        .search-button { background: #febd69; border: none; width: 50px; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        .alibaba-card { font-family: 'Roboto', Helvetica, Arial, sans-serif; background: #ffffff; height: 461px; cursor: pointer; overflow: hidden; transition: all 0.3s ease; border: 1px solid #eee; display: flex; flex-direction: column; border-radius: 8px; position: relative; }
        .image-half { flex: 0 0 230.5px; width: 100%; overflow: hidden; position: relative; }
        .text-half { flex: 1; width: 100%; padding: 0 12px; display: flex; flex-direction: column; overflow: hidden; }
        .product-img { transition: transform 0.5s ease !important; width: 100%; height: 100%; object-fit: cover; }
        .alibaba-card:hover { box-shadow: 0 10px 25px 0 rgba(0,0,0,0.15); }
        .options-btn { position: absolute; top: 10px; right: 10px; background: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 5; color: #555; border: none; cursor: pointer; }
        .dropdown-menu { position: absolute; top: 45px; right: 10px; background: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 100; width: 160px; padding: 5px 0; }
        .menu-item { padding: 10px 15px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #333; transition: background 0.2s; cursor: pointer; }
        .menu-item:hover { background: #f1f1f1; }
        .paused-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 2; font-weight: bold; }
      `}</style>
      
      <div style={premiumStyles.scrollLayer}>
        <div className="amazon-search-row">
          <div className="search-wrapper">
            <div className="category-dropdown">All <FaCaretDown style={{marginLeft: '5px'}} /></div>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button"><FaSearch size={18} /></button>
          </div>
          <button onClick={() => navigate("/market/sales/add-listing")} style={premiumStyles.headerAddBtn}>
            <FaPlus /> Post
          </button>
        </div>

        <div style={premiumStyles.fullViewportGrid}>
          {filteredListings.map((item) => (
            <div key={item.id} className="alibaba-card" onClick={(e) => e.stopPropagation()}>
              
              <button 
                className="options-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenuId(showMenuId === item.id ? null : item.id);
                }}
              >
                <FaEllipsisV />
              </button>

              {showMenuId === item.id && (
                <div className="dropdown-menu" ref={menuRef}>
                  <div className="menu-item" onClick={() => handleEdit(item.id)}>
                    <FaEdit color="#007185"/> Edit
                  </div>
                  
                  <div className="menu-item" onClick={() => handlePauseToggle(item)}>
                    {item.status === "PAUSED" ? (
                      <><FaPlay color="green"/> Resume</>
                    ) : (
                      <><FaPause color="#e77600"/> Pause</>
                    )}
                  </div>

                  <div className="menu-item" onClick={() => handleArchive(item.id)}>
                    <FaArchive color="#555"/> Archive
                  </div>

                  <div className="menu-item" onClick={() => handleDelete(item.id)} style={{color: 'red'}}>
                    <FaTrash /> Delete
                  </div>
                </div>
              )}

              <div className="image-half">
                {item.status === "PAUSED" && (
                   <div className="paused-overlay"><FaPause size={20} /> PAUSED</div>
                )}
                <img src={item.primary_image_url || "https://via.placeholder.com/300"} alt={item.product_name} className="product-img" />
                <div style={premiumStyles.verifiedTag}><FaShieldAlt size={10} /> Verified</div>
              </div>

              <div className="text-half">
                <h2 style={premiumStyles.productTitle}>{item.product_name}</h2>
                <p style={premiumStyles.description}>{item.description}</p>
                <div style={premiumStyles.priceRow}>
                  <span style={premiumStyles.priceMain}>ETB {item.price_per_unit}</span>
                  <span style={premiumStyles.unit}>/ {item.unit || 'Qtl'}</span>
                </div>
                <div style={premiumStyles.moq}>{item.quantity} {item.unit || 'Qtl'} <span>(Stock)</span></div>
                <div style={premiumStyles.vendorName}>{item.status || "ACTIVE"} Listing</div>
                <div style={premiumStyles.ratingRow}>
                  {[...Array(5)].map((_, i) => <FaStar key={i} color="#ff6600" size={10} />)}
                  <span style={premiumStyles.ratingCount}>Verified Seller</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh", background: "#e8eaef", position: "relative", zIndex: 10005 },
  scrollLayer: { marginTop: "78px", width: "100%", padding: "0" },
  fullViewportGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", width: "100%", padding: "0 20px", columnGap: "20px", rowGap: "20px" },
  headerAddBtn: { background: "#ff9900", border: "1px solid #a88734", borderRadius: "4px", color: "#111", padding: "0 20px", height: "42px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" },
  verifiedTag: { position: "absolute", top: "8px", left: "8px", background: "white", padding: "2px 6px", fontSize: "11px", borderRadius: "2px", fontWeight: "700", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  productTitle: { fontSize: "16px", color: "#333", fontWeight: "600", lineHeight: "1.2", height: "40px", overflow: "hidden", margin: "10px 0 0 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  description: { fontSize: "13px", color: "#666", lineHeight: "1.2", height: "32px", overflow: "hidden", margin: "5px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "2px", margin: "5px 0" },
  priceMain: { fontSize: "24px", fontWeight: "800", color: "#222" },
  unit: { fontSize: "14px", color: "#222" },
  moq: { fontSize: "14px", color: "#222", fontWeight: "700" },
  vendorName: { fontSize: "12px", color: "#666", textDecoration: "underline", marginTop: "auto" },
  ratingRow: { display: "flex", alignItems: "center", paddingBottom: "10px", marginTop: "5px" },
  ratingCount: { fontSize: "11px", color: "#999", marginLeft: "5px" },
  loader: { textAlign: 'center', padding: '150px' }
};

export default ViewFarmerListing;
