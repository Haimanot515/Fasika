import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { 
  FaBell, FaCheckCircle, FaExclamationCircle, 
  FaInfoCircle, FaEnvelopeOpen, FaChevronRight, 
  FaHistory, FaBroom 
} from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time] = useState(new Date());

  // --- LOGIC PRESERVED: Fetching from Backend ---
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/farmer/notifications");
        setNotifications(data.data || []);
      } catch (err) {
        console.error("Notification Stream Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getStatusIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'urgent': return <FaExclamationCircle />;
      case 'success': return <FaCheckCircle />;
      case 'message': return <FaEnvelopeOpen />;
      default: return <FaInfoCircle />;
    }
  };

  const theme = {
    primary: "#064e3b",
    accent: "#10b981",
    urgent: "#b91c1c",
    glass: "rgba(255, 255, 255, 0.95)",
    border: "rgba(0, 0, 0, 0.05)"
  };

  if (loading) return (
    <div style={{ background: "#ffffff", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <h2 style={{ color: theme.primary, letterSpacing: "5px", fontWeight: "900" }}>CONNECTING TO NOTIFICATION HUB...</h2>
    </div>
  );

  return (
    <div style={containerStyle}>
      <style>
        {`
          body, html { margin: 0; padding: 0; background: #ffffff; scroll-behavior: smooth; overflow-x: hidden; }
          .notif-section { 
            background: ${theme.glass}; 
            padding: 120px 100px; 
            border-bottom: 1px solid ${theme.border}; 
            width: 100%; 
            box-sizing: border-box; 
            min-height: 50vh; 
            display: flex;
            align-items: center;
            position: relative;
            transition: all 0.4s ease;
          }
          .notif-section:hover { background: #fafafa; }
          .status-bar {
            position: absolute; left: 0; top: 0; bottom: 0; width: 10px;
          }
          .notif-watermark {
            position: absolute; right: 100px; font-size: 300px; opacity: 0.02; color: ${theme.primary}; z-index: 0;
          }
        `}
      </style>

      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <div style={{ color: "white", fontWeight: "900", fontSize: "20px", transform: "rotate(-90deg)", marginBottom: "50px", letterSpacing: "5px" }}>FASIKA</div>
      </div>

      {/* HERO HEADER - PURE WHITE */}
      <header style={headerStyle}>
        <div>
          <span style={tagStyle}>SYSTEM ALERTS // REGISTRY LOG</span>
          <h1 style={titleStyle}>Notifications</h1>
          <p style={{ color: "#64748b", fontSize: "18px", marginTop: "15px", fontWeight: "500" }}>
            Real-time synchronization of your trade, climate, and security alerts.
          </p>
        </div>
        <div style={{ textAlign: "right", color: theme.primary }}>
          <div style={{ fontSize: "56px", fontWeight: "900" }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ fontSize: "14px", fontWeight: "800", opacity: 0.7, letterSpacing: "2px" }}>ENCRYPTED_STREAM_LIVE</div>
        </div>
      </header>

      {/* NOTIFICATION LOG (Vertical Flex Column) */}
      <main style={{ width: "100%" }}>
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <section key={notif.id} className="notif-section">
              <div className="status-bar" style={{ background: notif.type === 'urgent' ? theme.urgent : theme.accent }} />
              <div className="notif-watermark">{getStatusIcon(notif.type)}</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: "900px" }}>
                  <div style={{ display: "flex", gap: "25px", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ fontSize: "32px", color: notif.type === 'urgent' ? theme.urgent : theme.primary }}>
                      {getStatusIcon(notif.type)}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: notif.type === 'urgent' ? theme.urgent : theme.accent, letterSpacing: "5px" }}>
                      {notif.type?.toUpperCase()} // SIGNAL_{notif.id}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700" }}>
                      <FaHistory /> {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>

                  <h2 style={{ fontSize: "72px", fontWeight: "900", color: theme.primary, margin: "0 0 25px 0", letterSpacing: "-3px", lineHeight: "1.1" }}>
                    {notif.title}
                  </h2>

                  <p style={{ fontSize: "26px", lineHeight: "1.6", color: "#334155", fontWeight: "400", marginBottom: "40px" }}>
                    {notif.message}
                  </p>

                  <div style={{ display: "flex", gap: "20px" }}>
                    <button style={actionBtnStyle}>
                      ACKNOWLEDGE RECEIPT <FaChevronRight size={12} style={{ marginLeft: "10px" }} />
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: "right", opacity: 0.05, fontSize: "180px", fontWeight: "900", color: theme.primary }}>
                  {index + 1}
                </div>
              </div>
            </section>
          ))
        ) : (
          <div style={{ padding: "200px", textAlign: "center" }}>
            <FaBroom size={50} color="#e2e8f0" style={{ marginBottom: "20px" }} />
            <div style={{ fontSize: "24px", color: "#94a3b8", fontWeight: "700" }}>YOUR REGISTRY IS CURRENTLY CLEAR.</div>
          </div>
        )}
      </main>

      <footer style={footerStyle}>
        <div style={{ fontSize: "32px", fontWeight: "900", color: "white", letterSpacing: "5px" }}>🌿 FASIKA SECURITY & LOGS</div>
        <p style={{ fontSize: "12px", color: "white", opacity: 0.6, marginTop: "20px", letterSpacing: "3px" }}>
          SIGNAL NODE // ESTABLISHED 2026 // ADDIS ABABA CLUSTER
        </p>
      </footer>
    </div>
  );
};

// ──────────────── STYLES (Synchronized with Support & Advisory) ────────────────

const containerStyle = { marginLeft: "70px", minHeight: "100vh", fontFamily: "'Inter', sans-serif", position: "relative", width: "calc(100% - 70px)" };
const sidebarStyle = { position: "fixed", left: 0, top: 0, bottom: 0, width: "70px", background: "#064e3b", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: "50px" };
const headerStyle = { padding: "150px 100px 100px 100px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", background: "#ffffff", borderBottom: "1px solid #f0f0f0", boxSizing: "border-box" };
const tagStyle = { fontSize: "13px", fontWeight: "900", color: "#ffffff", background: "#064e3b", padding: "8px 20px", borderRadius: "0px", letterSpacing: "6px" };
const titleStyle = { fontSize: "90px", fontWeight: "900", margin: "25px 0 0 0", color: "#064e3b", letterSpacing: "-5px" };
const footerStyle = { padding: "120px 0", textAlign: "center", background: "#064e3b" };
const actionBtnStyle = { background: "none", border: "2px solid #064e3b", color: "#064e3b", padding: "14px 35px", fontSize: "14px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", letterSpacing: "2px" };

export default NotificationsPage;
