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
    glass: "rgba(255, 255, 255, 0.82)", 
    blur: "blur(30px)",
    border: "rgba(255, 255, 255, 0.2)"
  };

  const regions = [
    { id: "jimma", region: "JIMMA ZONE", title: "Kaffa Forest Coffee", body: "Monitoring the birthplace of Arabica. Humidity levels in the shade-grown canopy are holding at 65%.", stats: ["VARIETY: HEIRLOOM", "ALTITUDE: 1850m"] },
    { id: "gojjam", region: "WEST GOJJAM", title: "The Breadbasket Matrix", body: "Massive Teff and Wheat synchronization. Soil nitrogen levels in the Nile basin plots are peaking.", stats: ["TEFF YIELD: 92%", "SOIL: VOLCANIC"] },
    { id: "arusi", region: "ARSI ZONE", title: "Cereal Highland Hub", body: "Barley and Wheat logistics. Automated harvester fleet is currently active in the eastern plains.", stats: ["BARLEY: GRADE A", "TEMP: 18°C"] },
    { id: "sidama", region: "SIDAMA REGION", title: "Specialty Coffee Cluster", body: "Processing station telemetry. Washed and unwashed cherry ratios are optimized for export.", stats: ["FERMENT: 36h", "MOISTURE: 11%"] },
    { id: "danakil", region: "AFAR DEPRESSION", title: "Potash & Mineral Vault", body: "Monitoring the potash reserves for domestic fertilizer production. High-heat surveillance active.", stats: ["POTASH: SECURE", "EXTREME HEAT"] },
    { id: "harar", region: "EAST HARARGHE", title: "Harari Spice & Khat", body: "Tracking the unique micro-climate of the eastern hills. Water retention is steady despite low rain.", stats: ["TERRAIN: STEEP", "SUN: 10h/day"] },
    { id: "wolaita", region: "WOLAITA ZONE", title: "Root Crop Synchronization", body: "Enset (False Banana) and Sweet Potato density mapping. Biomass estimate exceeds 500 tons.", stats: ["ENSET VITALITY: 98%", "STARCH: HIGH"] },
    { id: "gambela", region: "GAMBELA BASIN", title: "Lowland Rice & Cotton", body: "Large-scale irrigation from the Baro River. Rice maturation is at 70%. Monitoring humidity.", stats: ["RICE: LONG GRAIN", "FLOW: 2200m³/s"] },
    { id: "bale", region: "BALE HIGHLANDS", title: "Livestock & Bio-Diversity", body: "High-altitude grazing monitoring. Herd health in the Sanetti plateau is verified.", stats: ["HERD: 1200", "HEALTH: OPTIMAL"] },
    { id: "amhara", region: "NORTH GONDAR", title: "Nile Basin Irrigation", body: "GERD-fed irrigation network monitoring. Water pressure in the Tana-Beles tunnel is stable.", stats: ["PRESSURE: 8 bar", "FLOW: 450m³/s"] }
  ];

  // NEW: FARM ANIMAL CARDS
  const animalSectors = [
    { id: "cattle", region: "NATIONAL CATTLE HERD", title: "Bovine Health Matrix", body: "Real-time tracking of the Boran and Zebu breeds. Grazing patterns optimized for highland pastures.", stats: ["POP: 70M", "HEALTH: 94%"] },
    { id: "poultry", region: "POULTRY CLUSTERS", title: "Avian Production Flow", body: "Automated climate control for central Ethiopian poultry hubs. Feed efficiency at maximum capacity.", stats: ["DAILY EGGS: 2M", "TEMP: 24°C"] },
    { id: "sheep", region: "HIGHLAND SHEEP", title: "Wool & Mutton Logistics", body: "Monitoring the Arsi-Bale and Menz breeds. Vaccination schedules for 2026 are 100% complete.", stats: ["WOOL: GRADE A", "COUNT: 42M"] }
  ];

  return (
    <div style={containerStyle}>
      <style>
        {`
          body, html { 
            margin: 0; padding: 0; 
            background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2560&q=100');
            background-size: cover; background-position: center;
            background-attachment: fixed; background-repeat: no-repeat;
            scroll-behavior: smooth;
          }
          .glass-card { 
            background: ${theme.glass}; 
            backdrop-filter: ${theme.blur}; 
            border-radius: 0px; 
            padding: 120px 100px; 
            margin-bottom: 0px; 
            border-bottom: 1px solid ${theme.border}; 
            width: 100%; 
            box-sizing: border-box;
            min-height: 80vh; 
            display: flex;
            align-items: center;
          }
          .animal-card {
            background: rgba(6, 78, 59, 0.05); /* Slight tint for animal cards */
          }
          .stat-badge {
            background: ${theme.primary}; color: white; padding: 12px 24px;
            border-radius: 4px; font-weight: 900; font-size: 13px; margin-right: 15px;
            letter-spacing: 1px;
          }
        `}
      </style>

      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <div style={{ color: "white", fontWeight: "900", fontSize: "20px", transform: "rotate(-90deg)", marginBottom: "50px", letterSpacing: "5px" }}>FASIKA</div>
      </div>

      <header style={headerStyle}>
        <div>
          <span style={tagStyle}>Ethiopian AGRICULTURAL HUB</span>
          <h1 style={titleStyle}>Fasika's Farmer Connect</h1>
        </div>
        <div style={{ textAlign: "right", color: "white" }}>
          <div style={{ fontSize: "56px", fontWeight: "900" }}>{time.toLocaleTimeString()}</div>
          <div style={{ fontSize: "16px", fontWeight: "800", opacity: 0.9 }}>LIVE FEED // ETHIOPIAN SECTOR MAP</div>
        </div>
      </header>

      <main style={{ width: "100%" }}>
        {/* ORIGINAL REGION CARDS */}
        {regions.map((item) => (
          <section id={item.id} key={item.id} className="glass-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <div style={{ maxWidth: "800px" }}>
                <span style={{ fontSize: "14px", fontWeight: "900", color: "#059669", letterSpacing: "5px" }}>{item.region}</span>
                <h2 style={{ fontSize: "84px", fontWeight: "900", color: theme.primary, margin: "10px 0 30px 0", letterSpacing: "-4px" }}>{item.title}</h2>
                <p style={{ fontSize: "24px", lineHeight: "1.6", color: "#111", fontWeight: "500", marginBottom: "40px" }}>{item.body}</p>
                <div style={{ display: "flex" }}>
                  {item.stats.map((stat, i) => (
                    <span key={i} className="stat-badge">{stat}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", opacity: 0.1, fontSize: "180px", fontWeight: "900", color: theme.primary }}>{regions.indexOf(item) + 1}</div>
            </div>
          </section>
        ))}

        {/* NEW ANIMAL MONITORING CARDS */}
        {animalSectors.map((item, index) => (
          <section id={item.id} key={item.id} className="glass-card animal-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <div style={{ maxWidth: "800px" }}>
                <span style={{ fontSize: "14px", fontWeight: "900", color: "#b91c1c", letterSpacing: "5px" }}>{item.region}</span>
                <h2 style={{ fontSize: "84px", fontWeight: "900", color: "#b91c1c", margin: "10px 0 30px 0", letterSpacing: "-4px" }}>{item.title}</h2>
                <p style={{ fontSize: "24px", lineHeight: "1.6", color: "#111", fontWeight: "500", marginBottom: "40px" }}>{item.body}</p>
                <div style={{ display: "flex" }}>
                  {item.stats.map((stat, i) => (
                    <span key={i} className="stat-badge" style={{ background: "#b91c1c" }}>{stat}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", opacity: 0.1, fontSize: "120px", fontWeight: "900", color: "#b91c1c" }}>
                V-{index + 1}
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer style={footerStyle}>
        <div style={{ fontSize: "32px", fontWeight: "900", color: "white", letterSpacing: "5px" }}>🌿 FASIKA FARMER AND BUYER CONNECT </div>
        <p style={{ fontSize: "14px", color: "white", letterSpacing: "4px", marginTop: "20px", opacity: 0.8 }}>CORE NODE // ESTABLISHED 2026 // ADDIS CLUSTER</p>
      </footer>
    </div>
  );
};

// ──────────────── STYLES ────────────────

const containerStyle = { marginLeft: "70px", minHeight: "100vh", fontFamily: "'Inter', sans-serif", position: "relative", width: "calc(100% - 70px)" };
const sidebarStyle = { position: "fixed", left: 0, top: 0, bottom: 0, width: "70px", background: "rgba(6, 78, 59, 0.95)", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: "50px" };
const headerStyle = { padding: "150px 100px 100px 100px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", background: "rgba(0,0,0,0.2)" };
const tagStyle = { fontSize: "14px", fontWeight: "900", color: "#ffffff", background: "rgba(6, 78, 59, 0.9)", padding: "8px 24px", borderRadius: "0px", letterSpacing: "8px" };
const titleStyle = { fontSize: "90px", fontWeight: "900", margin: "30px 0 0 0", color: "#ffffff", letterSpacing: "-5px", textShadow: "0 15px 50px rgba(0,0,0,0.5)" };
const footerStyle = { padding: "120px 0", textAlign: "center", background: "rgba(0,0,0,0.6)" };

export default FarmerDashboard;