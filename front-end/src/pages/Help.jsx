import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  FaHeadset, FaGavel, FaCloudSun, 
  FaHandHoldingUsd, FaChevronRight, FaLifeRing,
  FaWarehouse, FaTools
} from "react-icons/fa";

const SupportPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupport = async () => {
      try {
        // Fetches from GET /api/farmer/support/resources
        const res = await api.get("/farmer/support/resources");
        setResources(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch support resources from DROP registry");
      } finally {
        setLoading(false);
      }
    };
    fetchSupport();
  }, []);

  // Professional Icon Mapping based on DB icon_type strings
  const getIcon = (type) => {
    switch(type) {
      case 'legal': return <FaGavel />;
      case 'finance': return <FaHandHoldingUsd />;
      case 'weather': return <FaCloudSun />;
      case 'storage': return <FaWarehouse />;
      case 'tools': return <FaTools />;
      default: return <FaHeadset />;
    }
  };

  if (loading) return (
    <div style={styles.loader}>
       <div style={styles.spinner}></div>
       <p>Syncing DROP Resources...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.iconCircle}>
          <FaLifeRing size={40} color="white" />
        </div>
        <h1 style={styles.heroTitle}>Farmer Support Hub</h1>
        <p style={styles.heroSubtitle}>
          Professional guides and ecosystem resources fetched from the Fasika DROP Registry.
        </p>
      </section>

      {/* DYNAMIC RESOURCES GRID */}
      <div style={styles.grid}>
        {resources.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.iconContainer}>
              {getIcon(item.icon_type)}
            </div>
            <div style={styles.categoryBadge}>{item.category}</div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardContent}>{item.content}</p>
            <button style={styles.btn}>
              Read Full Guide <FaChevronRight size={10} style={{ marginLeft: "5px" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { padding: "80px 20px", background: "#f8fafc", minHeight: "100vh" },
  hero: { textAlign: "center", marginBottom: "70px", display: "flex", flexDirection: "column", alignItems: "center" },
  iconCircle: {
    background: "#10b981", width: "80px", height: "80px", borderRadius: "24px",
    display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px",
    boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)"
  },
  heroTitle: { fontSize: "2.8rem", fontWeight: "900", color: "#0f172a", margin: 0 },
  heroSubtitle: { color: "#64748b", fontSize: "1.2rem", marginTop: "10px", maxWidth: "600px" },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
    gap: "30px", maxWidth: "1240px", margin: "0 auto" 
  },
  card: { 
    background: "#fff", padding: "40px", borderRadius: "24px", 
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0",
    display: "flex", flexDirection: "column", transition: "0.3s ease"
  },
  iconContainer: { color: "#10b981", fontSize: "38px", marginBottom: "20px" },
  categoryBadge: { 
    color: "#059669", background: "#dcfce7", fontSize: "11px", fontWeight: "800",
    padding: "4px 12px", borderRadius: "50px", width: "fit-content", textTransform: "uppercase"
  },
  cardTitle: { fontSize: "1.4rem", color: "#1e293b", margin: "15px 0 10px 0", fontWeight: "700" },
  cardContent: { color: "#475569", lineHeight: "1.7", fontSize: "1rem", flex: 1 },
  btn: { 
    marginTop: "30px", background: "none", border: "none", 
    color: "#2563eb", fontWeight: "800", cursor: "pointer", 
    display: "flex", alignItems: "center", padding: 0, fontSize: "0.95rem" 
  },
  loader: { textAlign: "center", marginTop: "150px", color: "#64748b" },
  spinner: {
    width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #10b981",
    borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px"
  }
};

export default SupportPage;
