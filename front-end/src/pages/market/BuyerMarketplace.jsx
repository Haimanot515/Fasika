import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api/axios"; 
import { FaSearch, FaShieldAlt, FaMapMarkerAlt, FaStar, FaArrowRight, FaStore } from "react-icons/fa";

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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
        
        body, html { 
          margin: 0; padding: 0; overflow-x: hidden; 
          background: #f4f4f4; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
        }

        .glass-header {
          background: rgba(19, 25, 33, 0.98);
          backdrop-filter: blur(10px);
          padding: 12px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1001;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .search-pill {
          display: flex;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 2px 15px;
          width: 45%;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .search-pill:focus-within {
          background: #fff;
          box-shadow: 0 0 0 4px rgba(254, 189, 105, 0.3);
        }
        .search-pill input {
          background: transparent; border: none; outline: none;
          color: #fff; padding: 12px; width: 100%; font-size: 15px;
        }
        .search-pill:focus-within input { color: #111; }

        /* Alibaba Style Card */
        .premium-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s ease-in-out;
          border: 1px solid #e5e5e5;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .premium-card:hover {
          border-color: #ff6600; /* Alibaba Orange */
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        .image-cont {
          height: 200px;
          overflow: hidden;
          position: relative;
          background: #f8f8f8;
        }
        .image-cont img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease;
        }
        .premium-card:hover .image-cont img { transform: scale(1.05); }

        .verified-badge {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(255, 255, 255, 0.9);
          color: #333; padding: 4px 8px;
          font-size: 10px; font-weight: 700;
          border-radius: 4px; border: 1px solid #ddd;
        }

        .action-button {
          background: transparent;
          color: #ff6600; 
          border: 1px solid #ff6600;
          padding: 10px; border-radius: 20px;
          font-weight: 700; cursor: pointer;
          display: flex; align-items: center;
          justify-content: center; gap: 8px;
          transition: all 0.2s ease;
          margin-top: auto;
        }
        .action-button:hover {
          background: #ff6600;
          color: #fff;
        }

        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
        .skeleton {
          background: #f6f7f8;
          background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-repeat: no-repeat;
          background-size: 800px 100%;
          animation: shimmer 1.5s linear infinite forwards;
        }
      `}</style>
      
      <header className="glass-header">
        <div style={premiumStyles.logo}>FASIKA<span style={{color: '#febd69'}}>MARKET</span></div>
        <div className="search-pill">
          <FaSearch color="#febd69" style={{marginTop: '14px'}} />
          <input 
            placeholder="Search premium Ethiopian harvests..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{color: '#fff', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <FaStore color="#febd69" /> Marketplace 2.0
        </div>
      </header>

      <nav style={premiumStyles.catNav}>
        {categories.map(cat => <span key={cat} style={premiumStyles.categoryItem}>{cat}</span>)}
      </nav>

      <div style={premiumStyles.gridWrapper}>
        <div style={premiumStyles.grid}>
          {filtered.map((item, index) => {
            const isLast = products.length === index + 1;
            return (
              <div key={`${item.id}-${index}`} ref={isLast ? lastElementRef : null} className="premium-card">
                <div className="image-cont">
                  <img src={item.primary_image_url || "https://via.placeholder.com/400"} alt="" />
                  <div className="verified-badge"><FaShieldAlt color="#ff6600" /> VERIFIED</div>
                </div>

                <div style={{padding: '16px', display: 'flex', flexDirection: 'column', flex: 1}}>
                  <h3 style={premiumStyles.pTitle}>{item.product_name}</h3>
                  
                  <div style={premiumStyles.priceRow}>
                    <span style={premiumStyles.priceSymbol}>ETB</span>
                    <span style={premiumStyles.priceAmount}>{Number(item.price_per_unit).toLocaleString()}</span>
                    <span style={premiumStyles.unit}>/{item.unit || 'Qtl'}</span>
                  </div>

                  <div style={premiumStyles.moq}>
                    Min. Order: 1 {item.unit || 'Qtl'}
                  </div>

                  <p style={premiumStyles.pDesc}>
                    {item.description || "High-quality agricultural produce sourced directly from verified Ethiopian farms."}
                  </p>

                  <div style={premiumStyles.locInfo}>
                    <FaMapMarkerAlt size={12} /> {item.location || 'Ethiopia'}
                  </div>

                  <button className="action-button">
                    Contact Supplier
                  </button>
                </div>
              </div>
            );
          })}

          {loading && [1, 2, 3, 4].map(i => (
            <div key={i} className="premium-card">
              <div className="skeleton" style={{height: '200px', width: '100%'}}></div>
              <div style={{padding: '16px'}}>
                <div className="skeleton" style={{height: '20px', width: '70%', marginBottom: '10px'}}></div>
                <div className="skeleton" style={{height: '30px', width: '50%', marginBottom: '10px'}}></div>
                <div className="skeleton" style={{height: '40px', width: '100%', borderRadius: '20px'}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={premiumStyles.footerArea}>
        {!hasMore && products.length > 0 && (
          <div style={premiumStyles.endBadge}>No more products to display</div>
        )}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh", background: "#f4f4f4" },
  logo: { fontSize: "24px", fontWeight: "900", color: "#fff", letterSpacing: "-1px" },
  catNav: { background: "#232f3e", padding: "14px 40px", overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: "45px", borderBottom: "1px solid rgba(0,0,0,0.1)" },
  categoryItem: { color: "#94a3b8", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "color 0.2s" },
  gridWrapper: { maxWidth: "1400px", margin: "0 auto", padding: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "15px" },
  pTitle: { fontSize: "15px", fontWeight: "400", color: "#333", margin: "0 0 8px 0", height: "40px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", lineHeight: "1.4" },
  pDesc: { fontSize: "12px", color: "#666", lineHeight: "1.4", height: "34px", overflow: "hidden", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "3px", marginBottom: "4px" },
  priceSymbol: { fontSize: "14px", fontWeight: "700", color: "#222" },
  priceAmount: { fontSize: "20px", fontWeight: "700", color: "#222" },
  unit: { fontSize: "12px", color: "#666" },
  moq: { fontSize: "12px", color: "#666", marginBottom: "8px" },
  locInfo: { fontSize: "12px", color: "#999", marginBottom: "15px", display: "flex", alignItems: "center", gap: "4px" },
  footerArea: { padding: "40px 0", display: "flex", justifyContent: "center" },
  endBadge: { color: "#999", fontSize: "13px" }
};

export default BuyerMarketplace;
