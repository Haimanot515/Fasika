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
        /* 1. Pure White Background & No Corners */
        body, html { 
          margin: 0; 
          padding: 0; 
          overflow-x: hidden; 
          background: #ffffff !important; 
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
        }
        
        /* Keep Header Unchanged but Remove Corners from Search */
        .amazon-header { background-color: #000000; padding: 12px 20px; display: flex; align-items: center; gap: 30px; position: sticky; top: 0; z-index: 1001; }
        
        .search-container-amazon { 
          display: flex; flex: 1; max-width: 700px; height: 42px; 
          border-radius: 0px; /* Removed corners */
          overflow: hidden; background-color: #ffffff; border: 1px solid #000; 
        }
        .search-input-amazon { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 16px; color: #000; font-weight: 600; }
        .search-button-amazon { background-color: #ff9900; border: none; width: 55px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #fff; }
        
        .category-scroll-wrapper { background: #ffffff; padding: 15px 20px; overflow-x: auto; white-space: nowrap; display: flex; gap: 30px; border-bottom: 2px solid #f0f0f0; }
        .category-scroll-wrapper::-webkit-scrollbar { display: none; }

        /* Sharp Grid */
        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
          gap: 1px; /* Minimal gap for a high-density market look */
          width: 100%;
          padding: 0px; 
          background-color: #f0f0f0; /* Creates fine lines between white cards */
          box-sizing: border-box;
        }

        /* 2. Sharp Corners (avoid corners) & Pure White */
        .alibaba-card { 
          background: #ffffff; 
          display: flex; 
          flex-direction: column; 
          border-radius: 0px; /* Sharp edges */
          position: relative; 
          overflow: hidden;
          transition: background 0.2s;
          border: none;
          cursor: pointer;
        }
        
        .alibaba-card:hover { 
          background: #fdfdfd;
          outline: 2px solid #ff6600;
          z-index: 10;
        }

        .image-container { 
          aspect-ratio: 1/1; 
          width: 100%; 
          overflow: hidden; 
          position: relative; 
          background: #ffffff; 
        }
        
        .product-img { width: 100%; height: 100%; object-fit: cover; }

        .verified-badge { 
          position: absolute; 
          top: 0; 
          left: 0; 
          background: #00b411; 
          color: #ffffff; 
          padding: 4px 10px; 
          font-size: 12px; 
          font-weight: 900; 
          border-radius: 0px; /* Sharp edge */
          z-index: 2; 
        }

        /* 3. High Brightness Contact Button */
        .alibaba-contact-btn {
            width: 100%;
            margin-top: 15px;
            padding: 12px;
            border-radius: 0px; /* Sharp edge */
            border: none;
            background: #ff6600;
            color: #ffffff;
            font-weight: 900;
            font-size: 15px;
            text-transform: uppercase;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .alibaba-contact-btn:hover { background: #e65c00; }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-spinner { width: 40px; height: 40px; border: 5px solid #f3f3f3; border-top: 5px solid #ff6600; border-radius: 50%; animation: spin 1s linear infinite; }
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
              placeholder="Search marketplace..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button-amazon"><FaSearch size={18} /></button>
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
                src={item.primary_image_url || "https://via.placeholder.com/300"} 
                alt={item.product_name} 
                className="product-img" 
              />
              <div className="verified-badge"><FaShieldAlt size={14} /> VERIFIED</div>
            </div>

            <div style={premiumStyles.textHalf}>
              <h2 style={premiumStyles.productTitle}>{item.product_name}</h2>
              <div style={premiumStyles.priceRow}>
                <span style={premiumStyles.priceMain}>ETB {item.price_per_unit}</span>
                <span style={premiumStyles.unit}>/{item.unit || 'Qtl'}</span>
              </div>
              <div style={premiumStyles.stockInfo}>STOCK: {item.quantity} UNITS</div>
              <div style={premiumStyles.location}><FaMapMarkerAlt size={13} /> ETHIOPIA</div>
              <button className="alibaba-contact-btn">
                <FaEnvelope /> CONTACT SUPPLIER
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={premiumStyles.bottomArea}>
        {loading && <div className="loading-spinner"></div>}
        {!hasMore && products.length > 0 && (
          <span style={{color: '#000', fontSize: '18px', fontWeight: '900'}}>END OF RESULTS</span>
        )}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh", background: "#ffffff" },
  logo: { fontSize: "28px", fontWeight: "900", color: "#ffffff", whiteSpace: "nowrap", letterSpacing: "1px" },
  categoryItem: { fontSize: "16px", fontWeight: "800", color: "#000", cursor: "pointer", textTransform: "uppercase" },
  textHalf: { padding: "20px", display: "flex", flexDirection: "column", background: "#ffffff" },
  productTitle: { fontSize: "20px", fontWeight: "800", color: "#000", height: "52px", overflow: "hidden", lineHeight: "1.3", marginBottom: "8px", textTransform: "uppercase" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "4px", margin: "8px 0" },
  priceMain: { fontSize: "26px", fontWeight: "900", color: "#ff6600" }, // Bright orange price
  unit: { fontSize: "16px", color: "#000", fontWeight: "700" },
  stockInfo: { fontSize: "14px", color: "#000", fontWeight: "800", marginTop: "4px" },
  location: { fontSize: "14px", color: "#666", fontWeight: "700", marginTop: "12px" },
  bottomArea: { width: "100%", padding: "60px 0", display: "flex", justifyContent: "center", background: "#ffffff" }
};

export default BuyerMarketplace;
