import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { 
  FaHeadset, FaGavel, FaCloudSun, 
  FaHandHoldingUsd, FaChevronRight, FaLifeRing,
  FaWarehouse, FaTools, FaDatabase
} from "react-icons/fa";

const SupportPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  // --- Logic Stays Exactly The Same ---
  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const res = await api.get("/farmer/support/resources");
        setResources(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch support data from DROP Registry");
      } finally {
        setLoading(false);
      }
    };
    fetchSupport();

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  // --- Shared Inline Styles from Admin Template ---
  const pageStyle = {
    marginTop: "78px",
    marginLeft: "70px",
    padding: "0 50px 100px 50px",
    background: "#f4f7f6",
    fontFamily: "'Inter', sans-serif",
    color: "#1e293b",
    overflowX: "hidden"
  };

  const glassCard = {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.02)",
    border: "1px solid #eef2f1",
  };

  const sectionLabel = {
    fontSize: "12px",
    fontWeight: "800",
    color: "#16a34a",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "15px",
    display: "block"
  };

  if (loading) return (
    <div style={{ ...pageStyle, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h2 style={{ color: "#16a34a" }}>🔄 SYNCHRONIZING WITH DROP REGISTRY...</h2>
    </div>
  );

  return (
    <div style={pageStyle}>
      <style>
        {`
          .hero-gradient { background: linear-gradient(135deg, #064e3b 0%, #16a34a 100%); }
          @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          .animate-reveal { animation: slideUp 0.8s ease-out forwards; }
          .scroll-indicator { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); animation: bounce 2s infinite; color: white; opacity: 0.6; }
          @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0) translateX(-50%);} 40% {transform: translateY(-10px) translateX(-50%);} 60% {transform: translateY(-5px) translateX(-50%);} }
        `}
      </style>

      {/* ──────────────── PAGE 1: SYSTEM SALUTATION ──────────────── */}
      <section style={{ minHeight: "95vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }} className="animate-reveal">
        <div className="hero-gradient" style={{ padding: "100px 80px", borderRadius: "40px", color: "white", position: "relative", boxShadow: "0 40px 80px rgba(22, 163, 74, 0.2)" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 25px", borderRadius: "50px", display: "inline-block", fontSize: "12px", fontWeight: "bold", marginBottom: "25px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
            🌐 FASIKA ECOSYSTEM: FARMER SUPPORT INTERFACE
          </div>
          <h1 style={{ fontSize: "72px", fontWeight: "900", margin: "0 0 20px 0", letterSpacing: "-3px", lineHeight: "1" }}>
            Farmer Support Hub<br/>Knowledge Base
          </h1>
          <p style={{ fontSize: "24px", opacity: 0.85, maxWidth: "750px", lineHeight: "1.6", fontWeight: "400" }}>
            Accessing dynamic resources from the DROP Registry. Your localized agricultural intelligence, logistics, and financial guides are fully synchronized.
          </p>
          
          <div style={{ marginTop: "60px", display: "flex", gap: "80px" }}>
            <div>
              <div style={{ fontSize: "42px", fontWeight: "800" }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ fontSize: "13px", opacity: 0.6, letterSpacing: "1px", textTransform: "uppercase" }}>Current System Time</div>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "80px" }}>
              <div style={{ fontSize: "42px", fontWeight: "800" }}>{resources.length}</div>
              <div style={{ fontSize: "13px", opacity: 0.6, letterSpacing: "1px", textTransform: "uppercase" }}>Active Resource Modules</div>
            </div>
          </div>
          <div className="scroll-indicator">▼ Scroll to Access Resources</div>
        </div>
      </section>

      {/* ──────────────── PAGE 2: DYNAMIC RESOURCE GRID ──────────────── */}
      <section style={{ minHeight: "100vh", padding: "120px 0" }}>
        <span style={sectionLabel}>Sector 01: Resource Modules</span>
        <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "60px", letterSpacing: "-1px" }}>Registry Documentation</h2>
        
        {/* Dynamic Grid using your original logic */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
          {resources.map((item) => (
            <div key={item.id} style={{ ...glassCard, transition: "transform 0.3s ease", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ color: "#16a34a", fontSize: "32px", marginBottom: "20px" }}>
                {getIcon(item.icon_type)}
              </div>
              <div style={{ fontSize: "11px", fontWeight: "900", color: "#16a34a", background: "#dcfce7", padding: "4px 12px", borderRadius: "50px", width: "fit-content", marginBottom: "15px", textTransform: "uppercase" }}>
                {item.category}
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "15px" }}>{item.title}</h3>
              <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6", marginBottom: "25px" }}>{item.content}</p>
              <div style={{ display: "flex", alignItems: "center", color: "#16a34a", fontWeight: "800", fontSize: "14px" }}>
                INITIALIZE GUIDE <FaChevronRight size={10} style={{ marginLeft: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── PAGE 3: SYSTEM INTEGRITY ──────────────── */}
      <section style={{ minHeight: "60vh", padding: "100px 0" }}>
        <span style={sectionLabel}>Sector 02: Support Status</span>
        <div style={{ ...glassCard, background: "#1e293b", color: "white", padding: "60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 10px 0" }}>Registry Integrity: 100%</h2>
            <p style={{ opacity: 0.6 }}>All support documentation is verified and digitally signed by Fasika Core Operations.</p>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
             <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#16a34a" }}>SECURE</div>
                <div style={{ fontSize: "11px", opacity: 0.5 }}>Connection Mode</div>
             </div>
             <FaDatabase size={40} color="#16a34a" />
          </div>
        </div>
      </section>

      <footer style={{ padding: "80px 0", textAlign: "center", borderTop: "1px solid #eef2f1" }}>
        <div style={{ fontSize: "20px", fontWeight: "900", color: "#16a34a", marginBottom: "10px" }}>🌿 Fasika Support Portal</div>
        <p style={{ fontSize: "12px", color: "#94a3b8", letterSpacing: "1px" }}>
          RESOURCE LAYER v2.1 // DATA SOURCE: DROP_REGISTRY<br/>
          © 2026 Fasika Agricultural Global Operations.
        </p>
      </footer>
    </div>
  );
};

export default SupportPage;
