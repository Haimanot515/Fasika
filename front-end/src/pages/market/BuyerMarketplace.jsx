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
        body, html { 
            margin: 0; padding: 0; overflow-x: hidden; 
            background: #ffffff; 
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
        }
        
        .amazon-header { background-color: #000000; padding: 12px 20px; display: flex; align-items: center; gap: 30px; position: sticky; top: 0; z-index: 1001; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .search-container-amazon { display: flex; flex: 1; max-width: 700px; height: 42px; border-radius: 6px; overflow: hidden; background-color: #ffffff; border: 1px solid #ddd; }
        .search-input-amazon { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 15px; color: #111; }
        .search-button-amazon { background-color: #ff9900; border: none; width: 55px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #fff; }
        
        .category-scroll-wrapper { background: #ffffff; padding: 14px 20px; overflow-x: auto; white-space: nowrap; display: flex; gap: 30px; border-bottom: 1px solid #e5e5e5; }
        .category-scroll-wrapper::-webkit-scrollbar { display: none; }

        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
          gap: 20px; 
          width: 100%;
          padding: 20px; 
          box-sizing: border-box;
          background: #ffffff;
        }

        .alibaba-card { 
          background: #ffffff; 
          display: flex; 
          flex-direction: column; 
          border-radius: 12px; 
          position: relative; 
          overflow: hidden;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          border: 1px solid #f0f0f0; /* Subtle neutral border */
          cursor: pointer;
        }
        
        .alibaba-card:hover { 
          box-shadow: 0 10px 25px rgba(0,0,0,0.08); /* Soft shadow on hover */
          transform: translateY(-4px);
          border: 1px solid #e0e0e0; /* Neutral border change, no orange/red */
        }

        .image-container { 
          aspect-ratio: 1/1; 
          width: 100%; 
          overflow: hidden; 
          position: relative; 
          background: #fafafa; 
        }
        
        .product-img { width: 100%; height: 100%; object-fit: cover; }

        .verified-badge { 
          position: absolute; 
          top: 10px; 
          left: 10px; 
          background: #ffffff; 
          color: #00b411; 
          padding: 3px 8px; 
          font-size: 11px; 
          font-weight: 900; 
          border-radius: 4px; 
          z-index: 2; 
          border: 1px solid #00b411;
        }

        .alibaba-contact-btn {
            width: 100%;
            margin-top: 12px;
            padding: 10px;
            border-radius: 25px;
            border: 1px solid #ff6600; /* Thinner border */
            background: #ffffff;
            color: #ff6600;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .alibaba-contact-btn:hover { background: #ff6600; color: #ffffff; }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-spinner { width: 32px; height: 32px; border: 4px solid #f3f3f3; border-top: 4px solid #ff5000; border-radius: 50%; animation: spin 1s linear infinite; }
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
              <div className="verified-badge"><FaShieldAlt size={12} /> VERIFIED</div>
            </div>

            <div style={premiumStyles.textHalf}>
              <h2 style={premiumStyles.productTitle}>{item.product_name}</h2>
              <div style={premiumStyles.priceRow}>
                <span style={premiumStyles.priceMain}>ETB {item.price_per_unit}</span>
                <span style={premiumStyles.unit}>/{item.unit || 'Qtl'}</span>
              </div>
              <div style={premiumStyles.stockInfo}>Stock: {item.quantity} units</div>
              <div style={premiumStyles.location}><FaMapMarkerAlt size={12} /> Ethiopia</div>
              <button className="alibaba-contact-btn">
                <FaEnvelope /> Contact Supplier
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={premiumStyles.bottomArea}>
        {loading && <div className="loading-spinner"></div>}
        {!hasMore && products.length > 0 && (
          <span style={{color: '#888', fontSize: '16px', fontWeight: '700'}}>End of results</span>
        )}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh", backgroundColor: "#ffffff" },
  logo: { fontSize: "28px", fontWeight: "900", color: "#ffffff", whiteSpace: "nowrap", letterSpacing: "1px" },
  categoryItem: { fontSize: "15px", fontWeight: "700", color: "#222", cursor: "pointer" },
  textHalf: { padding: "16px", display: "flex", flexDirection: "column" },
  productTitle: { fontSize: "16px", fontWeight: "600", color: "#333", height: "42px", overflow: "hidden", lineHeight: "1.3", marginBottom: "6px" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "3px", margin: "4px 0" },
  priceMain: { fontSize: "20px", fontWeight: "800", color: "#000" },
  unit: { fontSize: "13px", color: "#666", fontWeight: "600" },
  stockInfo: { fontSize: "13px", color: "#444", fontWeight: "600", marginTop: "2px" },
  location: { fontSize: "12px", color: "#888", fontWeight: "500", marginTop: "10px" },
  bottomArea: { width: "100%", padding: "50px 0", display: "flex", justifyContent: "center", background: "#ffffff" }
};

export default BuyerMarketplace;
