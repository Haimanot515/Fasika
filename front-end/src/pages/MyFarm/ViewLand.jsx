import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import UpdateLand from "./UpdateLand";
import { 
  FaPlus, FaShieldAlt, FaSearch, FaCaretDown, 
  FaEllipsisV, FaEdit, FaTrash, FaMapMarkedAlt, FaExpand, FaStar 
} from "react-icons/fa";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingPlotId, setEditingPlotId] = useState(null);
  
  const menuRef = useRef(null);

  // Close meatball menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenuId]);

  const fetchLands = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/farmer/farm/land");
      setLands(data.data || []);
      setFilteredLands(data.data || []);
    } catch (err) { 
      console.error("Registry Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchLands(); }, []);

  useEffect(() => {
    const results = lands.filter(item =>
      item.plot_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLands(results);
  }, [searchTerm, lands]);

  const handleDrop = async (id) => {
    if (window.confirm("CRITICAL: Are you sure you want to DROP this asset from the registry?")) {
      try {
        await api.delete(`/farmer/farm/land/${id}`);
        setLands(prev => prev.filter(item => item.id !== id));
        setShowMenuId(null);
      } catch (err) { 
        alert("DROP failed. Registry node unreachable."); 
      }
    }
  };

  if (loading) return <div style={premiumStyles.loader}>🌾 Accessing Secure Registry...</div>;

  // If editing, show the UpdateLand component
  if (editingPlotId) {
    return (
      <UpdateLand 
        plotId={editingPlotId} 
        onUpdateSuccess={() => {
          setEditingPlotId(null);
          fetchLands();
        }} 
        onCancel={() => setEditingPlotId(null)} 
      />
    );
  }

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
        .image-half { flex: 0 0 230.5px; width: 100%; overflow: hidden; position: relative; background: #f0fdf4; display: flex; align-items: center; justify-content: center; color: #166534; }
        .text-half { flex: 1; width: 100%; padding: 0 12px; display: flex; flex-direction: column; overflow: hidden; }
        .alibaba-card:hover { box-shadow: 0 10px 25px 0 rgba(0,0,0,0.15); }
        .options-btn { position: absolute; top: 10px; right: 10px; background: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 5; color: #555; border: none; cursor: pointer; }
        .dropdown-menu { position: absolute; top: 45px; right: 10px; background: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 100; width: 160px; padding: 5px 0; }
        .menu-item { padding: 10px 15px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #333; transition: background 0.2s; cursor: pointer; }
        .menu-item:hover { background: #f1f1f1; }
      `}</style>
      
      <div style={premiumStyles.scrollLayer}>
        <div className="amazon-search-row">
          <div className="search-wrapper">
            <div className="category-dropdown">Land Registry <FaCaretDown style={{marginLeft: '5px'}} /></div>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search registry by plot name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button"><FaSearch size={18} /></button>
          </div>
          <button onClick={() => window.location.href='/farmer/farm/add-land'} style={premiumStyles.headerAddBtn}>
            <FaPlus /> DROP New
          </button>
        </div>

        <div style={premiumStyles.fullViewportGrid}>
          {filteredLands.map((plot) => (
            <div key={plot.id} className="alibaba-card" onClick={(e) => e.stopPropagation()}>
              <button 
                className="options-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenuId(showMenuId === plot.id ? null : plot.id);
                }}
              >
                <FaEllipsisV />
              </button>

              {showMenuId === plot.id && (
                <div className="dropdown-menu" ref={menuRef}>
                  <div className="menu-item" onClick={() => setEditingPlotId(plot.id)}>
                    <FaEdit color="#007185"/> Edit Asset
                  </div>
                  <div className="menu-item" onClick={() => handleDrop(plot.id)} style={{color: 'red'}}>
                    <FaTrash /> DROP Node
                  </div>
                </div>
              )}

              <div className="image-half">
                <FaMapMarkedAlt size={80} opacity={0.1} />
                <div style={premiumStyles.verifiedTag}><FaShieldAlt size={10} color="#15803d"/> Secure Node</div>
              </div>

              <div className="text-half">
                <h2 style={premiumStyles.productTitle}>{plot.plot_name}</h2>
                <div style={premiumStyles.idLabel}>REGISTRY ID: 0x{plot.id.toString().padStart(4, '0')}</div>
                
                <div style={premiumStyles.priceRow}>
                  <span style={premiumStyles.priceMain}>{plot.area_size}</span>
                  <span style={premiumStyles.unit}>Hectares (Ha)</span>
                </div>

                <div style={premiumStyles.moq}>
                   <span style={{
                     ...premiumStyles.statusBadge, 
                     backgroundColor: plot.land_status === 'Active' ? '#dcfce7' : '#f1f5f9',
                     color: plot.land_status === 'Active' ? '#166534' : '#64748b'
                   }}>
                     {plot.land_status || "Active"}
                   </span>
                </div>

                <div style={premiumStyles.vendorName}>Registry Node Status: Verified</div>
                
                <div style={premiumStyles.ratingRow}>
                  <FaStar color="#ff6600" size={10} />
                  <span style={premiumStyles.ratingCount}>{plot.crop_count || 0} Biological Assets Linked</span>
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
  productTitle: { fontSize: "16px", color: "#007185", fontWeight: "600", lineHeight: "1.2", height: "40px", overflow: "hidden", margin: "10px 0 0 0" },
  idLabel: { fontSize: "11px", color: "#666", fontWeight: "700", marginBottom: "5px" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "4px", margin: "5px 0" },
  priceMain: { fontSize: "24px", fontWeight: "800", color: "#222" },
  unit: { fontSize: "14px", color: "#222" },
  moq: { margin: "5px 0" },
  statusBadge: { padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" },
  vendorName: { fontSize: "12px", color: "#666", textDecoration: "underline", marginTop: "auto" },
  ratingRow: { display: "flex", alignItems: "center", paddingBottom: "10px", marginTop: "5px" },
  ratingCount: { fontSize: "11px", color: "#999", marginLeft: "5px" },
  loader: { textAlign: 'center', padding: '150px' }
};

export default ViewLand;
