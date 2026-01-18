import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import UpdateLand from "./UpdateLand";
import { 
    Trash2, Edit3, Search, ChevronDown, 
    ShieldCheck, Plus, MapPin, Leaf, Dog,
    Loader2
} from "lucide-react";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingPlotId, setEditingPlotId] = useState(null);
  
  const menuRef = useRef(null);

  // FIX: Added '/view' to match your backend router: router.get('/view', ...)
  const fetchLands = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/farmer/farm/land/view");
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
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenuId]);

  useEffect(() => {
    const results = lands.filter(item =>
      item.plot_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLands(results);
  }, [searchTerm, lands]);

  const handleDrop = async (id) => {
    if (window.confirm("CRITICAL: Confirm DROP from registry?")) {
      try {
        const response = await api.delete(`/farmer/farm/land/${id}`);
        if (response.data.success) {
          setLands(prev => prev.filter(item => item.id !== id));
          setShowMenuId(null);
        }
      } catch (err) { 
        console.error("DROP Failed:", err);
      }
    }
  };

  if (loading) return (
    <div style={styles.loaderContainer}>
      <Loader2 className="spin" size={40} color="#166534" />
      <div style={{marginTop: '20px', fontWeight: '800'}}>SYNCING REGISTRY...</div>
      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );

  if (editingPlotId) {
    return (
      <div style={styles.pageWrapper}>
        <UpdateLand 
          plotId={editingPlotId} 
          onUpdateSuccess={() => { setEditingPlotId(null); fetchLands(); }} 
          onCancel={() => setEditingPlotId(null)} 
        />
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        {/* Top Controls */}
        <div style={styles.topBar}>
          <div style={styles.searchContainer}>
            <Search size={18} color="#64748b" />
            <input 
              style={styles.searchInput}
              placeholder="Filter nodes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button style={styles.addBtn} onClick={() => window.location.href = '/my-farm/land/add'}>
            <Plus size={18} /> DROP NEW LAND
          </button>
        </div>

        {/* Nodes Grid */}
        <div style={styles.grid}>
          {filteredLands.map((plot) => (
            <div key={plot.id} style={styles.card}>
              <div style={{...styles.banner, backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`}}>
                <div style={styles.verifiedBadge}><ShieldCheck size={12} /> SECURE NODE</div>
                <button style={styles.menuTrigger} onClick={(e) => { e.stopPropagation(); setShowMenuId(showMenuId === plot.id ? null : plot.id); }}>
                  <ChevronDown size={18} />
                </button>
                {showMenuId === plot.id && (
                  <div style={styles.dropdown} ref={menuRef}>
                    <div style={styles.dropItem} onClick={() => setEditingPlotId(plot.id)}><Edit3 size={14} /> Update</div>
                    <div style={{...styles.dropItem, color: '#ef4444'}} onClick={() => handleDrop(plot.id)}><Trash2 size={14} /> DROP</div>
                  </div>
                )}
              </div>

              <div style={styles.cardContent}>
                <div style={styles.nodeRef}>REG_ID: {plot.id}</div>
                <h3 style={styles.plotName}>{plot.plot_name}</h3>
                <div style={styles.locRow}><MapPin size={14} /> {plot.woreda}, {plot.region}</div>
                <div style={styles.statGrid}>
                  <div style={styles.statBox}><span style={styles.statVal}>{plot.area_size}</span><span style={styles.statLabel}>HA</span></div>
                  <div style={styles.statBox}><span style={styles.statVal}>{plot.soil_type_name || 'Nitosols'}</span><span style={styles.statLabel}>SOIL</span></div>
                </div>
                <div style={styles.assetCounts}>
                  <div style={styles.assetPill}><Leaf size={14}/> {plot.crop_count}</div>
                  <div style={styles.assetPill}><Dog size={14}/> {plot.animal_count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Added padding-top to ensure visibility below navbar
  pageWrapper: { 
    paddingTop: '100px', 
    paddingBottom: '60px',
    backgroundColor: '#f8fafc', 
    minHeight: '100vh' 
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  topBar: { display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '40px' },
  searchContainer: { flex: 1, display: 'flex', alignItems: 'center', background: 'white', padding: '0 20px', borderRadius: '14px', border: '1px solid #e2e8f0' },
  searchInput: { border: 'none', outline: 'none', width: '100%', padding: '15px', fontSize: '14px' },
  addBtn: { background: '#166534', color: 'white', border: 'none', padding: '0 25px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: { background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
  banner: { height: '140px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  verifiedBadge: { position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' },
  menuTrigger: { position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '8px', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dropdown: { position: 'absolute', top: '50px', right: '12px', background: 'white', borderRadius: '12px', width: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10 },
  dropItem: { padding: '12px 15px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  cardContent: { padding: '20px' },
  nodeRef: { fontSize: '9px', color: '#94a3b8', fontWeight: '800' },
  plotName: { margin: '5px 0', fontSize: '18px', color: '#0f172a', fontWeight: '800' },
  locRow: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b', marginBottom: '15px' },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' },
  statBox: { background: '#f8fafc', padding: '10px', borderRadius: '10px', textAlign: 'center' },
  statVal: { display: 'block', fontSize: '16px', fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: '8px', color: '#94a3b8', fontWeight: '800' },
  assetCounts: { display: 'flex', gap: '8px' },
  assetPill: { background: '#f0fdf4', color: '#166534', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' },
  loaderContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }
};

export default ViewLand;
