import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import UpdateLand from "./UpdateLand";
import { 
    Trash2, Edit3, Search, Map, 
    ChevronDown, Activity, ShieldCheck, Plus,
    MapPin, Globe, Leaf
} from "lucide-react";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingPlotId, setEditingPlotId] = useState(null);
  const [activeAssetView, setActiveAssetView] = useState({ plotId: null, type: null });
  
  const menuRef = useRef(null);

  // Close dropdown on outside click
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
      item.plot_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLands(results);
  }, [searchTerm, lands]);

  const handleDrop = async (id) => {
    if (window.confirm("CRITICAL: Are you sure you want to DROP this asset node from the secure registry?")) {
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
    setActiveAssetView(prev => (prev.plotId === plotId && prev.type === type) 
      ? { plotId: null, type: null } 
      : { plotId, type }
    );
  };

  if (loading) return (
    <div style={premiumStyles.loaderContainer}>
      <div className="pulse-loader"></div>
      <div style={{marginTop: '20px', letterSpacing: '3px'}}>ACCESSING SECURE REGISTRY...</div>
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
    <div style={premiumStyles.pageWrapper}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(.33); }
          80%, 100% { opacity: 0; }
        }
        .pulse-loader {
          width: 50px; height: 50px; border-radius: 50%; background: #166534;
          animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        .nav-pill:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .nav-pill.active { background: #f0fdf4 !important; border-color: #22c55e !important; color: #166534 !important; }
      `}</style>

      {/* Registry Top Bar */}
      <div style={premiumStyles.headerSection}>
        <div style={premiumStyles.searchWrapper}>
            <Search size={20} color="#94a3b8" style={{position: 'absolute', left: '20px', top: '18px'}} />
            <input 
                style={premiumStyles.searchInput}
                type="text" 
                placeholder="Search Plot Identity, Region, or Node ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <button style={premiumStyles.addBtn} onClick={() => window.location.href = '/my-farm/land/add'}>
          <Plus size={20} /> DROP NEW LAND
        </button>
      </div>

      {/* Land Nodes Grid */}
      <div style={premiumStyles.landGrid}>
        {filteredLands.map((plot) => (
          <div key={plot.id} style={premiumStyles.registryCard}>
            
            {/* Actions Menu */}
            <div style={{position: 'absolute', top: '15px', right: '15px', zIndex: 10}}>
                <button 
                    style={premiumStyles.dotsBtn} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenuId(showMenuId === plot.id ? null : plot.id);
                    }}
                >
                    <ChevronDown size={18} />
                </button>
                {showMenuId === plot.id && (
                <div style={premiumStyles.dropdownMenu} ref={menuRef}>
                    <div style={premiumStyles.dropdownItem} onClick={() => setEditingPlotId(plot.id)}>
                        <Edit3 size={15} /> Edit Metadata
                    </div>
                    <div style={{...premiumStyles.dropdownItem, color: '#dc2626', borderTop: '1px solid #f1f5f9'}} onClick={() => handleDrop(plot.id)}>
                        <Trash2 size={15} /> DROP NODE
                    </div>
                </div>
                )}
            </div>

            {/* Visual Header */}
            <div style={premiumStyles.cardBanner}>
              <div style={premiumStyles.verifiedPill}>
                <ShieldCheck size={12} /> REGISTRY VERIFIED
              </div>
            </div>

            <div style={premiumStyles.cardBody}>
              <div style={premiumStyles.nodeId}>NODE_REF // 0x{plot.id?.toString().padStart(6, '0')}</div>
              <h2 style={premiumStyles.plotTitle}>{plot.plot_name}</h2>

              <div style={premiumStyles.locationRow}>
                <MapPin size={14} color="#64748b" />
                <span>{plot.woreda}, {plot.region}</span>
              </div>

              <div style={premiumStyles.metricRow}>
                <div>
                  <span style={premiumStyles.metricMain}>{plot.area_size}</span>
                  <span style={premiumStyles.metricUnit}>HA</span>
                </div>
                <div style={{
                  ...premiumStyles.statusPill,
                  background: plot.land_status === 'Active' ? '#dcfce7' : '#fee2e2',
                  color: plot.land_status === 'Active' ? '#166534' : '#991b1b'
                }}>
                  {plot.land_status || "Active"}
                </div>
              </div>

              {/* Asset Drawers */}
              <div style={premiumStyles.assetNav}>
                <div 
                    className={`nav-pill ${activeAssetView.plotId === plot.id && activeAssetView.type === 'crops' ? 'active' : ''}`} 
                    style={premiumStyles.navPill}
                    onClick={() => toggleAssetView(plot.id, 'crops')}
                >
                  <Leaf size={14} /> <b>Crops</b>
                </div>
                <div 
                    className={`nav-pill ${activeAssetView.plotId === plot.id && activeAssetView.type === 'geo' ? 'active' : ''}`} 
                    style={premiumStyles.navPill}
                    onClick={() => toggleAssetView(plot.id, 'geo')}
                >
                  <Globe size={14} /> <b>Geo</b>
                </div>
              </div>

              {activeAssetView.plotId === plot.id && (
                <div style={premiumStyles.assetDrawer}>
                  <b style={{color: '#166534', fontSize: '11px'}}>{activeAssetView.type.toUpperCase()} SPECIFICATIONS</b>
                  {activeAssetView.type === 'crops' ? (
                     <p style={{margin: '8px 0 0 0', fontSize: '12px'}}>
                        Soil: {plot.soil_type} | Climate: {plot.climate_zone}
                     </p>
                  ) : (
                    <p style={{margin: '8px 0 0 0', fontSize: '12px'}}>
                        Zone: {plot.zone} | Kebele: {plot.kebele}
                    </p>
                  )}
                </div>
              )}

              <div style={premiumStyles.cardFooter}>
                <div style={premiumStyles.syncText}>
                  <span style={premiumStyles.dot}></span> SYNCED TO NODE
                </div>
                <div style={{fontSize: '11px', fontWeight: '800', color: '#94a3b8'}}>
                   UPDATED 2026
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
  pageWrapper: { minHeight: "100vh", backgroundColor: "#f8fafc", padding: "40px 20px" },
  headerSection: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', maxWidth: '1200px', margin: '0 auto 50px auto' },
  searchWrapper: { position: 'relative', flex: 1, maxWidth: '600px' },
  searchInput: { 
    width: '100%', padding: '16px 20px 16px 55px', borderRadius: '18px', border: '1px solid #e2e8f0',
    outline: 'none', fontSize: '15px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
  },
  addBtn: { 
    background: '#166534', color: 'white', border: 'none', height: '55px', padding: '0 25px', 
    borderRadius: '18px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
    boxShadow: '0 10px 15px -3px rgba(22, 101, 52, 0.2)'
  },
  landGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' },
  registryCard: { background: 'white', borderRadius: '28px', overflow: 'hidden', position: 'relative', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  cardBanner: { height: '120px', background: '#166534', backgroundImage: 'linear-gradient(135deg, #166534 0%, #14532d 100%)', position: 'relative' },
  verifiedPill: { position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', color: '#166534', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.5px' },
  dotsBtn: { width: '38px', height: '38px', borderRadius: '12px', border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  dropdownMenu: { position: 'absolute', top: '45px', right: '0', background: 'white', width: '170px', borderRadius: '14px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', overflow: 'hidden' },
  dropdownItem: { padding: '14px 18px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s', color: '#334155' },
  cardBody: { padding: '24px' },
  nodeId: { fontSize: '10px', color: '#94a3b8', letterSpacing: '1.5px', fontWeight: '800', marginBottom: '10px' },
  plotTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '20px' },
  metricRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  metricMain: { fontSize: '32px', fontWeight: '900', color: '#1e293b' },
  metricUnit: { fontSize: '12px', color: '#94a3b8', fontWeight: '800', marginLeft: '6px' },
  statusPill: { padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px' },
  assetNav: { display: 'flex', gap: '10px', marginBottom: '15px' },
  navPill: { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', transition: '0.2s' },
  assetDrawer: { background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '14px', padding: '15px', marginBottom: '15px' },
  cardFooter: { borderTop: '1px solid #f1f5f9', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  syncText: { fontSize: '10px', color: '#22c55e', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' },
  dot: { width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' },
  loaderContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontWeight: '900', color: '#166534' }
};

export default ViewLand;
