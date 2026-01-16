import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // Standardized api instance for Render deployment
import { 
  FaShieldAlt, FaMapMarkerAlt, FaStar, FaWarehouse, FaTruck, 
  FaFire, FaMapPin, FaMedal, FaPercentage, FaLeaf, FaBoxOpen, 
  FaClock, FaSeedling, FaCloudSun, FaTractor, FaGlassWhiskey 
} from "react-icons/fa";
import { GiCow, GiFruitBowl, GiWheat, GiSheep } from "react-icons/gi";

const BuyerMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const { data } = await api.get("/buyer/marketplace/public");
        setProducts(data.data || []);
      } catch (err) {
        console.error("Marketplace Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  if (loading) return <div style={styles.loader}>🚜 Loading Marketplace Grid...</div>;

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        body, html { margin: 0; padding: 0; background: #ffffff; }

        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 20px; 
          padding: 20px; 
          width: 100%;
          box-sizing: border-box;
        }

        .agri-card { 
          background: #ffffff; 
          height: 500px; 
          cursor: pointer; 
          display: flex; 
          flex-direction: column; 
          border-radius: 12px; 
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
          position: relative;
          outline: none; /* Removes border line on click */
          user-select: none;
        }
        
        .agri-card:hover { 
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
          border-color: #065f46;
        }

        /* 1. Zoom Effect on Hover */
        .image-container { 
          height: 230px; 
          width: 100%; 
          overflow: hidden; 
          position: relative; 
          background: #fdfdfd;
        }
        .product-img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
        }
        .agri-card:hover .product-img { 
          transform: scale(1.1); 
        }

        .welcome-section {
          padding: 40px 20px 0px;
          background: #ffffff;
          border-bottom: 1px solid #eeeeee;
        }

        .tab-wrapper {
          display: flex;
          gap: 30px;
          margin-top: 25px;
          overflow-x: auto;
          scrollbar-width: none; 
          -ms-overflow-style: none;
          padding-right: 40px;
        }
        .tab-wrapper::-webkit-scrollbar { display: none; }

        .market-tab {
          padding-bottom: 15px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          color: #888;
          white-space: nowrap;
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          flex-shrink: 0;
        }
        .market-tab:hover { color: #065f46; }
        .market-tab.active { color: #065f46; }
        .market-tab.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3.5px;
          background: #febd69;
          border-radius: 10px;
        }

        .icon-glow { filter: drop-shadow(0 0 2px rgba(0,0,0,0.1)); }
        .active .icon-glow { filter: drop-shadow(0 0 5px rgba(39, 174, 96, 0.4)); }
        
        /* Remove button click outline */
        button:focus, .agri-card:focus { outline: none; }
      `}</style>

      <div className="welcome-section">
        <h1 style={{ color: "#065f46", margin: "0 0 5px 0", fontSize: "28px", fontWeight: "900" }}>
          Welcome to the Digital Gebeya 
        </h1>
        <p style={{ color: "#444", margin: 0, fontSize: "16px" }}>
          Explore fresh produce and quality livestock direct from verified Ethiopian farmers.
        </p>
        
        <div className="tab-wrapper">
          <div className={`market-tab ${activeTab === "for-you" ? "active" : ""}`} onClick={() => setActiveTab("for-you")}>For You</div>
          <div className={`market-tab ${activeTab === "recommended" ? "active" : ""}`} onClick={() => setActiveTab("recommended")}>
            <FaFire className="icon-glow" size={14} color={activeTab === "recommended" ? "#e67e22" : "#999"} /> Recommended
          </div>
          <div className={`market-tab ${activeTab === "nearby" ? "active" : ""}`} onClick={() => setActiveTab("nearby")}>
            <FaMapPin className="icon-glow" size={14} color={activeTab === "nearby" ? "#3498db" : "#999"} /> Nearby
          </div>
          <div className={`market-tab ${activeTab === "top-sellers" ? "active" : ""}`} onClick={() => setActiveTab("top-sellers")}>
            <FaMedal className="icon-glow" size={14} color={activeTab === "top-sellers" ? "#f1c40f" : "#999"} /> Top Sellers
          </div>
          <div className={`market-tab ${activeTab === "daily-deals" ? "active" : ""}`} onClick={() => setActiveTab("daily-deals")}>
            <FaPercentage className="icon-glow" size={14} color={activeTab === "daily-deals" ? "#e74c3c" : "#999"} /> Daily Deals
          </div>
          <div className={`market-tab ${activeTab === "organic" ? "active" : ""}`} onClick={() => setActiveTab("organic")}>
            <FaLeaf className="icon-glow" size={14} color={activeTab === "organic" ? "#27ae60" : "#999"} /> 100% Organic
          </div>
          <div className={`market-tab ${activeTab === "grains" ? "active" : ""}`} onClick={() => setActiveTab("grains")}>
            <GiWheat className="icon-glow" size={16} color={activeTab === "grains" ? "#d4a373" : "#999"} /> Grains & Cereals
          </div>
          <div className={`market-tab ${activeTab === "livestock-premium" ? "active" : ""}`} onClick={() => setActiveTab("livestock-premium")}>
            <GiSheep className="icon-glow" size={16} color={activeTab === "livestock-premium" ? "#7f8c8d" : "#999"} /> Premium Livestock
          </div>
          <div className={`market-tab ${activeTab === "dairy" ? "active" : ""}`} onClick={() => setActiveTab("dairy")}>
            <FaGlassWhiskey className="icon-glow" size={14} color={activeTab === "dairy" ? "#3498db" : "#999"} /> Fresh Dairy
          </div>
          <div className={`market-tab ${activeTab === "seasonal" ? "active" : ""}`} onClick={() => setActiveTab("seasonal")}>
            <FaCloudSun className="icon-glow" size={14} color={activeTab === "seasonal" ? "#f39c12" : "#999"} /> Seasonal Picks
          </div>
          <div className={`market-tab ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
            <FaBoxOpen className="icon-glow" size={14} color={activeTab === "bulk" ? "#8e44ad" : "#999"} /> Bulk Orders
          </div>
          <div className={`market-tab ${activeTab === "seeds" ? "active" : ""}`} onClick={() => setActiveTab("seeds")}>
            <FaSeedling className="icon-glow" size={14} color={activeTab === "seeds" ? "#2ecc71" : "#999"} /> Seeds & Inputs
          </div>
          <div className={`market-tab ${activeTab === "tools" ? "active" : ""}`} onClick={() => setActiveTab("tools")}>
            <FaTractor className="icon-glow" size={14} color={activeTab === "tools" ? "#34495e" : "#999"} /> Agri Tools
          </div>
          <div className={`market-tab ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}>
            <FaClock className="icon-glow" size={14} color={activeTab === "new" ? "#2980b9" : "#999"} /> Recently Added
          </div>
        </div>
      </div>

      <div className="full-edge-grid">
        {products.map((item) => (
          <div key={item.id} className="agri-card" tabIndex="0">
            <div className="image-container">
              <img 
                src={item.primary_image_url || "https://images.unsplash.com/photo-1546501078-c53c82990ddd?q=80&w=300&auto=format&fit=crop"} 
                alt={item.product_name} 
                className="product-img" 
              />
              <div style={styles.verifiedBadge}><FaShieldAlt size={11} /> VERIFIED</div>
              <div style={styles.typeBadge}>
                {item.category === "Livestock" ? <GiCow color="#5d4037" size={16}/> : <GiFruitBowl color="#e67e22" size={16}/>}
                {item.category || "Produce"}
              </div>
            </div>

            <div style={styles.textHalf}>
              <h2 style={styles.productTitle}>{item.product_name}</h2>
              <div style={styles.priceRow}>
                <span style={styles.priceMain}>ETB {item.price_per_unit}</span>
                <span style={styles.unit}>/ {item.unit || 'Qtl'}</span>
              </div>
              <div style={styles.infoRow}>
                <span><FaWarehouse size={12}/> Stock: <b>{item.quantity}</b></span>
                <span><FaTruck size={12}/> Ready to Ship</span>
              </div>
              <div style={styles.location}>
                <FaMapMarkerAlt size={11} /> {item.location || "Ethiopia"}
              </div>
              <div style={styles.ratingRow}>
                {[...Array(5)].map((_, i) => <FaStar key={i} color="#febd69" size={13} />)}
                <span style={{fontSize: '12px', color: '#666', marginLeft: '5px'}}>(4.8)</span>
              </div>
              <button style={styles.contactBtn}>Negotiate Price</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { width: "100%", background: "#ffffff", minHeight: "100vh" },
  textHalf: { padding: "18px", display: "flex", flexDirection: "column", flex: 1, gap: '10px' },
  productTitle: { fontSize: "19px", fontWeight: "700", color: "#111", margin: 0 },
  priceRow: { display: "flex", alignItems: "baseline", gap: "5px" },
  priceMain: { fontSize: "26px", fontWeight: "800", color: "#111" },
  unit: { fontSize: "14px", color: "#666" },
  infoRow: { display: 'flex', gap: '15px', fontSize: '13px', color: '#333' },
  location: { fontSize: "12px", color: "#888", display: 'flex', alignItems: 'center', gap: '5px' },
  ratingRow: { display: "flex", alignItems: 'center', gap: "3px" },
  verifiedBadge: {
    position: "absolute", top: "12px", left: "12px", background: "#27ae60",
    color: "white", padding: "5px 12px", fontSize: "11px", fontWeight: "800", borderRadius: "4px",
    zIndex: 2, display: "flex", alignItems: "center", gap: "5px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  typeBadge: {
    position: "absolute", bottom: "12px", right: "12px", background: "#fff",
    padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold",
    display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)", zIndex: 2
  },
  contactBtn: { 
    width: "100%", marginTop: "auto", padding: "14px", borderRadius: "25px", border: "none", 
    color: "#fff", background: "linear-gradient(90deg, #ff9000 0%, #ff5000 100%)", fontWeight: "bold", fontSize: "14px", cursor: 'pointer', outline: 'none'
  },
  loader: { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#065f46', fontWeight: 'bold' }
};

export default BuyerMarketplace;
