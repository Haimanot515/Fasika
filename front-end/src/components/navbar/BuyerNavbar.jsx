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
        {/* "ALL" BUTTON - TOGGLES SIDEBAR ON CLICK */}
        <div 
          onClick={toggleSidebar} 
          style={isSidebarOpen ? styles.activeLink : styles.link}
        >
          <FaBars style={{ marginRight: "8px" }} /> All
        </div>
        
        <Link to="/marketplace" style={styles.link}>Marketplace</Link>
        <Link to="/market-prices" style={styles.link}>Market Prices</Link>
        <Link to="/trending" style={styles.link}>Trending</Link>
        <Link to="/recommended" style={styles.link}>Recommended</Link>
        
        {/* DASHBOARD LINK - ALSO TOGGLES SIDEBAR */}
        <div 
          onClick={toggleSidebar}
          style={isSidebarOpen || location.pathname.includes("/dashboard") ? styles.activeLink : styles.link}
        >
          <MdDashboard style={{ marginRight: "8px", fontSize: "18px" }} /> Dashboard
        </div>

        <Link to="/help-support" style={styles.link}>Help/Support</Link>
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
    gap: "20px",
    backgroundColor: "#065f46", // Forest Green to match Agri Brand
    padding: "10px 25px",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    fontSize: "14px",
    overflowX: "auto",
    whiteSpace: "nowrap",
    scrollbarWidth: "none", 
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    position: "relative",
    zIndex: 1000 
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
    border: "1px solid transparent",
    borderRadius: "2px",
    transition: "0.2s",
    userSelect: "none"
  },
  activeLink: {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #fff", 
    borderRadius: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    userSelect: "none"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)", // Darker backdrop for better focus
    zIndex: 9999, // Sits right behind the 10000 z-index sidebar
    transition: "0.3s opacity ease"
  }
};

export default SecondaryNavbar;