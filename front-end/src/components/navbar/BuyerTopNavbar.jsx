import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaShoppingCart, FaCaretDown } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import api from "../../api/axios";
import DraggablePromotionPage from "../../pages/dashboard/BuyerPromotionPage";

const BuyerTopNavbar = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState(localStorage.getItem("userRegion") || "Locating...");
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [userData, setUserData] = useState({ name: "", photo: null });
  
  const regionRef = useRef(null);

  const ethiopianRegions = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa", 
    "Gambela", "Harari", "Oromia", "Sidama", "Somali", "South Ethiopia", 
    "South West Ethiopia", "Tigray"
  ];

  const handleLogoClick = () => {
    setShowPromo(!showPromo);
    navigate("/dashboard");
  };

  useEffect(() => {
    if (!localStorage.getItem("userRegion") && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const placeName = data.city || data.locality || data.principalSubdivision || "Addis Ababa";
            setRegion(placeName);
            localStorage.setItem("userRegion", placeName);
          } catch (error) {
            setRegion("Addis Ababa");
          }
        },
        () => setRegion("Addis Ababa")
      );
    }
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setShowRegionMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegionSelect = (selected) => {
    setRegion(selected);
    localStorage.setItem("userRegion", selected);
    setShowRegionMenu(false);
  };

  return (
    <>
      <nav style={amazonStyles.navbar}>
        <style>{`
          .nav-hover:hover { border: 1px solid #fff !important; border-radius: 2px; }
          .search-focus:focus-within { box-shadow: 0 0 0 2px #f08804; }
          .logo-btn { cursor: pointer; user-select: none; }
          .region-item { color: #111; font-size: 14px; transition: background 0.1s; font-weight: 600; }
          .region-item:hover { background: #F0F2F2; color: #c45500 !important; }
          
          .amazon-arrow {
            position: absolute;
            top: -10px;
            left: 20px;
            width: 0; 
            height: 0; 
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid white;
            z-index: 1000000;
          }
        `}</style>

        {/* Logo */}
        <div onClick={handleLogoClick} className="nav-hover logo-btn" style={amazonStyles.logo}>
          fasika<span style={{ color: "#febd69" }}>.et</span>
        </div>

        {/* Location Section */}
        <div 
          className="nav-hover" 
          style={{ ...amazonStyles.navSection, position: 'relative' }} 
          ref={regionRef}
          onClick={() => setShowRegionMenu(!showRegionMenu)}
        >
          <FaMapMarkerAlt style={amazonStyles.locationIcon} />
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Deliver to</span>
            <span style={amazonStyles.lineTwo}>{region}</span>
          </div>

          {showRegionMenu && (
            <div style={amazonStyles.customDropdown}>
              <div className="amazon-arrow"></div>
              <div style={amazonStyles.dropdownHeader}>
                Choose your location
              </div>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {ethiopianRegions.map(reg => (
                  <div 
                    key={reg} 
                    className="region-item"
                    style={amazonStyles.dropdownItem}
                    onClick={(e) => { e.stopPropagation(); handleRegionSelect(reg); }}
                  >
                    {reg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar - Fixed Visibility */}
        <div className="search-focus" style={amazonStyles.searchContainer}>
          <div style={amazonStyles.searchCategory}>
            <select style={amazonStyles.categorySelect}>
              <option>All</option>
              <option>Livestock</option>
              <option>Grains</option>
            </select>
            <FaCaretDown style={amazonStyles.caretIcon} />
          </div>
          <input type="text" style={amazonStyles.searchInput} placeholder="Search for bulls, teff, or honey..." />
          <button style={amazonStyles.searchButton}>
            <FaSearch style={{ fontSize: "20px", color: "#333" }} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="nav-hover" style={amazonStyles.navSection}>
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Hello, {userData.name ? userData.name.split(' ')[0] : "Sign in"}</span>
            <span style={amazonStyles.lineTwo}>Account & Lists <FaCaretDown style={{ fontSize: "10px" }} /></span>
          </div>
          <div style={amazonStyles.avatarCircle}>
            {userData.photo ? (
              <img src={userData.photo} alt="User" style={amazonStyles.avatarImg} />
            ) : (
              <MdOutlineAccountCircle size={34} color="white" />
            )}
          </div>
        </div>

        {/* Orders & Cart */}
        <Link to="/orders" className="nav-hover" style={amazonStyles.navSectionLink}>
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Returns</span>
            <span style={amazonStyles.lineTwo}>& Orders</span>
          </div>
        </Link>

        <Link to="/cart" className="nav-hover" style={amazonStyles.cartSection}>
          <div style={{ position: "relative" }}>
            <FaShoppingCart style={{ fontSize: "34px" }} />
            <span style={amazonStyles.cartCount}>3</span>
          </div>
          <span style={{ ...amazonStyles.lineTwo, marginTop: "10px" }}>Cart</span>
        </Link>
      </nav>

      {showPromo && (
        <div style={overlayStyles.wrapper}>
          <div style={overlayStyles.header}>
            <span>Marketplace Promotions</span>
            <button style={overlayStyles.closeBtn} onClick={() => setShowPromo(false)}>CLOSE [DROP]</button>
          </div>
          <DraggablePromotionPage />
        </div>
      )}
    </>
  );
};

const overlayStyles = {
    wrapper: { position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)', zIndex: 100003, backgroundColor: '#f0f2f2', overflowY: 'auto' },
    header: { background: '#232f3e', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', fontWeight: 'bold' },
    closeBtn: { background: '#e74c3c', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }
};

const amazonStyles = {
  navbar: { 
    display: "flex", 
    alignItems: "center", 
    backgroundColor: "#131921", 
    padding: "5px 20px", // Reduced top/bottom padding to pull text up
    gap: "12px", 
    minHeight: "65px", // Using minHeight instead of fixed height for better vertical centering
    color: "#fff", 
    position: "fixed", 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 10000 
  },
  logo: { textDecoration: "none", color: "#fff", fontSize: "28px", fontWeight: "800", padding: "4px 10px", border: "1px solid transparent" },
  navSection: { display: "flex", alignItems: "center", padding: "4px 8px", cursor: "pointer", border: "1px solid transparent", gap: "6px" },
  navSectionLink: { textDecoration: "none", color: "#fff", padding: "4px 8px", border: "1px solid transparent" },
  locationIcon: { fontSize: "20px", alignSelf: "center", marginTop: "12px" },
  navTextContainer: { display: "flex", flexDirection: "column", justifyContent: "center" },
  lineOne: { fontSize: "13px", color: "#ccc", fontWeight: "600", lineHeight: "1.1" },
  lineTwo: { fontSize: "16px", fontWeight: "800", lineHeight: "1.1" },
  
  // Search Bar fixes
  searchContainer: { display: "flex", flex: 1, height: "45px", borderRadius: "4px", overflow: "hidden", backgroundColor: "#fff", margin: "0 5px" },
  searchCategory: { display: "flex", alignItems: "center", backgroundColor: "#f3f3f3", padding: "0 10px", borderRight: "1px solid #bbb", position: "relative" },
  categorySelect: { appearance: "none", backgroundColor: "transparent", border: "none", fontSize: "14px", paddingRight: "15px", outline: "none", cursor: "pointer", fontWeight: "700" },
  caretIcon: { position: "absolute", right: "5px", fontSize: "11px", color: "#555" },
  searchInput: { flex: 1, border: "none", padding: "0 12px", outline: "none", fontSize: "16px", fontWeight: "500", color: "#111" },
  searchButton: { 
    backgroundColor: "#febd69", 
    border: "none", 
    minWidth: "50px", // Ensured width
    height: "100%",   // Ensured height matches container
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },

  cartSection: { display: "flex", alignItems: "center", textDecoration: "none", color: "#fff", padding: "0 10px", gap: "5px" },
  cartCount: { position: "absolute", top: "-8px", right: "12px", color: "#f08804", fontSize: "18px", fontWeight: "900" },
  avatarCircle: { width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.3)" },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  
  customDropdown: { 
    position: 'absolute', 
    top: '55px', 
    left: '-10px', 
    backgroundColor: 'white', 
    minWidth: '260px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.35)', 
    borderRadius: '8px', 
    zIndex: 999999,
    padding: '0 0 10px 0',
    border: '1px solid #D5D9D9'
  },
  dropdownHeader: { padding: '14px 15px', backgroundColor: '#F0F2F2', borderBottom: '1px solid #D5D9D9', borderRadius: '8px 8px 0 0', color: '#111', fontWeight: '800', fontSize: '15px' },
  dropdownItem: { padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #f3f3f3' }
};

export default BuyerTopNavbar;
