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
        const res = await api.get("/farmer/support/resources");
        setResources(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch support data");
      } finally {
        setLoading(false);
      }
    };
    fetchSupport();
  }, []);

  // Updated Icon Mapper for dynamic categories
  const getIcon = (type) => {
    switch(type) {
      case 'legal': return <FaGavel />;         // Disputes & Rules
      case 'finance': return <FaHandHoldingUsd />; // Payments
      case 'weather': return <FaCloudSun />;     // Climate help
      case 'storage': return <FaWarehouse />;    // Post-harvest
      case 'tools': return <FaTools />;          // App technical help
      default: return <FaHeadset />;             // General Support
    }
  };

  if (loading) return (
    <div style={styles.loader}>
      <div style={styles.spinner}></div>
      <p>Fetching DROP Resources...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <FaLifeRing size={50} color="#10b981" />
        <h1 style={styles.heroTitle}>Farmer Support Hub</h1>
        <p style={styles.heroSubtitle}>Dynamic resources fetched from the Fasika DROP Registry.</p>
      </section>

      <div style={styles.grid}>
        {resources.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.iconContainer}>
              {getIcon(item.icon_type)}
            </div>
            <div style={styles.category}>{item.category}</div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardContent}>{item.content}</p>
            <button style={styles.btn}>
              Read Guide <FaChevronRight size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- INLINE CSS ---
const styles = {
  container: { padding: "40px", background: "#f8fafc", minHeight: "100vh" },
  hero: { textAlign: "center", marginBottom: "50px" },
  heroTitle: { fontSize: "2.5rem", fontWeight: "800", color: "#1e293b", margin: "10px 0" },
  heroSubtitle: { color: "#64748b", fontSize: "1.1rem" },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
    gap: "25px", maxWidth: "1200px", margin: "0 auto" 
  },
  card: { 
    background: "#fff", padding: "30px", borderRadius: "16px", 
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
    display: "flex", flexDirection: "column", transition: "transform 0.2s"
  },
  iconContainer: { color: "#10b981", fontSize: "35px", marginBottom: "15px" },
  category: { color: "#10b981", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" },
  cardTitle: { fontSize: "1.25rem", color: "#1e293b", margin: "10px 0", fontWeight: "700" },
  cardContent: { color: "#64748b", lineHeight: "1.6", fontSize: "0.95rem", flex: 1 },
  btn: { 
    marginTop: "20px", background: "none", border: "none", 
    color: "#2563eb", fontWeight: "700", cursor: "pointer", 
    display: "flex", alignItems: "center", gap: "5px", padding: 0 
  },
  loader: { 
    textAlign: "center", marginTop: "100px", color: "#64748b",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"
  },
  spinner: {
    width: "40px", height: "40px", border: "4px solid #e2e8f0",
    borderTop: "4px solid #10b981", borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

export default SupportPage;
