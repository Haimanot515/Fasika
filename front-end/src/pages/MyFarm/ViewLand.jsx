import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
    ShieldCheck, MapPin, Leaf, Dog, Box, Ruler, Layers, Loader2, Thermometer
} from "lucide-react";

const ViewLand = () => {
  const [lands, setLands] = useState([]);
  const [stats, setStats] = useState({ total_lands: 0, total_animals: 0, total_hectares: 0 });
  const [loading, setLoading] = useState(true);

  const fetchRegistry = async () => {
    try {
      const [resD, resS] = await Promise.all([
        api.get("/farmer/farm/land/view-detailed"),
        api.get("/farmer/farm/land/stats")
      ]);
      setLands(resD.data.data || []);
      setStats(resS.data.stats || {});
    } catch (err) { console.error("Sync Error", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRegistry(); }, []);

  if (loading) return <div style={styles.loader}><Loader2 className="spin" /> SYNCING NODES...</div>;

  return (
    <div style={styles.container}>
      {/* GLOBAL STATS HEADER */}
      <div style={styles.statsHeader}>
        <div style={styles.statBox}>
          <Layers size={20} color="#166534" />
          <div style={styles.statText}><b>{stats.total_lands}</b> <p>PLOTS</p></div>
        </div>
        <div style={styles.statBox}>
          <Ruler size={20} color="#166534" />
          <div style={styles.statText}><b>{stats.total_hectares}</b> <p>HECTARES</p></div>
        </div>
        <div style={styles.statBox}>
          <Dog size={20} color="#166534" />
          <div style={styles.statText}><b>{stats.total_animals}</b> <p>LIVESTOCK</p></div>
        </div>
      </div>

      <div style={styles.grid}>
        {lands.map((plot) => (
          <div key={plot.id} style={styles.card}>
            <div style={{...styles.banner, backgroundImage: `url(${plot.land_image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'})`}}>
               <div style={styles.badge}><ShieldCheck size={14}/> ID: #00{plot.id}</div>
            </div>

            <div style={styles.content}>
              <h2 style={styles.title}>{plot.plot_name.toUpperCase()}</h2>
              <div style={styles.loc}><MapPin size={14}/> {plot.woreda}, {plot.region}</div>
              
              <div style={styles.soilInfo}>
                <div style={styles.soilPill}><b>SOIL:</b> {plot.soil_type_name} ({plot.texture_category})</div>
                <div style={styles.soilPill}><b>ZONE:</b> {plot.climate_zone}</div>
              </div>

              {/* DYNAMIC ASSET LISTS */}
              <div style={styles.assetSection}>
                <h4 style={styles.assetHeader}><Leaf size={16}/> REGISTERED CROPS ({plot.crop_count})</h4>
                <div style={styles.assetContainer}>
                  {plot.crop_list.length > 0 ? plot.crop_list.map((c, i) => (
                    <div key={i} style={styles.assetPill}>
                      <b>{c.crop_name}</b> <span>{c.crop_variety || 'Standard'}</span> <i>{c.quantity} Units</i>
                    </div>
                  )) : <span style={styles.none}>No crops in this node</span>}
                </div>

                <h4 style={{...styles.assetHeader, marginTop: '20px'}}><Dog size={16}/> LIVESTOCK ({plot.animal_count})</h4>
                <div style={styles.assetContainer}>
                  {plot.animal_list.length > 0 ? plot.animal_list.map((a, i) => (
                    <div key={i} style={styles.assetPill}>
                      <b>{a.animal_type}</b> <span style={{color: '#16a34a'}}>{a.health_status}</span> <i>{a.head_count} Head</i>
                    </div>
                  )) : <span style={styles.none}>No animals in this node</span>}
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
  statText: { lineHeight: '1' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' },
  card: { background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
  banner: { height: '200px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  badge: { position: 'absolute', top: '15px', left: '15px', background: 'white', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', color: '#166534' },
  content: { padding: '25px' },
  title: { fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 5px' },
  loc: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', fontWeight: '600' },
  soilInfo: { display: 'flex', gap: '10px', margin: '20px 0' },
  soilPill: { background: '#f1f5f9', padding: '8px 15px', borderRadius: '10px', fontSize: '12px', color: '#475569' },
  assetHeader: { fontSize: '13px', fontWeight: '900', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  assetContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  assetPill: { background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', minWidth: '120px' },
  none: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }
};

export default ViewLand;
