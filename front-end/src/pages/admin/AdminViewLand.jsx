import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
    ShieldCheck, MapPin, Leaf, Ruler, Layers, Loader2, Trash2, Edit3, User, Search
} from "lucide-react";

const AdminViewLand = () => {
  const [lands, setLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total_lands: 0, total_hectares: 0 });
  const [loading, setLoading] = useState(true);

  const fetchGlobalRegistry = async () => {
    try {
      // Path matches: app.use('/api/admin/farmers', adminFarmerRoutes)
      const res = await api.get("/admin/farmers/view-all");
      
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
      console.error("Admin Registry Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDropNode = async (id) => {
    if (window.confirm(`🛑 CRITICAL: DROP Land Node #${id} from the global registry?`)) {
      try {
        // Path matches router.delete('/land/:farmId/drop') under /admin/farmers
        await api.delete(`/admin/farmers/land/${id}/drop`);
        alert("NODE DROPPED SUCCESSFULLY");
        fetchGlobalRegistry();
      } catch (err) { 
        alert("DROP FAILED: Authority verification required."); 
      }
    }
  };

  useEffect(() => { fetchGlobalRegistry(); }, []);

  // Filter lands locally based on Search Term (Owner or Plot Name)
  const filteredLands = lands.filter(plot => 
    plot.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.plot_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={styles.loader}>
      <Loader2 className="animate-spin" size={40} color="#166534" /> 
      <span style={{marginTop: '15px'}}>SYNCING GLOBAL REGISTRY...</span>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* HEADER & SEARCH SECTION */}
      <div style={styles.headerSection}>
        <div style={styles.titleArea}>
            <h1 style={styles.mainTitle}>GLOBAL LAND REGISTRY</h1>
            <p style={styles.subTitle}>Administrative Authority & Node Management</p>
        </div>

        <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input 
                type="text" 
                placeholder="Search by Farmer or Plot Name..." 
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
          <div style={styles.statText}><b>{stats.total_lands}</b> <p>TOTAL NODES</p></div>
        </div>
        <div style={styles.statBox}>
          <Ruler size={20} color="#166534" />
          <div style={styles.statText}><b>{stats.total_hectares}</b> <p>HECTARES</p></div>
        </div>
        <div style={styles.statBox}>
          <ShieldCheck size={20} color="#166534" />
          <div style={styles.statText}><b>VERIFIED</b> <p>REGISTRY</p></div>
        </div>
      </div>

      {/* LAND GRID */}
      <div style={styles.grid}>
        {filteredLands.map((plot) => (
          <div key={plot.id} style={styles.card}>
            <div style={{
              ...styles.banner, 
              backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`
            }}>
               <div style={styles.badge}><ShieldCheck size={14}/> ID: #00{plot.id}</div>
               
               <div style={styles.adminOverlay}>
                  <button onClick={() => handleDropNode(plot.id)} style={styles.dropBtn}>
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
              
              <div style={styles.loc}>
                <MapPin size={14}/> {plot.woreda}, {plot.region}
              </div>
              
              <div style={styles.soilInfo}>
                <div style={styles.soilPill}><b>SOIL:</b> {plot.soil_type_name}</div>
                <div style={styles.soilPill}><b>AREA:</b> {plot.area_size} Ha</div>
              </div>

              <div style={styles.assetSection}>
                <h4 style={styles.assetHeader}><Leaf size={16}/> PRIMARY ASSETS</h4>
                <div style={styles.assetContainer}>
                  {plot.crop_list?.length > 0 ? plot.crop_list.slice(0, 2).map((c, i) => (
                    <div key={i} style={styles.assetPill}>
                      <b>{c.crop_name}</b> <span>{c.quantity} Units</span>
                    </div>
                  )) : <span style={styles.none}>No crops registered</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '100px 5% 60px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  loader: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#166534' },
  headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  titleArea: { textAlign: 'left' },
  mainTitle: { fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0 },
  subTitle: { color: '#64748b', margin: '5px 0 0', fontSize: '14px' },
  searchWrapper: { position: 'relative', width: '100%', maxWidth: '400px' },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchInput: { width: '100%', padding: '12px 12px 12px 45px', borderRadius: '15px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
  statsHeader: { display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'center' },
  statBox: { background: 'white', padding: '15px 30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' },
  statText: { lineHeight: '1', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px' },
  card: { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
  banner: { height: '180px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '15px', left: '15px', background: 'white', padding: '5px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', color: '#166534' },
  adminOverlay: { position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' },
  dropBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex' },
  editBtn: { background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex' },
  content: { padding: '25px' },
  title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 5px' },
  ownerInfo: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#166534', marginBottom: '5px' },
  loc: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', fontWeight: '600' },
  soilInfo: { display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '15px 0' },
  soilPill: { background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', color: '#475569', fontWeight: '700' },
  assetHeader: { fontSize: '12px', fontWeight: '900', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  assetContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  assetPill: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '10px', fontSize: '10px', display: 'flex', flexDirection: 'column' },
  none: { fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }
};

export default AdminViewLand;
