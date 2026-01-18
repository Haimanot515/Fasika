import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import UpdateLand from "./UpdateLand";
import { 
    Trash2, Edit3, Search, ChevronDown, 
    ShieldCheck, Plus, MapPin, Leaf, Dog,
    Info, Loader2
} from "lucide-react";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingPlotId, setEditingPlotId] = useState(null);
  
  const menuRef = useRef(null);

  // Sync with your Backend: GET /farmer/farm/land
  const fetchLands = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/farmer/farm/land");
      // data.data contains the result.rows from your pool.query
      setLands(data.data || []);
      setFilteredLands(data.data || []);
    } catch (err) { 
      console.error("Registry Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchLands(); }, []);

  // Handle outside clicks for the action menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenuId]);

  // Search logic
  useEffect(() => {
    const results = lands.filter(item =>
      item.plot_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLands(results);
  }, [searchTerm, lands]);

  // DELETE / DROP Action: Fits your deleteLand controller
  const handleDrop = async (id) => {
    if (window.confirm("CRITICAL: Confirm DROP from registry? This node will be permanently purged.")) {
      try {
        const response = await api.delete(`/farmer/farm/land/${id}`);
        if (response.data.success) {
          setLands(prev => prev.filter(item => item.id !== id));
          setShowMenuId(null);
        }
      } catch (err) { 
        console.error("DROP Failed:", err);
        alert("DROP failed. Registry node unreachable."); 
      }
    }
  };

  if (loading) return (
    <div style={styles.loaderContainer}>
      <Loader2 className="spin" size={40} color="#166534" />
      <div style={{marginTop: '20px', letterSpacing: '2px', fontWeight: '800'}}>FETCHING REGISTRY NODES...</div>
      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );

  // Logic to switch to UpdateLand component (Fits your updateLand controller)
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
    <div style={styles.pageWrapper}>
      {/* Search and Drop New Bar */}
      <div style={styles.topBar}>
        <div style={styles.searchContainer}>
          <Search size={18} color="#64748b" />
          <input 
            style={styles.searchInput}
            placeholder="Filter registry by plot or region..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button style={styles.addBtn} onClick={() => window.location.href = '/my-farm/land/add'}>
          <Plus size={18} /> DROP NEW LAND
        </button>
      </div>

      <div style={styles.grid}>
        {filteredLands.map((plot) => (
          <div key={plot.id} style={styles.card}>
            
            {/* Header / Banner */}
            <div style={{...styles.banner, backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`}}>
              <div style={styles.verifiedBadge}>
                <ShieldCheck size={12} /> SECURE NODE
              </div>
              
              {/* Action Menu Trigger */}
              <button 
                style={styles.menuTrigger}
                onClick={(e) => { e.stopPropagation(); setShowMenuId(showMenuId === plot.id ? null : plot.id); }}
              >
                <ChevronDown size={18} />
              </button>

              {showMenuId === plot.id && (
                <div style={styles.dropdown} ref={menuRef}>
                  <div style={styles.dropItem} onClick={() => setEditingPlotId(plot.id)}>
                    <Edit3 size={14} /> Update Node
                  </div>
                  <div style={{...styles.dropItem, color: '#ef4444'}} onClick={() => handleDrop(plot.id)}>
                    <Trash2 size={14} /> DROP FROM REGISTRY
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div style={styles.cardContent}>
              <div style={styles.nodeRef}>0x-{plot.id.toString().padStart(5, '0')}</div>
              <h3 style={styles.plotName}>{plot.plot_name}</h3>
              
              <div style={styles.locRow}>
                <MapPin size={14} /> {plot.woreda}, {plot.region}
              </div>

              <div style={styles.statGrid}>
                <div style={styles.statBox}>
                  <span style={styles.statVal}>{plot.area_size}</span>
                  <span style={styles.statLabel}>HECTARES</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statVal}>{plot.soil_type_name || 'Nitosols'}</span>
                  <span style={styles.statLabel}>SOIL TYPE</span>
                </div>
              </div>

              <div style={styles.assetCounts}>
                <div style={styles.assetPill}><Leaf size={14}/> {plot.crop_count} Crops</div>
                <div style={styles.assetPill}><Dog size={14}/> {plot.animal_count} Animals</div>
              </div>

              <div style={styles.footer}>
                <div style={styles.syncStatus}>
                  <div style={styles.greenDot}></div> SECURE SYNCED
                </div>
                <div style={{fontSize: '10px', color: '#94a3b8'}}>{plot.climate_zone}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  topBar: { display: 'flex', justifyContent: 'space-between', gap: '20px', maxWidth: '1200px', margin: '0 auto 40px' },
  searchContainer: { flex: 1, display: 'flex', alignItems: 'center', background: 'white', padding: '0 20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  searchInput: { border: 'none', outline: 'none', width: '100%', padding: '15px', fontSize: '14px' },
  addBtn: { background: '#166534', color: 'white', border: 'none', padding: '0 25px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' },
  card: { background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
  banner: { height: '160px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  verifiedBadge: { position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', color: '#166534', display: 'flex', alignItems: 'center', gap: '5px' },
  menuTrigger: { position: 'absolute', top: '15px', right: '15px', width: '35px', height: '35px', borderRadius: '10px', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dropdown: { position: 'absolute', top: '55px', right: '15px', background: 'white', borderRadius: '12px', width: '180px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 10 },
  dropItem: { padding: '12px 15px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f8fafc' },
  cardContent: { padding: '24px' },
  nodeRef: { fontSize: '10px', color: '#94a3b8', fontWeight: '800', marginBottom: '5px' },
  plotName: { margin: '0 0 5px 0', fontSize: '20px', color: '#0f172a', fontWeight: '800' },
  locRow: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b', marginBottom: '20px' },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' },
  statBox: { background: '#f8fafc', padding: '12px', borderRadius: '12px', textAlign: 'center' },
  statVal: { display: 'block', fontSize: '18px', fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: '9px', color: '#94a3b8', fontWeight: '800' },
  assetCounts: { display: 'flex', gap: '10px', marginBottom: '20px' },
  assetPill: { background: '#f0fdf4', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' },
  footer: { borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  syncStatus: { fontSize: '10px', color: '#22c55e', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' },
  greenDot: { width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' },
  loaderContainer: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }
};

export default ViewLand;
