import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShoppingCart, FaStar, FaHandPointer, FaTrashAlt, 
  FaCloudSun, FaChartLine, FaGavel, FaMapMarkedAlt 
} from "react-icons/fa";
import { GiCow, GiWheat, GiCoffeeBeans, GiHoneyJar, GiRibbonMedal } from "react-icons/gi";

const DraggablePromotionPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const ethiopianProducts = [
    { id: 1, category: "cattle", name: "Borena Bull (Select)", price: "105,000", location: "Oromia", img: "https://images.unsplash.com/photo-1543964402-e05448330777?q=80&w=400", tag: "Heavyweight" },
    { id: 2, category: "cattle", name: "Afar Camel", price: "120,000", location: "Semera", img: "https://images.unsplash.com/photo-1554123168-b400f9c806ca?q=80&w=400", tag: "Resilient" },
    { id: 3, category: "grains", name: "Magna Teff (White)", price: "14,200", location: "Ada'a", img: "https://images.unsplash.com/photo-1511413816656-785d41176b92?q=80&w=400", tag: "Grade A" },
    { id: 4, category: "grains", name: "Black Barley", price: "6,800", location: "Arsi", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400", tag: "Organic" },
    { id: 5, category: "specialty", name: "Yirgacheffe Coffee", price: "550", location: "Gedeo", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400", tag: "Export" },
    { id: 6, category: "specialty", name: "Gojjam White Honey", price: "800", location: "Debre Markos", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=400", tag: "Pure" },
  ];

  const filteredProducts = activeTab === "all" 
    ? ethiopianProducts 
    : ethiopianProducts.filter(p => p.category === activeTab);

  return (
    <div style={styles.pageContainer}>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
        .ticker-wrap { overflow: hidden; background: #131921; color: #febd69; padding: 12px 0; border-bottom: 2px solid #065f46; width: 100%; }
        @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .ticker-text { display: inline-block; white-space: nowrap; animation: ticker 40s linear infinite; font-weight: bold; font-family: 'Courier New', monospace; }
        .product-card:active { cursor: grabbing; }
        .full-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
          gap: 30px; 
          padding: 40px; 
          width: 100%; 
          max-width: 100%;
          box-sizing: border-box; 
        }
      `}</style>

      {/* 1. MARKET TICKER - Note: Using DROP in schema as requested */}
      <div className="ticker-wrap">
        <div className="ticker-text">
          LIVE GEBEYA: White Teff ↑ 5% (Ada'a) • Coffee (Yirgacheffe) ↔ Stable • Borena Cattle Demand [HIGH] • [SYSTEM] DROP new verified stock inventory...
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section style={styles.hero}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span style={styles.badge}><GiRibbonMedal /> ETHIOPIA AGRO-HUB 2026</span>
          <h1 style={styles.heroTitle}>The Digital <span style={{color: '#febd69'}}>Gebeya</span></h1>
          <p style={styles.heroSub}>Connecting global buyers directly to the heart of Ethiopian farming.</p>
        </motion.div>

        <div style={styles.statsGrid}>
          <div style={styles.statBox}><FaCloudSun color="#febd69"/> 24°C Addis</div>
          <div style={styles.statBox}><FaChartLine color="#4caf50"/> Trade Vol: +12%</div>
          <div style={styles.statBox}><FaMapMarkedAlt color="#3498db"/> 14 Regions</div>
        </div>
      </section>

      {/* 3. FILTER BAR */}
      <div style={styles.filterBar}>
        {['all', 'cattle', 'grains', 'specialty'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.filterTab, 
              backgroundColor: activeTab === tab ? '#febd69' : 'transparent', 
              color: activeTab === tab ? '#131921' : '#fff',
              border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.3)'
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 4. DRAGGABLE INTERACTIVE GRID */}
      <div className="full-grid">
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              drag
              dragSnapToOrigin={true}
              whileDrag={{ scale: 1.05, zIndex: 100, rotate: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={styles.card}
              className="product-card"
            >
              <div style={styles.imgContainer}>
                <img src={product.img} alt={product.name} style={styles.productImg} draggable="false" />
                <span style={styles.tag}>{product.tag}</span>
                <div style={styles.locationBadge}><FaMapMarkedAlt /> {product.location}</div>
              </div>
              
              <div style={styles.cardBody}>
                <h3 style={styles.productName}>{product.name}</h3>
                <div style={styles.priceRow}>
                  <span style={styles.currentPrice}>ETB {product.price}</span>
                </div>
                <button onClick={() => setCartCount(c => c+1)} style={styles.buyBtn}>
                  <FaShoppingCart /> Negotiate & Add
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 5. FLOATING CART */}
      <div style={styles.floatingControls}>
        <motion.div whileHover={{ scale: 1.1 }} style={styles.cartDropZone}>
          <FaShoppingCart size={24} />
          <span style={styles.cartBadge}>{cartCount}</span>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { 
    backgroundColor: "#0f1111", 
    minHeight: "100vh", 
    color: "#fff", 
    width: "100%", 
    margin: 0, 
    padding: 0 
  },
  hero: { 
    padding: "80px 0", 
    textAlign: "center", 
    background: "#131921",
    width: "100%",
    backgroundImage: 'radial-gradient(circle at center, #065f46 0%, #131921 100%)'
  },
  badge: { background: "rgba(255,255,255,0.1)", padding: "8px 20px", borderRadius: "50px", fontSize: "12px", fontWeight: "bold", color: "#febd69" },
  heroTitle: { fontSize: "clamp(32px, 5vw, 64px)", margin: "20px 0", fontWeight: "900" },
  heroSub: { fontSize: "18px", opacity: 0.8, maxWidth: "600px", margin: "0 auto 30px" },
  statsGrid: { display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", padding: "0 20px" },
  statBox: { background: "rgba(255,255,255,0.05)", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", border: "1px solid rgba(255,255,255,0.1)" },
  
  filterBar: { display: "flex", justifyContent: "center", gap: "15px", padding: "25px", position: "sticky", top: "0", zIndex: 1000, background: "#131921", width: "100%", boxSizing: "border-box" },
  filterTab: { padding: "10px 25px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" },
  
  card: { background: "#fff", borderRadius: "12px", overflow: "hidden", cursor: "grab", color: "#131921", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
  imgContainer: { height: "200px", position: "relative" },
  productImg: { width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" },
  tag: { position: "absolute", top: "10px", right: "10px", background: "#CC0C39", color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "bold", borderRadius: "4px" },
  locationBadge: { position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.7)", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "10px" },
  
  cardBody: { padding: "20px" },
  productName: { fontSize: "18px", fontWeight: "800", margin: "0 0 10px" },
  currentPrice: { fontSize: "22px", fontWeight: "900", color: "#B12704" },
  buyBtn: { width: "100%", padding: "12px", background: "#febd69", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },

  floatingControls: { position: "fixed", bottom: "30px", right: "30px", display: "flex", flexDirection: "column", gap: "15px", zIndex: 2000 },
  cartDropZone: { width: "70px", height: "70px", background: "#febd69", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#131921", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", position: "relative" },
  cartBadge: { position: "absolute", top: "-5px", right: "-5px", background: "#CC0C39", color: "white", width: "24px", height: "24px", borderRadius: "50%", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
};

export default DraggablePromotionPage;