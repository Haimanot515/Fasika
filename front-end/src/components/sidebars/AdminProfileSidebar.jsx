import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const AdminProfileSidebar = ({ isOpen = true }) => {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const sidebarRef = useRef(null);

  // Accordion state
  const [openL1, setOpenL1] = useState({ ACCOUNT: true });
  const [openL2, setOpenL2] = useState({});

  const toggleSidebar = () => setCollapsed(prev => !prev);

  // Auto-collapse when clicking outside
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

  const sidebarStyle = {
    width: collapsed ? "70px" : "350px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    position: "fixed",
    top: "78px", 
    height: "calc(100vh - 78px)", 
    left: 0,
    zIndex: 100,
    overflowY: "auto", 
    overflowX: "hidden",
    paddingBottom: "80px",
    boxShadow: collapsed ? "none" : "10px 0 15px -5px rgba(0,0,0,0.05)"
  };

  const l1Header = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "15px 20px", cursor: "pointer", background: "#fff",
    borderBottom: "1px solid #f5f5f5", width: "100%", borderTop: "none", borderLeft: "none", borderRight: "none",
    color: "#27ae60", fontWeight: "900", fontSize: "14px", letterSpacing: "0.5px",
    position: "relative"
  };

  const l2Header = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 20px 10px 40px", cursor: "pointer", background: "transparent", 
    border: "none", width: "100%", fontSize: "12px", color: "#333", 
    fontWeight: "700", textAlign: "left"
  };

  const l3LinkStyle = ({ isActive }) => ({
    display: "block", 
    padding: "8px 10px 8px 70px", 
    textDecoration: "none",
    fontSize: "12px", 
    color: isActive ? "#27ae60" : "#7f8c8d",
    borderLeft: isActive ? "3px solid #27ae60" : "1px solid #eee",
    background: isActive ? "#f9fdfb" : "transparent",
    transition: "0.2s", 
    fontWeight: isActive ? "600" : "400"
  });

  const symbolStyle = { fontSize: "16px", fontWeight: "400", opacity: "0.7", paddingRight: "10px" };

  return (
    <>
      <style>
        {`
          .admin-sidebar-scroll::-webkit-scrollbar { width: 5px; }
          .admin-sidebar-scroll::-webkit-scrollbar-track { background: #f9f9f9; }
          .admin-sidebar-scroll::-webkit-scrollbar-thumb { background: #27ae60; border-radius: 10px; }
          
          .sentence-case { text-transform: lowercase; display: inline-block; }
          .sentence-case::first-letter { text-transform: uppercase; }

          .hamburger-btn:hover {
            background-color: #f0faf4 !important;
            transform: scale(1.05);
          }

          .has-tooltip { position: relative; }
          .tooltip-text {
            visibility: hidden;
            width: 150px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 4px;
            padding: 6px;
            position: absolute;
            z-index: 101;
            left: 110%;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 11px;
            pointer-events: none;
            font-weight: 400;
          }
          .has-tooltip:hover .tooltip-text { visibility: visible; opacity: 1; }
        `}
      </style>

      <aside ref={sidebarRef} style={sidebarStyle} className="admin-sidebar-scroll">
        <div style={{ padding: collapsed ? "15px 10px" : "10px 20px", textAlign: "center" }}>
          <button 
            className="hamburger-btn has-tooltip"
            onClick={toggleSidebar}
            style={{ 
              width: "100%", padding: collapsed ? "12px 0" : "12px", border: "2px solid #27ae60", 
              color: "#27ae60", background: "white", cursor: "pointer", fontWeight: "900", 
              borderRadius: "4px", display: "flex", justifyContent: "center", alignItems: "center",
              transition: "all 0.2s ease", fontSize: collapsed ? "22px" : "14px"
            }}
          >
            {collapsed ? "👤" : <span className="sentence-case">Close profile menu</span>}
            {collapsed && <span className="tooltip-text">Open Profile Menu</span>}
          </button>
        </div>

        <nav>
          {/* --- ACCOUNT INFO --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('ACCOUNT')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "🆔" : <span className="sentence-case">Account info</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.ACCOUNT ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Account Info</span>}
            </button>
            {openL1.ACCOUNT && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('ACC_MGMT')}>
                  <span className="sentence-case">Personal details</span>
                  <span style={symbolStyle}>{openL2.ACC_MGMT ? "−" : "+"}</span>
                </button>
                {openL2.ACC_MGMT && (
                  <div className="l3-container">
                    <NavLink to="/admin/profile/edit" style={l3LinkStyle}><span className="sentence-case">Edit profile data</span></NavLink>
                    <NavLink to="/admin/profile/avatar" style={l3LinkStyle}><span className="sentence-case">Change profile photo</span></NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- LOGIN & SECURITY --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('SECURITY')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "🛡️" : <span className="sentence-case">Login & security</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.SECURITY ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Login & Security</span>}
            </button>
            {openL1.SECURITY && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('SEC_MOD')}>
                  <span className="sentence-case">Access protection</span>
                  <span style={symbolStyle}>{openL2.SEC_MOD ? "−" : "+"}</span>
                </button>
                {openL2.SEC_MOD && (
                  <div className="l3-container">
                    <NavLink to="/admin/profile/password" style={l3LinkStyle}><span className="sentence-case">Change master password</span></NavLink>
                    <NavLink to="/admin/profile/2fa" style={l3LinkStyle}><span className="sentence-case">Two-factor auth</span></NavLink>
                    <NavLink to="/admin/profile/api-keys" style={l3LinkStyle}><span className="sentence-case">Manage api keys</span></NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- MY ACTIVITY --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('ACTIVITY')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "📈" : <span className="sentence-case">My activity</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.ACTIVITY ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">My Activity</span>}
            </button>
            {openL1.ACTIVITY && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('LOG_MOD')}>
                  <span className="sentence-case">Admin auditing</span>
                  <span style={symbolStyle}>{openL2.LOG_MOD ? "−" : "+"}</span>
                </button>
                {openL2.LOG_MOD && (
                  <div className="l3-container">
                    <NavLink to="/admin/profile/logs" style={l3LinkStyle}><span className="sentence-case">Action history logs</span></NavLink>
                    <NavLink to="/admin/profile/sessions" style={l3LinkStyle}><span className="sentence-case">Active login sessions</span></NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- PREFERENCES --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('PREFS')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "🎨" : <span className="sentence-case">Preferences</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.PREFS ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Preferences</span>}
            </button>
            {openL1.PREFS && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('PREF_MOD')}>
                  <span className="sentence-case">Customization</span>
                  <span style={symbolStyle}>{openL2.PREF_MOD ? "−" : "+"}</span>
                </button>
                {openL2.PREF_MOD && (
                  <div className="l3-container">
                    <NavLink to="/admin/profile/notifications" style={l3LinkStyle}><span className="sentence-case">Email alert settings</span></NavLink>
                    <NavLink to="/admin/profile/theme" style={l3LinkStyle}><span className="sentence-case">Dashboard theme</span></NavLink>
                    <NavLink to="/admin/profile/language" style={l3LinkStyle}><span className="sentence-case">System language</span></NavLink>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminProfileSidebar;