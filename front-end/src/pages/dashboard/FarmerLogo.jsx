import React from "react";

const Birr = () => <span style={{ fontWeight: "800", color: "#fbbf24" }}>ETB</span>;

const FarmerLogo = () => {
  const pageStyle = {
    background: "#020617",
    color: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    lineHeight: "1.6",
    width: "100%",
    minHeight: "100vh",
    margin: "0",
    padding: "0",
    overflowX: "hidden"
  };

  const sectionStyle = {
    padding: "80px 5%", // Reduced side padding for full-width feel
    width: "100%",
    boxSizing: "border-box",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  };

  const cardGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "40px",
    width: "100%"
  };

  const featureCard = {
    background: "rgba(255,255,255,0.03)",
    padding: "35px",
    borderRadius: "4px",
    border: "1px solid rgba(251, 191, 36, 0.1)"
  };

  return (
    <div style={pageStyle}>
      <style>
        {`
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; }
          @keyframes tickerScroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
          .marquee-container { 
            position: sticky; 
            top: 0; 
            z-index: 1000; 
            background: rgba(2, 6, 23, 0.95); 
            backdrop-filter: blur(12px);
            padding: 18px 0;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            border-bottom: 1px solid rgba(251, 191, 36, 0.2);
          }
          .marquee-content { display: inline-block; animation: tickerScroll 35s linear infinite; }
          .marquee-item { margin-right: 80px; font-weight: 700; font-size: 13px; letter-spacing: 2px; }
          .btn-primary { background: #fbbf24; color: #000; padding: 16px 60px; border-radius: 4px; border: none; font-weight: 800; cursor: pointer; letter-spacing: 2px; transition: 0.3s; }
          .btn-primary:hover { background: #fff; }
          .tag { color: #fbbf24; font-weight: 800; font-size: 12px; letter-spacing: 3px; display: block; margin-bottom: 15px; }
          .stats-row { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
        `}
      </style>

      {/* 1. TICKER */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="marquee-item">MARKET DATA: COFFEE G1 - 258.40 <Birr/> [+3.1%]</span>
          <span className="marquee-item">SYSTEM: 1,420 HECTARES ACTIVE</span>
          <span className="marquee-item">YIELD FORECAST: MEHER SEASON [+24%]</span>
          <span className="marquee-item">TEFF MAGNA: 10,200 <Birr/> [STABLE]</span>
          <span className="marquee-item">LOGISTICS: DJIBOUTI HUB - ACTIVE</span>
        </div>
      </div>

      {/* 2. HERO */}
      <header style={{ ...sectionStyle, textAlign: "center", padding: "180px 5%" }}>
        <span className="tag">ESTABLISHED 2026</span>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: "900", margin: "10px 0", letterSpacing: "-3px", lineHeight: "1" }}>AGRI-LOG ETHIOPIA</h1>
        <p style={{ fontSize: "1.4rem", color: "#94a3b8", maxWidth: "900px", margin: "30px auto", fontWeight: "300" }}>
          The enterprise operating system for industrial-scale farming. Precision data, autonomous monitoring, and global trade integration.
        </p>
        <button className="btn-primary">INITIATE PLATFORM</button>
      </header>

      {/* 3. CROP MONITORING */}
      <section style={sectionStyle}>
        <span className="tag">PRODUCTION</span>
        <h2 style={{ fontSize: "2.5rem" }}>Crop Growth Lifecycle</h2>
        <div style={cardGrid}>
          <div style={featureCard}>
            <h4 style={{ color: "#fbbf24", margin: "0 0 10px 0" }}>WHITE TEFF</h4>
            <p style={{ fontSize: "1.1rem" }}>Phase: Heading. Estimated harvest in 18 days. Nutrient profile: <span style={{color: "#2ecc71"}}>Optimal</span>.</p>
          </div>
          <div style={featureCard}>
            <h4 style={{ color: "#fbbf24", margin: "0 0 10px 0" }}>ARABICA COFFEE</h4>
            <p style={{ fontSize: "1.1rem" }}>Phase: Berry Ripening. Real-time moisture stress detected in Western Sector.</p>
          </div>
          <div style={featureCard}>
            <h4 style={{ color: "#fbbf24", margin: "0 0 10px 0" }}>RED KIDNEY BEANS</h4>
            <p style={{ fontSize: "1.1rem" }}>Phase: Germination. Soil nitrogen levels at 94% efficiency.</p>
          </div>
        </div>
      </section>

      {/* 4. SENSOR DATA (Full Width Flex) */}
      <section style={sectionStyle}>
        <span className="tag">INTELLIGENCE</span>
        <h2 style={{ fontSize: "2.5rem" }}>Subterranean Matrix</h2>
        <div className="stats-row" style={{marginTop: "40px"}}>
          {[{l: "MOISTURE", v: "18.2%"}, {l: "TEMPERATURE", v: "27.4°C"}, {l: "ACIDITY", v: "6.8 pH"}, {l: "NITROGEN", v: "44kg/ha"}].map(s => (
            <div key={s.l} style={{ flex: "1", minWidth: "200px" }}>
              <p className="tag">{s.l}</p>
              <h2 style={{ fontSize: "4rem", margin: "0", fontWeight: "900" }}>{s.v}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WEATHER (Edge-to-Edge Scroll) */}
      <section style={sectionStyle}>
        <span className="tag">CLIMATE</span>
        <h2 style={{ fontSize: "2.5rem" }}>Regional Forecast</h2>
        <div style={{ display: "flex", gap: "2px", marginTop: "30px", background: "rgba(255,255,255,0.05)" }}>
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
            <div key={day} style={{ flex: 1, padding: "40px 20px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ margin: 0, fontWeight: "800", opacity: 0.6 }}>{day}</p>
              <h3 style={{ margin: "10px 0", fontSize: "2rem" }}>26°C</h3>
              <small style={{ color: "#fbbf24", fontWeight: "800" }}>DRY</small>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINANCIALS (Ultra Wide) */}
      <section style={{ ...sectionStyle, background: "linear-gradient(90deg, #020617 0%, rgba(251, 191, 36, 0.08) 50%, #020617 100%)", textAlign: "center" }}>
        <span className="tag">FINANCIAL AI</span>
        <h2 style={{ fontSize: "1.2rem", margin: 0, opacity: 0.8 }}>ESTIMATED SEASONAL REVENUE</h2>
        <h1 style={{ fontSize: "clamp(3rem, 10vw, 8rem)", margin: "10px 0", fontWeight: "900" }}><Birr/> 4,820,000</h1>
        <p style={{ color: "#2ecc71", fontWeight: "800", letterSpacing: "2px" }}>+18.5% YEAR-ON-YEAR GROWTH</p>
      </section>

      {/* 10. COMPLIANCE */}
      <section style={sectionStyle}>
        <span className="tag">CERTIFICATION</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>Global Trade Marks</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["EU ORGANIC", "FAIRTRADE", "RAINFOREST ALLIANCE", "GLOBAL G.A.P"].map(cert => (
              <div key={cert} style={{ border: "1px solid #fbbf24", padding: "10px 20px", fontWeight: "800", fontSize: "11px" }}>
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: "80px 5%", textAlign: "center", color: "#475569", background: "#010409" }}>
        <p style={{ letterSpacing: "4px", fontWeight: "800", color: "#f8fafc" }}>AGRI-LOG 2026</p>
        <p style={{ fontSize: "12px", marginTop: "10px" }}>ADAMAS, ETHIOPIA • GLOBAL OPERATIONS HUB • DATA SECURED VIA BLOCKCHAIN</p>
      </footer>
    </div>
  );
};

export default FarmerLogo;