import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import MyFarmSidebar from "../sidebars/MyFarmSidebar";
import MarketSidebar from "../sidebars/MarketSidebar";
import ProfileSidebar from "../sidebars/ProfileSidebar";
import FarmerLogo from "../../pages/dashboard/FarmerLogo"; 
import api from "../../api/axios";

// ICONS
import { 
  MdCloudQueue, 
  MdDashboard, 
  MdOutlineNotificationsActive, 
  MdHelpOutline, 
  MdOutlineShoppingBag, 
  MdOutlineAccountCircle,
  MdAgriculture
} from "react-icons/md"; 

const FarmerNavbar = ({ toggle }) => {
  const [showMyFarm, setShowMyFarm] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoPage, setShowLogoPage] = useState(false); 
  
  const [farmerData, setFarmerData] = useState({ name: "", photo: null });
  const navigate = useNavigate();

  const myFarmRef = useRef(null);
  const marketRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchFarmerProfile = async () => {
      try {
        const res = await api.get('/farmers/profile');
        if (res.data && res.data.success) {
          const profile = res.data.data;
          setFarmerData({
            name: profile.full_name || profile.farm_name || "Farmer",
            photo: profile.photo_url || null 
          });
        }
      } catch (err) {
        console.error("Could not load nav profile data", err);
      }
    };
    fetchFarmerProfile();
  }, []);

  const closeAll = () => {
    setShowMyFarm(false);
    setShowMarket(false);
    setShowProfile(false);
    setShowLogoPage(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault(); 
    closeAll();
    setShowLogoPage(!showLogoPage);
    navigate("/dashboard"); 
  };

  const handleMyFarmClick = () => {
    const targetState = !showMyFarm;
    closeAll();
    setShowMyFarm(targetState);
  };

  const handleMarketClick = () => {
    const targetState = !showMarket;
    closeAll();
    setShowMarket(targetState);
  };

  const handleProfileClick = () => {
    const targetState = !showProfile;
    closeAll();
    setShowProfile(targetState);
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
    gap: "8px",                
    whiteSpace: "nowrap"
  });

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",                
    fontSize: "1.05rem",
    fontWeight: "700",
    whiteSpace: "nowrap"
  };

  // ✅ ADJUSTED TO STANDARD PROMINENT SIZE (38px)
  const avatarStyle = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    marginLeft: "4px"
  };

  const EthiopiaMapIcon = () => (
    <svg width="32" height="32" viewBox="0 0 512 512" fill="#2ecc71" xmlns="http://www.w3.org/2000/svg">
      <path d="M418.5 119.8c-12.7-18.7-32.5-31.5-63.4-31.4-15.6.1-26.6 5.8-37.4 12.5-12 7.4-23.3 16.5-36 21.6-13.6 5.5-29 5.8-43.5 3.3-15-2.6-28.7-10.3-43.4-15-18.1-5.7-37.7-6-56.1.1-17.7 5.9-32.9 19.3-43.1 35.8-12.6 20.3-17.8 45.4-13.7 69.1 2.8 15.9 8.7 30.9 14.8 45.9 6.5 16 13.5 31.8 19.8 47.9 4.3 11.1 7.8 22.5 11.8 33.7 3.1 8.7 6.8 17.2 10.5 25.7 6.1 14 12.7 27.9 20.2 41.2 10.2 18.2 23.3 35.5 41.2 47.4 14.8 9.9 32.1 15.1 49.9 15.3 22.8.2 44.9-8.4 62.4-23 15.9-13.2 28.5-30.1 38.6-48.5 7.4-13.5 13.6-27.7 20-41.8 4.7-10.4 9.8-20.7 15.2-30.8 7.3-13.7 15.1-27.1 23-40.4 8.7-14.7 17.7-29.3 25.1-44.8 8.9-18.6 14.2-39.1 14.1-59.8-.1-21.7-6.2-42.8-17.9-61.1z" />
    </svg>
  );

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
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 9999,
        display: "flex", alignItems: "center", padding: "0 30px", height: "78px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", boxSizing: "border-box", overflow: "hidden" 
      }}>
        
        <div onClick={handleLogoClick} style={{ cursor: "pointer", flexShrink: 0 }}>
          <div className="brand" style={{ ...linkStyle, fontWeight: "800", fontSize: "1.4rem" }}>
            <EthiopiaMapIcon />
            <span style={{ marginLeft: "6px" }}>Farmers</span>
          </div>
        </div>

        <div className="nav-links" style={{ 
          display: "flex", justifyContent: "space-between", alignItems: "center", 
          flex: 1, marginLeft: "40px", flexWrap: "nowrap"
        }}>
          <div style={{ display: "flex", gap: "25px", flexShrink: 0 }}> 
            <Link to="/weather" style={linkStyle} onClick={closeAll}>Weather <MdCloudQueue size={22}/></Link>
            <button style={getBtnStyle(showMyFarm)} onClick={handleMyFarmClick}>
              My Farm <MdDashboard size={22}/>
            </button>
            <Link to="/advisory" style={linkStyle} onClick={closeAll}>Advisory <MdAgriculture size={22}/></Link>
          </div>

          <div style={{ display: "flex", gap: "25px", flexShrink: 0 }}> 
            <Link to="/notifications" style={linkStyle} onClick={closeAll}>Notifications <MdOutlineNotificationsActive size={22}/></Link>
            <Link to="/support" style={linkStyle} onClick={closeAll}>Support <MdHelpOutline size={22}/></Link>
          </div>

          <div style={{ display: "flex", gap: "25px", alignItems: "center", flexShrink: 0 }}> 
            <button style={getBtnStyle(showMarket)} onClick={handleMarketClick}>
              Market <MdOutlineShoppingBag size={22}/></button>
            <button style={getBtnStyle(showProfile)} onClick={handleProfileClick}>
              <span style={{ fontSize: "1.1rem" }}>
                {farmerData.name ? `Hello, ${farmerData.name.split(' ')[0]}` : "Profile"} 
              </span>
              <div style={avatarStyle}>
                {farmerData.photo ? (
                  <img src={farmerData.photo} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  // ✅ ICON INCREASED TO 34px FOR BETTER VISIBILITY
                  <MdOutlineAccountCircle size={34} color="white" />
                )}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {showLogoPage && (
        <div style={{ position: "fixed", top: "78px", left: 0, width: "100%", height: "calc(100vh - 78px)", zIndex: 9990, backgroundColor: "#0f172a" }}>
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
