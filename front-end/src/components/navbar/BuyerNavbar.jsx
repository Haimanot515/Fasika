import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { MdDashboard } from "react-icons/md"; 

// IMPORT THE SIDEBAR
import BuyerDashboardSidebar from "../sidebars/BuyerDashboardSidebar"; 

const SecondaryNavbar = () => {
  const location = useLocation();
  
  // STATE TO CONTROL SIDEBAR VISIBILITY
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav style={styles.navBar}>
        <style>{`
          .secondary-link:hover {
            border: 1px solid #fff !important;
          }
        `}</style>

        {/* "ALL" BUTTON - TOGGLES SIDEBAR ON CLICK */}
        <div 
          onClick={toggleSidebar} 
          className="secondary-link"
          style={isSidebarOpen ? styles.activeLink : styles.link}
        >
          <FaBars style={{ marginRight: "8px" }} /> All
        </div>
        
        <Link to="/marketplace" className="secondary-link" style={styles.link}>Marketplace</Link>
        <Link to="/market-prices" className="secondary-link" style={styles.link}>Market Prices</Link>
        <Link to="/trending" className="secondary-link" style={styles.link}>Trending</Link>
        <Link to="/recommended" className="secondary-link" style={styles.link}>Recommended</Link>
        
        {/* DASHBOARD LINK - ALSO TOGGLES SIDEBAR */}
        <div 
          onClick={toggleSidebar}
          className="secondary-link"
          style={isSidebarOpen || location.pathname.includes("/dashboard") ? styles.activeLink : styles.link}
        >
          <MdDashboard style={{ marginRight: "8px", fontSize: "20px" }} /> Dashboard
        </div>

        <Link to="/support" className="secondary-link" style={styles.link}>Help/Support</Link>
      </nav>

      {/* THE SIDEBAR COMPONENT */}
      <BuyerDashboardSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* DARK OVERLAY (DROPS when sidebar closes) */}
      {isSidebarOpen && (
        <div 
          style={styles.overlay} 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}
    </>
  );
};

const styles = {
  navBar: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "#065f46", 
    padding: "8px 25px",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    fontSize: "16px", // INCREASED FONT SIZE
    overflowX: "auto",
    whiteSpace: "nowrap",
    scrollbarWidth: "none", 
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    
    // FIXED POSITIONING
    position: "fixed",
    top: "60px", 
    left: 0,
    right: 0,
    zIndex: 100000 
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    border: "1px solid transparent",
    borderRadius: "2px",
    transition: "0.2s",
    userSelect: "none",
    fontWeight: "600" // MAKE BOLD
  },
  activeLink: {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #fff", 
    borderRadius: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    userSelect: "none"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)", 
    zIndex: 99999, 
    transition: "0.3s opacity ease"
  }
};

export default SecondaryNavbar;
