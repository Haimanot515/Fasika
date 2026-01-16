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
        /* 2. Real Market Brightness (White Background) */
        body, html { margin: 0; padding: 0; overflow-x: hidden; background: #ffffff; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        
        .amazon-header { background-color: #ff6600; padding: 10px 20px; display: flex; align-items: center; gap: 30px; position: sticky; top: 0; z-index: 1001; }
        
        /* Black Search Bar Implementation */
        .search-container-amazon { 
          display: flex; 
          flex: 1; 
          max-width: 700px; 
          height: 42px; 
          border-radius: 20px; 
          overflow: hidden; 
          background-color: #000000; 
          border: 1px solid #333;
        }
        .search-input-amazon { 
          flex: 1; 
          border: none; 
          padding: 0 20px; 
          outline: none; 
          font-size: 15px; 
          background: transparent; 
          color: #ffffff; 
        }
        .search-input-amazon::placeholder { color: #888; }
        .search-button-amazon { background-color: #febd69; border: none; width: 60px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #000; }
        
        /* 5. Horizontal Category Scroll (Hidden scrollbar) */
        .category-scroll-wrapper { 
          background: #f8f8f8; 
          padding: 12px 20px; 
          overflow-x: auto; 
          white-space: nowrap; 
          display: flex; 
          gap: 35px; 
          scrollbar-width: none; 
          border-bottom: 1px solid #ddd;
        }
        .category-scroll-wrapper::-webkit-scrollbar { display: none; }

        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
          gap: 20px; 
          width: 100%;
          padding: 20px; 
          box-sizing: border-box;
          min-height: 500px; /* 4. Keeps fetched items visible */
        }

        .alibaba-card { 
          background: #ffffff; 
          height: 470px; 
          display: flex; 
          flex-direction: column; 
          border-radius: 12px; 
          position: relative; 
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #eee;
        }
        
        .alibaba-card:hover { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border-color: #ff6600; }

        /* 1. Hover Effect: Zoom OUT (Scale Up) only the image */
        .image-container { flex: 0 0 220px; width: 100%; overflow: hidden; position: relative; }
        .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .alibaba-card:hover .product-img { transform: scale(1.1); }

        .verified-badge { position: absolute; top: 10px; left: 10px; background: #27ae60; color: white; padding: 4px 10px; font-size: 10px; font-weight: 700; border-radius: 4px; z-index: 2; }

        /* 3. Alibaba Style Contact Button */
        .alibaba-contact-btn {
            width: 100%;
            margin-top: auto;
            padding: 12px;
            border-radius: 25px;
            border: none;
            background: linear-gradient(90deg, #ff9000 0%, #ff5000 100%);
            color: white;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .alibaba-contact-btn:hover { opacity: 0.9; }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-spinner {
          width: 30px; height: 30px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #ff6600;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      <div className="amazon-header">
        <div style={premiumStyles.logo}>FASIKA<span style={{ color: "#000" }}>MARKET</span></div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <div className="search-container-amazon">
            <input 
              type="text" 
              className="search-input-amazon" 
              placeholder="Search by product name..." 
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

      {/* Grid Container where items persist after fetch */}
      <div className="full-edge-grid">
        {filtered.map((item, index) => (
          <div key={`${item.id}-${index}`} className="alibaba-card">
            <div className="image-container">
              <img 
                src={item.primary_image_url || "https://via.placeholder.com/300"} 
                alt={item.product_name} 
                className="product-img" 
              />
              <div className="verified-badge"><FaShieldAlt size={11} /> VERIFIED</div>
            </div>

            <div style={premiumStyles.textHalf}>
              <h2 style={premiumStyles.productTitle}>{item.product_name}</h2>
              <p style={premiumStyles.description}>{item.description}</p>
              <div style={premiumStyles.priceRow}>
                <span style={premiumStyles.priceMain}>ETB {item.price_per_unit}</span>
                <span style={premiumStyles.unit}>/ {item.unit || 'Qtl'}</span>
              </div>
              <div style={premiumStyles.stockInfo}>Stock: {item.quantity} units available</div>
              <div style={premiumStyles.location}><FaMapMarkerAlt size={11} /> Ethiopia</div>
              <button className="alibaba-contact-btn">
                <FaEnvelope /> Contact Supplier
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={premiumStyles.bottomArea}>
        {loading && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
            <div className="loading-spinner"></div>
            <span>Loading items...</span>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <span style={{color: '#888'}}>You've reached the end of the market.</span>
        )}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh" },
  logo: { fontSize: "24px", fontWeight: "900", color: "#fff", whiteSpace: "nowrap" },
  categoryItem: { fontSize: "15px", fontWeight: "500", color: "#333", cursor: "pointer" },
  textHalf: { padding: "12px", display: "flex", flexDirection: "column", flex: 1 },
  productTitle: { fontSize: "16px", fontWeight: "600", color: "#222", height: "40px", overflow: "hidden", lineHeight: '1.2' },
  description: { fontSize: "12px", color: "#777", height: "32px", overflow: "hidden", margin: "4px 0" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "4px", margin: "4px 0" },
  priceMain: { fontSize: "20px", fontWeight: "800", color: "#111" },
  unit: { fontSize: "13px", color: "#666" },
  stockInfo: { fontSize: "12px", color: "#444", fontWeight: "600" },
  location: { fontSize: "12px", color: "#999", marginBottom: "12px" },
  bottomArea: { width: "100%", padding: "60px 0", display: "flex", justifyContent: "center", fontWeight: "bold", color: "#ff6600" }
};

export default BuyerMarketplace;
