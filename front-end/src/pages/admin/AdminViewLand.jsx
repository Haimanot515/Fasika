import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
    ShieldCheck, MapPin, Leaf, Ruler, Layers, Loader2, Trash2, Edit3, User
} from "lucide-react";

const AdminViewLand = () => {
  const [lands, setLands] = useState([]);
  const [stats, setStats] = useState({ total_lands: 0, total_hectares: 0 });
  const [loading, setLoading] = useState(true);

  const fetchGlobalRegistry = async () => {
    try {
      /** * FIXED: Path adjusted to match server.js mounting: 
       * app.use('/api/admin/farmers', adminFarmerRoutes)
       */
      const res = await api.get("/admin/farmers/view-all");
      
      if (res.data.success) {
        const data = res.data.data || [];
        setLands(data);
        
        // Local calculation for global stats
        const totalHectares = data.reduce((acc, curr) => acc + parseFloat(curr.area_size || 0), 0);
        setStats({
          total_lands: data.length,
          total_hectares: totalHectares.toFixed(2)
        });
      }
    } catch (err) { 
      console.error("Admin Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDropNode = async (id) => {
    if (window.confirm(`⚠️ AUTHORITY ALERT: DROP Land Node #${id} permanently from registry?`)) {
      try {
        // FIXED: Path adjusted to match backend router mounting
        await api.delete(`/admin/farmers/land/${id}/drop`);
        alert("Registry Node DROPPED");
        fetchGlobalRegistry();
      } catch (err) { 
        alert("Operation Failed: Node could not be dropped."); 
      }
    }
  };

  useEffect(() => { fetchGlobalRegistry(); }, []);

  if (loading) return (
    <div style={styles.loader}>
      <Loader2 className="animate-spin" size={32} /> 
      SYNCING GLOBAL REGISTRY...
    </div>
  );

  return (
    <div style={styles.container}>
      {/* GLOBAL ADMIN STATS */}
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
          <div style={styles.statText}><b>ADMIN</b> <p>AUTHORITY</p></div>
        </div>
      </div>

      <div style={styles.grid}>
        {lands.map((plot) => (
          <div key={plot.id} style={styles.card}>
            {/* Banner with Background Image */}
            <div style={{
              ...styles.banner, 
              backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`
            }}>
               <div style={styles.badge}><ShieldCheck size={14}/> NODE: #00{plot.id}</div>
               
               {/* ADMIN ACTION OVERLAY */}
               <div style={styles.adminOverlay}>
                  <button onClick={() => handleDropNode(plot.id)} style={styles.dropBtn} title="DROP RECORD">
                    <Trash2 size={16} />
                  </button>
                  <button style={styles.editBtn} title="EDIT REGISTRY">
                    <Edit3 size={16} />
                  </button>
               </div>
            </div>

            <div style={styles.content}>
              <h2 style={styles.title}>{plot.plot_name?.toUpperCase() || "UNNAMED PLOT"}</h2>
              
              <div style={styles.ownerInfo}>
                <User size={14} color="#16a34a"/> <b>Owner:</b> {plot.owner_name || "Unknown Farmer"}
              </div>
              
              <div style={styles.loc}>
                <MapPin size={14}/> {plot.woreda || "N/A"}, {plot.region || "N/A"}
              </div>
              
              <div style={styles.soilInfo}>
                <div style={styles.soilPill}><b>SOIL:</b> {plot.soil_type_name}</div>
                <div style={styles.soilPill}><b>ZONE:</b> {plot.climate_zone}</div>
                <div style={styles.soilPill}><b>AREA:</b> {plot.area_size} Ha</div>
              </div>

              {/* ASSETS SUMMARY */}
              <div style={styles.assetSection}>
                <h4 style={styles.assetHeader}><Leaf size={16}/> PRIMARY CROPS</h4>
                <div style={styles.assetContainer}>
                  {plot.crop_list?.length > 0 ? plot.crop_list.slice(0, 3).map((c, i) => (
                    <div key={i} style={styles.assetPill}>
                      <b>{c.crop_name}</b> <span>{c.quantity} Units</span>
                    </div>
                  )) : <span style={styles.none}>No crops registered in this node</span>}
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
  container: { padding: '120px 5% 60px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#166534', gap: '10px' },
  statsHeader: { display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'center' },
  statBox: { background: 'white', padding: '15px 30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' },
  statText: { lineHeight: '1', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' },
  card: { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
  banner: { height: '180px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '15px', left: '15px', background: 'white', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', color: '#166534', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  adminOverlay: { position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' },
  dropBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  editBtn: { background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  content: { padding: '25px' },
  title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 5px' },
  ownerInfo: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#166534', marginBottom: '5px' },
  loc: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', fontWeight: '600' },
  soilInfo: { display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '15px 0' },
  soilPill: { background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', color: '#475569', fontWeight: '700' },
  assetHeader: { fontSize: '12px', fontWeight: '900', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' },
  assetContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  assetPill: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', display: 'flex', flexDirection: 'column' },
  none: { fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }
};

export default AdminViewLand;
