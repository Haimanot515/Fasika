import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { 
  FaShieldAlt, FaMapMarkerAlt, FaStar, FaWarehouse, FaTruck, 
  FaFire, FaMapPin, FaMedal, FaPercentage, FaLeaf, FaBoxOpen, 
  FaClock, FaSeedling, FaCloudSun, FaTractor, FaGlassWhiskey,
  FaShoppingCart
} from "react-icons/fa";
import { GiWheat, GiSheep } from "react-icons/gi";

const BuyerMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        // Fetching data - ensure 'description' is included in your database query
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

        /* 1. Seamless Horizontal List (No Scrollbar) */
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
          font-weight: 700; 
          color: #999;
          white-space: nowrap;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }
        .market-tab.active { color: #000; }
        .market-tab.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #ff9900;
        }

        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
          gap: 30px; 
          padding: 30px 25px; 
          background: #ffffff;
        }

        /* 2. Seamless Card Look */
        .agri-card { 
          background: #ffffff; 
          display: flex; 
          flex-direction: column; 
          position: relative;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          min-height: 463px; /* Added 3px to base height */
        }
        
        .agri-card:hover { 
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          transform: translateY(-5px);
        }

        /* 3. Image Zoom Effect */
        .image-container { 
          aspect-ratio: 1/1; 
          width: 100%; 
          overflow: hidden; 
          position: relative; 
          background: #fcfcfc; 
          border-radius: 8px;
        }
        .product-img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          transition: transform 0.6s ease; 
        }
        .agri-card:hover .product-img { 
          transform: scale(1.12); 
        }

        .verified-badge { 
          position: absolute; top: 10px; left: 10px; 
          background: rgba(255,255,255,0.95); 
          color: #00b411; padding: 3px 8px; font-size: 10px; 
          font-weight: 800; border-radius: 4px; z-index: 2; border: 1px solid #00b411;
        }

        .product-description {
            font-size: 13px; color: #666; line-height: 1.5; margin-top: 8px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
            overflow: hidden; text-overflow: ellipsis; height: 38px;
        }

        .buy-now-btn {
            width: 100%; margin-top: auto; padding: 12px; border-radius: 6px; 
            border: none; background: #ff9900; color: #ffffff; 
            font-weight: 700; font-size: 14px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: background 0.2s;
        }
        .buy-now-btn:hover { background: #e68a00; }
      `}</style>

      <div className="welcome-section" style={styles.welcomeSection}>
        <h1 style={styles.mainTitle}>Digital Gebeya Market</h1>
        <p style={styles.subTitle}>Premium fresh produce and livestock directly from verified sources.</p>
        
        <div className="tab-wrapper">
          <div className={`market-tab ${activeTab === "for-you" ? "active" : ""}`} onClick={() => setActiveTab("for-you")}>For You</div>
          <div className={`market-tab ${activeTab === "recommended" ? "active" : ""}`} onClick={() => setActiveTab("recommended")}><FaFire size={14} color={activeTab === "recommended" ? "#ff4500" : "#bbb"} /> Recommended</div>
          <div className={`market-tab ${activeTab === "grains" ? "active" : ""}`} onClick={() => setActiveTab("grains")}><GiWheat size={16} color={activeTab === "grains" ? "#d4a373" : "#bbb"} /> Grains</div>
          <div className={`market-tab ${activeTab === "livestock-premium" ? "active" : ""}`} onClick={() => setActiveTab("livestock-premium")}><GiSheep size={16} color={activeTab === "livestock-premium" ? "#8e8e93" : "#bbb"} /> Livestock</div>
          <div className={`market-tab ${activeTab === "tools" ? "active" : ""}`} onClick={() => setActiveTab("tools")}><FaTractor size={14} color={activeTab === "tools" ? "#5856d6" : "#bbb"} /> Agri Tools</div>
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
              <div className="verified-badge"><FaShieldAlt size={10} /> VERIFIED</div>
            </div>

            <div style={styles.textHalf}>
              <h2 style={styles.productTitle}>{item.product_name}</h2>
              
              {/* Description fetched from database */}
              <p className="product-description">
                {item.description || "Premium quality product sourced from verified local suppliers. Guaranteed freshness for all orders."}
              </p>

              <div style={styles.priceRow}>
                <span style={styles.priceMain}>ETB {item.price_per_unit}</span>
                <span style={styles.unit}>/ {item.unit || 'Qtl'}</span>
              </div>

              <div style={styles.infoRow}>
                <span><FaWarehouse size={12}/> Stock: <b>{item.quantity}</b></span>
                <div style={styles.ratingRow}>
                   <FaStar color="#ffcc00" size={12} />
                   <span style={{fontSize: '12px', fontWeight: '700'}}>4.8</span>
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
  welcomeSection: { padding: "40px 25px 0px", background: "#ffffff" },
  mainTitle: { color: "#000", margin: "0 0 8px 0", fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" },
  subTitle: { color: "#666", margin: 0, fontSize: "16px", fontWeight: "500" },
  textHalf: { padding: "12px 0px", display: "flex", flexDirection: "column", flex: 1 },
  productTitle: { fontSize: "16px", fontWeight: "700", color: "#111", margin: 0 },
  priceRow: { display: "flex", alignItems: "baseline", gap: "5px", margin: "8px 0 4px" },
  priceMain: { fontSize: "20px", fontWeight: "800", color: "#000" },
  unit: { fontSize: "13px", color: "#666", fontWeight: "600" },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#444' },
  location: { fontSize: "11px", color: "#999", display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', marginBottom: '12px' },
  ratingRow: { display: "flex", alignItems: 'center', gap: "3px" },
  loader: { textAlign: 'center', padding: '100px', fontSize: '18px', fontWeight: '800' }
};

export default BuyerMarketplace;
