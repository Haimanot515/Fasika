import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { 
  FaHeadset, FaGavel, FaCloudSun, 
  FaHandHoldingUsd, FaChevronRight, FaLifeRing,
  FaWarehouse, FaTools 
} from "react-icons/fa";

const SupportPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  // --- LOGIC PRESERVED: Fetching from DROP Backend ---
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

  const theme = {
    primary: "#064e3b",
    accent: "#10b981",
    glass: "rgba(255, 255, 255, 0.95)", // High opacity white glass
    blur: "blur(20px)",
    border: "rgba(0, 0, 0, 0.05)"
  };

  if (loading) return (
    <div style={{ background: "#f4f7f6", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <h2 style={{ color: theme.primary, letterSpacing: "5px" }}>LOADING DROP RESOURCES...</h2>
    </div>
  );

  return (
    <div style={containerStyle}>
      <style>
        {`
          body, html { margin: 0; padding: 0; background: #f4f7f6; scroll-behavior: smooth; overflow-x: hidden; }
          .glass-card { 
            background: ${theme.glass}; 
            backdrop-filter: ${theme.blur}; 
            padding: 120px 100px; 
            border-bottom: 1px solid ${theme.border}; 
            width: 100%; 
            box-sizing: border-box; 
            min-height: 70vh; 
            display: flex;
            align-items: center;
            transition: background 0.4s ease;
          }
          .glass-card:hover { background: #ffffff; }
          .stat-badge {
            background: ${theme.primary}; color: white; padding: 12px 24px;
            border-radius: 4px; font-weight: 900; font-size: 13px; margin-right: 15px;
            letter-spacing: 2px; text-transform: uppercase;
          }
          .icon-bg {
            position: absolute; right: 100px; font-size: 250px; opacity: 0.03; color: ${theme.primary}; z-index: 0;
          }
        `}
      </style>

      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <div style={{ color: "white", fontWeight: "900", fontSize: "20px", transform: "rotate(-90deg)", marginBottom: "50px", letterSpacing: "5px" }}>FASIKA</div>
      </div>

      {/* HEADER SECTION */}
      <header style={headerStyle}>
        <div>
          <span style={tagStyle}>FASIKA REGISTRY SUPPORT</span>
          <h1 style={titleStyle}>Farmer Support Hub</h1>
        </div>
        <div style={{ textAlign: "right", color: "white" }}>
          <div style={{ fontSize: "56px", fontWeight: "900" }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ fontSize: "16px", fontWeight: "800", opacity: 0.9 }}>LIVE DROP DATABASE CONNECTED</div>
        </div>
      </header>

      {/* VERTICAL LIST OF RESOURCES */}
      <main style={{ width: "100%" }}>
        {resources.map((item, index) => (
          <section key={item.id} className="glass-card" style={{ position: "relative" }}>
            <div className="icon-bg">{getIcon(item.icon_type)}</div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", position: "relative", zIndex: 1 }}>
              <div style={{ maxWidth: "850px" }}>
                <span style={{ fontSize: "14px", fontWeight: "900", color: theme.accent, letterSpacing: "5px", textTransform: "uppercase" }}>
                  {item.category} // MODULE 0{index + 1}
                </span>
                
                <div style={{ display: "flex", alignItems: "center", gap: "25px", margin: "20px 0" }}>
                  <div style={{ fontSize: "50px", color: theme.primary }}>{getIcon(item.icon_type)}</div>
                  <h2 style={{ fontSize: "72px", fontWeight: "900", color: theme.primary, margin: 0, letterSpacing: "-3px" }}>
                    {item.title}
                  </h2>
                </div>

                <p style={{ fontSize: "24px", lineHeight: "1.7", color: "#334155", fontWeight: "400", marginBottom: "40px", maxWidth: "800px" }}>
                  {item.content}
                </p>

                <div style={{ display: "flex", alignItems: "center" }}>
                   <div className="stat-badge">Source: DROP Registry</div>
                   <button style={actionBtnStyle}>
                     OPEN FULL GUIDE <FaChevronRight size={12} style={{ marginLeft: "10px" }} />
                   </button>
                </div>
              </div>
              
              <div style={{ textAlign: "right", opacity: 0.05, fontSize: "180px", fontWeight: "900", color: theme.primary }}>
                {index + 1}
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer style={footerStyle}>
        <div style={{ fontSize: "32px", fontWeight: "900", color: "white", letterSpacing: "5px" }}>🌿 FASIKA KNOWLEDGE BASE</div>
        <p style={{ fontSize: "14px", color: "white", letterSpacing: "4px", marginTop: "20px", opacity: 0.7 }}>
          ECOSYSTEM PROTOCOL // VERSION 8.4.1 // SECURE DATA STREAM
        </p>
      </footer>
    </div>
  );
};

// ──────────────── STYLES ────────────────

const containerStyle = { 
  marginLeft: "70px", 
  minHeight: "100vh", 
  fontFamily: "'Inter', sans-serif", 
  position: "relative", 
  width: "calc(100% - 70px)" 
};

const sidebarStyle = { 
  position: "fixed", left: 0, top: 0, bottom: 0, width: "70px", 
  background: "#064e3b", zIndex: 1000, display: "flex", 
  flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: "50px" 
};

const headerStyle = { 
  padding: "150px 100px 100px 100px", display: "flex", 
  justifyContent: "space-between", alignItems: "flex-end", 
  background: "linear-gradient(to bottom, #064e3b, #0d9488)", boxSizing: "border-box" 
};

const tagStyle = { 
  fontSize: "14px", fontWeight: "900", color: "#ffffff", 
  background: "rgba(0, 0, 0, 0.3)", padding: "8px 24px", 
  borderRadius: "0px", letterSpacing: "8px" 
};

const titleStyle = { 
  fontSize: "90px", fontWeight: "900", margin: "30px 0 0 0", 
  color: "#ffffff", letterSpacing: "-5px", textShadow: "0 10px 30px rgba(0,0,0,0.2)" 
};

const footerStyle = { padding: "120px 0", textAlign: "center", background: "#064e3b" };

const actionBtnStyle = {
  background: "none", border: "2px solid #064e3b", color: "#064e3b", 
  padding: "12px 30px", fontSize: "14px", fontWeight: "900", 
  cursor: "pointer", display: "flex", alignItems: "center", letterSpacing: "2px"
};

export default SupportPage;
