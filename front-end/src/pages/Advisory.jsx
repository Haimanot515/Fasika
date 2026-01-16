import React, { useEffect, useState } from "react";
import api from "../api/axios"; 
import { 
  FaLightbulb, FaCloudSun, FaExclamationTriangle, FaSeedling, 
  FaCalendarAlt, FaChevronRight 
} from "react-icons/fa";

const AdvisoryBoard = () => {
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        // Points to your advisory endpoint (adjust URL as needed)
        const { data } = await api.get("/farmer/advisory");
        setAdvices(data.data || []);
      } catch (err) {
        console.error("Advisory Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisory();
  }, []);

  if (loading) return <div style={styles.loader}>🌱 Gathering expert advice...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}><FaLightbulb color="#fbbf24" /> Farmer Advisory Board</h2>
        <p style={styles.subtitle}>Real-time agricultural insights and weather-based tips</p>
      </div>

      <div style={styles.grid}>
        {advices.length > 0 ? (
          advices.map((tip) => (
            <div key={tip.id} style={styles.card}>
              <div style={styles.cardAccent(tip.priority)} />
              <div style={styles.content}>
                <div style={styles.meta}>
                  <span style={styles.categoryBadge}>
                    {getCategoryIcon(tip.category)} {tip.category}
                  </span>
                  <span style={styles.date}><FaCalendarAlt /> {new Date(tip.created_at).toLocaleDateString()}</span>
                </div>
                
                <h3 style={styles.tipTitle}>{tip.title}</h3>
                <p style={styles.tipText}>{tip.message}</p>
                
                <button style={styles.actionBtn}>
                  Read Details <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.empty}>No active advisories for your region right now.</div>
        )}
      </div>
    </div>
  );
};

// Helper to pick icons based on category text
const getCategoryIcon = (cat) => {
  const c = cat?.toLowerCase();
  if (c?.includes("weather")) return <FaCloudSun />;
  if (c?.includes("pest") || c?.includes("warning")) return <FaExclamationTriangle />;
  return <FaSeedling />;
};

const styles = {
  container: { padding: "30px", background: "#f8fafc", minHeight: "100vh" },
  header: { marginBottom: "25px" },
  title: { fontSize: "24px", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px", margin: 0 },
  subtitle: { color: "#64748b", margin: "5px 0 0 0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" },
  card: { 
    background: "#fff", borderRadius: "12px", overflow: "hidden", 
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0",
    position: "relative", display: "flex", flexDirection: "column"
  },
  cardAccent: (priority) => ({
    height: "4px", 
    width: "100%", 
    background: priority === "high" ? "#ef4444" : "#10b981" 
  }),
  content: { padding: "20px", flex: 1, display: "flex", flexDirection: "column" },
  meta: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  categoryBadge: { 
    background: "#f1f5f9", padding: "4px 10px", borderRadius: "20px", 
    fontSize: "12px", fontWeight: "600", color: "#475569", display: "flex", alignItems: "center", gap: "6px" 
  },
  date: { fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px" },
  tipTitle: { fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 10px 0" },
  tipText: { fontSize: "14px", color: "#475569", lineHeight: "1.6", margin: "0 0 20px 0" },
  actionBtn: { 
    marginTop: "auto", background: "none", border: "none", color: "#2563eb", 
    fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", 
    alignItems: "center", gap: "5px", padding: 0 
  },
  loader: { textAlign: "center", padding: "100px", color: "#10b981", fontWeight: "bold" },
  empty: { gridColumn: "1/-1", textAlign: "center", padding: "50px", color: "#94a3b8", background: "#fff", borderRadius: "12px" }
};

export default AdvisoryBoard;

