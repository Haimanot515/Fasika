import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// --- REACT ICONS IMPORT ---
import { FaStore, FaChartLine, FaSearch, FaTimes, FaHistory, FaPlusCircle, FaListUl, FaExchangeAlt } from "react-icons/fa";
import { MdOutlinePriceCheck } from "react-icons/md";

const MarketSidebar = ({ isOpen = true }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [collapsed, setCollapsed] = useState(!isOpen);
  const [searchTerm, setSearchTerm] = useState("");

  const [openL1, setOpenL1] = useState({ SALES: true });
  const [openL2, setOpenL2] = useState({});

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/market/sales?search=${encodeURIComponent(searchTerm)}`);
    }
  };

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

  /* --- Admin Style Formatting --- */
  const sidebarStyle = {
    width: collapsed ? "70px" : "350px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#ffffff",
    borderLeft: "1px solid #e0e0e0",
    position: "fixed",
    top: "80px", // Adjusted to sit below navbar
    height: "calc(100vh - 80px)", // Adjusted to match new top
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

  const l3LinkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
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
          .market-sidebar-scroll::-webkit-scrollbar { width: 5px; }
          .market-sidebar-scroll::-webkit-scrollbar-thumb { background: #27ae60; border-radius: 10px; }
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

      <aside ref={sidebarRef} style={sidebarStyle} className="market-sidebar-scroll">
        
        <div style={{ padding: "15px 20px" }}>
          {!collapsed ? (
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Search market..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "12px" }}
              />
              <button type="submit" style={{ backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "4px", padding: "8px", cursor: "pointer" }}>
                <FaSearch />
              </button>
            </form>
          ) : null}
          
          <button 
            onClick={toggleSidebar}
            className="has-tooltip"
            style={{ 
              width: "100%", padding: "10px", border: "2px solid #27ae60", color: "#27ae60", 
              background: "white", cursor: "pointer", fontWeight: "900", borderRadius: "4px",
              display: "flex", justifyContent: "center", alignItems: "center"
            }}
          >
            {collapsed ? <FaStore /> : <><FaTimes style={{marginRight: '8px'}}/> <span className="sentence-case">Close market</span></>}
            {collapsed && <span className="tooltip-text">Market Menu</span>}
          </button>
        </div>

        <nav>
          {/* --- SALES MANAGEMENT --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('SALES')} className={collapsed ? "has-tooltip" : ""}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="icon-box"><FaStore /></div>
                {!collapsed && <span className="sentence-case">Sales Management</span>}
              </div>
              {!collapsed && <span>{openL1.SALES ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Sales Management</span>}
            </button>
            {openL1.SALES && !collapsed && (
              <div className="l2-container">
                <div className="l3-container">
                  <NavLink to="/market/sales/add-listing" style={l3LinkStyle}><FaPlusCircle /> <span className="sentence-case">Add new listing</span></NavLink>
                  <NavLink to="/market/sales" style={l3LinkStyle}><FaListUl /> <span className="sentence-case">My active listings</span></NavLink>
                  <NavLink to="/market/sales/record-transaction" style={l3LinkStyle}><FaExchangeAlt /> <span className="sentence-case">Record transaction</span></NavLink>
                  <NavLink to="/market/sales/transaction-history" style={l3LinkStyle}><FaHistory /> <span className="sentence-case">Delete All </span></NavLink>
                </div>
              </div>
            )}
          </div>

          {/* --- MARKET PRICES --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('PRICES')} className={collapsed ? "has-tooltip" : ""}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="icon-box"><FaChartLine /></div>
                {!collapsed && <span className="sentence-case">Market Prices</span>}
              </div>
              {!collapsed && <span>{openL1.PRICES ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Prices</span>}
            </button>
            {openL1.PRICES && !collapsed && (
              <div className="l2-container">
                <div className="l3-container">
                  <NavLink to="/market/crop-prices/current" style={l3LinkStyle}><MdOutlinePriceCheck style={{fontSize: '16px'}}/> <span className="sentence-case">Current crop prices</span></NavLink>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default MarketSidebar;
