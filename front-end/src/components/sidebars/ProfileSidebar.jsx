import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaUserCircle, FaIdCard, FaDoorOpen, FaChevronRight, FaChevronDown 
} from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

const ProfileSidebar = ({ isOpen = true }) => {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const sidebarRef = useRef(null);

  // Accordion state
  const [openL1, setOpenL1] = useState({ ACCOUNT: true });
  const [openL2, setOpenL2] = useState({ ACC_UPDATE: true });

  const toggleSidebar = () => setCollapsed(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!collapsed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsed]);

  const toggleL1 = (key) => {
    if (collapsed) setCollapsed(false);
    setOpenL1(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleL2 = (key) => {
    setOpenL2(prev => ({ ...prev, [key]: !prev[key] }));
  };

  /* --- Styles --- */
  const sidebarStyle = {
    width: collapsed ? "70px" : "350px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#ffffff",
    borderLeft: "1px solid #e0e0e0",
    position: "fixed",
    top: "80px",
    height: "calc(100vh - 80px)",
    right: 0,
    zIndex: 10000,
    overflowY: "auto",
    overflowX: "hidden",
    paddingBottom: "80px",
    boxShadow: collapsed ? "none" : "-10px 0 15px -5px rgba(0,0,0,0.05)"
  };

  const l1Header = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "15px 20px", cursor: "pointer", background: "#fff",
    borderBottom: "1px solid #f5f5f5", width: "100%", border: "none",
    color: "#27ae60", fontWeight: "900", fontSize: "14px", letterSpacing: "0.5px"
  };

  const l2Header = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 20px 10px 40px", cursor: "pointer", background: "transparent",
    border: "none", width: "100%", fontSize: "12px", color: "#333",
    fontWeight: "700", textAlign: "left"
  };

  const l3LinkStyle = ({ isActive }) => ({
    display: "flex", alignItems: "center", gap: "10px",
    padding: "8px 10px 8px 70px",
    textDecoration: "none",
    fontSize: "12px",
    color: isActive ? "#27ae60" : "#7f8c8d",
    borderRight: isActive ? "3px solid #27ae60" : "none",
    background: isActive ? "#f9fdfb" : "transparent",
    transition: "0.2s",
    fontWeight: isActive ? "600" : "400"
  });

  return (
    <>
      <style>
        {`
          .farmer-sidebar-scroll::-webkit-scrollbar { width: 5px; }
          .farmer-sidebar-scroll::-webkit-scrollbar-thumb { background: #27ae60; border-radius: 10px; }
          .icon-box { min-width: 30px; display: flex; justify-content: center; font-size: 18px; }
          .sentence-case { text-transform: lowercase; display: inline-block; }
          .sentence-case::first-letter { text-transform: uppercase; }
          .has-tooltip { position: relative; }
          .tooltip-text {
            visibility: hidden; width: 140px; background-color: #333; color: #fff; text-align: center;
            border-radius: 4px; padding: 6px; position: absolute; z-index: 101; right: 110%;
            top: 50%; transform: translateY(-50%); opacity: 0; transition: opacity 0.3s; font-size: 11px;
          }
          .has-tooltip:hover .tooltip-text { visibility: visible; opacity: 1; }
        `}
      </style>

      <aside ref={sidebarRef} style={sidebarStyle} className="farmer-sidebar-scroll">
        <div style={{ padding: collapsed ? "15px 10px" : "15px 20px", textAlign: "center" }}>
          <button 
            className="hamburger-btn has-tooltip"
            onClick={toggleSidebar}
            style={{ 
              width: "100%", padding: "12px", border: "2px solid #27ae60", 
              color: "#27ae60", background: "white", cursor: "pointer", fontWeight: "900", 
              borderRadius: "4px", display: "flex", justifyContent: "center", alignItems: "center"
            }}
          >
            {collapsed ? <FaUserCircle size={22} /> : <><MdOutlineClose style={{marginRight: '8px'}}/> <span className="sentence-case">Close profile</span></>}
            {collapsed && <span className="tooltip-text">Open Profile Menu</span>}
          </button>
        </div>

        <nav>
          {/* --- ACCOUNT INFO --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('ACCOUNT')} className={collapsed ? "has-tooltip" : ""}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="icon-box"><FaIdCard /></div>
                {!collapsed && <span className="sentence-case">Account Information</span>}
              </div>
              {!collapsed && <span>{openL1.ACCOUNT ? <FaChevronDown size={12}/> : <FaChevronRight size={12}/>}</span>}
              {collapsed && <span className="tooltip-text">Account Info</span>}
            </button>
            
            {openL1.ACCOUNT && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('ACC_UPDATE')}>
                  <span className="sentence-case">Update Detail</span>
                  <span>{openL2.ACC_UPDATE ? "−" : "+"}</span>
                </button>
                {openL2.ACC_UPDATE && (
                  <div className="l3-container">
                    <NavLink to="/profile/create-account" style={l3LinkStyle}>
                        <FaUserCircle /> <span className="sentence-case">Create profile</span>
                    </NavLink>
                    <NavLink to="/profile/update-account" style={l3LinkStyle}>
                        <FaIdCard /> <span className="sentence-case">Update profile</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- LOGOUT --- */}
          <div style={{ padding: "20px" }}>
            <NavLink 
              to="/login" 
              style={{ 
                color: "#e74c3c", fontWeight: "bold", textDecoration: "none", 
                fontSize: "14px", display: "flex", alignItems: "center", gap: "10px" 
              }}
            >
              <div className="icon-box"><FaDoorOpen /></div>
              {!collapsed && "Logout of Account"}
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default ProfileSidebar;
