import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaShoppingCart, FaCaretDown } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
// 1. Import your central api instance
import api from "../../api/axios";
import DraggablePromotionPage from "../../pages/dashboard/BuyerPromotionPage";

const BuyerTopNavbar = () => {
  const [region, setRegion] = useState("Addis Ababa");
  const [showPromo, setShowPromo] = useState(false);
  const location = useLocation();

  // 2. Profile state logic from FarmerNavbar
  const [userData, setUserData] = useState({ name: "", photo: null });

  // 3. Fetch Profile logic on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/farmers/profile');
        if (res.data && res.data.success) {
          const profile = res.data.data;
          setUserData({
            name: profile.full_name || profile.farm_name || "Buyer",
            photo: profile.photo_url || null 
          });
        }
      } catch (err) {
        console.error("Could not load nav profile data", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <nav style={amazonStyles.navbar}>
        <style>{`
          .nav-hover:hover { border: 1px solid #fff !important; border-radius: 2px; }
          .search-focus:focus-within { box-shadow: 0 0 0 2px #f08804; }
          .logo-btn { cursor: pointer; user-select: none; }
        `}</style>

        {/* Logo - Toggles showPromo */}
        <div 
          onClick={() => setShowPromo(!showPromo)} 
          className="nav-hover logo-btn" 
          style={amazonStyles.logo}
        >
          fasika<span style={{ color: "#febd69" }}>.et</span>
        </div>

        {/* Deliver To Section */}
        <div className="nav-hover" style={amazonStyles.navSection}>
          <FaMapMarkerAlt style={amazonStyles.locationIcon} />
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Deliver to</span>
            <span style={amazonStyles.lineTwo}>{region}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-focus" style={amazonStyles.searchContainer}>
          <div style={amazonStyles.searchCategory}>
            <select style={amazonStyles.categorySelect}>
              <option>All</option>
              <option>Livestock</option>
              <option>Grains</option>
              <option>Vegetables</option>
            </select>
            <FaCaretDown style={amazonStyles.caretIcon} />
          </div>
          <input
            type="text"
            style={amazonStyles.searchInput}
            placeholder="Search for bulls, teff, or honey..."
          />
          <button style={amazonStyles.searchButton}>
            <FaSearch style={{ fontSize: "18px" }} />
          </button>
        </div>

        {/* 4. Accounts & Lists - Now Dynamic */}
        <div className="nav-hover" style={amazonStyles.navSection}>
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>
              Hello, {userData.name ? userData.name.split(' ')[0] : "Sign in"}
            </span>
            <span style={amazonStyles.lineTwo}>
              Account & Lists <FaCaretDown style={{ fontSize: "10px" }} />
            </span>
          </div>
          
          {/* Avatar / Profile Image Logic */}
          <div style={amazonStyles.avatarCircle}>
            {userData.photo ? (
              <img src={userData.photo} alt="User" style={amazonStyles.avatarImg} />
            ) : (
              <MdOutlineAccountCircle size={30} color="white" />
            )}
          </div>
        </div>

        {/* Returns & Orders */}
        <Link to="/orders" className="nav-hover" style={amazonStyles.navSectionLink}>
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Returns</span>
            <span style={amazonStyles.lineTwo}>& Orders</span>
          </div>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="nav-hover" style={amazonStyles.cartSection}>
          <div style={{ position: "relative" }}>
            <FaShoppingCart style={{ fontSize: "32px" }} />
            <span style={amazonStyles.cartCount}>3</span>
          </div>
          <span style={{ ...amazonStyles.lineTwo, marginTop: "12px" }}>Cart</span>
        </Link>
      </nav>

      {/* Toggled Promotion Page Overlay */}
      {showPromo && (
        <div style={overlayStyles.wrapper}>
          <div style={overlayStyles.header}>
            <span>Marketplace Promotions</span>
            <button 
                style={overlayStyles.closeBtn} 
                onClick={() => setShowPromo(false)}
            >
                CLOSE [DROP]
            </button>
          </div>
          <DraggablePromotionPage />
        </div>
      )}
    </>
  );
};

const overlayStyles = {
    wrapper: {
        position: 'fixed',
        top: '60px',
        left: 0,
        width: '100%',
        height: 'calc(100vh - 60px)',
        zIndex: 15000,
        backgroundColor: '#f0f2f2',
        overflowY: 'auto'
    },
    header: {
        background: '#232f3e',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    closeBtn: {
        background: '#e74c3c',
        border: 'none',
        color: 'white',
        padding: '5px 15px',
        borderRadius: '4px',
        cursor: 'pointer'
    }
}

const amazonStyles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#131921",
    padding: "8px 20px",
    gap: "15px",
    height: "60px",
    color: "#fff",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 11000,
  },
  logo: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    padding: "6px 12px",
    border: "1px solid transparent",
    transition: "0.1s",
  },
  navSection: {
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    cursor: "pointer",
    border: "1px solid transparent",
    gap: "8px", // Increased gap for the avatar
  },
  navSectionLink: {
    textDecoration: "none",
    color: "#fff",
    padding: "6px 10px",
    border: "1px solid transparent",
  },
  locationIcon: {
    fontSize: "18px",
    marginTop: "8px",
    marginRight: "2px",
  },
  navTextContainer: {
    display: "flex",
    flexDirection: "column",
  },
  lineOne: {
    fontSize: "12px",
    color: "#ccc",
  },
  lineTwo: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  searchContainer: {
    display: "flex",
    flex: 1,
    height: "40px",
    borderRadius: "4px",
    overflow: "hidden",
    backgroundColor: "#fff",
    margin: "0 10px", 
  },
  searchCategory: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: "0 10px",
    borderRight: "1px solid #bbb",
    cursor: "pointer",
    position: "relative",
  },
  categorySelect: {
    appearance: "none",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "12px",
    color: "#555",
    paddingRight: "15px",
    outline: "none",
    cursor: "pointer",
  },
  caretIcon: {
    position: "absolute",
    right: "5px",
    fontSize: "10px",
    color: "#555",
  },
  searchInput: {
    flex: 1,
    border: "none",
    padding: "0 10px",
    outline: "none",
    fontSize: "15px",
  },
  searchButton: {
    backgroundColor: "#febd69",
    border: "none",
    width: "45px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
  },
  cartSection: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#fff",
    padding: "0 10px",
    gap: "5px",
    border: "1px solid transparent",
  },
  cartCount: {
    position: "absolute",
    top: "-5px",
    right: "10px",
    backgroundColor: "#131921",
    color: "#f08804",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "20px",
    textAlign: "center",
  },
  // New styles for the Profile Avatar
  avatarCircle: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.3)"
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
};

export default BuyerTopNavbar;
