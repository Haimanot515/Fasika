import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import UpdateLand from "./UpdateLand";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingPlotId, setEditingPlotId] = useState(null);
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

  if (loading) return (
    <div style={premiumStyles.loaderContainer}>
      <div className="pulse-loader"></div>
      <div style={{marginTop: '20px'}}>ACCESSING SECURE REGISTRY...</div>
    </div>
  );

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        
        body { font-family: 'Inter', sans-serif; margin: 0; background: #f8fafc; color: #1e293b; }
        
        .search-bar-container { display: flex; justify-content: center; padding: 40px 20px; gap: 15px; }
        .custom-search { flex: 1; max-width: 600px; position: relative; }
        .custom-search input { 
          width: 100%; padding: 16px 25px; border-radius: 15px; border: 1px solid #e2e8f0; 
          outline: none; font-size: 16px; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        
        .add-land-btn { 
          background: #166534; color: white; border: none; padding: 0 30px; 
          border-radius: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 10px 15px -3px rgba(22, 101, 52, 0.3);
        }
        .add-land-btn:hover { transform: translateY(-2px); background: #15803d; }

        .land-grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); 
          gap: 30px; max-width: 1300px; margin: 0 auto; padding: 0 25px 60px; 
        }

        .registry-card { 
          background: white; border-radius: 25px; overflow: hidden; position: relative;
          border: 1px solid #f1f5f9; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .registry-card:hover { transform: translateY(-10px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); }

        .card-banner { height: 200px; background: #166534; position: relative; overflow: hidden; }
        .card-banner::after { 
           content: ""; position: absolute; width: 100%; height: 100%; 
           background: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80') center/cover;
           opacity: 0.7;
        }

        .verified-pill { 
          position: absolute; top: 20px; left: 20px; background: rgba(255,255,255,0.9);
          padding: 6px 15px; border-radius: 10px; font-size: 11px; font-weight: 800;
          color: #166534; z-index: 2; letter-spacing: 1px;
        }

        .dots-btn {
          position: absolute; top: 15px; right: 15px; width: 40px; height: 40px;
          border-radius: 12px; border: none; background: rgba(255,255,255,0.9);
          cursor: pointer; z-index: 10; font-weight: bold; font-size: 20px;
        }

        .card-body { padding: 30px; }
        .node-id { font-size: 10px; color: #94a3b8; letter-spacing: 2px; font-weight: 800; margin-bottom: 10px; }
        .plot-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; }

        .metric-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; }
        .metric-main { font-size: 32px; font-weight: 800; color: #1e293b; line-height: 1; }
        .metric-unit { font-size: 14px; color: #64748b; font-weight: 600; margin-left: 5px; }

        .status-pill { padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; }

        .asset-nav { display: flex; gap: 10px; margin-bottom: 20px; }
        .nav-pill { 
          flex: 1; padding: 12px 5px; border-radius: 12px; border: 1px solid #f1f5f9;
          background: #f8fafc; cursor: pointer; text-align: center; transition: 0.2s;
        }
        .nav-pill.active { background: #f0fdf4; border-color: #22c55e; }
        .nav-pill b { display: block; font-size: 11px; color: #1e293b; text-transform: uppercase; }

        .asset-drawer { 
          background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 15px; 
          padding: 20px; margin-bottom: 20px; text-align: center; color: #94a3b8; font-size: 13px;
        }

        .card-footer { 
          border-top: 1px solid #f1f5f9; padding-top: 20px; 
          display: flex; justify-content: space-between; align-items: center;
        }
        .sync-text { font-size: 11px; color: #22c55e; font-weight: 700; display: flex; align-items: center; gap: 5px; }
        .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; }

        .pulse-loader {
          width: 50px; height: 50px; border-radius: 50%; background: #166534;
          animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(.33); }
          80%, 100% { opacity: 0; }
        }

        .dropdown-menu {
          position: absolute; top: 65px; right: 15px; background: white; width: 180px;
          border-radius: 15px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          z-index: 100; overflow: hidden; border: 1px solid #f1f5f9;
        }
        .dropdown-item { 
          padding: 15px 20px; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .dropdown-item:hover { background: #f8fafc; }
        .drop-action { color: #dc2626; border-top: 1px solid #f1f5f9; }
      `}</style>

      <div className="search-bar-container">
        <div className="custom-search">
          <input 
            type="text" 
            placeholder="Search Land Node Registry..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-land-btn" onClick={() => window.location.href = '/my-farm/land/add'}>
          + ADD NEW LAND
        </button>
      </div>

      <div className="land-grid">
        {filteredLands.map((plot) => (
          <div key={plot.id} className="registry-card">
            <button className="dots-btn" onClick={(e) => {
              e.stopPropagation();
              setShowMenuId(showMenuId === plot.id ? null : plot.id);
            }}>⋮</button>

            {showMenuId === plot.id && (
              <div className="dropdown-menu" ref={menuRef}>
                <div className="dropdown-item" onClick={() => setEditingPlotId(plot.id)}>Edit Details</div>
                <div className="dropdown-item drop-action" onClick={() => handleDrop(plot.id)}>DROP NODE</div>
              </div>
            )}

            <div className="card-banner">
              <div className="verified-pill">✓ VERIFIED PLOT</div>
            </div>

            <div className="card-body">
              <div className="node-id">NODE :: 0x{plot.id?.toString().padStart(6, '0')}</div>
              <h2 className="plot-title">{plot.plot_name}</h2>

              <div className="metric-row">
                <div>
                  <span className="metric-main">{plot.area_size}</span>
                  <span className="metric-unit">Hectares</span>
                </div>
                <div className="status-pill" style={{
                  background: plot.land_status === 'Active' ? '#dcfce7' : '#fee2e2',
                  color: plot.land_status === 'Active' ? '#166534' : '#991b1b'
                }}>
                  {plot.land_status || "Active"}
                </div>
              </div>

              <div className="asset-nav">
                <div className={`nav-pill ${activeAssetView.plotId === plot.id && activeAssetView.type === 'crops' ? 'active' : ''}`} onClick={() => toggleAssetView(plot.id, 'crops')}>
                  <b>Crops</b>
                </div>
                <div className={`nav-pill ${activeAssetView.plotId === plot.id && activeAssetView.type === 'animals' ? 'active' : ''}`} onClick={() => toggleAssetView(plot.id, 'animals')}>
                  <b>Livestock</b>
                </div>
                <div className={`nav-pill ${activeAssetView.plotId === plot.id && activeAssetView.type === 'health' ? 'active' : ''}`} onClick={() => toggleAssetView(plot.id, 'health')}>
                  <b>Health</b>
                </div>
              </div>

              {activeAssetView.plotId === plot.id && (
                <div className="asset-drawer">
                  <b>{activeAssetView.type.toUpperCase()} REGISTRY</b><br/>
                  Securely synced. Data encrypted at node level.
                </div>
              )}

              <div className="card-footer">
                <div className="sync-text">
                  <span className="dot"></span> SECURE SYNCED
                </div>
                <div style={{fontSize: '11px', fontWeight: '800', color: '#94a3b8'}}>
                  {plot.crop_count || 0} ASSETS LINKED
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { minHeight: "100vh", position: "relative" },
  loaderContainer: { 
    height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', 
    alignItems: 'center', fontWeight: '800', color: '#166534', letterSpacing: '2px' 
  }
};

export default ViewLand;
