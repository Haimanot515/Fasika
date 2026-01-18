import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import UpdateLand from "./UpdateLand";
import { 
    Trash2, Edit3, Search, ChevronDown, 
    ShieldCheck, Plus, MapPin, Leaf, Dog,
    Loader2, Box, Ruler, Layers
} from "lucide-react";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [stats, setStats] = useState({ total_lands: 0, total_animals: 0, total_hectares: 0 });
  const [filteredLands, setFilteredLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingPlotId, setEditingPlotId] = useState(null);
  
  const menuRef = useRef(null);

  const fetchRegistryData = async () => {
    setLoading(true);
    try {
      // 1. Fetching Detailed Data (with lists of crops/animals) and Global Stats
      const [detailedRes, statsRes] = await Promise.all([
        api.get("/farmer/farm/land/view-detailed"),
        api.get("/farmer/farm/land/stats")
      ]);

      const landsData = detailedRes.data.data || [];
      setLands(landsData);
      setFilteredLands(landsData);
      
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) { 
      console.error("Registry Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchRegistryData(); }, []);

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
          fetchRegistryData(); // Refresh both lists and stats
          setShowMenuId(null);
        }
      } catch (err) { console.error("DROP Failed:", err); }
    }
  };

  if (loading) return (
    <div style={styles.loaderContainer}>
      <Loader2 className="spin" size={60} color="#166534" />
      <div style={{marginTop: '20px', fontWeight: '800', fontSize: '20px'}}>SYNCING REGISTRY...</div>
      <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );

  if (editingPlotId) return (
    <div style={styles.pageWrapper}>
      <UpdateLand plotId={editingPlotId} onUpdateSuccess={() => { setEditingPlotId(null); fetchRegistryData(); }} onCancel={() => setEditingPlotId(null)} />
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        
        {/* SECTION 1: GLOBAL STATISTICS HEADER */}
        <div style={styles.statsHeader}>
            <div style={styles.headerText}>
                <h1 style={styles.mainTitle}>FARM REGISTRY DASHBOARD</h1>
                <p style={styles.subTitle}>Live monitoring of biological and territorial assets</p>
            </div>
            <div style={styles.headerStatsRow}>
                <div style={styles.statCardSmall}><Layers color="#166534"/> <div><b>{stats.total_lands}</b><span>PLOTS</span></div></div>
                <div style={styles.statCardSmall}><Ruler color="#166534"/> <div><b>{stats.total_hectares}</b><span>HECTARES</span></div></div>
                <div style={styles.statCardSmall}><Dog color="#166534"/> <div><b>{stats.total_animals}</b><span>LIVESTOCK</span></div></div>
            </div>
        </div>

        <div style={styles.topBar}>
          <div style={styles.searchContainer}>
            <Search size={24} color="#64748b" />
            <input style={styles.searchInput} placeholder="Filter secure nodes by name or region..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button style={styles.addBtn} onClick={() => window.location.href = '/my-farm/land/add'}>
            <Plus size={24} /> DROP NEW LAND
          </button>
        </div>

        <div style={styles.grid}>
          {filteredLands.map((plot) => (
            <div key={plot.id} style={styles.card}>
              <div style={{...styles.banner, backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`}}>
                <div style={styles.verifiedBadge}><ShieldCheck size={16} /> REGISTRY VERIFIED</div>
                <button style={styles.menuTrigger} onClick={(e) => { e.stopPropagation(); setShowMenuId(showMenuId === plot.id ? null : plot.id); }}>
                  <ChevronDown size={24} />
                </button>
                {showMenuId === plot.id && (
                  <div style={styles.dropdown} ref={menuRef}>
                    <div style={styles.dropItem} onClick={() => setEditingPlotId(plot.id)}><Edit3 size={18} /> Update Node</div>
                    <div style={{...styles.dropItem, color: '#ef4444'}} onClick={() => handleDrop(plot.id)}><Trash2 size={18} /> DROP NODE</div>
                  </div>
                )}
              </div>

              <div style={styles.cardContent}>
                <div style={styles.nodeRef}>IDENTIFIER: #00{plot.id}</div>
                <h3 style={styles.plotName}>{plot.plot_name}</h3>
                <div style={styles.locRow}><MapPin size={18} /> {plot.woreda}, {plot.region}, {plot.zone}</div>
                
                <div style={styles.statGrid}>
                  <div style={styles.statBox}><span style={styles.statVal}>{plot.area_size}</span><span style={styles.statLabel}>HECTARES</span></div>
                  <div style={styles.statBox}><span style={styles.statVal}>{plot.soil_type_name || 'Nitosols'}</span><span style={styles.statLabel}>SOIL TYPE</span></div>
                </div>

                <div style={styles.assetHeader}><Box size={18}/> REGISTERED BIOLOGICAL ASSETS</div>
                
                <div style={styles.assetList}>
                   {/* DYNAMIC LIST OF CROPS */}
                   <div style={styles.assetGroup}>
                      <div style={styles.groupTitle}><Leaf size={14}/> Crops ({plot.crop_count})</div>
                      <div style={styles.itemList}>
                        {plot.crop_list ? plot.crop_list.map((c, i) => (
                            <div key={i} style={styles.pill}>{c.crop_name} <small>({c.quantity})</small></div>
                        )) : <span style={styles.emptyText}>No crops registered</span>}
                      </div>
                   </div>

                   {/* DYNAMIC LIST OF ANIMALS */}
                   <div style={styles.assetGroup}>
                      <div style={styles.groupTitle}><Dog size={14}/> Livestock ({plot.animal_count})</div>
                      <div style={styles.itemList}>
                        {plot.animal_list ? plot.animal_list.map((a, i) => (
                            <div key={i} style={styles.pill}>{a.animal_type} <small>({a.head_count} head)</small></div>
                        )) : <span style={styles.emptyText}>No animals registered</span>}
                      </div>
                   </div>
                </div>

                <div style={styles.footer}>
                  <div style={styles.syncStatus}><div style={styles.greenDot}></div> SECURE SYNCED</div>
                  <div style={{fontSize: '14px', fontWeight: '700', color: '#94a3b8'}}>{plot.climate_zone}</div>
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
  pageWrapper: { paddingTop: '120px', paddingBottom: '80px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  contentContainer: { maxWidth: '1400px', margin: '0 auto', padding: '0 30px' },
  
  // Stats Header Styles
  statsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: 'white', padding: '30px', borderRadius: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
  mainTitle: { fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: 0 },
  subTitle: { color: '#64748b', fontSize: '16px', fontWeight: '500', marginTop: '5px' },
  headerStatsRow: { display: 'flex', gap: '20px' },
  statCardSmall: { display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 20px', background: '#f1f5f9', borderRadius: '16px' },
  
  topBar: { display: 'flex', justifyContent: 'space-between', gap: '30px', marginBottom: '50px' },
  searchContainer: { flex: 1, display: 'flex', alignItems: 'center', background: 'white', padding: '0 25px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  searchInput: { border: 'none', outline: 'none', width: '100%', padding: '20px', fontSize: '18px', fontWeight: '500' },
  addBtn: { background: '#166534', color: 'white', border: 'none', padding: '0 35px', borderRadius: '20px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(22, 101, 52, 0.3)' },
  
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' },
  card: { background: 'white', borderRadius: '32px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' },
  banner: { height: '220px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  verifiedBadge: { position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.95)', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '900', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' },
  menuTrigger: { position: 'absolute', top: '20px', right: '20px', width: '45px', height: '45px', borderRadius: '14px', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  dropdown: { position: 'absolute', top: '75px', right: '20px', background: 'white', borderRadius: '18px', width: '220px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', zIndex: 10, overflow: 'hidden' },
  dropItem: { padding: '18px 20px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: '0.2s' },
  
  cardContent: { padding: '35px' },
  nodeRef: { fontSize: '12px', color: '#94a3b8', fontWeight: '900', letterSpacing: '1px' },
  plotName: { margin: '10px 0', fontSize: '28px', color: '#0f172a', fontWeight: '900' },
  locRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', color: '#64748b', fontWeight: '600', marginBottom: '25px' },
  
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' },
  statBox: { background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9' },
  statVal: { display: 'block', fontSize: '22px', fontWeight: '900', color: '#1e293b' },
  statLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.5px' },
  
  assetHeader: { fontSize: '13px', fontWeight: '900', color: '#166534', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' },
  assetList: { background: '#f8fafc', borderRadius: '20px', padding: '20px', marginBottom: '30px' },
  assetGroup: { marginBottom: '15px' },
  groupTitle: { fontSize: '14px', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  itemList: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '22px' },
  pill: { background: 'white', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#1e293b', border: '1px solid #e2e8f0' },
  emptyText: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' },

  footer: { borderTop: '2px solid #f8fafc', paddingTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  syncStatus: { fontSize: '13px', color: '#22c55e', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' },
  greenDot: { width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' },
  loaderContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }
};

export default ViewLand;
