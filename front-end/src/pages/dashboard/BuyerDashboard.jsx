import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { 
  FaShieldAlt, FaMapMarkerAlt, FaStar, FaWarehouse, FaTruck, 
  FaFire, FaMapPin, FaMedal, FaPercentage, FaLeaf, FaBoxOpen, 
  FaClock, FaSeedling, FaCloudSun, FaTractor, FaGlassWhiskey,
  FaShoppingCart
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

  if (loading) return <div style={styles.loader}>Loading Fasika Marketplace...</div>;

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        body, html { 
            margin: 0; padding: 0; 
            background: #ffffff !important; 
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
        }

        .tab-wrapper {
          display: flex;
          gap: 35px;
          margin-top: 30px;
          overflow-x: auto;
          scrollbar-width: none; 
          -ms-overflow-style: none;
          padding-bottom: 5px;
        }
        .tab-wrapper::-webkit-scrollbar { display: none; }

        .market-tab {
          padding-bottom: 15px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 800; 
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

        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 30px; 
          padding: 30px 25px; 
          background: #ffffff;
        }

        .agri-card { 
          background: #ffffff; 
          display: flex; 
          flex-direction: column; 
          position: relative;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          min-height: 463px; /* Taller height as requested */
        }
        
        .agri-card:hover { 
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          transform: translateY(-5px);
        }

        .image-container { 
          aspect-ratio: 1/1; 
          width: 100%; 
          overflow: hidden; 
          position: relative; 
          background: #fcfcfc; 
          border-radius: 12px;
        }
        .product-img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          transition: transform 0.7s ease; 
        }
        .agri-card:hover .product-img { 
          transform: scale(1.15); /* Smooth Zoom */
        }

        .product-description {
            font-size: 13px; color: #666; line-height: 1.5; margin-top: 8px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
            overflow: hidden; text-overflow: ellipsis; height: 38px;
        }

        .buy-now-btn {
            width: 100%; margin-top: auto; padding: 14px; border-radius: 30px; 
            border: none; background: #ff9900; color: #ffffff; 
            font-weight: 800; font-size: 14px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: all 0.3s;
        }
        .buy-now-btn:hover { background: #e68a00; transform: scale(1.02); }
      `}</style>

      <div className="welcome-section" style={styles.welcomeSection}>
        <h1 style={styles.mainTitle}>Digital Gebeya Market</h1>
        <p style={styles.subTitle}>Premium fresh produce and livestock directly from verified sources.</p>
        
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
          <div key={item.id} className="agri-card">
            <div className="image-container">
              <img 
                src={item.primary_image_url || "https://via.placeholder.com/300"} 
                alt={item.product_name} 
                className="product-img" 
              />
              <div style={styles.verifiedBadge}><FaShieldAlt size={10} /> VERIFIED</div>
            </div>

            <div style={styles.textHalf}>
              <h2 style={styles.productTitle}>{item.product_name}</h2>
              
              <p className="product-description">
                {item.description || "Premium quality product sourced from verified local suppliers. Guaranteed freshness and fast delivery."}
              </p>

              <div style={styles.priceRow}>
                <span style={styles.priceMain}>ETB {item.price_per_unit}</span>
                <span style={styles.unit}>/ {item.unit || 'Qtl'}</span>
              </div>

              <div style={styles.infoRow}>
                <span><FaWarehouse size={12}/> Stock: <b>{item.quantity}</b></span>
                <div style={styles.ratingRow}>
                   <FaStar color="#ffcc00" size={12} />
                   <span style={{fontSize: '12px', fontWeight: '800'}}>4.8</span>
                </div>
              </div>

              <div style={styles.location}>
                <FaMapMarkerAlt size={11} /> {item.location || "Ethiopia"}
              </div>

              <button className="buy-now-btn">
                <FaShoppingCart size={14} /> Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { width: "100%", background: "#ffffff", minHeight: "100vh" },
  welcomeSection: { padding: "50px 25px 0px", background: "#ffffff", borderBottom: "1px solid #f5f5f5" },
  mainTitle: { color: "#000", margin: "0 0 8px 0", fontSize: "32px", fontWeight: "900", letterSpacing: "-0.5px" },
  subTitle: { color: "#666", margin: 0, fontSize: "17px", fontWeight: "500" },
  textHalf: { padding: "20px 0px", display: "flex", flexDirection: "column", flex: 1 },
  productTitle: { fontSize: "18px", fontWeight: "800", color: "#111", margin: 0 },
  priceRow: { display: "flex", alignItems: "baseline", gap: "5px", margin: "10px 0 5px" },
  priceMain: { fontSize: "24px", fontWeight: "900", color: "#000" },
  unit: { fontSize: "14px", color: "#666", fontWeight: "600" },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#111' },
  location: { fontSize: "12px", color: "#888", display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', marginBottom: '15px', fontWeight: '600' },
  ratingRow: { display: "flex", alignItems: 'center', gap: "3px" },
  verifiedBadge: { position: "absolute", top: "12px", left: "12px", background: "rgba(255,255,255,0.95)", color: "#00b411", padding: "4px 10px", fontSize: "10px", fontWeight: "900", borderRadius: "6px", zIndex: 2, border: "1px solid #00b411" },
  loader: { textAlign: 'center', padding: '100px', fontSize: '20px', fontWeight: '900' }
};

export default BuyerMarketplace;
