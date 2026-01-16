import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { 
  FaHeadset, FaGavel, FaCloudSun, 
  FaHandHoldingUsd, FaChevronRight, FaLifeRing,
  FaWarehouse, FaTools, FaTerminal
} from "react-icons/fa";

const SupportPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timestamp] = useState(new Date().toLocaleDateString());

  // --- Logic Preserved: Fetching from Backend ---
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

  // --- Elite Styles: Long-Page "Log" Aesthetics ---
  const containerStyle = {
    marginTop: "78px",
    marginLeft: "70px",
    padding: "0 0 100px 0",
    background: "#0f172a", // Deep Midnight Dark Theme
    fontFamily: "'Inter', sans-serif",
    color: "#f8fafc",
    minHeight: "100vh"
  };

  const logRow = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "60px 100px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "background 0.3s ease"
  };

  if (loading) return (
    <div style={{ ...containerStyle, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p style={{ letterSpacing: "5px", color: "#16a34a" }}>INITIALIZING REGISTRY STREAM...</p>
    </div>
  );

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .log-entry { animation: fadeIn 0.6s ease-out forwards; }
          .glow-text { text-shadow: 0 0 20px rgba(22, 163, 74, 0.4); }
          .accent-line { width: 40px; height: 2px; background: #16a34a; margin-bottom: 20px; }
        `}
      </style>

      {/* ──────────────── HEADER: SYSTEM BROADCAST ──────────────── */}
      <header style={{ padding: "120px 100px", background: "radial-gradient(circle at top left, #064e3b 0%, #0f172a 50%)" }}>
        <div style={{ color: "#16a34a", fontWeight: "900", letterSpacing: "4px", fontSize: "12px", marginBottom: "20px" }}>
          FASIKA // SUPPORT_REGISTRY // v.2026
        </div>
        <h1 style={{ fontSize: "84px", fontWeight: "900", margin: 0, letterSpacing: "-4px" }} className="glow-text">
          Resources Log
        </h1>
        <p style={{ fontSize: "20px", color: "#94a3b8", maxWidth: "800px", marginTop: "20px", lineHeight: "1.6" }}>
          Automated documentation stream for the global agricultural network. 
          Real-time access to protocols, logistics, and trade governance modules.
        </p>
        <div style={{ marginTop: "40px", display: "flex", gap: "40px", fontSize: "14px", color: "#64748b" }}>
          <span>STATUS: <span style={{ color: "#16a34a" }}>ONLINE</span></span>
          <span>DATE: {timestamp}</span>
          <span>SOURCE: DROP_DB</span>
        </div>
      </header>

      {/* ──────────────── VERTICAL FLEX COLUMN LOG ──────────────── */}
      <main style={{ display: "flex", flexDirection: "column" }}>
        {resources.map((item, index) => (
          <section key={item.id} className="log-entry" style={{ ...logRow, animationDelay: `${index * 0.1}s` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ color: "#334155", fontWeight: "900", fontSize: "14px", fontFamily: "monospace" }}>
                ID: 00{item.id}
              </span>
              <div className="accent-line"></div>
            </div>

            <div style={{ display: "flex", gap: "60px", alignItems: "flex-start" }}>
              {/* Left Column: Icon & Category */}
              <div style={{ minWidth: "200px" }}>
                <div style={{ fontSize: "40px", color: "#16a34a", marginBottom: "10px" }}>
                  {getIcon(item.icon_type)}
                </div>
                <div style={{ fontSize: "12px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px" }}>
                  {item.category}
                </div>
              </div>

              {/* Right Column: Title & Content */}
              <div style={{ maxWidth: "800px" }}>
                <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#f8fafc", marginBottom: "15px" }}>
                  {item.title}
                </h2>
                <p style={{ fontSize: "18px", color: "#94a3b8", lineHeight: "1.8", marginBottom: "30px" }}>
                  {item.content}
                </p>
                <button 
                  style={{ 
                    background: "rgba(22, 163, 74, 0.1)", 
                    border: "1px solid #16a34a", 
                    color: "#16a34a", 
                    padding: "12px 25px", 
                    borderRadius: "4px", 
                    fontWeight: "bold", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  DECRYPT FULL DOCUMENT <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* ──────────────── FOOTER: END OF STREAM ──────────────── */}
      <footer style={{ padding: "100px", textAlign: "center", background: "#020617" }}>
        <FaTerminal size={30} color="#1e293b" style={{ marginBottom: "20px" }} />
        <div style={{ fontSize: "12px", color: "#334155", letterSpacing: "2px" }}>
          --- END OF REGISTRY DATA STREAM ---
        </div>
      </footer>
    </div>
  );
};

export default SupportPage;
