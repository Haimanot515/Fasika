import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { FaMapMarkerAlt, FaStar, FaWarehouse, FaTruck, FaFire, FaMapPin, FaMedal, FaPercentage, FaLeaf, FaBoxOpen, FaClock, FaSeedling, FaCloudSun, FaTractor, FaGlassWhiskey } from "react-icons/fa";
import { GiSheep, GiWheat } from "react-icons/gi";

const BuyerMarketplace = ({ searchCriteria }) => { // Accept search data
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]); // Added for filtering
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const { data } = await api.get("/buyer/marketplace/public");
        setProducts(data.data || []);
        setDisplayProducts(data.data || []);
      } catch (err) {
        console.error("Marketplace Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  // Filter Logic: Runs when searchCriteria changes
  useEffect(() => {
    if (!searchCriteria) return;
    const { term, category } = searchCriteria;
    
    let filtered = products.filter(item => {
      const matchTerm = item.product_name.toLowerCase().includes(term.toLowerCase());
      const matchCat = category === "All" || item.category === category;
      return matchTerm && matchCat;
    });
    
    setDisplayProducts(filtered);
  }, [searchCriteria, products]);

  if (loading) return <div style={styles.loader}>Loading Fasika Marketplace Grid...</div>;

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        /* Global Brightness Reset kept exactly the same */
        body, html { margin: 0; padding: 0; background: #ffffff !important; }
        .full-edge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding: 25px; width: 100%; box-sizing: border-box; background: #ffffff; }
        .agri-card { background: #ffffff; height: 500px; cursor: pointer; display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); border: 1px solid #f2f2f2; position: relative; outline: none; user-select: none; }
        .agri-card:hover { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); transform: translateY(-8px); border-color: #eee; }
        .image-container { height: 230px; width: 100%; overflow: hidden; position: relative; background: #ffffff; }
        .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
        .agri-card:hover .product-img { transform: scale(1.15); }
        .welcome-section { padding: 50px 25px 0px; background: #ffffff; border-bottom: 1px solid #f5f5f5; }
        .tab-wrapper { display: flex; gap: 35px; margin-top: 30px; overflow-x: auto; scrollbar-width: none; }
        .market-tab { padding-bottom: 15px; cursor: pointer; font-size: 15px; font-weight: 800; color: #999; white-space: nowrap; transition: 0.2s; display: flex; align-items: center; gap: 10px; position: relative; flex-shrink: 0; }
        .market-tab.active { color: #000; }
        .market-tab.active::after { content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: #ff9900; border-radius: 10px; }
      `}</style>

      <div className="welcome-section">
        <h1 style={{ color: "#000", margin: "0 0 8px 0", fontSize: "32px", fontWeight: "900", letterSpacing: "-0.5px" }}>Digital Gebeya Market</h1>
        {/* ... Tab Wrapper code remains the same ... */}
      </div>

      <div className="full-edge-grid">
        {displayProducts.map((item) => ( // Changed to map over filtered list
          <div key={item.id} className="agri-card" tabIndex="0">
            <div className="image-container">
              <img src={item.primary_image_url || "https://images.unsplash.com/photo-1546501078-c53c82990ddd"} alt={item.product_name} className="product-img" />
            </div>
            <div style={styles.textHalf}>
              <h2 style={styles.productTitle}>{item.product_name}</h2>
              <div style={styles.priceRow}><span style={styles.priceMain}>ETB {item.price_per_unit}</span><span style={styles.unit}>/ {item.unit || 'Qtl'}</span></div>
              <div style={styles.infoRow}><span><FaWarehouse size={12}/> Stock: <b>{item.quantity}</b></span><span><FaTruck size={12}/> Ready</span></div>
              <div style={styles.location}><FaMapMarkerAlt size={11} /> {item.location || "Ethiopia"}</div>
              <button style={styles.contactBtn}>Contact Supplier</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles remain exactly as you provided...
const styles = { /* ... your styles ... */ };

export default BuyerMarketplace;
