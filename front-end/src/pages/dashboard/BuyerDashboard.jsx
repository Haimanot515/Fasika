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
        /* Global Brightness Reset */
        body, html { margin: 0; padding: 0; background: #ffffff !important; }

        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 25px; 
          padding: 25px; 
          width: 100%;
          box-sizing: border-box;
          background: #ffffff;
        }

        .agri-card { 
          background: #ffffff; 
          height: 500px; 
          cursor: pointer; 
          display: flex; 
          flex-direction: column; 
          border-radius: 12px; 
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 1px solid #f2f2f2;
          position: relative;
          outline: none;
          user-select: none;
        }
        
        .agri-card:hover { 
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-8px);
          border-color: #eee;
        }

        /* Smooth Zoom Effect */
        .image-container { 
          height: 230px; 
          width: 100%; 
          overflow: hidden; 
          position: relative; 
          background: #ffffff; 
        }
        .product-img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          transition: transform 0.7s ease; 
        }
        .agri-card:hover .product-img { 
          transform: scale(1.15); 
        }

        .welcome-section {
          padding: 50px 25px 0px;
          background: #ffffff;
          border-bottom: 1px solid #f5f5f5;
        }

        .tab-wrapper {
          display: flex;
          gap: 35px;
          margin-top: 30px;
          overflow-x: auto;
          scrollbar-width: none; 
          -ms-overflow-style: none;
        }
        .tab-wrapper::-webkit-scrollbar { display: none; }

        .market-tab {
          padding-bottom: 15px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 800; /* Bold for brightness/legibility */
          color: #999;
          white-space: nowrap;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          flex-shrink: 0;
        }
        .market-tab:hover { color: #111; }
        .market-tab.active { color: #000; }
        .market-tab.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: #ff9900;
          border-radius: 10px;
        }

        /* Clean badges */
        .verified-badge {
          position: absolute; top: 15px; left: 15px; background: #00b411;
          color: white; padding: 5px 12px; fontSize: 11px; fontWeight: 900; 
          borderRadius: 4px; zIndex: 2; display: flex; alignItems: center; gap: 5px;
          box-shadow: 0 4px 10px rgba(0,180,17,0.3);
        }

        .type-badge {
          position: absolute; bottom: 15px; right: 15px; background: #ffffff;
          padding: 7px 15px; borderRadius: 30px; fontSize: 11px; fontWeight: 900;
          display: flex; alignItems: center; gap: 8px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1); zIndex: 2; color: #111;
        }
        
        button:focus, .agri-card:focus { outline: none; }
      `}</style>

      <div className="welcome-section">
        <h1 style={{ color: "#000", margin: "0 0 8px 0", fontSize: "32px", fontWeight: "900", letterSpacing: "-0.5px" }}>
          Digital Gebeya Market
        </h1>
        <p style={{ color: "#666", margin: 0, fontSize: "17px", fontWeight: "500" }}>
          Premium fresh produce and livestock directly from verified sources.
        </p>
        
        <div className="tab-wrapper">
          <div className={`market-tab ${activeTab === "for-you" ? "active" : ""}`} onClick={() => setActiveTab("for-you")}>For You</div>
          <div className={`market-tab ${activeTab === "recommended" ? "active" : ""}`} onClick={() => setActiveTab("recommended")}>
            <FaFire size={14} color={activeTab === "recommended" ? "#ff4500" : "#bbb"} /> Recommended
          </div>
          <div className={`market-tab ${activeTab === "nearby" ? "active" : ""}`} onClick={() => setActiveTab("nearby")}>
            <FaMapPin size={14} color={activeTab === "nearby" ? "#007aff" : "#bbb"} /> Nearby
          </div>
          <div className={`market-tab ${activeTab === "top-sellers" ? "active" : ""}`} onClick={() => setActiveTab("top-sellers")}>
            <FaMedal size={14} color={activeTab === "top-sellers" ? "#ffcc00" : "#bbb"} /> Top Sellers
          </div>
          <div className={`market-tab ${activeTab === "daily-deals" ? "active" : ""}`} onClick={() => setActiveTab("daily-deals")}>
            <FaPercentage size={14} color={activeTab === "daily-deals" ? "#ff3b30" : "#bbb"} /> Daily Deals
          </div>
          <div className={`market-tab ${activeTab === "organic" ? "active" : ""}`} onClick={() => setActiveTab("organic")}>
            <FaLeaf size={14} color={activeTab === "organic" ? "#34c759" : "#bbb"} /> 100% Organic
          </div>
          <div className={`market-tab ${activeTab === "grains" ? "active" : ""}`} onClick={() => setActiveTab("grains")}>
            <GiWheat size={16} color={activeTab === "grains" ? "#d4a373" : "#bbb"} /> Grains
          </div>
          <div className={`market-tab ${activeTab === "livestock-premium" ? "active" : ""}`} onClick={() => setActiveTab("livestock-premium")}>
            <GiSheep size={16} color={activeTab === "livestock-premium" ? "#8e8e93" : "#bbb"} /> Premium Livestock
          </div>
          <div className={`market-tab ${activeTab === "dairy" ? "active" : ""}`} onClick={() => setActiveTab("dairy")}>
            <FaGlassWhiskey size={14} color={activeTab === "dairy" ? "#5ac8fa" : "#bbb"} /> Fresh Dairy
          </div>
          <div className={`market-tab ${activeTab === "seasonal" ? "active" : ""}`} onClick={() => setActiveTab("seasonal")}>
            <FaCloudSun size={14} color={activeTab === "seasonal" ? "#ff9500" : "#bbb"} /> Seasonal
          </div>
          <div className={`market-tab ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
            <FaBoxOpen size={14} color={activeTab === "bulk" ? "#af52de" : "#bbb"} /> Bulk Orders
          </div>
          <div className={`market-tab ${activeTab === "seeds" ? "active" : ""}`} onClick={() => setActiveTab("seeds")}>
            <FaSeedling size={14} color={activeTab === "seeds" ? "#30d158" : "#bbb"} /> Seeds
          </div>
          <div className={`market-tab ${activeTab === "tools" ? "active" : ""}`} onClick={() => setActiveTab("tools")}>
            <FaTractor size={14} color={activeTab === "tools" ? "#5856d6" : "#bbb"} /> Agri Tools
          </div>
          <div className={`market-tab ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}>
            <FaClock size={14} color={activeTab === "new" ? "#007aff" : "#bbb"} /> New
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
              <div className="verified-badge"><FaShieldAlt size={11} /> VERIFIED</div>
              <div className="type-badge">
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
                <span><FaTruck size={12}/> Ready</span>
              </div>
              <div style={styles.location}>
                <FaMapMarkerAlt size={11} /> {item.location || "Ethiopia"}
              </div>
              <div style={styles.ratingRow}>
                {[...Array(5)].map((_, i) => <FaStar key={i} color="#ffcc00" size={13} />)}
                <span style={{fontSize: '12px', color: '#111', fontWeight: '700', marginLeft: '5px'}}>4.8</span>
              </div>
              <button style={styles.contactBtn}>Contact Supplier</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { width: "100%", background: "#ffffff", minHeight: "100vh" },
  textHalf: { padding: "20px", display: "flex", flexDirection: "column", flex: 1, gap: '10px' },
  productTitle: { fontSize: "20px", fontWeight: "800", color: "#000", margin: 0, letterSpacing: "-0.3px" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "5px" },
  priceMain: { fontSize: "28px", fontWeight: "900", color: "#000" },
  unit: { fontSize: "15px", color: "#666", fontWeight: "600" },
  infoRow: { display: 'flex', gap: '15px', fontSize: '14px', color: '#111', fontWeight: '500' },
  location: { fontSize: "13px", color: "#888", display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' },
  ratingRow: { display: "flex", alignItems: 'center', gap: "3px" },
  contactBtn: { 
    width: "100%", marginTop: "auto", padding: "15px", borderRadius: "30px", border: "none", 
    color: "#fff", background: "linear-gradient(90deg, #ff9000 0%, #ff5000 100%)", fontWeight: "900", fontSize: "15px", cursor: 'pointer', outline: 'none',
    boxShadow: "0 10px 20px rgba(255, 80, 0, 0.2)"
  },
  loader: { textAlign: 'center', padding: '100px', fontSize: '20px', color: '#111', fontWeight: '900' }
};

export default BuyerMarketplace;
