import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import MyFarmSidebar from "../sidebars/MyFarmSidebar";
import MarketSidebar from "../sidebars/MarketSidebar";
import ProfileSidebar from "../sidebars/ProfileSidebar";
import FarmerLogo from "../../pages/dashboard/FarmerLogo"; 
import api from "../../api/axios";

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
  
  // State for User Data from DB
  const [farmerData, setFarmerData] = useState({ name: "", photo: null });

  const myFarmRef = useRef(null);
  const marketRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch farmer profile from database on mount
  useEffect(() => {
    const fetchFarmerProfile = async () => {
      try {
        const res = await api.get('/farmers/my-profile');
        if (res.data) {
          setFarmerData({
            name: res.data.full_name || res.data.farm_name || "User",
            photo: res.data.photo || null
          });
        }
      } catch (err) {
        console.error("Could not load nav profile data", err);
      }
    };
    fetchFarmerProfile();
  }, []);

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
    fontSize: "1.05rem",
    fontWeight: "700",
    cursor: "pointer",
    padding: "10px 5px", 
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",               
    whiteSpace: "nowrap"
  });

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",               
    fontSize: "1.05rem",
    fontWeight: "700",
    whiteSpace: "nowrap"
  };

  // GitHub style avatar dimensions
  const avatarStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)", // Background for default placeholder
    overflow: "hidden"
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
        padding: "0 30px",
        height: "78px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        overflow: "hidden" 
      }}>
        
        <div onClick={handleLogoClick} style={{ cursor: "pointer", flexShrink: 0 }}>
          <Link to="/" className="brand" style={{ ...linkStyle, fontWeight: "800", fontSize: "1.4rem", pointerEvents: "none" }}>
            <FaSeedling size={30} color="#2ecc71" /> 
            <span style={{ marginLeft: "6px" }}>Farmers</span>
          </Link>
        </div>

        <div className="nav-links" style={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center", 
          flex: 1,
          marginLeft: "40px",
          flexWrap: "nowrap",
          overflowX: "auto",
          msOverflowStyle: "none",
          scrollbarWidth: "none"
        }}>
          
          <div style={{ display: "flex", gap: "25px", flexShrink: 0 }}> 
            <Link to="/weather" style={linkStyle}>Weather <MdCloudQueue size={22}/></Link>
            <button style={getBtnStyle(showMyFarm)} onClick={handleMyFarmClick}>
              My Farm <MdDashboard size={22}/>
            </button>
            <Link to="/advisory" style={linkStyle}>Advisory <MdAgriculture size={22}/></Link>
          </div>

          <div style={{ display: "flex", gap: "25px", flexShrink: 0 }}> 
            <Link to="/notifications" style={linkStyle}>Notifications <MdOutlineNotificationsActive size={22}/></Link>
            <Link to="/support" style={linkStyle}>Support <MdHelpOutline size={22}/></Link>
          </div>

          <div style={{ display: "flex", gap: "25px", alignItems: "center", flexShrink: 0 }}> 
            <button style={getBtnStyle(showMarket)} onClick={handleMarketClick}>
              Market <MdOutlineShoppingBag size={22}/></button>
            <button style={getBtnStyle(showProfile)} onClick={handleProfileClick}>
              
              {/* Display "Hello, Name" */}
              {farmerData.name ? `Hello, ${farmerData.name.split(' ')[0]}` : "Profile"} 

              {/* Display Photo or Circular Placeholder with Icon */}
              <div style={avatarStyle}>
                {farmerData.photo ? (
                  <img src={farmerData.photo} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <MdOutlineAccountCircle size={28} color="white" />
                )}
              </div>
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
