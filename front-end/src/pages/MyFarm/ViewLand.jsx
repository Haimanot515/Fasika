import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import UpdateLand from "./UpdateLand";
import { 
  FaPlus, FaShieldAlt, FaSearch, FaEllipsisV, 
  FaEdit, FaTrash, FaMapMarkedAlt, FaStar, FaVectorSquare 
} from "react-icons/fa";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingPlotId, setEditingPlotId] = useState(null);
  
  const menuRef = useRef(null);

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
        .amazon-search-row { display: flex; justify-content: center; align-items: center; padding: 25px 0px; width: 100%; gap: 15px; }
        .search-wrapper { display: flex; width: 600px; height: 42px; border-radius: 4px; border: 1px solid #888; overflow: hidden; background: #fff; transition: border-color 0.2s; }
        .search-wrapper:focus-within { border-color: #e77600; box-shadow: 0 0 3px 2px rgba(228, 121, 17, 0.5); }
        .search-input { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 15px; }
        .search-button { background: #febd69; border: none; width: 50px; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        
        /* TWO CARDS PER ROW LOGIC */
        .land-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 25px; 
            width: 100%; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px;
        }

        .alibaba-card { 
            font-family: 'Roboto', Helvetica, Arial, sans-serif; 
            background: #ffffff; 
            height: 480px; 
            cursor: pointer; 
            overflow: hidden; 
            transition: all 0.3s ease; 
            border: 1px solid #ddd; 
            display: flex; 
            flex-direction: column; 
            border-radius: 12px; 
            position: relative; 
        }

        /* LAND BACKGROUND IMAGE SECTION */
        .image-half { 
            flex: 0 0 240px; 
            width: 100%; 
            position: relative; 
            background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
            background-size: cover;
            background-position: center;
        }
        .image-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .alibaba-card:hover { box-shadow: 0 12px 30px rgba(0,0,0,0.18); transform: translateY(-2px); }
        
        .options-btn { position: absolute; top: 15px; right: 15px; background: white; width: 35px; height: 35px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 5; color: #333; border: none; cursor: pointer; }
        .dropdown-menu { position: absolute; top: 55px; right: 15px; background: white; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); z-index: 100; width: 170px; padding: 6px 0; }
        .menu-item { padding: 12px 18px; display: flex; align-items: center; gap: 12px; font-size: 14px; color: #333; transition: background 0.2s; cursor: pointer; }
        .menu-item:hover { background: #f8f9fa; }
      `}</style>
      
      <div style={premiumStyles.scrollLayer}>
        <div className="amazon-search-row">
          <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filter your land plots by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button"><FaSearch size={18} /></button>
          </div>
          <button 
            onClick={() => window.location.href='/farmer/farm/add-land'} 
            style={premiumStyles.headerAddBtn}
          >
            <FaPlus /> Add Land
          </button>
        </div>

        <div className="land-grid">
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
                  <div className="menu-item" onClick={() => handleDrop(plot.id)} style={{color: '#d32f2f', fontWeight: 'bold'}}>
                    <FaTrash /> DROP Node
                  </div>
                </div>
              )}

              <div className="image-half">
                <div className="image-overlay">
                    <FaVectorSquare size={50} color="white" style={{ opacity: 0.8 }} />
                </div>
                <div style={premiumStyles.verifiedTag}><FaShieldAlt size={12} color="#15803d"/> Verified Plot</div>
              </div>

              <div className="text-half">
                <h2 style={premiumStyles.productTitle}>{plot.plot_name}</h2>
                <div style={premiumStyles.idLabel}>REGISTRY TOKEN: 0x{plot.id.toString().padStart(6, '0')}</div>
                
                <div style={premiumStyles.priceRow}>
                  <span style={premiumStyles.priceMain}>{plot.area_size}</span>
                  <span style={premiumStyles.unit}>Hectares (Ha)</span>
                </div>

                <div style={{ margin: "10px 0" }}>
                   <span style={{
                     ...premiumStyles.statusBadge, 
                     backgroundColor: plot.land_status === 'Active' ? '#dcfce7' : '#fee2e2',
                     color: plot.land_status === 'Active' ? '#166534' : '#991b1b',
                     border: `1px solid ${plot.land_status === 'Active' ? '#bbf7d0' : '#fecaca'}`
                   }}>
                     {plot.land_status || "Active"}
                   </span>
                </div>

                <div style={premiumStyles.vendorName}>Secure Registry Node • Last Synced Today</div>
                
                <div style={premiumStyles.ratingRow}>
                  <FaStar color="#ff9900" size={12} />
                  <span style={premiumStyles.ratingCount}>{plot.crop_count || 0} Assets Currently Linked to this Plot</span>
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
  pageWrapper: { width: "100vw", minHeight: "100vh", background: "#f0f2f5", position: "relative", zIndex: 10005 },
  scrollLayer: { marginTop: "78px", width: "100%", paddingBottom: "60px" },
  headerAddBtn: { background: "#ff9900", border: "1px solid #a88734", borderRadius: "4px", color: "#111", padding: "0 25px", height: "42px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  verifiedTag: { position: "absolute", top: "12px", left: "12px", background: "rgba(255,255,255,0.95)", padding: "4px 10px", fontSize: "12px", borderRadius: "4px", fontWeight: "800", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", color: "#15803d", display: "flex", alignItems: "center", gap: "5px" },
  productTitle: { fontSize: "20px", color: "#007185", fontWeight: "700", margin: "15px 0 5px 0" },
  idLabel: { fontSize: "12px", color: "#777", letterSpacing: "1px", marginBottom: "10px" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "6px", margin: "5px 0" },
  priceMain: { fontSize: "28px", fontWeight: "900", color: "#111" },
  unit: { fontSize: "16px", color: "#444", fontWeight: "500" },
  statusBadge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase" },
  vendorName: { fontSize: "13px", color: "#555", fontWeight: "500", marginTop: "auto", borderTop: "1px solid #eee", paddingTop: "10px" },
  ratingRow: { display: "flex", alignItems: "center", paddingBottom: "15px", marginTop: "8px" },
  ratingCount: { fontSize: "12px", color: "#15803d", marginLeft: "6px", fontWeight: "700" },
  loader: { textAlign: 'center', padding: '150px', fontSize: '20px', color: '#166534', fontWeight: 'bold' }
};

export default ViewLand;
