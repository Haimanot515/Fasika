import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api/axios"; 
import { FaSearch, FaShieldAlt, FaMapMarkerAlt, FaStar } from "react-icons/fa";

const BuyerMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Ref for the Intersection Observer (The "Anchor")
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
      // Backend handles LIMIT and OFFSET based on page
      const { data } = await api.get(`/buyer/marketplace/public?page=${page}&limit=12`);
      const newProducts = data.data || [];
      
      setProducts(prev => [...prev, ...newProducts]);
      
      // If we got less than 12 items, we've hit the end of the database
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
        body, html { margin: 0; padding: 0; overflow-x: hidden; background: #e2e5e9; font-family: 'Segoe UI', Roboto, sans-serif; }
        .amazon-header { background-color: #131921; padding: 10px 20px; display: flex; align-items: center; gap: 30px; position: sticky; top: 0; z-index: 1001; }
        .search-container-amazon { display: flex; flex: 1; max-width: 700px; height: 42px; border-radius: 4px; overflow: hidden; background-color: #fff; }
        .search-input-amazon { flex: 1; border: none; padding: 0 15px; outline: none; font-size: 15px; }
        .search-button-amazon { background-color: #febd69; border: none; width: 50px; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        
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
          display: flex; 
          flex-direction: column; 
          border-radius: 8px; 
          overflow: hidden;
          transition: transform 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* SKELETON ANIMATION */
        @keyframes shimmer {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
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
          border-top: 4px solid #febd69;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      
      <div className="amazon-header">
        <div style={premiumStyles.logo}>FASIKA<span style={{ color: "#febd69" }}>MARKET</span></div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
          <div className="search-container-amazon">
            <input type="text" className="search-input-amazon" placeholder="Search products..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="search-button-amazon"><FaSearch size={18} /></button>
          </div>
        </div>
      </div>

      <nav style={premiumStyles.catNav}>
        {categories.map(cat => <span key={cat} style={premiumStyles.categoryItem}>{cat}</span>)}
      </nav>

      <div className="full-edge-grid">
        {filtered.map((item, index) => {
          // If it's the last item in the list, attach the observer ref
          const isLast = products.length === index + 1;
          return (
            <div key={`${item.id}-${index}`} ref={isLast ? lastElementRef : null} className="alibaba-card">
              <div style={premiumStyles.imgBox}>
                <img src={item.primary_image_url || "https://via.placeholder.com/300"} alt="" style={premiumStyles.pImg} />
                <div style={premiumStyles.badge}><FaShieldAlt size={11} /> VERIFIED</div>
              </div>
              <div style={premiumStyles.content}>
                <h2 style={premiumStyles.title}>{item.product_name}</h2>
                <div style={premiumStyles.priceRow}>
                   <span style={premiumStyles.price}>ETB {item.price_per_unit}</span>
                   <span style={premiumStyles.unit}>/ {item.unit || 'Qtl'}</span>
                </div>
                <div style={premiumStyles.location}><FaMapMarkerAlt size={11} /> Ethiopia</div>
                <button style={premiumStyles.btn}>Contact Supplier</button>
              </div>
            </div>
          );
        })}

        {/* Industry Level Skeletons while loading */}
        {loading && [1, 2, 3, 4].map(i => (
          <div key={`skel-${i}`} className="alibaba-card">
             <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
             <div style={{ padding: '15px' }}>
                <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '10px' }}></div>
                <div className="skeleton" style={{ height: '30px', width: '50%' }}></div>
             </div>
          </div>
        ))}
      </div>

      <div style={premiumStyles.footer}>
        {loading && <div className="spinner"></div>}
        {!hasMore && <span>Inventory fully loaded.</span>}
      </div>
    </div>
  );
};

const premiumStyles = {
  pageWrapper: { width: "100vw", minHeight: "100vh" },
  logo: { fontSize: "24px", fontWeight: "900", color: "#fff" },
  catNav: { background: "#232f3e", padding: "12px 20px", overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: "50px" },
  categoryItem: { color: "#fff", cursor: "pointer", fontSize: "14px" },
  imgBox: { height: "200px", position: "relative", overflow: "hidden" },
  pImg: { width: "100%", height: "100%", objectFit: "cover" },
  badge: { position: "absolute", top: "10px", left: "10px", background: "#131921", color: "#fff", padding: "4px 8px", fontSize: "10px", borderRadius: "4px" },
  content: { padding: "15px", display: "flex", flexDirection: "column", flex: 1 },
  title: { fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0", height: "40px" },
  priceRow: { margin: "5px 0" },
  price: { fontSize: "20px", fontWeight: "800" },
  unit: { fontSize: "12px", color: "#666" },
  location: { fontSize: "12px", color: "#6b7280", marginTop: "10px" },
  btn: { marginTop: "auto", width: "100%", padding: "10px", background: "transparent", border: "2px solid #131921", fontWeight: "bold", cursor: "pointer", borderRadius: "6px" },
  footer: { padding: "50px", display: "flex", justifyContent: "center", color: "#131921", fontWeight: "bold" }
};

export default BuyerMarketplace;
