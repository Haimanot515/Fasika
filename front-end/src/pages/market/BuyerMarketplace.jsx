import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios"; 
import { 
  FaSearch, FaShieldAlt, FaMapMarkerAlt, FaEnvelope 
} from "react-icons/fa";

const BuyerMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMarketplace = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const { data } = await api.get(`/buyer/marketplace/public?page=${page}&limit=12`);
      const newProducts = data.data || [];
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Marketplace Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchMarketplace();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentHeight = window.innerHeight + document.documentElement.scrollTop;
      
      if (currentHeight + 100 >= scrollHeight) {
        fetchMarketplace();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMarketplace]);

  const categories = [
    "Cereals & Grains", "Fruits & Vegetables", "Oilseeds", "Livestock", 
    "Spices & Herbs", "Processed Goods", "Dairy Products", "Poultry", 
    "Coffee & Tea", "Pulses", "Tubers & Roots", "Agricultural Tools",
    "Organic Fertilizers", "Animal Feed", "Honey & Wax", "Textile Fibers"
  ];
  
  const filtered = products.filter(p =>
    p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={premiumStyles.pageWrapper}>
      <style>{`
        /* 1. Max Brightness Pure White Background */
        body, html { 
          margin: 0; 
          padding: 0; 
          overflow-x: hidden; 
          background: #ffffff !important; 
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
        }
        
        .amazon-header { background-color: #000000; padding: 12px 20px; display: flex; align-items: center; gap: 30px; position: sticky; top: 0; z-index: 1001; }
        
        .search-container-amazon { 
          display: flex; flex: 1; max-width: 700px; height: 42px; 
          border-radius: 0px; 
          overflow: hidden; background-color: #ffffff; border: 2px solid #000; 
        }
        .search-input-amazon { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 16px; color: #000; font-weight: 700; }
        .search-button-amazon { background-color: #ff9900; border: none; width: 55px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #fff; }
        
        .category-scroll-wrapper { background: #ffffff; padding: 15px 20px; overflow-x: auto; white-space: nowrap; display: flex; gap: 30px; border-bottom: 3px solid #f9f9f9; }
        .category-scroll-wrapper::-webkit-scrollbar { display: none; }

        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 30px; 
          width: 100%;
          padding: 40px; 
          background-color: #ffffff; /* Pure white space between cards */
          box-sizing: border-box;
        }

        /* 2. 3D Floating Card Style (Sharp edges) */
        .alibaba-card { 
          background: #ffffff; 
          display: flex; 
          flex-direction: column; 
          border-radius: 0px; 
          position: relative; 
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid #f0f0f0;
          cursor: pointer;
          /* High contrast shadow for 3D depth */
          box-shadow: 0 10px 20px rgba(0,0,0,0.08), 0 6px 6px rgba(0,0,0,0.1);
        }
        
        .alibaba-card:hover { 
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 38px rgba(0,0,0,0.15), 0 15px 12px rgba(0,0,0,0.12);
          outline: 3px solid #ff6600;
          z-index: 10;
        }

        .image-container { 
          aspect-ratio: 1/1; 
          width: 100%; 
          overflow: hidden; 
          position: relative; 
          background: #fff; 
          border-bottom: 1px solid #eee;
        }
        
        .product-img { width: 100%; height: 100%; object-fit: cover; }

        .verified-badge { 
          position: absolute; 
          top: 0; 
          left: 0; 
          background: #00b411; 
          color: #ffffff; 
          padding: 6px 12px; 
          font-size: 13px; 
          font-weight: 900; 
          border-radius: 0px; 
          z-index: 2; 
        }

        .alibaba-contact-btn {
            width: 100%;
            margin-top: 15px;
            padding: 14px;
            border-radius: 0px; 
            border: none;
            background: #ff6600;
            color: #ffffff;
            font-weight: 900;
            font-size: 16px;
            text-transform: uppercase;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 4px 0 #cc5200; /* 3D effect on button */
        }
        .alibaba-contact-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #cc5200; }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-spinner { width: 45px; height: 45px; border: 6px solid #f3f3f3; border-top: 6px solid #ff6600; border-radius: 50%; animation: spin 1s linear infinite; }
      `}</style>
      
      <div className="amazon-header">
        <div style={premiumStyles.logo}>
            FASIKA<span style={{ color: "#ff6600" }}>MARKET</span>
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <div className="search-container-amazon">
            <input 
              type="text" 
              className="search-input-amazon" 
              placeholder="SEARCH MARKETPLACE..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button-amazon"><FaSearch size={20} /></button>
          </div>
        </div>
      </div>

      <nav className="category-scroll-wrapper">
        {categories.map(cat => (
          <span key={cat} style={premiumStyles.categoryItem}>{cat}</span>
        ))}
      </nav>

      <div className="full-edge-grid">
        {filtered.map((item, index) => (
          <div key={`${item.id}-${index}`} className="alibaba-card">
            <div className="image-container">
              <img 
                src={item.primary_image_url || "https://via.placeholder.com/400"} 
                alt={item.product_name} 
                className="product-img" 
              />
              <div className="verified-badge"><FaShieldAlt size={16} /> VERIFIED</div>
            </div>

            <div style={premiumStyles.textHalf}>
              <h2 style={premiumStyles.productTitle}>{item.product_name}</h2>
              <div style={premiumStyles.priceRow}>
                <span style={premiumStyles.priceMain}>ETB {item.price_per_unit}</span>
                <span style={premiumStyles.unit}>/{item.unit || 'QTL'}</span>
              </div>
              <div style={premiumStyles.stockInfo}>AVAILABILITY: {item.quantity} UNITS</div>
              <div style={premiumStyles.location}><FaMapMarkerAlt size={14} /> ETHIOPIA</div>
              <button className="alibaba-contact-btn">
                <FaEnvelope /> SEND INQUIRY
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={premiumStyles.bottomArea}>
        {loading && <div className="loading-spinner"></div>}
        {!hasMore && products.length > 0 && (
          <span style={{color: '#000', fontSize: '20px', fontWeight: '900', letterSpacing: '2px'}}>END OF MARKET</span>
        )}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh", background: "#ffffff" },
  logo: { fontSize: "30px", fontWeight: "900", color: "#ffffff", whiteSpace: "nowrap", letterSpacing: "2px" },
  categoryItem: { fontSize: "16px", fontWeight: "900", color: "#000", cursor: "pointer", textTransform: "uppercase" },
  textHalf: { padding: "24px", display: "flex", flexDirection: "column", background: "#ffffff" },
  productTitle: { fontSize: "22px", fontWeight: "900", color: "#000", height: "58px", overflow: "hidden", lineHeight: "1.2", marginBottom: "10px", textTransform: "uppercase" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "5px", margin: "10px 0" },
  priceMain: { fontSize: "28px", fontWeight: "900", color: "#ff6600" }, 
  unit: { fontSize: "18px", color: "#000", fontWeight: "800" },
  stockInfo: { fontSize: "14px", color: "#000", fontWeight: "900", marginTop: "5px", letterSpacing: "1px" },
  location: { fontSize: "15px", color: "#444", fontWeight: "800", marginTop: "15px" },
  bottomArea: { width: "100%", padding: "80px 0", display: "flex", justifyContent: "center", background: "#ffffff" }
};

export default BuyerMarketplace;
