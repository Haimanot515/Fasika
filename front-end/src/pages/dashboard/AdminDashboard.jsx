import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [serverLoad, setServerLoad] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const loadInterval = setInterval(() => setServerLoad(Math.floor(Math.random() * (30 - 20 + 1) + 20)), 3000);
    return () => { clearInterval(timer); clearInterval(loadInterval); };
  }, []);

  // --- Shared Inline Styles ---
  const pageStyle = {
    marginTop: "78px",
    marginLeft: "70px",
    padding: "0 50px 100px 50px",
    background: "#f4f7f6",
    fontFamily: "'Inter', sans-serif",
    color: "#1e293b",
    overflowX: "hidden"
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

  const glassCard = {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.02)",
    border: "1px solid #eef2f1",
  };

  return (
    <div style={pageStyle}>
      <style>
        {`
          .sentence-case::first-letter { text-transform: uppercase; }
          .hero-gradient { background: linear-gradient(135deg, #064e3b 0%, #16a34a 100%); }
          @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          .animate-reveal { animation: slideUp 0.8s ease-out forwards; }
          .scroll-indicator { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); animation: bounce 2s infinite; color: white; opacity: 0.6; }
          @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0) translateX(-50%);} 40% {transform: translateY(-10px) translateX(-50%);} 60% {transform: translateY(-5px) translateX(-50%);} }
        `}
      </style>

      {/* ──────────────── PAGE 1: THE ELITE SALUTATION ──────────────── */}
      <section style={{ minHeight: "95vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }} className="animate-reveal">
        <div className="hero-gradient" style={{ padding: "100px 80px", borderRadius: "40px", color: "white", position: "relative", boxShadow: "0 40px 80px rgba(22, 163, 74, 0.2)" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "10px 25px", borderRadius: "50px", display: "inline-block", fontSize: "12px", fontWeight: "bold", marginBottom: "25px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
            🛡️ ENCRYPTED ADMIN SESSION: ACTIVE
          </div>
          <h1 style={{ fontSize: "72px", fontWeight: "900", margin: "0 0 20px 0", letterSpacing: "-3px", lineHeight: "1" }}>
            Welcome back,<br/>Grand Commander Abebe
          </h1>
          <p style={{ fontSize: "24px", opacity: 0.85, maxWidth: "750px", lineHeight: "1.6", fontWeight: "400" }} className="sentence-case">
            The Fasika global agricultural network is performing at peak efficiency. 1.2M metrics analyzed in the last hour. All command systems are standing by for your authorization.
          </p>
          
          <div style={{ marginTop: "60px", display: "flex", gap: "80px" }}>
            <div>
              <div style={{ fontSize: "42px", fontWeight: "800" }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
              <div style={{ fontSize: "13px", opacity: 0.6, letterSpacing: "1px", textTransform: "uppercase" }}>Master System Time</div>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "80px" }}>
              <div style={{ fontSize: "42px", fontWeight: "800" }}>{serverLoad}%</div>
              <div style={{ fontSize: "13px", opacity: 0.6, letterSpacing: "1px", textTransform: "uppercase" }}>Ecosystem Latency</div>
            </div>
          </div>
          <div className="scroll-indicator">▼ Scroll to Enter Command Center</div>
        </div>
      </section>

      {/* ──────────────── PAGE 2: MACRO ECOSYSTEM INTELLIGENCE ──────────────── */}
      <section style={{ minHeight: "100vh", padding: "120px 0" }}>
        <span style={sectionLabel}>Sector 01: Macro Intelligence</span>
        <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "60px", letterSpacing: "-1px" }} className="sentence-case">Ecosystem growth & distribution</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "25px" }}>
          {[
            { label: "Total Farmers", val: "14,285", growth: "↑ 12%", color: "#16a34a" },
            { label: "Market Volume", val: "$2.84M", growth: "↑ 24%", color: "#1e293b" },
            { label: "Active Buyers", val: "3,102", growth: "↑ 7%", color: "#1e293b" },
            { label: "Pending Approvals", val: "142", growth: "Needs Review", color: "#e74c3c" }
          ].map((stat, i) => (
            <div key={i} style={glassCard}>
              <h3 style={{ fontSize: "13px", color: "#64748b", fontWeight: "700" }}>{stat.label}</h3>
              <div style={{ fontSize: "36px", fontWeight: "900", color: stat.color, margin: "15px 0" }}>{stat.val}</div>
              <div style={{ fontSize: "12px", color: stat.color === "#e74c3c" ? "#e74c3c" : "#22c55e", fontWeight: "bold" }}>{stat.growth}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", ...glassCard, height: "500px", background: "#0f172a", color: "white", overflow: "hidden" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between" }}>
            <span className="sentence-case">Network traffic visualization</span>
            <span style={{ color: "#16a34a" }}>Live Data Stream</span>
          </div>
          
        </div>
      </section>

      {/* ──────────────── PAGE 3: GLOBAL LOGISTICS & MAP ──────────────── */}
      <section style={{ minHeight: "100vh", padding: "120px 0" }}>
        <span style={sectionLabel}>Sector 02: Global Logistics</span>
        <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "60px", letterSpacing: "-1px" }} className="sentence-case">Supply chain & transit monitoring</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "40px" }}>
          <div style={{ ...glassCard, height: "700px", background: "#e2e8f0", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "url('https://maps.googleapis.com/maps/api/staticmap?center=9.0192,38.7525&zoom=6&size=1200x800&key=YOUR_API_KEY')", backgroundSize: "cover" }}></div>
            <div style={{ position: "absolute", top: "30px", left: "30px", background: "#1e293b", color: "white", padding: "15px 25px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold" }}>
              🛰️ ACTIVE GPS TRACKING: 4,102 SHIPMENTS IN TRANSIT
            </div>
             
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={{ ...glassCard, background: "#1e293b", color: "white" }}>
              <h4 className="sentence-case" style={{ margin: "0 0 20px 0", fontSize: "18px" }}>Regional Demand</h4>
              {['Addis Ababa', 'Dire Dawa', 'Mekele', 'Gondar'].map(city => (
                <div key={city} style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px" }}>
                    <span>{city}</span>
                    <span>{Math.floor(Math.random() * 100)}%</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "10px" }}>
                    <div style={{ height: "100%", width: `${Math.floor(Math.random() * 100)}%`, background: "#16a34a", borderRadius: "10px" }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...glassCard, borderLeft: "6px solid #16a34a" }}>
              <h4 className="sentence-case">Logistics Alerts</h4>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "10px" }}>No critical delays detected in the last 24 hours. Transit times are within 0.5% of target.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── PAGE 4: SECURITY & ACCESS AUDIT ──────────────── */}
      <section style={{ minHeight: "100vh", padding: "120px 0" }}>
        <span style={sectionLabel}>Sector 03: Security Audit</span>
        <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "60px", letterSpacing: "-1px" }} className="sentence-case">High-level administrative oversight</h2>
        
        <div style={{ ...glassCard, padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "30px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="sentence-case" style={{ margin: 0 }}>System Authorization Logs</h3>
            <button style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #16a34a", color: "#16a34a", background: "none", fontWeight: "bold", cursor: "pointer" }}>Export Data</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {["Event ID", "Admin User", "Action Performed", "Resource", "IP Address", "Status"].map(h => (
                  <th key={h} style={{ padding: "20px", fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: "800" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "20px", fontSize: "14px", color: "#94a3b8" }}>#AUTH-88{i}</td>
                  <td style={{ padding: "20px", fontSize: "14px", fontWeight: "700" }}>Master_Abebe</td>
                  <td style={{ padding: "20px", fontSize: "14px" }}>Updated System Branding Meta</td>
                  <td style={{ padding: "20px", fontSize: "14px" }}>/config/brand</td>
                  <td style={{ padding: "20px", fontSize: "14px", fontFamily: "monospace" }}>192.168.1.{i}42</td>
                  <td style={{ padding: "20px" }}>
                    <span style={{ padding: "6px 14px", background: "#dcfce7", color: "#166534", borderRadius: "20px", fontSize: "11px", fontWeight: "900" }}>VERIFIED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ──────────────── PAGE 5: INFRASTRUCTURE HEALTH ──────────────── */}
      <section style={{ minHeight: "100vh", padding: "120px 0" }}>
        <span style={sectionLabel}>Sector 04: System Infrastructure</span>
        <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "60px", letterSpacing: "-1px" }} className="sentence-case">Server health & hardware metrics</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px" }}>
          <div style={{ ...glassCard, textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>🔋</div>
            <h4 className="sentence-case">CPU Cluster Alpha</h4>
            <div style={{ fontSize: "40px", fontWeight: "900", color: "#16a34a" }}>18%</div>
            <p style={{ fontSize: "12px", color: "#64748b" }}>Load Balanced Across 12 Cores</p>
          </div>
          <div style={{ ...glassCard, textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>💾</div>
            <h4 className="sentence-case">Database Shard 01</h4>
            <div style={{ fontSize: "40px", fontWeight: "900", color: "#16a34a" }}>42.1TB</div>
            <p style={{ fontSize: "12px", color: "#64748b" }}>Storage Capacity: 85% Available</p>
          </div>
          <div style={{ ...glassCard, textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>🚀</div>
            <h4 className="sentence-case">API Gateway</h4>
            <div style={{ fontSize: "40px", fontWeight: "900", color: "#16a34a" }}>12ms</div>
            <p style={{ fontSize: "12px", color: "#64748b" }}>Average Response Latency</p>
          </div>
        </div>
      </section>

      {/* ──────────────── PAGE 6: USER GOVERNANCE ──────────────── */}
      <section style={{ minHeight: "100vh", padding: "120px 0" }}>
        <span style={sectionLabel}>Sector 05: User Governance</span>
        <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "60px", letterSpacing: "-1px" }} className="sentence-case">Global user management directory</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}>
          <div style={glassCard}>
            <h4 className="sentence-case">Recent Farmer Applications</h4>
            <div style={{ marginTop: "20px" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "14px" }}>Farmer Daniel Bekele</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Region: Oromia • Specialty: Coffee</div>
                  </div>
                  <button style={{ padding: "6px 15px", borderRadius: "6px", background: "#16a34a", color: "white", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Approve</button>
                </div>
              ))}
            </div>
          </div>
          
          <div style={glassCard}>
            <h4 className="sentence-case">Flagged Activity</h4>
            <div style={{ marginTop: "20px" }}>
              {[1, 2].map(i => (
                <div key={i} style={{ padding: "20px", background: "#fff1f2", borderRadius: "12px", marginBottom: "15px", border: "1px solid #fda4af" }}>
                  <div style={{ fontWeight: "800", color: "#be123c", fontSize: "13px" }}>⚠️ CRITICAL: SUSPICIOUS LOGIN</div>
                  <p style={{ fontSize: "12px", color: "#be123c", margin: "5px 0" }}>Multiple failed attempts on Admin_Account_4.</p>
                  <button style={{ background: "#be123c", color: "white", border: "none", padding: "5px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", marginTop: "10px", cursor: "pointer" }}>Lock Account</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── FINAL PAGE: MASTER BROADCAST ──────────────── */}
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div style={{ ...glassCard, background: "#1e293b", color: "white", width: "100%", padding: "80px", textAlign: "center" }}>
          <h2 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "20px" }} className="sentence-case">Deploy System Broadcast</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto 40px", opacity: 0.7 }}>Send an urgent message to all administrators, farmers, and buyers currently active on the platform.</p>
          <textarea style={{ width: "100%", maxWidth: "800px", height: "150px", borderRadius: "15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", padding: "20px", color: "white", fontFamily: "inherit", fontSize: "16px", marginBottom: "20px" }} placeholder="Enter message payload..."></textarea>
          <br/>
          <button style={{ padding: "18px 50px", borderRadius: "12px", background: "#16a34a", color: "white", border: "none", fontSize: "16px", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 20px rgba(22, 163, 74, 0.3)" }}>Initialize Broadcast</button>
        </div>
      </section>

      <footer style={{ padding: "100px 0", textAlign: "center", borderTop: "1px solid #eef2f1", marginTop: "50px" }}>
        <div style={{ fontSize: "20px", fontWeight: "900", color: "#16a34a", marginBottom: "10px" }}>🌿 Fasika Admin Portal</div>
        <p style={{ fontSize: "12px", color: "#94a3b8", letterSpacing: "1px" }}>
          CORE VERSION 8.4.1 // SECURE SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}<br/>
          © 2026 Fasika Agricultural Global Operations. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;