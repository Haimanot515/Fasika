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
      /**
       * PATH LOGIC:
       * Server mounting: /api/admin/farmers
       * Router path: /view-all
       * Result: /admin/farmers/view-all
       */
      const res = await api.get("/admin/farmers/view-all");
      
      if (res.data.success) {
        const data = res.data.data || [];
        setLands(data);
        const totalH = data.reduce((acc, curr) => acc + parseFloat(curr.area_size || 0), 0);
        setStats({ total_lands: data.length, total_hectares: totalH.toFixed(2) });
      }
    } catch (err) { 
      console.error("Admin Sync Error:", err); 
    } finally { setLoading(false); }
  };

  const handleDropNode = async (id) => {
    if (window.confirm(`🛑 DROP Node #${id} permanently?`)) {
      try {
        /**
         * PATH LOGIC:
         * Server: /api/admin/farmers
         * Router: /land/:farmId/drop
         */
        await api.delete(`/admin/farmers/land/${id}/drop`);
        alert("NODE DROPPED");
        fetchGlobalRegistry();
      } catch (err) { alert("DROP Failed"); }
    }
  };

  useEffect(() => { fetchGlobalRegistry(); }, []);

  const filteredLands = lands.filter(p => 
    p.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.plot_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={styles.loader}><Loader2 className="animate-spin" /> SYNCING...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div>
            <h1 style={styles.mainTitle}>DROP REGISTRY AUTHORITY</h1>
            <p style={styles.subTitle}>Global Node Management</p>
        </div>
        <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input 
                type="text" 
                placeholder="Search Owner or Plot..." 
                style={styles.searchInput}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div style={styles.statsHeader}>
        <div style={styles.statBox}>
          <Layers size={20} color="#166534" />
          <div style={styles.statText}><b>{stats.total_lands}</b> <p>NODES</p></div>
        </div>
        <div style={styles.statBox}>
          <Ruler size={20} color="#166534" />
          <div style={styles.statText}><b>{stats.total_hectares}</b> <p>HA</p></div>
        </div>
      </div>

      <div style={styles.grid}>
        {filteredLands.map((plot) => (
          <div key={plot.id} style={styles.card}>
            <div style={{...styles.banner, backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`}}>
               <div style={styles.badge}><ShieldCheck size={12}/> NODE: {plot.id}</div>
               <div style={styles.adminOverlay}>
                  <button onClick={() => handleDropNode(plot.id)} style={styles.dropBtn}><Trash2 size={16} /></button>
               </div>
            </div>
            <div style={styles.content}>
              <h2 style={styles.title}>{plot.plot_name?.toUpperCase()}</h2>
              <div style={styles.ownerInfo}><User size={14}/> <b>{plot.owner_name}</b></div>
              <div style={styles.loc}><MapPin size={14}/> {plot.woreda}, {plot.region}</div>
              <div style={styles.soilInfo}>
                <div style={styles.soilPill}>{plot.soil_type_name}</div>
                <div style={styles.soilPill}>{plot.area_size} Ha</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '100px 5% 50px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', gap: '10px' },
  headerSection: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  mainTitle: { fontSize: '24px', fontWeight: '900', margin: 0 },
  subTitle: { fontSize: '13px', color: '#64748b' },
  searchWrapper: { position: 'relative', width: '300px' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchInput: { width: '100%', padding: '10px 10px 10px 40px', borderRadius: '12px', border: '1px solid #e2e8f0' },
  statsHeader: { display: 'flex', gap: '15px', marginBottom: '30px' },
  statBox: { background: 'white', padding: '15px 25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px' },
  statText: { fontSize: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
  card: { background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  banner: { height: '150px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', color: '#166534' },
  adminOverlay: { position: 'absolute', top: '10px', right: '10px' },
  dropBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
  content: { padding: '20px' },
  title: { fontSize: '18px', fontWeight: '800', margin: '0 0 5px' },
  ownerInfo: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#16a34a' },
  loc: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748b' },
  soilInfo: { display: 'flex', gap: '8px', marginTop: '12px' },
  soilPill: { background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }
};

export default AdminViewLand;
