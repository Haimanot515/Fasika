import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaSearch, FaCommentDots, FaShieldAlt, FaMapMarkerAlt, 
  FaStar 
} from "react-icons/fa";

const BuyerMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/buyer/marketplace/public");
        setProducts(data.data || []);
      } catch (err) {
        console.error("Marketplace Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  // Expanded list of categories
  const categories = [
    "Cereals & Grains", "Fruits & Vegetables", "Oilseeds", "Livestock", 
    "Spices & Herbs", "Processed Goods", "Dairy Products", "Poultry", 
    "Coffee & Tea", "Pulses", "Tubers & Roots", "Agricultural Tools",
    "Organic Fertilizers", "Animal Feed", "Honey & Wax", "Textile Fibers"
  ];
  
  const filtered = products.filter(p =>
    p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={premiumStyles.loader}>🌾 Loading Fasika Marketplace...</div>;

  return (
    <div style={premiumStyles.pageWrapper}>
      <style>{`
        body, html { margin: 0; padding: 0; overflow-x: hidden; background: #e2e5e9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        
        .amazon-header {
          background-color: #131921;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 30px;
          position: sticky;
          top: 0;
          z-index: 1001;
        }

        .search-container-amazon {
          display: flex;
          flex: 1;
          max-width: 700px;
          height: 42px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #fff;
        }

        .search-input-amazon { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 15px; }
        .search-button-amazon { background-color: #febd69; border: none; width: 50px; display: flex; justify-content: center; align-items: center; cursor: pointer; }

        /* HORIZONTAL SCROLLING CATEGORIES */
        .category-scroll-wrapper {
          background: #232f3e;
          padding: 12px 20px;
          overflow-x: auto;
          white-space: nowrap;
          display: flex;
          gap: 50px;
          scrollbar-width: none; /* Firefox */
        }
        .category-scroll-wrapper::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
          gap: 15px; 
          width: 100%;
          padding: 15px; 
          box-sizing: border-box;
        }

        .alibaba-card { 
          background: #ffffff; 
          height: 455px; 
          cursor: pointer; 
          display: flex; 
          flex-direction: column; 
          border-radius: 8px; 
          position: relative; 
          overflow: hidden;
          border: none; 
          transition: box-shadow 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .alibaba-card:hover { 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .image-container { 
          flex: 0 0 200px; 
          width: 100%; 
          overflow: hidden; 
          position: relative; 
        }
        
        .product-img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          transition: transform 0.8s cubic-bezier(0.2, 0, 0.2, 1); 
        }

        .alibaba-card:hover .product-img { 
          transform: scale(1.3);
        }

        .verified-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(19, 25, 33, 0.85);
          color: white;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          z-index: 2;
        }
      `}</style>
      
      <div className="amazon-header">
        <div style={premiumStyles.logo}>FASIKA<span style={{ color: "#febd69" }}>MARKET</span></div>
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

      {/* HORIZONTAL CATEGORY BAR */}
      <nav className="category-scroll-wrapper">
        {categories.map(cat => (
          <span key={cat} style={premiumStyles.categoryItem}>{cat}</span>
        ))}
      </nav>

      <div className="full-edge-grid">
        {filtered.map((item) => (
          <div key={item.id} className="alibaba-card">
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
              
              <div style={premiumStyles.stockInfo}>Stock: {item.quantity}</div>
              <div style={premiumStyles.location}><FaMapMarkerAlt size={11} /> Ethiopia</div>
              
              <div style={premiumStyles.ratingRow}>
                {[...Array(5)].map((_, i) => <FaStar key={i} color="#febd69" size={13} />)}
              </div>

              <button style={premiumStyles.contactBtn}>Contact Supplier</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh" },
  logo: { fontSize: "24px", fontWeight: "900", color: "#fff", whiteSpace: "nowrap" },
  categoryItem: { 
    fontSize: "16px", 
    fontWeight: "500", 
    color: "#fff",
    cursor: "pointer", 
    opacity: 0.9,
    display: "inline-block"
  },
  textHalf: { padding: "15px", display: "flex", flexDirection: "column", flex: 1 },
  productTitle: { fontSize: "17px", fontWeight: "700", color: "#111", height: "40px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  description: { fontSize: "13px", color: "#4b5563", height: "34px", overflow: "hidden", margin: "6px 0" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "4px", margin: "6px 0" },
  priceMain: { fontSize: "22px", fontWeight: "800", color: "#111" },
  unit: { fontSize: "13px", color: "#666" },
  stockInfo: { fontSize: "13px", color: "#111", fontWeight: "700" },
  location: { fontSize: "12px", color: "#6b7280" },
  ratingRow: { display: "flex", gap: "3px", marginTop: "8px" },
  contactBtn: { width: "100%", marginTop: "auto", padding: "10px", borderRadius: "6px", border: "2px solid #131921", color: "#131921", background: "transparent", fontWeight: "bold", fontSize: "13px" },
  loader: { textAlign: 'center', padding: '150px', fontSize: '20px', color: '#131921' }
};

export default BuyerMarketplace;