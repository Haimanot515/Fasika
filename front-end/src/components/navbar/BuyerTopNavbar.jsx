import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaShoppingCart, FaCaretDown } from "react-icons/fa";
import DraggablePromotionPage from "../../pages/dashboard/BuyerPromotionPage";

const BuyerTopNavbar = ({ onSearchTrigger }) => { // Logic prop added
  const [region] = useState("Addis Ababa");
  const [showPromo, setShowPromo] = useState(false);
  
  // New internal state for the inputs
  const [searchVal, setSearchVal] = useState("");
  const [catVal, setCatVal] = useState("All");

  const executeSearch = () => {
    onSearchTrigger({ term: searchVal, category: catVal });
  };

  return (
    <>
      <nav style={amazonStyles.navbar}>
        <style>{`
          .nav-hover:hover { border: 1px solid #fff !important; border-radius: 2px; }
          .search-focus:focus-within { box-shadow: 0 0 0 2px #f08804; }
          .logo-btn { cursor: pointer; user-select: none; }
        `}</style>

        <div onClick={() => setShowPromo(!showPromo)} className="nav-hover logo-btn" style={amazonStyles.logo}>
          fasika<span style={{ color: "#febd69" }}>.et</span>
        </div>

        <div className="nav-hover" style={amazonStyles.navSection}>
          <FaMapMarkerAlt style={amazonStyles.locationIcon} />
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Deliver to</span>
            <span style={amazonStyles.lineTwo}>{region}</span>
          </div>
        </div>

        <div className="search-focus" style={amazonStyles.searchContainer}>
          <div style={amazonStyles.searchCategory}>
            <select 
              style={amazonStyles.categorySelect} 
              value={catVal} 
              onChange={(e) => setCatVal(e.target.value)}
            >
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
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
          />
          <button style={amazonStyles.searchButton} onClick={executeSearch}>
            <FaSearch style={{ fontSize: "18px" }} />
          </button>
        </div>

        <div className="nav-hover" style={amazonStyles.navSection}>
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Hello, User</span>
            <span style={amazonStyles.lineTwo}>Account & Lists <FaCaretDown style={{ fontSize: "10px" }} /></span>
          </div>
        </div>

        <Link to="/orders" className="nav-hover" style={amazonStyles.navSectionLink}>
          <div style={amazonStyles.navTextContainer}>
            <span style={amazonStyles.lineOne}>Returns</span>
            <span style={amazonStyles.lineTwo}>& Orders</span>
          </div>
        </Link>

        <Link to="/cart" className="nav-hover" style={amazonStyles.cartSection}>
          <div style={{ position: "relative" }}>
            <FaShoppingCart style={{ fontSize: "32px" }} />
            <span style={amazonStyles.cartCount}>3</span>
          </div>
          <span style={{ ...amazonStyles.lineTwo, marginTop: "12px" }}>Cart</span>
        </Link>
      </nav>

      {showPromo && (
        <div style={overlayStyles.wrapper}>
          <div style={overlayStyles.header}>
            <span>Marketplace Promotions</span>
            <button style={overlayStyles.closeBtn} onClick={() => setShowPromo(false)}>
              CLOSE [DROP]
            </button>
          </div>
          <DraggablePromotionPage />
        </div>
      )}
    </>
  );
};

// Styles remain exactly as you provided...
const overlayStyles = { /* ... your styles ... */ };
const amazonStyles = { /* ... your styles ... */ };

export default BuyerTopNavbar;
