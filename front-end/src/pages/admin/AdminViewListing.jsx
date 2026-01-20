import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios"; 
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, FaSearch, FaEllipsisV, FaEdit, FaArchive,
  FaUserShield, FaPhone, FaTag, FaBoxOpen, FaGlobe, FaDatabase
} from "react-icons/fa";

const AdminViewListing = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Handle clicking outside the dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenuId]);

  useEffect(() => { fetchGlobalRegistry(); }, []);

  const fetchGlobalRegistry = async () => {
    try {
      // Hits the authority path in adminProductListingRoutes
      const { data } = await api.get("/admin/marketplace/listings");
      setListings(data.listings || []);
      setFilteredListings(data.listings || []);
    } catch (err) { 
      console.error("Registry Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  // Filter logic for Master Registry
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const results = listings.filter(item => (
      item.product_name?.toLowerCase().includes(lowerSearch) ||
      item.owner_name?.toLowerCase().includes(lowerSearch) ||
      item.product_category?.toLowerCase().includes(lowerSearch) ||
      item.listing_id?.toString().includes(lowerSearch)
    ));
    setFilteredListings(results);
  }, [searchTerm, listings]);

  const handleDrop = async (id) => {
    if (window.confirm("⚠️ AUTHORITY ACTION: DROP (Archive) this node?")) {
      try {
        await api.patch(`/admin/marketplace/listings/${id}/archive`);
        setListings(prev => prev.filter(item => item.listing_id !== id));
        alert("REGISTRY DROP SUCCESSFUL");
      } catch (err) { 
        alert("DROP Failed: Authority access denied.");
      }
    }
  };

  if (loading) return (
    <div style={styles.loader}>
      <FaDatabase className="animate-spin" style={{ marginBottom: '15px', fontSize: '40px' }} />
      <br />Syncing Master Registry (DROP)...
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .search-container {
          background: #0f172a;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          border-bottom: 4px solid #3b82f6;
        }
        .search-bar-ui {
          display: flex;
          background: white;
          width: 100%;
          max-width: 700px;
          height: 50px;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }
        .search-bar-ui input {
          flex: 1;
          border: none;
          padding: 0 20px;
          font-size: 15px;
          outline: none;
          color: #1e293b;
        }
        .search-icon-btn {
          width: 60px;
          background: #3b82f6;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
        }
        .registry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .card-ui {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          animation: fadeIn 0.5s ease forwards;
        }
        .card-ui:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          border-color: #3b82f6;
        }
      `}</style>

      {/* COMMAND CENTER HEADER */}
      <div className="search-container">
        <h1 style={styles.mainTitle}><FaGlobe style={{color: '#3b82f6'}} /> MASTER PRODUCT REGISTRY</h1>
        <div className="search-bar-ui">
          <input 
            type="text" 
            placeholder="Filter by Product, Farmer, Category or Node ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-icon-btn"><FaSearch /></button>
        </div>
        <button onClick={() => navigate("/admin/farmers/market/add")} style={styles.addBtn}>
          <FaPlus /> ADD REGISTRY NODE
        </button>
      </div>

      {/* REGISTRY NODES */}
      <div className="registry-grid">
        {filteredListings.map((item) => (
          <div key={item.listing_id} className="card-ui">
            {/* ACTION DROPDOWN */}
            <div style={styles.dropMenuContainer}>
              <button 
                style={styles.optionsTrigger} 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenuId(showMenuId === item.listing_id ? null : item.listing_id);
                }}
              >
                <FaEllipsisV />
              </button>
              {showMenuId === item.listing_id && (
                <div style={styles.dropdown} ref={menuRef}>
                  <div 
                    style={styles.dropItem} 
                    onClick={() => navigate(`/admin/farmers/market/edit/${item.listing_id}`)}
                  >
                    <FaEdit color="#3b82f6" /> Update Node
                  </div>
                  <div 
                    style={{...styles.dropItem, color: '#ef4444', borderBottom: 'none'}} 
                    onClick={() => handleDrop(item.listing_id)}
                  >
                    <FaArchive /> DROP Listing
                  </div>
                </div>
              )}
            </div>

            <img 
              src={item.primary_image_url || "https://via.placeholder.com/400x250"} 
              style={styles.cardImg} 
              alt="product" 
            />
            
            <div style={styles.cardBody}>
              <div style={styles.categoryBadge}><FaTag /> {item.product_category}</div>
              <h2 style={styles.productName}>{item.product_name}</h2>
              <div style={styles.priceTag}>
                ETB {item.price_per_unit} 
                <small style={{fontSize: '12px', color: '#64748b', fontWeight: 'normal'}}> / {item.unit}</small>
              </div>
              
              <div style={styles.infoBox}>
                <div style={styles.infoRow}><FaUserShield color="#3b82f6"/> {item.owner_name}</div>
                <div style={styles.infoRow}><FaPhone color="#3b82f6"/> {item.owner_phone || 'N/A'}</div>
                <div style={styles.infoRow}><FaBoxOpen color="#3b82f6"/> Stock: {item.quantity} {item.unit}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{...styles.status, color: item.status === 'ACTIVE' ? '#22c55e' : '#f59e0b'}}>
                  ● {item.status}
                </div>
                <div style={styles.idLabel}>NODE_ID: {item.listing_id}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { background: "#f8fafc", minHeight: "100vh" },
  mainTitle: { color: "white", fontSize: "22px", fontWeight: "900", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "12px" },
  addBtn: { background: "#3b82f6", color: "white", border: "none", padding: "12px 25px", borderRadius: "4px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" },
  cardImg: { width: "100%", height: "220px", objectFit: "cover", borderBottom: "1px solid #f1f5f9" },
  cardBody: { padding: "20px", display: "flex", flexDirection: "column" },
  categoryBadge: { fontSize: "10px", fontWeight: "900", color: "#3b82f6", textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" },
  productName: { fontSize: "19px", fontWeight: "800", color: "#0f172a", margin: "0 0 5px 0" },
  priceTag: { fontSize: "24px", fontWeight: "900", color: "#1e293b", marginBottom: "15px" },
  infoBox: { background: "#f1f5f9", padding: "15px", borderRadius: "8px", marginBottom: "15px" },
  infoRow: { fontSize: "12px", color: "#334155", display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", fontWeight: "600" },
  status: { fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" },
  idLabel: { fontSize: "9px", color: "#94a3b8", fontFamily: "monospace" },
  dropMenuContainer: { position: "absolute", top: "12px", right: "12px", zIndex: 10 },
  optionsTrigger: { background: "rgba(15, 23, 42, 0.8)", color: "white", border: "none", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  dropdown: { position: "absolute", top: "40px", right: "0", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", width: "160px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: 50, padding: "5px 0" },
  dropItem: { padding: "12px 15px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700", borderBottom: "1px solid #f8fafc" },
  loader: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#3b82f6', fontWeight: '900', background: '#0f172a' }
};

export default AdminViewListing;
