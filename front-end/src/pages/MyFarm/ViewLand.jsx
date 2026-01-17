import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import UpdateLand from "./UpdateLand";
import { 
  FaPlus, FaShieldAlt, FaSearch, FaEllipsisV, 
  FaEdit, FaTrash, FaMapMarkedAlt, FaStar, FaVectorSquare,
  FaLeaf, FaPaw, FaChartLine, FaChevronDown, FaChevronUp
} from "react-icons/fa";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingPlotId, setEditingPlotId] = useState(null);
  
  // State to track which section is open for which plot
  const [activeAssetView, setActiveAssetView] = useState({ plotId: null, type: null });
  
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
      item.plot_name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const toggleAssetView = (plotId, type) => {
    if (activeAssetView.plotId === plotId && activeAssetView.type === type) {
      setActiveAssetView({ plotId: null, type: null });
    } else {
      setActiveAssetView({ plotId, type });
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
        body, html { margin: 0; padding: 0; overflow-x: hidden; background: #f0f2f5; }
        .amazon-search-row { display: flex; justify-content: center; align-items: center; padding: 25px 0px; width: 100%; gap: 15px; }
        .search-wrapper { display: flex; width: 600px; height: 42px; border-radius: 4px; border: 1px solid #888; overflow: hidden; background: #fff; }
        .search-input { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 15px; }
        .search-button { background: #febd69; border: none; width: 50px; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        .land-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .alibaba-card { 
          font-family: 'Roboto', sans-serif; 
          background: #ffffff; 
          min-height: 540px; 
          overflow: hidden; 
          border: 1px solid #ddd; 
          display: flex; 
          flex-direction: column; 
          border-radius: 12px; 
          position: relative; 
          transition: height 0.3s ease;
        }
        
        .image-half { flex: 0 0 220px; width: 100%; position: relative; background: #e2e8f0 url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80') center/cover; }
        .asset-btn-row { display: flex; gap: 8px; margin: 15px 0 5px 0; }
        
        .asset-btn { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          padding: 8px; 
          background: #f8f9fa; 
          border: 1px solid #e2e8f0; 
          border-radius: 8px; 
          cursor: pointer; 
          color: #475569; 
          transition: 0.2s; 
        }
        .asset-btn.active { background: #eff6ff; border-color: #3b82f6; color: #1e40af; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        .asset-btn span { font-size: 11px; font-weight: 700; margin-top: 4px; text-transform: uppercase; }

        .asset-list-container {
          background: #fdfdfd;
          border: 1px solid #edf2f7;
          border-radius: 8px;
          margin-bottom: 15px;
          padding: 10px;
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .asset-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
          color: #334155;
        }
        .asset-item:last-child { border-bottom: none; }
      `}</style>
      
      <div style={premiumStyles.scrollLayer}>
        <div className="amazon-search-row">
          <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Filter your land plots..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button"><FaSearch size={18} /></button>
          </div>
          <button 
            onClick={() => { window.location.href = '/farmer/farm/add-land'; }} 
            style={premiumStyles.headerAddBtn}
          >
            <FaPlus /> Add Land
          </button>
        </div>

        <div className="land-grid">
          {filteredLands.map((plot) => (
            <div key={plot.id} className="alibaba-card">
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
                <div style={premiumStyles.dropdownMenu} ref={menuRef}>
                  <div style={premiumStyles.menuItem} onClick={() => setEditingPlotId(plot.id)}>
                    <FaEdit color="#007185"/> Edit Asset
                  </div>
                  <div style={{...premiumStyles.menuItem, color: '#d32f2f', fontWeight: 'bold'}} onClick={() => handleDrop(plot.id)}>
                    <FaTrash /> DROP Node
                  </div>
                </div>
              )}

              <div className="image-half">
                <div style={premiumStyles.verifiedTag}><FaShieldAlt size={12} color="#15803d"/> Verified Plot</div>
              </div>

              <div className="text-half" style={{ padding: "15px", flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={premiumStyles.productTitle}>{plot.plot_name}</h2>
                <div style={premiumStyles.idLabel}>REGISTRY TOKEN: 0x{plot.id?.toString().padStart(6, '0')}</div>
                
                <div style={premiumStyles.priceRow}>
                  <span style={premiumStyles.priceMain}>{plot.area_size}</span>
                  <span style={premiumStyles.unit}>Hectares (Ha)</span>
                  <span style={{...premiumStyles.statusBadge, 
                    backgroundColor: plot.land_status === 'Active' ? '#dcfce7' : '#fee2e2',
                    color: plot.land_status === 'Active' ? '#166534' : '#991b1b',
                    marginLeft: 'auto'
                  }}>{plot.land_status || "Active"}</span>
                </div>

                {/* ASSET BUTTONS */}
                <div className="asset-btn-row">
                  <div 
                    className={`asset-btn ${activeAssetView.plotId === plot.id && activeAssetView.type === 'crops' ? 'active' : ''}`}
                    onClick={() => toggleAssetView(plot.id, 'crops')}
                  >
                    <FaLeaf size={18} color="#16a34a"/>
                    <span>Crops</span>
                  </div>
                  <div 
                    className={`asset-btn ${activeAssetView.plotId === plot.id && activeAssetView.type === 'animals' ? 'active' : ''}`}
                    onClick={() => toggleAssetView(plot.id, 'animals')}
                  >
                    <FaPaw size={18} color="#92400e"/>
                    <span>Animals</span>
                  </div>
                  <div 
                    className={`asset-btn ${activeAssetView.plotId === plot.id && activeAssetView.type === 'health' ? 'active' : ''}`}
                    onClick={() => toggleAssetView(plot.id, 'health')}
                  >
                    <FaChartLine size={18} color="#2563eb"/>
                    <span>Health</span>
                  </div>
                </div>

                {/* INLINE LIST (Appears below buttons) */}
                {activeAssetView.plotId === plot.id && (
                  <div className="asset-list-container">
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                      Registered {activeAssetView.type}
                      <span style={{ color: '#3b82f6' }}>{activeAssetView.type === 'crops' ? (plot.crop_count || 0) : 0} Items</span>
                    </div>
                    
                    {activeAssetView.type === 'crops' && (plot.crop_list || []).length > 0 ? (
                      plot.crop_list.map((crop, idx) => (
                        <div key={idx} className="asset-item">
                          <span>{crop.name}</span>
                          <span style={{ fontWeight: '600' }}>{crop.quantity} {crop.unit}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: '#94a3b8' }}>
                        No {activeAssetView.type} found for this plot.
                      </div>
                    )}
                  </div>
                )}

                <div style={premiumStyles.vendorName}>Secure Registry Node • Last Synced Today</div>
                <div style={premiumStyles.ratingRow}>
                  <FaStar color="#ff9900" size={12} />
                  <span style={premiumStyles.ratingCount}>{plot.crop_count || 0} Assets Linked</span>
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
  pageWrapper: { width: "100vw", minHeight: "100vh", background: "#f0f2f5", position: "relative", zIndex: 1000 },
  scrollLayer: { marginTop: "78px", width: "100%", paddingBottom: "60px" },
  headerAddBtn: { background: "#ff9900", border: "1px solid #a88734", borderRadius: "4px", color: "#111", padding: "0 25px", height: "42px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" },
  verifiedTag: { position: "absolute", top: "12px", left: "12px", background: "white", padding: "4px 10px", fontSize: "12px", borderRadius: "4px", fontWeight: "800", color: "#15803d", display: "flex", alignItems: "center", gap: "5px" },
  productTitle: { fontSize: "20px", color: "#007185", fontWeight: "700", margin: "0 0 5px 0" },
  idLabel: { fontSize: "11px", color: "#777", letterSpacing: "1px", marginBottom: "8px" },
  priceRow: { display: "flex", alignItems: "center", gap: "6px", margin: "5px 0" },
  priceMain: { fontSize: "26px", fontWeight: "900", color: "#111" },
  unit: { fontSize: "14px", color: "#444" },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "800", textTransform: "uppercase" },
  vendorName: { fontSize: "12px", color: "#666", marginTop: "auto", borderTop: "1px solid #eee", paddingTop: "10px" },
  ratingRow: { display: "flex", alignItems: "center", paddingBottom: "10px", marginTop: "5px" },
  ratingCount: { fontSize: "12px", color: "#15803d", marginLeft: "6px", fontWeight: "700" },
  options-btn: { position: "absolute", top: "15px", right: "15px", background: "white", width: "35px", height: "35px", border-radius: "50%", display: "flex", justify-content: "center", align-items: "center", box-shadow: "0 2px 8px rgba(0,0,0,0.2)", z-index: 5, color: "#333", border: "none", cursor: "pointer" },
  dropdownMenu: { position: "absolute", top: "55px", right: "15px", background: "white", border: "1px solid #ddd", borderRadius: "6px", boxShadow: "0 8px 16px rgba(0,0,0,0.15)", zIndex: 100, width: "170px", padding: "6px 0" },
  menuItem: { padding: "12px 18px", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", cursor: "pointer" },
  loader: { textAlign: 'center', padding: '150px', fontSize: '20px', color: '#166534', fontWeight: 'bold' }
};

export default ViewLand;
