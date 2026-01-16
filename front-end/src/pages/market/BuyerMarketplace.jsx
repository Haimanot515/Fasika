import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api/axios"; 
import { FaSearch, FaShieldAlt, FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";

const BuyerMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/buyer/marketplace/public?page=${page}&limit=12`);
      const newProducts = data.data || [];
      setProducts(prev => [...prev, ...newProducts]);
      if (newProducts.length < 12) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Marketplace Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMarketplace();
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
        body, html { margin: 0; padding: 0; overflow-x: hidden; background: #f1f3f6; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        
        .amazon-header { background-color: #131921; padding: 12px 30px; display: flex; align-items: center; gap: 40px; position: sticky; top: 0; z-index: 1001; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
        
        .search-container-amazon { 
            display: flex; flex: 1; max-width: 800px; height: 45px; border-radius: 8px; overflow: hidden; background-color: #fff;
            transition: box-shadow 0.3s ease;
        }
        .search-container-amazon:focus-within { box-shadow: 0 0 0 3px rgba(254, 189, 105, 0.5); }
        .search-input-amazon { flex: 1; border: none; padding: 0 20px; outline: none; font-size: 16px; color: #333; }
        .search-button-amazon { background-color: #febd69; border: none; width: 60px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #131921; transition: background 0.2s; }
        .search-button-amazon:hover { background-color: #f3a847; }
        
        .full-edge-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 25px; 
          width: 100%;
          padding: 30px; 
          box-sizing: border-box;
        }

        /* UPGRADED INDUSTRIAL LEVEL CARD */
        .alibaba-card { 
          background: #ffffff; 
          height: auto;
          display: flex; 
          flex-direction: column; 
          border-radius: 16px; 
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          position: relative;
        }
        .alibaba-card:hover { 
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #febd69;
        }
        
        .image-container-zoom { height: 220px; width: 100%; overflow: hidden; position: relative; }
        .product-img-main { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .alibaba-card:hover .product-img-main { transform: scale(1.1); }

        /* SKELETON ANIMATION */
        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
        .skeleton {
          background: #f6f7f8;
          background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-repeat: no-repeat;
          background-size: 800px 100%;
          display: inline-block;
          position: relative;
          animation: shimmer 1.5s linear infinite forwards;
        }

        .spinner {
          width: 40px; height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #131921;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .btn-industrial {
            background: #131921;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
            margin-top: 15px;
        }
        .btn-industrial:hover { background: #232f3e; gap: 12px; }
      `}</style>
      
      <div className="amazon-header">
        <div style={premiumStyles.logo}>FASIKA<span style={{ color: "#febd69" }}>MARKET</span></div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <div className="search-container-amazon">
            <input type="text" className="search-input-amazon" placeholder="Search quality agricultural products..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="search-button-amazon"><FaSearch size={20} /></button>
          </div>
        </div>
      </div>

      <nav style={premiumStyles.catNav}>
        {categories.map(cat => <span key={cat} style={premiumStyles.categoryItem}>{cat}</span>)}
      </nav>

      <div className="full-edge-grid">
        {filtered.map((item, index) => {
          const isLast = products.length === index + 1;
          return (
            <div key={`${item.id}-${index}`} ref={isLast ? lastElementRef : null} className="alibaba-card">
              <div className="image-container-zoom">
                <img src={item.primary_image_url || "https://via.placeholder.com/300"} alt="" className="product-img-main" />
                <div style={premiumStyles.badge}><FaShieldAlt size={11} /> VERIFIED SELLER</div>
              </div>
              
              <div style={premiumStyles.content}>
                <div style={premiumStyles.metaRow}>
                    <span style={premiumStyles.categoryTag}>PREMIUM GRADE</span>
                    <div style={{display:'flex', gap: '2px'}}>{[...Array(5)].map((_, i) => <FaStar key={i} size={10} color="#febd69" />)}</div>
                </div>
                
                <h2 style={premiumStyles.title}>{item.product_name}</h2>
                
                <div style={premiumStyles.priceRow}>
                   <span style={premiumStyles.price}>ETB {Number(item.price_per_unit).toLocaleString()}</span>
                   <span style={premiumStyles.unit}>/ {item.unit || 'Qtl'}</span>
                </div>
                
                <div style={premiumStyles.location}><FaMapMarkerAlt size={12} color="#6b7280" /> {item.location || 'Ethiopia'} • Stock: {item.quantity}</div>
                
                <button className="btn-industrial">
                    Contact Supplier <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {loading && [1, 2, 3, 4].map(i => (
          <div key={`skel-${i}`} className="alibaba-card">
             <div className="skeleton" style={{ height: '220px', width: '100%' }}></div>
             <div style={{ padding: '20px' }}>
                <div className="skeleton" style={{ height: '20px', width: '90%', marginBottom: '12px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ height: '30px', width: '60%', borderRadius: '4px' }}></div>
             </div>
          </div>
        ))}
      </div>

      <div style={premiumStyles.footer}>
        {loading && <div className="spinner"></div>}
        {!hasMore && <div style={premiumStyles.endMsg}>End of verified inventory.</div>}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh" },
  logo: { fontSize: "28px", fontWeight: "900", color: "#fff", letterSpacing: "-1px" },
  catNav: { background: "#232f3e", padding: "14px 30px", overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)" },
  categoryItem: { color: "#cbd5e1", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" },
  badge: { position: "absolute", top: "12px", left: "12px", background: "rgba(19, 25, 33, 0.9)", color: "#fff", padding: "6px 12px", fontSize: "10px", fontWeight: "bold", borderRadius: "6px", backdropFilter: "blur(4px)" },
  content: { padding: "20px", display: "flex", flexDirection: "column", flex: 1 },
  metaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  categoryTag: { fontSize: "10px", fontWeight: "800", color: "#64748b", letterSpacing: "0.5px" },
  title: { fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 10px 0", height: "44px", overflow: "hidden", lineHeight: "1.3" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "6px" },
  price: { fontSize: "24px", fontWeight: "900", color: "#131921" },
  unit: { fontSize: "14px", color: "#64748b", fontWeight: "500" },
  location: { fontSize: "13px", color: "#64748b", marginTop: "12px", display: "flex", alignItems: "center", gap: "5px" },
  footer: { padding: "80px 0", display: "flex", justifyContent: "center", alignItems: "center" },
  endMsg: { color: "#94a3b8", fontWeight: "600", fontSize: "14px", padding: "20px 40px", background: "#fff", borderRadius: "50px" }
};

export default BuyerMarketplace;
