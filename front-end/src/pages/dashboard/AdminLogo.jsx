import React from "react";

const AdminWelcomePage = () => {
  const containerStyle = {
    padding: "0",
    background: "linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)",
    fontFamily: "'Inter', sans-serif",
    color: "#0c4a6e"
  };

  const sectionLabel = {
    fontSize: "12px",
    fontWeight: "800",
    color: "#0ea5e9",
    textTransform: "uppercase",
    letterSpacing: "3px",
    display: "block",
    marginBottom: "20px"
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          .sentence-case::first-letter { text-transform: uppercase; }
          .sky-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border-radius: 24px; padding: 40px; border: 1px solid #e0f2fe; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.05); transition: 0.4s; }
          .sky-card:hover { transform: translateY(-10px); border-color: #7dd3fc; box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1); }
          .hero-title { font-size: 80px; font-weight: 900; letter-spacing: -4px; margin: 20px 0; color: #0284c7; line-height: 0.9; }
          .stat-badge { background: #e0f2fe; color: #0369a1; padding: 8px 16px; borderRadius: 50px; fontSize: 12px; fontWeight: 800; }
          .info-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f1f5f9; }
        `}
      </style>

      {/* ─── SECTION 1: THE SUPREME HORIZON ─── */}
      <section style={{ 
        height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10%", 
        background: "linear-gradient(to right, rgba(240,249,255,1), rgba(240,249,255,0)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover", backgroundPosition: "right"
      }}>
        <div style={{ maxWidth: "800px" }}>
          <span className="stat-badge"></span>
          <h1 className="hero-title">Sovereign Command<br/>Salutations</h1>
          <p style={{ fontSize: "24px", opacity: 0.9, lineHeight: "1.6", color: "#075985", marginTop: "30px" }}>
            The sky over the Ethiopian highlands is clear. You are managing the most advanced agricultural exchange in East Africa. Every data point below represents a life, a farm, and a future.
          </p>
          <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
            <button style={{ padding: "15px 35px", background: "#0ea5e9", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>System Overview</button>
            <button style={{ padding: "15px 35px", background: "white", color: "#0ea5e9", border: "1px solid #0ea5e9", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>Security Logs</button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: REGIONAL COMMAND BREAKDOWN ─── */}
      <section style={{ padding: "100px 10%" }}>
        <span style={sectionLabel}>Geographical Influence</span>
        <h2 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "50px" }}>Regional Management Sectors</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px", marginTop: "40px" }}>
          {[
            { region: "Oromia", focus: "Coffee & Cattle", health: "98%" },
            { region: "Amhara", focus: "Teff & Grains", health: "94%" },
            { region: "Sidama", focus: "Premium Coffee", health: "99%" },
            { region: "Southern", focus: "Fruits & Spices", health: "91%" },
            { region: "Tigray", focus: "Honey & Sesame", health: "88%" },
            { region: "Somali", focus: "Livestock Export", health: "95%" }
          ].map((item, i) => (
            <div key={i} className="sky-card" style={{ padding: "25px" }}>
              <div style={{ fontWeight: "900", fontSize: "18px", color: "#0369a1" }}>{item.region}</div>
              <div className="info-row"><span>Primary Focus:</span> <strong>{item.focus}</strong></div>
              <div className="info-row"><span>Sector Health:</span> <strong style={{ color: "#10b981" }}>{item.health}</strong></div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 3: HERITAGE EXPORT PROMOTION (ANIMALS) ─── */}
      <section style={{ padding: "120px 10%", background: "#f8fafc" }}>
        <span style={sectionLabel}>Asset Valuation</span>
        <h2 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "50px" }}>High-Value Livestock Promotions</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px" }}>
          <div className="sky-card">
            <div style={{ fontSize: "40px" }}>🐄</div>
            <h3 style={{ fontSize: "24px", fontWeight: "800", margin: "15px 0" }}>Borena Cattle: The Gulf Strategy</h3>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#475569" }}>
              Our Borena bulls are the gold standard for meat export. Admin Advice: Ensure quarantine protocols at the Modjo hub are synchronized with Saudi and UAE import standards to minimize holding costs.
            </p>
          </div>

          <div className="sky-card">
            <div style={{ fontSize: "40px" }}>🐐</div>
            <h3 style={{ fontSize: "24px", fontWeight: "800", margin: "15px 0" }}>Afar & Somali Goat Clusters</h3>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#475569" }}>
              The resilience of the Afar goat breed is a key marketing point for European organic markets. Focus on "Sun-Raised" branding to capture the 25% premium price gap.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: GENETIC SOVEREIGNTY & SEEDS ─── */}
      <section style={{ padding: "120px 10%" }}>
        <span style={sectionLabel}>Intellectual Property</span>
        <h2 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "40px" }}>Seed & Genetic Sovereignty</h2>
        <div style={{ background: "#0369a1", color: "white", padding: "50px", borderRadius: "30px", display: "flex", gap: "40px", alignItems: "center" }}>
          <div style={{ fontSize: "80px" }}>🌾</div>
          <div>
            <h3 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "15px" }}>Protecting the National Teff Ledger</h3>
            <p style={{ opacity: 0.9, lineHeight: "1.6", fontSize: "16px" }}>
              As an Admin, you are a guardian of Ethiopian genetics. Any attempt to register foreign patents on local Teff or Coffee varieties via the Fasika portal must be blocked and reported to the Sovereign Legal Department immediately.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: THE ADMIN CONSTITUTION (EXPANDED) ─── */}
      <section style={{ padding: "120px 10%", background: "#f0f9ff" }}>
        <span style={sectionLabel}>Operational Code</span>
        <h2 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "60px" }}>Detailed Rules of Engagement</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div className="rule-box">
            <h4 style={{ fontWeight: "900", color: "#0369a1", marginBottom: "20px" }}>Data Ethics Protocol</h4>
            <p style={{ fontSize: "14px", lineHeight: "1.8" }}>
              1. <strong>Pixel Privacy:</strong> No screenshots of farmer financial records are permitted.<br/>
              2. <strong>Verification:</strong> Physical on-ground agents must verify 10% of all digital uploads.<br/>
              3. <strong>Traceability:</strong> From the clear sky to the soil, every grain must be traceable to a specific GPS coordinate.
            </p>
          </div>
          <div className="rule-box">
            <h4 style={{ fontWeight: "900", color: "#0369a1", marginBottom: "20px" }}>Market Fairness Protocol</h4>
            <p style={{ fontSize: "14px", lineHeight: "1.8" }}>
              1. <strong>Zero-Broker Policy:</strong> Flag any user attempting to buy and sell without adding value.<br/>
              2. <strong>Price Protection:</strong> Deploy "Emergency Floor Prices" during harvest gluts.<br/>
              3. <strong>Global Transparency:</strong> Ensure international buyers see the exact breakdown of what the farmer receives.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "100px 10%", background: "white", borderTop: "1px solid #e0f2fe", textAlign: "center" }}>
        <div style={{ fontSize: "30px", marginBottom: "20px" }}>🇪🇹</div>
        <h2 style={{ color: "#0ea5e9", fontWeight: "900" }}>FASIKA CLEAR SKY COMMAND</h2>
        <p style={{ color: "#94a3b8", fontSize: "12px", letterSpacing: "2px", marginTop: "10px" }}>
          ADHERING TO THE ETHIOPIAN AGRICULTURAL SOVEREIGNTY ACT OF 2026
        </p>
      </footer>
    </div>
  );
};

export default AdminWelcomePage;