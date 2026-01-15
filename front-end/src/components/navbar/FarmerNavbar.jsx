import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import MyFarmSidebar from "../sidebars/MyFarmSidebar";
import MarketSidebar from "../sidebars/MarketSidebar";
import ProfileSidebar from "../sidebars/ProfileSidebar";
import FarmerLogo from "../../pages/dashboard/FarmerLogo"; 

// --- STABLE TESTED ICONS ---
import { 
  MdCloudQueue, 
  MdDashboard, 
  MdOutlineNotificationsActive, 
  MdHelpOutline, 
  MdOutlineShoppingBag, 
  MdOutlineAccountCircle,
  MdAgriculture
} from "react-icons/md"; 
import { FaSeedling } from "react-icons/fa";

const FarmerNavbar = ({ toggle }) => {
  const [showMyFarm, setShowMyFarm] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoPage, setShowLogoPage] = useState(false); 

  const myFarmRef = useRef(null);
  const marketRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogoClick = (e) => {
    e.preventDefault(); 
    setShowLogoPage(!showLogoPage);
    setShowMyFarm(false);
    setShowMarket(false);
    setShowProfile(false);
  };

  const handleMyFarmClick = () => {
    setShowMyFarm(!showMyFarm);
    if (!showMyFarm) { setShowMarket(false); setShowProfile(false); setShowLogoPage(false); }
  };

  const handleMarketClick = () => {
    setShowMarket(!showMarket);
    if (!showMarket) { setShowMyFarm(false); setShowProfile(false); setShowLogoPage(false); }
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    if (!showProfile) { setShowMyFarm(false); setShowMarket(false); setShowLogoPage(false); }
  };

  const getBtnStyle = (isActive) => ({
    background: "transparent",
    border: "none",
    borderBottom: isActive ? "3px solid white" : "3px solid transparent",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    padding: "10px 10px", // Slightly reduced horizontal padding
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",           // Reduced gap between icon and text (was 8px)
    whiteSpace: "nowrap"
  });

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "4px",           // Reduced gap between icon and text (was 8px)
    fontWeight: "500",
    whiteSpace: "nowrap"
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMyFarm && myFarmRef.current && !myFarmRef.current.contains(event.target)) setShowMyFarm(false);
      if (showMarket && marketRef.current && !marketRef.current.contains(event.target)) setShowMarket(false);
      if (showProfile && profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMyFarm, showMarket, showProfile]);

  return (
    <div className="navbar-container" style={{ width: "100%", overflowX: "hidden" }}>
      <nav className="farmer-navbar" style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        zIndex: 9999,
        display: "flex", 
        alignItems: "center", 
        padding: "0 15px",    // Slightly reduced side padding
        height: "78px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        overflow: "hidden" 
      }}>
        
        <div onClick={handleLogoClick} style={{ cursor: "pointer", flexShrink: 0 }}>
          <Link to="/" className="brand" style={{ ...linkStyle, fontWeight: "bold", fontSize: "1.3rem", pointerEvents: "none" }}>
            <FaSeedling size={28} color="#2ecc71" /> 
            <span style={{ marginLeft: "4px" }}>Farmers</span> {/* Reduced from 8px */}
          </Link>
        </div>

        <div className="nav-links" style={{ 
          display: "flex", 
          justifyContent: "space-evenly", 
          alignItems: "center", 
          flex: 1,
          flexWrap: "nowrap",
          overflowX: "auto",
          msOverflowStyle: "none",
          scrollbarWidth: "none"
        }}>
          
          <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}> {/* Reduced gap from 20px */}
            <Link to="/weather" style={linkStyle}>Weather <MdCloudQueue size={22}/></Link>
            <button style={getBtnStyle(showMyFarm)} onClick={handleMyFarmClick}>
              My Farm <MdDashboard size={22}/>
            </button>
            <Link to="/advisory" style={linkStyle}>Advisory <MdAgriculture size={22}/></Link>
          </div>

          <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}> {/* Reduced gap from 20px */}
            <Link to="/notifications" style={linkStyle}>Notifications <MdOutlineNotificationsActive size={22}/></Link>
            <Link to="/support" style={linkStyle}>Support <MdHelpOutline size={22}/></Link>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}> {/* Reduced gap from 20px */}
            <button style={getBtnStyle(showMarket)} onClick={handleMarketClick}>
              Market <MdOutlineShoppingBag size={22}/></button>
            <button style={getBtnStyle(showProfile)} onClick={handleProfileClick}>
              Profile <MdOutlineAccountCircle size={24}/>
            </button>
          </div>
        </div>
      </nav>

      {showLogoPage && (
        <div style={{ 
          position: "fixed", 
          top: "78px", 
          left: 0, 
          width: "100%", 
          height: "calc(100vh - 78px)", 
          zIndex: 9990, 
          overflowY: "auto",
          backgroundColor: "#0f172a" 
        }}>
          <FarmerLogo />
        </div>
      )}

      {showMyFarm && <div ref={myFarmRef} style={{ position: "relative", zIndex: 9998 }}><MyFarmSidebar /></div>}
      {showMarket && <div ref={marketRef} style={{ position: "relative", zIndex: 9998 }}><MarketSidebar /></div>}
      {showProfile && <div ref={profileRef} style={{ position: "relative", zIndex: 9998 }}><ProfileSidebar /></div>}
    </div>
  );
};

export default FarmerNavbar;
