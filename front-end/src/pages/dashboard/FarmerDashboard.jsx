import React, { useState, useEffect } from "react";

const FarmerDashboard = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const theme = {
    primary: "#064e3b",
    accent: "#10b981",
    glass: "rgba(255, 255, 255, 0.85)", 
    blur: "blur(40px)",
    border: "rgba(255, 255, 255, 0.3)"
  };

  const regions = [
    { id: "jimma", region: "JIMMA ZONE", title: "Kaffa Forest Coffee", body: "Monitoring the birthplace of Arabica. Humidity levels in the shade-grown canopy are holding at 65%. Soil moisture sensors indicate optimal conditions for the upcoming harvest cycle.", stats: ["VARIETY: HEIRLOOM", "ALTITUDE: 1850m", "MOISTURE: 65%"] },
    { id: "gojjam", region: "WEST GOJJAM", title: "The Breadbasket Matrix", body: "Massive Teff and Wheat synchronization. Soil nitrogen levels in the Nile basin plots are peaking. Automated irrigation schedules are being adjusted for the dry spell expected next week.", stats: ["TEFF YIELD: 92%", "SOIL: VOLCANIC", "NITROGEN: HIGH"] },
    { id: "arusi", region: "ARSI ZONE", title: "Cereal Highland Hub", body: "Barley and Wheat logistics. Automated harvester fleet is currently active in the eastern plains. Real-time grain quality analysis shows high protein content across all sectors.", stats: ["BARLEY: GRADE A", "TEMP: 18°C", "PROTEIN: 14%"] },
    { id: "sidama", region: "SIDAMA REGION", title: "Specialty Coffee Cluster", body: "Processing station telemetry. Washed and unwashed cherry ratios are optimized for export. Solar drying beds are operating at 95% efficiency under the current sun exposure.", stats: ["FERMENT: 36h", "MOISTURE: 11%", "SOLAR: 95%"] },
    { id: "danakil", region: "AFAR DEPRESSION", title: "Potash & Mineral Vault", body: "Monitoring the potash reserves for domestic fertilizer production. High-heat surveillance active. Subterranean sensors tracking mineral stability in the salt flats.", stats: ["POTASH: SECURE", "EXTREME HEAT", "STABILITY: 100%"] },
    { id: "harar", region: "EAST HARARGHE", title: "Harari Spice & Khat", body: "Tracking the unique micro-climate of the eastern hills. Water retention is steady despite low rain. Terraced farming algorithms are optimizing runoff collection.", stats: ["TERRAIN: STEEP", "SUN: 10h/day", "RETENTION: 88%"] },
    { id: "wolaita", region: "WOLAITA ZONE", title: "Root Crop Synchronization", body: "Enset (False Banana) and Sweet Potato density mapping. Biomass estimate exceeds 500 tons. Intercropping efficiency has increased nutrient density in the upper soil layers.", stats: ["ENSET VITALITY: 98%", "STARCH: HIGH", "BIOMASS: 500T"] },
    { id: "gambela", region: "GAMBELA BASIN", title: "Lowland Rice & Cotton", body: "Large-scale irrigation from the Baro River. Rice maturation is at 70%. Monitoring humidity levels to prevent fungal growth in the dense lowland vegetation.", stats: ["RICE: LONG GRAIN", "FLOW: 2200m³/s", "MATURITY: 70%"] },
    { id: "bale", region: "BALE HIGHLANDS", title: "Livestock & Bio-Diversity", body: "High-altitude grazing monitoring. Herd health in the Sanetti plateau is verified. Satellite tracking ensures no encroachment on protected Afro-alpine habitats.", stats: ["HERD: 1200", "HEALTH: OPTIMAL", "ALT: 4000m"] },
    { id: "amhara", region: "NORTH GONDAR", title: "Nile Basin Irrigation", body: "GERD-fed irrigation network monitoring. Water pressure in the Tana-Beles tunnel is stable. Distributing vital resources to over 50,000 smallholder plots.", stats: ["PRESSURE: 8 bar", "FLOW: 450m³/s", "REACH: 50k PLOTS"] }
  ];

  const animalSectors = [
    { id: "cattle", region: "NATIONAL CATTLE HERD", title: "Bovine Health Matrix", body: "Real-time tracking of the Boran and Zebu breeds. Grazing patterns optimized for highland pastures through AI-driven migratory mapping.", stats: ["POP: 70M", "HEALTH: 94%", "BREED: ZEBU"] },
    { id: "poultry", region: "POULTRY CLUSTERS", title: "Avian Production Flow", body: "Automated climate control for central Ethiopian poultry hubs. Feed efficiency at maximum capacity. Biosecurity protocols are currently at Level 1.", stats: ["DAILY EGGS: 2M", "TEMP: 24°C", "BIOSEC: L1"] },
    { id: "sheep", region: "HIGHLAND SHEEP", title: "Wool & Mutton Logistics", body: "Monitoring the Arsi-Bale and Menz breeds. Vaccination schedules for 2026 are 100% complete. Supply chain readiness for the holiday season is green.", stats: ["WOOL: GRADE A", "COUNT: 42M", "VACC: 100%"] }
  ];

  return (
    <div style={containerStyle}>
      <style>
        {`
          body, html { 
            margin: 0; padding: 0; 
            min-height: 100vh;
            background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2560&q=100');
            background-size: cover; 
            background-position: center center;
            background-attachment: fixed; 
            background-repeat: no-repeat;
            background-color: #022c22;
            scroll-behavior: smooth;
            overflow-x: hidden;
          }
          .glass-card { 
            background: ${theme.glass}; 
            backdrop-filter: ${theme.blur}; 
            border-bottom: 2px solid ${theme.border}; 
            width: 100%; 
            box-sizing: border-box; 
            /* THE "LONGER" SETTINGS */
            min-height: 120vh; 
            padding: 250px 10vw; 
            display: flex;
            align-items: center;
          }
          .animal-card {
            background: rgba(255, 255, 255, 0.9);
          }
          .stat-badge {
            background: ${theme.primary}; color: white; padding: 16px 32px;
            border-radius: 4px; font-weight: 900; font-size: 14px; margin-right: 20px;
            letter-spacing: 2px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
        `}
      </style>

      {/* FIXED VERTICAL SIDEBAR */}
      <div style={sidebarStyle}>
        <div style={{ color: "white", fontWeight: "900", fontSize: "24px", transform: "rotate(-90deg)", marginBottom: "80px", letterSpacing: "8px", opacity: 0.6 }}>FASIKA</div>
      </div>

      {/* FULL SCREEN HEADER */}
      <header style={headerStyle}>
        <div>
          <span style={tagStyle}>2026 AGRICULTURAL TELEMETRY</span>
          <h1 style={titleStyle}>Fasika's Farmer Connect</h1>
        </div>
        <div style={{ textAlign: "right", color: "white" }}>
          <div style={{ fontSize: "72px", fontWeight: "900", letterSpacing: "-2px" }}>{time.toLocaleTimeString()}</div>
          <div style={{ fontSize: "18px", fontWeight: "800", opacity: 0.8, letterSpacing: "3px" }}>CENTRAL COMMAND // ETHIOPIA</div>
        </div>
      </header>

      <main style={{ width: "100%" }}>
        {regions.map((item) => (
          <section id={item.id} key={item.id} className="glass-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ maxWidth: "900px" }}>
                <span style={{ fontSize: "16px", fontWeight: "900", color: "#059669", letterSpacing: "8px" }}>{item.region}</span>
                <h2 style={{ fontSize: "110px", fontWeight: "900", color: theme.primary, margin: "20px 0 40px 0", letterSpacing: "-6px", lineHeight: "0.9" }}>{item.title}</h2>
                <p style={{ fontSize: "28px", lineHeight: "1.5", color: "#1f2937", fontWeight: "500", marginBottom: "60px" }}>{item.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {item.stats.map((stat, i) => (
                    <span key={i} className="stat-badge">{stat}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", opacity: 0.07, fontSize: "280px", fontWeight: "900", color: theme.primary, pointerEvents: "none" }}>
                {regions.indexOf(item) + 1}
              </div>
            </div>
          </section>
        ))}

        {animalSectors.map((item, index) => (
          <section id={item.id} key={item.id} className="glass-card animal-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ maxWidth: "900px" }}>
                <span style={{ fontSize: "16px", fontWeight: "900", color: "#b91c1c", letterSpacing: "8px" }}>{item.region}</span>
                <h2 style={{ fontSize: "110px", fontWeight: "900", color: "#b91c1c", margin: "20px 0 40px 0", letterSpacing: "-6px", lineHeight: "0.9" }}>{item.title}</h2>
                <p style={{ fontSize: "28px", lineHeight: "1.5", color: "#1f2937", fontWeight: "500", marginBottom: "60px" }}>{item.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {item.stats.map((stat, i) => (
                    <span key={i} className="stat-badge" style={{ background: "#b91c1c" }}>{stat}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", opacity: 0.07, fontSize: "200px", fontWeight: "900", color: "#b91c1c", pointerEvents: "none" }}>
                V-{index + 1}
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer style={footerStyle}>
        <div style={{ fontSize: "42px", fontWeight: "900", color: "white", letterSpacing: "8px" }}>🌿 FASIKA HUB </div>
        <p style={{ fontSize: "16px", color: "white", letterSpacing: "6px", marginTop: "30px", opacity: 0.6 }}>ADDI-C NODE // SECURE ACCESS // 2026</p>
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
  width: "calc(100% - 70px)",
};

const sidebarStyle = { 
  position: "fixed", left: 0, top: 0, bottom: 0, width: "70px", 
  background: "rgba(2, 44, 34, 0.98)", zIndex: 1000, 
  display: "flex", flexDirection: "column", alignItems: "center", 
  justifyContent: "flex-end", paddingBottom: "80px",
  borderRight: "1px solid rgba(255,255,255,0.1)"
};

const headerStyle = { 
  minHeight: "110vh", 
  padding: "0 10vw", 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))", 
  boxSizing: "border-box" 
};

const tagStyle = { 
  fontSize: "16px", fontWeight: "900", color: "#ffffff", 
  background: "#10b981", padding: "12px 30px", 
  letterSpacing: "10px", display: "inline-block" 
};

const titleStyle = { 
  fontSize: "120px", fontWeight: "900", margin: "40px 0 0 0", 
  color: "#ffffff", letterSpacing: "-8px", lineHeight: "0.85",
  textShadow: "0 20px 80px rgba(0,0,0,0.6)" 
};

const footerStyle = { 
  padding: "200px 0", textAlign: "center", 
  background: "#022c22", boxSizing: "border-box" 
};

export default FarmerDashboard;
