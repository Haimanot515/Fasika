import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios"; 
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, FaSearch, FaEllipsisV, FaEdit, FaArchive,
  FaUserShield, FaPhone, FaEnvelope, FaTag, FaBoxOpen, FaGlobe
} from "react-icons/fa";

const AdminViewListing = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenuId, setShowMenuId] = useState(null);
  
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
      const { data } = await api.get("/admin/marketplace/listings");
      setListings(data.listings || []);
      setFilteredListings(data.listings || []);
    } catch (err) { 
      console.error("Registry Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const results = listings.filter(item => (
      item.product_name?.toLowerCase().includes(lowerSearch) ||
      item.owner_name?.toLowerCase().includes(lowerSearch) ||
      item.product_category?.toLowerCase().includes(lowerSearch)
    ));
    setFilteredListings(results);
  }, [searchTerm, listings]);

  const handleDrop = async (id) => {
    if (window.confirm("⚠️ AUTHORITY ACTION: DROP (Archive) this node?")) {
      try {
        await api.patch(`/admin/marketplace/listings/${id}/archive`);
        setListings(prev => prev.filter(item => item.id !== id));
        alert("REGISTRY DROP SUCCESSFUL");
      } catch (err) { 
        alert("DROP Failed: Authority access denied.");
      }
    }
  };

  if (loading) return <div style={styles.loader}>Syncing Master Registry...</div>;

  return (
    <div style={styles.pageContainer}>
      <style>{`
        .search-container {
          background: #0f172a;
          padding: 30px;
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
          max-width: 800px;
          height: 55px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }
        .search-bar-ui input {
          flex: 1;
          border: none;
          padding: 0 20px;
          font-size: 16px;
          outline: none;
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
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .card-ui {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: 0.3s;
          position: relative;
        }
        .card-ui:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .drop-menu {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
        }
        .options-trigger {
          background: rgba(15, 23, 42, 0.7);
          color: white;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>

      {/* COMMAND CENTER HEADER */}
      <div className="search-container">
        <h1 style={styles.mainTitle}><FaGlobe /> GLOBAL PRODUCT REGISTRY</h1>
        <div className="search-bar-ui">
          <input 
            type="text" 
            placeholder="Search Registry by Product, Farmer, or Category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-icon-btn"><FaSearch size={20}/></button>
        </div>
        <button onClick={() => navigate("/admin/farmers/market/add")} style={styles.addBtn}>
          <FaPlus /> ADD REGISTRY NODE
        </button>
      </div>

      {/* REGISTRY NODES */}
      <div className="registry-grid">
        {filteredListings.map((item) => (
          <div key={item.id} className="card-ui">
            <div className="drop-menu">
              <button className="options-trigger" onClick={(e) => {
                e.stopPropagation();
                setShowMenuId(showMenuId === item.id ? null : item.id);
              }}>
                <FaEllipsisV />
              </button>
              {showMenuId === item.id && (
                <div style={styles.dropdown} ref={menuRef}>
                  <div style={styles.dropItem} onClick={() => navigate(`/admin/farmers/market/edit/${item.id}`)}>
                    <FaEdit color="#3b82f6" /> Edit
                  </div>
                  <div style={styles.dropItem} onClick={() => handleDrop(item.id)}>
                    <FaArchive color="#ef4444" /> DROP
                  </div>
                </div>
              )}
            </div>

            <img src={item.primary_image_url || "https://via.placeholder.com/400"} style={styles.cardImg} alt="product" />
            
            <div style={styles.cardBody}>
              <div style={styles.categoryBadge}><FaTag /> {item.product_category}</div>
              <h2 style={styles.productName}>{item.product_name}</h2>
              <div style={styles.priceTag}>ETB {item.price_per_unit} <small>/ {item.unit}</small></div>
              
              <div style={styles.infoBox}>
                <div style={styles.infoRow}><FaUserShield /> {item.owner_name}</div>
                <div style={styles.infoRow}><FaPhone /> {item.owner_phone || 'N/A'}</div>
                <div style={styles.infoRow}><FaBoxOpen /> Stock: {item.quantity} {item.unit}</div>
              </div>

              <div style={{...styles.status, color: item.status === 'ACTIVE' ? '#22c55e' : '#ef4444'}}>
                ● {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { background: "#f1f5f9", minHeight: "100vh" },
  mainTitle: { color: "white", fontSize: "24px", fontWeight: "800", letterSpacing: "1px" },
  addBtn: { background: "#22c55e", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" },
  cardImg: { width: "100%", height: "200px", objectFit: "cover" },
  cardBody: { padding: "20px" },
  categoryBadge: { fontSize: "10px", fontWeight: "900", color: "#3b82f6", textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" },
  productName: { fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 10px 0" },
  priceTag: { fontSize: "22px", fontWeight: "900", color: "#3b82f6" },
  infoBox: { background: "#f8fafc", padding: "12px", borderRadius: "8px", marginTop: "15px" },
  infoRow: { fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" },
  status: { marginTop: "15px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" },
  dropdown: { position: "absolute", top: "45px", right: "10px", background: "white", border: "1px solid #ddd", borderRadius: "8px", width: "120px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", z.index: 20 },
  dropItem: { padding: "10px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  loader: { textAlign: "center", paddingTop: "100px", fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }
};

export default AdminViewListing;
