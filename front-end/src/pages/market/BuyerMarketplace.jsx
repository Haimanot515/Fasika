import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios"; 
import { 
  FaSearch, FaShieldAlt, FaMapMarkerAlt, FaShoppingCart 
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
      // Fetching from your database - ensure the 'description' field is included in the SELECT/DROP schema
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
            background: #ffffff !important; 
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
        }
        
        .amazon-header { background-color: #000000; padding: 12px 20px; display: flex; align-items: center; gap: 30px; position: sticky; top: 0; z-index: 1001; }
        .search-container-amazon { display: flex; flex: 1; max-width: 700px; height: 42px; border-radius: 6px; overflow: hidden; background-color: #ffffff; border: 1px solid #ddd; }
        .search-input-amazon { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 15px; color: #111; }
        .search-button-amazon { background-color: #ff9900; border: none; width: 55px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #fff; }
        
        .category-scroll-wrapper { 
          background: #ffffff; padding: 14px 20px; overflow-x: auto; white-space: nowrap; display: flex; gap: 30px; border-bottom: 1px solid #f0f0f0;
          -ms-overflow-style: none; scrollbar-width: none; 
        }
        .category-scroll-wrapper::-webkit-scrollbar { display: none; }

        .full-edge-grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
          gap: 30px; width: 100%; padding: 30px 20px; box-sizing: border-box; background: #ffffff;
        }

        .alibaba-card { 
          background: #ffffff; display: flex; flex-direction: column; position: relative; 
          transition: all 0.3s ease; border: none; cursor: pointer;
          min-height: 460px; /* Adjusted for the added description text */
        }

        .image-container { 
          aspect-ratio: 1/1; width: 100%; overflow: hidden; position: relative; 
          background: #fcfcfc; border-radius: 8px;
        }
        
        .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .alibaba-card:hover .product-img { transform: scale(1.1); }

        .verified-badge { 
          position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.95); 
          color: #00b411; padding: 3px 8px; font-size: 10px; font-weight: 800; border-radius: 4px; z-index: 2; border: 1px solid #00b411;
        }

        /* Description truncate logic to keep card heights uniform */
        .product-description {
            font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 8px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
            overflow: hidden; text-overflow: ellipsis; height: 38px;
        }

        .buy-now-btn {
            width: 100%; margin-top: auto; padding: 12px; border-radius: 6px; border: none;
            background: #ff9900; color: #ffffff; font-weight: 700; font-size: 14px;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
      `}</style>
      
      <div className="amazon-header">
        <div style={premiumStyles.logo}>
            FASIKA<span style={{ color: "#ff6600" }}>MARKET</span>
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <div className="search-container-amazon">
            <input type="text" className="search-input-amazon" placeholder="Search products..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="search-button-amazon"><FaSearch size={18} /></button>
          </div>
        </div>
      </div>

      <nav className="category-scroll-wrapper">
        {categories.map(cat => <span key={cat} style={premiumStyles.categoryItem}>{cat}</span>)}
      </nav>

      <div className="full-edge-grid">
        {filtered.map((item, index) => (
          <div key={`${item.id}-${index}`} className="alibaba-card">
            <div className="image-container">
              <img src={item.primary_image_url || "https://via.placeholder.com/300"} alt={item.product_name} className="product-img" />
              <div className="verified-badge"><FaShieldAlt size={10} /> VERIFIED</div>
            </div>

            <div style={premiumStyles.textHalf}>
              <h2 style={premiumStyles.productTitle}>{item.product_name}</h2>
              
              {/* Added Description from Database */}
              <p className="product-description">
                {item.description || "No description available for this product."}
              </p>

              <div style={premiumStyles.priceRow}>
                <span style={premiumStyles.priceMain}>ETB {item.price_per_unit}</span>
                <span style={premiumStyles.unit}>/{item.unit || 'Qtl'}</span>
              </div>
              <div style={premiumStyles.stockInfo}>Stock: {item.quantity} units</div>
              <div style={premiumStyles.location}><FaMapMarkerAlt size={11} /> Ethiopia</div>
              <button className="buy-now-btn">
                <FaShoppingCart size={14} /> Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={premiumStyles.bottomArea}>
        {loading && <div className="loading-spinner"></div>}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh", backgroundColor: "#ffffff" },
  logo: { fontSize: "24px", fontWeight: "900", color: "#ffffff", whiteSpace: "nowrap" },
  categoryItem: { fontSize: "14px", fontWeight: "600", color: "#444", cursor: "pointer" },
  textHalf: { padding: "12px 0px", display: "flex", flexDirection: "column", flexGrow: 1 },
  productTitle: { fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "2px", margin: "4px 0" },
  priceMain: { fontSize: "19px", fontWeight: "800", color: "#000" },
  unit: { fontSize: "12px", color: "#666" },
  stockInfo: { fontSize: "12px", color: "#555" },
  location: { fontSize: "11px", color: "#999", marginTop: "8px", marginBottom: "10px" },
  bottomArea: { width: "100%", padding: "60px 0", display: "flex", justifyContent: "center", background: "#ffffff" }
};

export default BuyerMarketplace;
