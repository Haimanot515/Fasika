import React, { useEffect, useState } from "react";
import api from "../api/axios"; 
import { 
  FaLightbulb, FaCloudSun, FaExclamationTriangle, FaSeedling, 
  FaCalendarAlt, FaChevronRight 
} from "react-icons/fa";

const AdvisoryBoard = () => {
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time] = useState(new Date());

  // --- LOGIC PRESERVED: Fetching from Backend ---
  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
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

  const getCategoryIcon = (cat) => {
    const c = cat?.toLowerCase();
    if (c?.includes("weather")) return <FaCloudSun />;
    if (c?.includes("pest") || c?.includes("warning")) return <FaExclamationTriangle />;
    return <FaSeedling />;
  };

  const theme = {
    primary: "#064e3b",
    accent: "#10b981",
    warning: "#ef4444",
    glass: "rgba(255, 255, 255, 0.95)",
    border: "rgba(0, 0, 0, 0.05)"
  };

  if (loading) return (
    <div style={{ background: "#ffffff", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <h2 style={{ color: theme.primary, letterSpacing: "5px", fontWeight: "900" }}>SYNCHRONIZING ADVISORY NODES...</h2>
    </div>
  );

  return (
    <div style={containerStyle}>
      <style>
        {`
          body, html { margin: 0; padding: 0; background: #ffffff; scroll-behavior: smooth; overflow-x: hidden; }
          .log-section { 
            background: ${theme.glass}; 
            padding: 120px 100px; 
            border-bottom: 1px solid ${theme.border}; 
            width: 100%; 
            box-sizing: border-box; 
            min-height: 60vh; 
            display: flex;
            align-items: center;
            position: relative;
            transition: background 0.4s ease;
          }
          .log-section:hover { background: #fafafa; }
          .priority-line {
            position: absolute; left: 0; top: 0; bottom: 0; width: 8px;
          }
          .icon-watermark {
            position: absolute; right: 100px; font-size: 280px; opacity: 0.03; color: ${theme.primary}; z-index: 0;
          }
        `}
      </style>

      {/* SIDEBAR (Identical to Support/Farmer Dashboard) */}
      <div style={sidebarStyle}>
        <div style={{ color: "white", fontWeight: "900", fontSize: "20px", transform: "rotate(-90deg)", marginBottom: "50px", letterSpacing: "5px" }}>FASIKA</div>
      </div>

      {/* HERO HEADER - WHITE BACKGROUND STYLE */}
      <header style={headerStyle}>
        <div>
          <span style={tagStyle}>AGRONOMIC INTELLIGENCE // 2026</span>
          <h1 style={titleStyle}>Farmer Advisory Board</h1>
          <p style={{ color: "#64748b", fontSize: "18px", marginTop: "15px", fontWeight: "500" }}>Real-time agricultural insights and satellite-based growth protocols.</p>
        </div>
        <div style={{ textAlign: "right", color: theme.primary }}>
          <div style={{ fontSize: "56px", fontWeight: "900" }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ fontSize: "14px", fontWeight: "800", opacity: 0.7, letterSpacing: "2px" }}>ADVISORY_STREAM_ACTIVE</div>
        </div>
      </header>

      {/* ADVISORY LIST (Vertical Flex Column) */}
      <main style={{ width: "100%" }}>
        {advices.length > 0 ? (
          advices.map((tip, index) => (
            <section key={tip.id} className="log-section">
              <div className="priority-line" style={{ background: tip.priority === "high" ? theme.warning : theme.accent }} />
              <div className="icon-watermark">{getCategoryIcon(tip.category)}</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: "900px" }}>
                  <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: tip.priority === "high" ? theme.warning : theme.accent, letterSpacing: "5px" }}>
                      {tip.category.toUpperCase()} // ADVISORY_0{index + 1}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700" }}>
                      <FaCalendarAlt /> {new Date(tip.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 style={{ fontSize: "72px", fontWeight: "900", color: theme.primary, margin: "0 0 25px 0", letterSpacing: "-3px", lineHeight: "1" }}>
                    {tip.title}
                  </h2>

                  <p style={{ fontSize: "26px", lineHeight: "1.6", color: "#334155", fontWeight: "400", marginBottom: "40px" }}>
                    {tip.message}
                  </p>

                  <button style={actionBtnStyle}>
                    EXECUTE PROTOCOL <FaChevronRight size={12} style={{ marginLeft: "10px" }} />
                  </button>
                </div>

                <div style={{ textAlign: "right", opacity: 0.05, fontSize: "180px", fontWeight: "900", color: theme.primary }}>
                  {index + 1}
                </div>
              </div>
            </section>
          ))
        ) : (
          <div style={{ padding: "200px", textAlign: "center", fontSize: "24px", color: "#94a3b8", fontWeight: "700" }}>
            NO ACTIVE ADVISORIES IN REGISTRY.
          </div>
        )}
      </main>

      <footer style={footerStyle}>
        <div style={{ fontSize: "32px", fontWeight: "900", color: "white", letterSpacing: "5px" }}>🌿 FASIKA ADVISORY NETWORK</div>
        <p style={{ fontSize: "12px", color: "white", opacity: 0.6, marginTop: "20px", letterSpacing: "3px" }}>
          CORE ADVISORY NODE // DATA REFRESHED EVERY 60S
        </p>
      </footer>
    </div>
  );
};

// ──────────────── STYLES (Identical Level to Support Page) ────────────────

const containerStyle = { marginLeft: "70px", minHeight: "100vh", fontFamily: "'Inter', sans-serif", position: "relative", width: "calc(100% - 70px)" };
const sidebarStyle = { position: "fixed", left: 0, top: 0, bottom: 0, width: "70px", background: "#064e3b", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: "50px" };
const headerStyle = { padding: "150px 100px 100px 100px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", background: "#ffffff", borderBottom: "1px solid #f0f0f0", boxSizing: "border-box" };
const tagStyle = { fontSize: "13px", fontWeight: "900", color: "#ffffff", background: "#064e3b", padding: "8px 20px", borderRadius: "0px", letterSpacing: "6px" };
const titleStyle = { fontSize: "80px", fontWeight: "900", margin: "25px 0 0 0", color: "#064e3b", letterSpacing: "-4px" };
const footerStyle = { padding: "120px 0", textAlign: "center", background: "#064e3b" };
const actionBtnStyle = { background: "none", border: "2px solid #064e3b", color: "#064e3b", padding: "14px 35px", fontSize: "14px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", letterSpacing: "2px" };

export default AdvisoryBoard;
