import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { ShieldCheck, MapPin, Leaf, Ruler, Layers, Loader2, Trash2, User } from "lucide-react";

const AdminViewLand = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGlobalRegistry = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get("/admin/farmers/view-all");
      
      // DEBUG LOGS
      console.log("SERVER RESPONSE:", res.data);

      if (res.data.success) {
        setLands(res.data.data || []);
      }
    } catch (err) { 
      console.error("ADMIN ERROR:", err.response?.data || err.message);
      // This helps you see if it's a 401 (Auth) or 404 (Path) error on screen
      setError(err.response?.data?.error || "Registry Connection Failed");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchGlobalRegistry(); }, []);

  if (loading) return <div style={styles.loader}><Loader2 className="animate-spin" /> SYNCING REGISTRY...</div>;

  if (error) return (
    <div style={styles.errorContainer}>
      <h2>🚫 {error}</h2>
      <p>Please ensure you are logged in as an Admin.</p>
      <button onClick={() => window.location.reload()} style={styles.retryBtn}>RETRY SYNC</button>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.statsHeader}>
        <div style={styles.statBox}>
          <Layers size={20} color="#166534" />
          <div style={styles.statText}><b>{lands.length}</b> <p>TOTAL NODES</p></div>
        </div>
      </div>

      {lands.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>NO LAND DATA FOUND</h3>
          <p>The DROP registry is currently empty.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {lands.map((plot) => (
            <div key={plot.id} style={styles.card}>
              <div style={{...styles.banner, backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`}}>
                 <div style={styles.badge}><ShieldCheck size={12}/> NODE: {plot.id}</div>
              </div>
              <div style={styles.content}>
                <h2 style={styles.title}>{plot.plot_name?.toUpperCase() || "UNNAMED"}</h2>
                <div style={styles.ownerInfo}><User size={14}/> <b>{plot.owner_name}</b></div>
                <div style={styles.loc}><MapPin size={14}/> {plot.woreda}, {plot.region}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '120px 5% 50px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', gap: '10px', fontWeight: 'bold' },
  errorContainer: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ef4444' },
  retryBtn: { marginTop: '20px', padding: '10px 20px', background: '#166534', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  statsHeader: { display: 'flex', gap: '20px', marginBottom: '30px' },
  statBox: { background: 'white', padding: '15px 25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' },
  statText: { lineHeight: '1', fontSize: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
  card: { background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  banner: { height: '160px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', color: '#166534' },
  content: { padding: '20px' },
  title: { fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: '0 0 5px' },
  ownerInfo: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#16a34a', marginBottom: '5px' },
  loc: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748b' },
  emptyState: { textAlign: 'center', padding: '100px', color: '#64748b' }
};

export default AdminViewLand;
