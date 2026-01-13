import React, { useState } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Import the five independent sidebars from your directory
import AdminFarmersSidebar from "../sidebars/AdminFarmersSidebar";
import AdminBuyersSidebar from "../sidebars/AdminBuyersSidebar";
import AdminSystemSidebar from "../sidebars/AdminSystemSidebar";
import AdminUsersSidebar from "../sidebars/AdminUsersSidebar";
import AdminProfileSidebar from "../sidebars/AdminProfileSidebar";
import AdminWelcomePage from "../../pages/dashboard/AdminLogo";

const AdminNavbar = () => {
  const navigate = useNavigate();

  // State to track which sidebar is currently "toggled" on
  const [activeSidebar, setActiveSidebar] = useState(null);
  
  // New state to toggle the long Welcome/Rules page
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      window.location.href = "/login";
    }
  };

  const toggleSidebar = (name) => {
    setShowWelcome(false); // Close welcome page if a sidebar is opened
    setActiveSidebar(prev => (prev === name ? null : name));
  };

  // Logic to toggle the welcome page via Logo
  const toggleWelcome = (e) => {
    e.preventDefault(); // Prevent default link navigation
    setActiveSidebar(null); // Close any open sidebars
    setShowWelcome(!showWelcome); // Toggle the welcome page visibility
  };

  // Inline style for buttons to handle the "active" underline
  const getBtnStyle = (name) => ({
    background: "transparent",
    border: "none",
    borderBottom: activeSidebar === name ? "2px solid white" : "2px solid transparent",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    padding: "6px 12px",
    transition: "all 0.3s ease"
  });

  return (
    <div className="navbar-wrapper">
      {/* Top Navigation Bar with Inline Flex for Left alignment */}
      <nav className="farmer-navbar admin-variant" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', zIndex: 5000, position: 'relative' }}>
        
        {/* Brand - Now acts as the Welcome Toggle */}
        <div 
          className="brand" 
          onClick={toggleWelcome}
          style={{ cursor: 'pointer', color: 'white', whiteSpace: 'nowrap', textDecoration: 'none' }}
        >
          🌿 Fasika <span style={{ fontSize: '12px', opacity: 0.8 }}>ADMIN</span>
        </div>

        {/* Links container with Inline Space-Evenly */}
        <div className="nav-links" style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flex: 1, gap: '0' }}>
          
          {/* --- MANAGEMENT GROUP --- */}
          <div className="nav-group" style={{ display: 'flex', gap: '16px' }}>
            <button 
              style={getBtnStyle('users')}
              onClick={() => toggleSidebar('users')}
            >
              Users
            </button>
            <button 
              style={getBtnStyle('farmers')}
              onClick={() => toggleSidebar('farmers')}
            >
              Farmers
            </button>
            <button 
              style={getBtnStyle('buyers')}
              onClick={() => toggleSidebar('buyers')}
            >
              Buyers
            </button>
          </div>

          {/* --- PRODUCTION OVERSIGHT --- */}
          <div className="nav-group" style={{ display: 'flex', gap: '16px' }}>
            <Link 
              title="Monitor Land & Crops" 
              to="/admin/production" 
              onClick={() => {setActiveSidebar(null); setShowWelcome(false);}}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              Team
            </Link>
            <Link 
              title="Marketplace Orders" 
              to="/admin/orders" 
              onClick={() => {setActiveSidebar(null); setShowWelcome(false);}}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              Contact
            </Link>
          </div>

          {/* --- SYSTEM GROUP --- */}
          <div className="nav-group" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/admin/notifications" onClick={() => {setActiveSidebar(null); setShowWelcome(false);}} style={{ textDecoration: 'none' }}>🔔</Link>
            
            <button 
              style={getBtnStyle('system')}
              onClick={() => toggleSidebar('system')}
            >
              Support
            </button>
            
            <button 
              style={getBtnStyle('profile')}
              onClick={() => toggleSidebar('profile')}
            >
              Profile
            </button>
            
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              style={{ background: 'transparent', border: '1px solid white', borderRadius: '6px', padding: '6px 12px', color: 'white', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- THE FULL SCREEN WELCOME/RULES OVERLAY --- */}
      {showWelcome && (
        <div className="welcome-overlay-container" style={{
          position: 'fixed',
          top: '78px', // Directly under your navbar
          left: '70px', // Matches your offset
          right: 0,
          bottom: 0,
          background: 'white',
          zIndex: 4000,
          overflowY: 'auto'
        }}>
          <AdminWelcomePage />
        </div>
      )}

      {/* --- SIDEBAR SLOT --- */}
      <div className="sidebar-container-slot">
        {activeSidebar === 'users' && <AdminUsersSidebar />}
        {activeSidebar === 'farmers' && <AdminFarmersSidebar />}
        {activeSidebar === 'buyers' && <AdminBuyersSidebar />}
        {activeSidebar === 'system' && <AdminSystemSidebar />}
        {activeSidebar === 'profile' && <AdminProfileSidebar />}
      </div>
    </div>
  );
};

export default AdminNavbar;