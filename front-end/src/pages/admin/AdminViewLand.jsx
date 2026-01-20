import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
    ShieldCheck, MapPin, Leaf, Ruler, Layers, Loader2, Trash2, Edit3, User, Search, AlertTriangle
} from "lucide-react";

const AdminViewLand = () => {
  const [lands, setLands] = useState([]);
  const [stats, setStats] = useState({ total_lands: 0, total_hectares: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGlobalRegistry = async () => {
    try {
      setLoading(true);
      setError(null);

      /**
       * PATH VERIFICATION:
       * Axios baseURL: .../api
       * Server mount: /admin/farmers
       * Route: /view-all
       * Target: /api/admin/farmers/view-all
       */
      const res = await api.get("/admin/farmers/view-all");
      
      console.log("Registry Sync Success:", res.data);

      if (res.data.success) {
        const data = res.data.data || [];
        setLands(data);
        
        const totalHectares = data.reduce((acc, curr) => acc + parseFloat(curr.area_size || 0), 0);
        setStats({
          total_lands: data.length,
          total_hectares: totalHectares.toFixed(2)
        });
      }
    } catch (err) { 
      console.error("Critical Registry Error:", err.response || err);
      setError(err.response?.data?.message || "Route Not Found - Check Backend Mounting");
    } finally { 
      setLoading(false); 
    }
  };

  const handleDropNode = async (id) => {
    if (window.confirm(`⚠️ AUTHORITY ALERT: DROP Land Node #${id} permanently?`)) {
      try {
        // Path: /api/admin/farmers/land/:id/drop
        await api.delete(`/admin/farmers/land/${id}/drop`);
        alert("NODE DROPPED FROM REGISTRY");
        fetchGlobalRegistry();
      } catch (err) { 
        alert("DROP FAILED: Unauthorized or Database Error"); 
      }
    }
  };

  useEffect(() => { fetchGlobalRegistry(); }, []);

  const filteredLands = lands.filter(plot => 
    plot.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.plot_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={styles.loader}>
      <Loader2 className="animate-spin" size={40} color="#166534" /> 
      <p>SYNCING GLOBAL REGISTRY...</p>
    </div>
  );

  if (error) return (
    <div style={styles.errorContainer}>
      <AlertTriangle size={48} color="#ef4444" />
      <h2 style={{margin: '20px 0 10px'}}>Registry Connection Failed</h2>
      <p style={{color: '#64748b'}}>{error}</p>
      <button onClick={fetchGlobalRegistry} style={styles.retryBtn}>RETRY AUTHORITY SYNC</button>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div>
            <h1 style={styles.mainTitle}>LAND REGISTRY AUTHORITY</h1>
            <p style={styles.subTitle}>Managing Global Farmer Assets & Nodes</p>
        </div>
        
        <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input 
                type="text" 
                placeholder="Search by Owner or Plot Name..." 
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={styles.statsHeader}>
        <div style={styles.statBox}>
          <Layers size={20} color="#166534" />
          <div style={styles.statText}><b>{stats.total_lands}</b> <p>TOTAL PLOTS</p></div>
        </div>
        <div style={styles.statBox}>
          <Ruler size={20} color="#166534" />
          <div style={styles.statText}><b>{stats.total_hectares}</b> <p>REG. HECTARES</p></div>
        </div>
        <div style={styles.statBox}>
          <ShieldCheck size={20} color="#166534" />
          <div style={styles.statText}><b>ACTIVE</b> <p>REGISTRY</p></div>
        </div>
      </div>

      {/* GRID */}
      {filteredLands.length === 0 ? (
        <div style={styles.empty}>No records found matching your search criteria.</div>
      ) : (
        <div style={styles.grid}>
            {filteredLands.map((plot) => (
            <div key={plot.id} style={styles.card}>
                <div style={{
                ...styles.banner, 
                backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`
                }}>
                <div style={styles.badge}><ShieldCheck size={12}/> NODE: #00{plot.id}</div>
                
                <div style={styles.adminOverlay}>
                    <button onClick={() => handleDropNode(plot.id)} style={styles.dropBtn} title="DROP RECORD">
                        <Trash2 size={16} />
                    </button>
                    <button style={styles.editBtn}>
                        <Edit3 size={16} />
                    </button>
                </div>
                </div>

                <div style={styles.content}>
                <h2 style={styles.title}>{plot.plot_name?.toUpperCase()}</h2>
                <div style={styles.ownerInfo}>
                    <User size={14} color="#16a34a"/> <b>Owner:</b> {plot.owner_name}
                </div>
                <div style={styles.loc}><MapPin size={14}/> {plot.woreda}, {plot.region}</div>
                
                <div style={styles.soilInfo}>
                    <div style={styles.soilPill}><b>SOIL:</b> {plot.soil_type_name}</div>
                    <div style={styles.soilPill}><b>AREA:</b> {plot.area_size} Ha</div>
                </div>

                <div style={styles.assetSection}>
                    <h4 style={styles.assetHeader}><Leaf size={14}/> REGISTERED CROPS</h4>
                    <div style={styles.assetContainer}>
                    {plot.crop_list?.length > 0 ? plot.crop_list.slice(0, 3).map((c, i) => (
                        <div key={i} style={styles.assetPill}>
                        <b>{c.crop_name}</b> <span>{c.quantity} Units</span>
                        </div>
                    )) : <span style={styles.none}>No crop nodes detected</span>}
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '120px 5% 60px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  loader: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#166534', gap: '10px' },
  errorContainer: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' },
  retryBtn: { marginTop: '20px', padding: '12px 25px', background: '#166534', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  mainTitle: { fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0 },
  subTitle: { color: '#64748b', fontSize: '14px', margin: '5px 0 0' },
  searchWrapper: { position: 'relative', width: '100%', maxWidth: '350px' },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchInput: { width: '100%', padding: '12px 12px 12px 45px', borderRadius: '15px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
  statsHeader: { display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'flex-start' },
  statBox: { background: 'white', padding: '15px 30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' },
  statText: { lineHeight: '1', fontSize: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' },
  card: { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
  banner: { height: '180px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '15px', left: '15px', background: 'white', padding: '5px 12px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', color: '#166534' },
  adminOverlay: { position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' },
  dropBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' },
  editBtn: { background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' },
  content: { padding: '25px' },
  title: { fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 5px' },
  ownerInfo: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16a34a', marginBottom: '5px' },
  loc: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' },
  soilInfo: { display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '15px 0' },
  soilPill: { background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', color: '#475569', fontWeight: '700' },
  assetHeader: { fontSize: '12px', fontWeight: '900', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  assetContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  assetPill: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '10px', fontSize: '10px' },
  none: { fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' },
  empty: { textAlign: 'center', padding: '100px', color: '#64748b', gridColumn: '1 / -1' }
};

export default AdminViewLand;
