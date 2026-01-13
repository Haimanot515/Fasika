import React from "react";
import { 
  MdArrowForward, 
  MdLocationOn, 
  MdEmail, 
  MdPhone, 
  MdDescription, 
  MdBusinessCenter 
} from "react-icons/md";

const Help = () => {
  // Logic: 78px (Top Bar) + 40px (Secondary Bar) = 118px
  const NAV_HEIGHT = "118px";

  const pageStyle = {
    background: "#020617", // Deep Dark Slate
    color: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
    lineHeight: "1.6",
    minHeight: "100vh",
    paddingTop: NAV_HEIGHT, // Forces content to start below the fixed Navbars
    boxSizing: "border-box"
  };

  const sectionStyle = {
    padding: "60px 10%",
    borderBottom: "1px solid rgba(251, 191, 36, 0.1)"
  };

  const tagStyle = {
    color: "#fbbf24", // Fasika Gold
    fontWeight: "800",
    fontSize: "12px",
    letterSpacing: "3px",
    display: "block",
    marginBottom: "15px"
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.02)",
    padding: "40px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "0.3s"
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "4px",
    color: "white",
    marginTop: "10px",
    marginBottom: "20px",
    outline: "none",
    boxSizing: "border-box"
  };

  return (
    <div style={pageStyle}>
      
      {/* SECTION 1: SUPPORT HUB (HEADER) */}
      <header style={{ ...sectionStyle, textAlign: "center", padding: "80px 10%" }}>
        <span style={tagStyle}>FASIKA FARMER ASSIST</span>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "900", margin: "0 0 20px", letterSpacing: "-1px" }}>Connect Center</h1>
        <p style={{ fontSize: "1.1rem", color: "#94a3b8", maxWidth: "700px", margin: "0 auto", fontWeight: "300" }}>
          The centralized portal for technical assistance, agronomy elite consultation, and global market logistics.
        </p>
      </header>

      {/* SECTION 2: KNOWLEDGE BASE */}
      <section style={sectionStyle}>
        <span style={tagStyle}>DOCUMENTATION</span>
        <h2 style={{ fontSize: "2rem", marginBottom: "40px" }}>Self-Service Intelligence</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
          {[
            { title: "Sensor Calibration", desc: "Hardware setup for NPK and moisture matrix." },
            { title: "Yield Analytics", desc: "Interpreting seasonal growth forecasting data." },
            { title: "Export Protocol", desc: "International compliance for 2026 trade cycles." }
          ].map((item, idx) => (
            <div key={idx} style={cardStyle}>
              <MdDescription size={30} color="#fbbf24" style={{ marginBottom: "15px" }} />
              <h3 style={{ marginBottom: "10px", fontSize: "1.4rem" }}>{item.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>{item.desc}</p>
              <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#fbbf24", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                VIEW GUIDE <MdArrowForward />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: REGIONAL HUB LOCATIONS */}
      <section style={sectionStyle}>
        <span style={tagStyle}>LOCAL PRESENCE</span>
        <h2 style={{ fontSize: "2rem", marginBottom: "40px" }}>Support Operations Ethiopia</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px" }}>
          <div style={{ ...cardStyle, borderLeft: "4px solid #fbbf24" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.5rem" }}>
              <MdLocationOn color="#fbbf24" /> Adama Logistics Hub
            </h3>
            <p style={{ color: "#94a3b8", marginTop: "10px" }}>Central Operations & Sensor Repair. Building 4, Oromia Region.</p>
            <p style={{ marginTop: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
              <MdPhone color="#fbbf24"/> +251 911 000 000
            </p>
          </div>
          <div style={{ ...cardStyle, borderLeft: "4px solid #fbbf24" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.5rem" }}>
              <MdBusinessCenter color="#fbbf24" /> Jimma Trade Bureau
            </h3>
            <p style={{ color: "#94a3b8", marginTop: "10px" }}>Specialized Agronomy & Coffee Export Grading Office.</p>
            <p style={{ marginTop: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
              <MdEmail color="#fbbf24"/> jimma-hub@fasikafarm.et
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: FORMAL INQUIRY PORTAL */}
      <section style={{ ...sectionStyle, background: "rgba(251, 191, 36, 0.01)", borderBottom: "none" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span style={tagStyle}>FORMAL REQUEST</span>
          <h2 style={{ fontSize: "2rem" }}>Enterprise Inquiry</h2>
          <p style={{ color: "#94a3b8", marginBottom: "40px" }}>Direct line to our executive support and logistics teams.</p>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "10px", letterSpacing: "1px", fontWeight: "800" }}>ORGANIZATION</label>
                <input style={inputStyle} type="text" placeholder="e.g. Jimma Cooperative" />
              </div>
              <div>
                <label style={{ fontSize: "10px", letterSpacing: "1px", fontWeight: "800" }}>CONTACT EMAIL</label>
                <input style={inputStyle} type="email" placeholder="admin@domain.et" />
              </div>
            </div>
            
            <label style={{ fontSize: "10px", letterSpacing: "1px", fontWeight: "800" }}>INQUIRY TYPE</label>
            <select style={{ ...inputStyle, background: "#0f172a" }}>
              <option>Technical System Issue</option>
              <option>Agronomy Consultation</option>
              <option>Supply Chain / Logistics</option>
              <option>Billing & Enterprise Tiers</option>
            </select>

            <label style={{ fontSize: "10px", letterSpacing: "1px", fontWeight: "800" }}>MESSAGE</label>
            <textarea style={{ ...inputStyle, minHeight: "150px", resize: "none" }} placeholder="Provide detailed information..."></textarea>

            <button style={{ 
              width: "100%", 
              padding: "20px", 
              background: "#fbbf24", 
              color: "#000", 
              fontWeight: "900", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              fontSize: "15px",
              marginTop: "10px"
            }}>
              SUBMIT TO CONNECT CENTER
            </button>
          </form>
        </div>
      </section>

      <footer style={{ padding: "60px", textAlign: "center", color: "#475569", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ letterSpacing: "2px", fontWeight: "800", fontSize: "14px" }}>FASIKA FARMER 2026</p>
      </footer>
    </div>
  );
};

export default Help;