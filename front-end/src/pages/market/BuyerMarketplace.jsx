import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api/axios"; 
import { FaSearch, FaShieldAlt, FaMapMarkerAlt, FaStar, FaStore, FaArrowRight } from "react-icons/fa";

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
      if (newProducts.length < 12) setHasMore(false);
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
    "Coffee & Tea", "Pulses", "Tubers & Roots"
  ];

  return (
    <div style={premiumStyles.pageWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
        
        body, html { 
          margin: 0; padding: 0; overflow-x: hidden; 
          background: #f8fafc; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
        }

        /* PREMIUM GLASS HEADER */
        .glass-header {
          background: rgba(19, 25, 33, 0.95);
          backdrop-filter: blur(10px);
          padding: 15px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1001;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .search-pill {
          display: flex;
          background: rgba(255,255,255,0.08);
          border-radius: 50px;
          padding: 5px 20px;
          width: 40%;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }
        .search-pill:focus-within {
          background: #fff;
          width: 45%;
          box-shadow: 0 0 0 4px rgba(254, 189, 105, 0.2);
        }
        .search-pill input {
          background: transparent; border: none; outline: none;
          color: #fff; padding: 10px; width: 100%; font-size: 14px;
        }
        .search-pill:focus-within input { color: #111; }

        /* PRODUCT CARD DESIGN */
        .premium-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .premium-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
        }

        .img-zoom-cont {
          height: 240px;
          overflow: hidden;
          position: relative;
        }
        .premium-card img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s ease;
        }
        .premium-card:hover img { transform: scale(1.1); }

        .price-tag {
          background: #131921;
          color: #febd69;
          padding: 8px 15px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 18px;
          position: absolute;
          bottom: 15px;
          right: 15px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
        }

        .contact-btn-premium {
          background: #131921;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          margin-top: 15px;
        }
        .contact-btn-premium:hover {
          background: #febd69;
          color: #131921;
        }

        /* SHIMMER SKELETON */
        .shimmer-box {
          height: 400px;
          background: #eceef1;
          background-image: linear-gradient(90deg, #eceef1 0px, #f4f4f4 40px, #eceef1 80px);
          background-size: 250px;
          animation: shine-loading 2s infinite linear;
          border-radius: 20px;
        }
        @keyframes shine-loading { 0% { background-position: -100px; } 100% { background-position: 300px; } }

        .spinner-modern {
          width: 40px; height: 40px;
          border: 3px solid rgba(19, 25, 33, 0.1);
          border-top: 3px solid #131921;
          border-radius: 50%;
          animation: spin 0.8s infinite linear;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
      
      <header className="glass-header">
        <div style={premiumStyles.logo}>FASIKA<span style={{color: '#febd69'}}>MARKET</span></div>
        <div className="search-pill">
          <FaSearch color="#febd69" style={{marginTop: '12px'}} />
          <input 
            placeholder="Search premium agricultural goods..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{color: '#fff', fontSize: '14px', fontWeight: '600'}}>
          <FaStore /> Marketplace v2.0
        </div>
      </header>

      <div style={premiumStyles.mainContent}>
        <div style={premiumStyles.heroSection}>
          <h1 style={premiumStyles.heroTitle}>Direct from the Source</h1>
          <p style={premiumStyles.heroSub}>Ethopian's premium marketplace for quality agricultural trade.</p>
        </div>

        <div style={premiumStyles.grid}>
          {products.filter(p => p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((item, index) => {
            const isLast = products.length === index + 1;
            return (
              <div key={`${item.id}-${index}`} ref={isLast ? lastElementRef : null} className="premium-card">
                <div className="img-zoom-cont">
                  <img src={item.primary_image_url || "https://via.placeholder.com/400"} alt="" />
                  <div className="price-tag">ETB {item.price_per_unit}</div>
                </div>
                <div style={{padding: '20px', display: 'flex', flexDirection: 'column', flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={premiumStyles.catLabel}>AGRICULTURE</span>
                    <div style={{display: 'flex', gap: '2px'}}>
                      {[...Array(5)].map((_, i) => <FaStar key={i} size={10} color="#febd69" />)}
                    </div>
                  </div>
                  <h3 style={premiumStyles.pTitle}>{item.product_name}</h3>
                  <div style={premiumStyles.locText}>
                    <FaMapMarkerAlt /> Addis Ababa, Ethiopia • <strong>{item.quantity} {item.unit || 'Qtl'} Available</strong>
                  </div>
                  <button className="contact-btn-premium">
                    Contact Supplier <FaArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {loading && [1, 2, 3, 4].map(i => <div key={i} className="shimmer-box"></div>)}
        </div>

        <div style={premiumStyles.loadArea}>
          {loading && <div className="spinner-modern"></div>}
          {!hasMore && <div style={premiumStyles.endNote}>All verified listings have been loaded.</div>}
        </div>
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { minHeight: "100vh" },
  logo: { fontSize: "26px", fontWeight: "900", color: "#fff", letterSpacing: "-1px" },
  mainContent: { maxWidth: "1400px", margin: "0 auto", padding: "0 40px" },
  heroSection: { padding: "60px 0", textAlign: "center" },
  heroTitle: { fontSize: "48px", fontWeight: "800", color: "#131921", margin: 0 },
  heroSub: { fontSize: "18px", color: "#64748b", marginTop: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px" },
  catLabel: { fontSize: "10px", fontWeight: "800", color: "#64748b", letterSpacing: "1px" },
  pTitle: { fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: "10px 0" },
  locText: { fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" },
  loadArea: { padding: "80px", display: "flex", justifyContent: "center" },
  endNote: { color: "#94a3b8", fontWeight: "600", fontSize: "14px", borderTop: "1px solid #e2e8f0", paddingTop: "20px", width: "100%", textAlign: "center" }
};

export default BuyerMarketplace;
