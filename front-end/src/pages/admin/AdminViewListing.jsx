import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios"; 
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, FaSearch, FaEllipsisV, FaEdit, FaArchive,
  FaUserShield, FaIdBadge, FaDatabase
} from "react-icons/fa";

const AdminViewListing = () => {
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

  useEffect(() => { fetchGlobalRegistry(); }, []);

  const fetchGlobalRegistry = async () => {
    try {
      const { data } = await api.get("/admin/marketplace/listings");
      setListings(data.listings || []);
      setFilteredListings(data.listings || []);
    } catch (err) { 
      console.error("Registry Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    const results = listings.filter(item =>
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredListings(results);
  }, [searchTerm, listings]);

  // FIXED: Now matches App.jsx path perfectly
  const handleEdit = (id) => {
    navigate(`/admin/farmers/market/edit/${id}`);
  };

  const handleDrop = async (id) => {
    if (window.confirm("⚠️ AUTHORITY ACTION: DROP (Archive) this node from the active registry?")) {
      try {
        await api.patch(`/admin/marketplace/listings/${id}/archive`);
        setListings(prev => prev.filter(item => item.listing_id !== id));
        alert("NODE DROPPED SUCCESSFULLY");
      } catch (err) { 
        console.error("Drop Error:", err);
        alert("DROP Failed: Authority access denied.");
      }
    }
  };

  if (loading) return <div style={premiumStyles.loader}><FaDatabase className="animate-spin" /> Syncing Master Registry...</div>;

  return (
    <div style={premiumStyles.pageWrapper} onClick={() => setShowMenuId(null)}>
      <style>{`
        .admin-search-bar { display: flex; justify-content: center; align-items: center; padding: 25px 0; background: #1e293b; width: 100%; gap: 15px; border-bottom: 4px solid #3b82f6; }
        .search-wrapper { display: flex; width: 700px; height: 45px; border-radius: 6px; overflow: hidden; background: #fff; }
        .registry-tag { background: #334155; color: #3b82f6; border-right: 1px solid #475569; padding: 0 15px; display: flex; align-items: center; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .search-input { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 15px; }
        .search-button { background: #3b82f6; border: none; width: 60px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: white; }
        .registry-card { background: #fff; height: 500px; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; position: relative; transition: transform 0.2s; }
        .registry-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .admin-options-btn { position: absolute; top: 12px; right: 12px; background: rgba(30, 41, 59, 0.8); width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; z-index: 5; color: white; border: none; cursor: pointer; }
        .dropdown-menu { position: absolute; top: 50px; right: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 100; width: 180px; padding: 8px 0; }
        .menu-item { padding: 12px 16px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: #1e293b; cursor: pointer; }
        .menu-item:hover { background: #f1f5f9; }
        .node-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 240px; background: rgba(30, 41, 59, 0.6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 900; z-index: 2; }
      `}</style>
      
      <div style={premiumStyles.scrollLayer}>
        <div className="admin-search-bar">
          <div className="search-wrapper">
            <div className="registry-tag"><FaDatabase style={{marginRight: '5px'}} /> Registry</div>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by product name or farmer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button"><FaSearch size={18} /></button>
          </div>
          <button onClick={() => navigate("/admin/farmers/market/add")} style={premiumStyles.headerAddBtn}>
            <FaPlus /> New Node
          </button>
        </div>

        <div style={premiumStyles.fullViewportGrid}>
          {filteredListings.map((item) => (
            <div key={item.listing_id} className="registry-card">
              <button 
                className="admin-options-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenuId(showMenuId === item.listing_id ? null : item.listing_id);
                }}
              >
                <FaEllipsisV />
              </button>

              {showMenuId === item.listing_id && (
                <div className="dropdown-menu" ref={menuRef}>
                  <div className="menu-item" onClick={() => handleEdit(item.listing_id)}>
                    <FaEdit color="#3b82f6"/> Update Node
                  </div>
                  <div className="menu-item" onClick={() => handleDrop(item.listing_id)} style={{color: '#ef4444'}}>
                    <FaArchive /> DROP Listing
                  </div>
                </div>
              )}

              <div style={premiumStyles.imageHalf}>
                {item.status === "PAUSED" && <div className="node-overlay">NODE PAUSED</div>}
                {item.status === "ARCHIVED" && <div className="node-overlay" style={{background: 'rgba(239, 68, 68, 0.7)'}}>DROPPED</div>}
                <img src={item.primary_image_url || "https://via.placeholder.com/300"} alt={item.product_name} style={premiumStyles.productImg} />
                <div style={premiumStyles.idTag}>ID: {item.listing_id}</div>
              </div>

              <div style={premiumStyles.textHalf}>
                <div style={premiumStyles.ownerBadge}>
                    <FaUserShield size={10} /> {item.owner_name || "Unknown Farmer"}
                </div>
                <h2 style={premiumStyles.productTitle}>{item.product_name}</h2>
                <div style={premiumStyles.priceRow}>
                  <span style={premiumStyles.priceMain}>ETB {item.price_per_unit}</span>
                  <span style={premiumStyles.unit}>/ {item.unit}</span>
                </div>
                
                <div style={premiumStyles.metaBox}>
                    <div style={premiumStyles.metaItem}><FaIdBadge /> Farm: {item.farm_name || 'N/A'}</div>
                    <div style={premiumStyles.metaItem}><FaDatabase /> Stock: {item.quantity}</div>
                </div>

                <div style={{...premiumStyles.statusIndicator, color: item.status === 'ACTIVE' ? '#22c55e' : '#64748b'}}>
                    ● {item.status}
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
  pageWrapper: { width: "100vw", minHeight: "100vh", background: "#f8fafc", zIndex: 10005 },
  scrollLayer: { marginTop: "78px", width: "100%" },
  fullViewportGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", width: "100%", padding: "40px 20px", gap: "25px" },
  headerAddBtn: { background: "#3b82f6", border: "none", borderRadius: "6px", color: "white", padding: "0 20px", height: "45px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" },
  imageHalf: { height: "240px", width: "100%", position: "relative", background: "#e2e8f0" },
  productImg: { width: "100%", height: "100%", objectFit: "cover" },
  idTag: { position: "absolute", bottom: "10px", right: "10px", background: "rgba(30, 41, 59, 0.9)", color: "#fff", padding: "2px 8px", fontSize: "10px", borderRadius: "4px", fontFamily: "monospace" },
  textHalf: { padding: "15px", display: "flex", flexDirection: "column", flex: 1 },
  ownerBadge: { display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "bold", color: "#3b82f6", marginBottom: "8px", textTransform: "uppercase" },
  productTitle: { fontSize: "17px", color: "#0f172a", fontWeight: "800", margin: "0 0 10px 0" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "15px" },
  priceMain: { fontSize: "22px", fontWeight: "900", color: "#0f172a" },
  unit: { fontSize: "12px", color: "#64748b", fontWeight: "600" },
  metaBox: { background: "#f1f5f9", padding: "10px", borderRadius: "8px", marginBottom: "10px" },
  metaItem: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#475569", marginBottom: "4px" },
  statusIndicator: { marginTop: "auto", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" },
  loader: { textAlign: 'center', padding: '150px', color: '#3b82f6', fontWeight: 'bold' }
};

export default AdminViewListing;
