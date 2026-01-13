import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaUserCircle, FaShoppingCart, FaHeart, FaHistory, 
  FaEnvelope, FaGavel, FaTrashAlt, FaMapMarkerAlt,
  FaWallet, FaBell, FaChartLine, FaSeedling, FaStore,
  FaChevronDown, FaChevronRight, FaLeaf
} from "react-icons/fa";
import { GiCow, GiFruitBowl, GiSheep, GiGoat, GiChicken } from "react-icons/gi";
import { MdDashboard, MdOutlineClose, MdStorefront, MdLocalShipping, MdPayments } from "react-icons/md";

const BuyerDashboardSidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const [openSubMenu, setOpenSubMenu] = useState("");

  useEffect(() => {
    setCollapsed(!isOpen);
  }, [isOpen]);

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? "" : menu);
  };

  const colors = {
    primary: "#27ae60", 
    danger: "#e74c3c", 
    text: "#2c3e50",
    muted: "#7f8c8d",
    bgLight: "#f4f9f6",
    border: "#e0e0e0"
  };

  const sidebarStyle = {
    width: collapsed ? "0px" : "347px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#ffffff",
    borderRight: collapsed ? "none" : `1px solid ${colors.border}`,
    position: "fixed",
    top: 0,
    height: "100vh",
    left: 0,
    zIndex: 99999, // Increased z-index to stay above navbars
    overflowY: "auto",
    overflowX: "hidden",
    boxShadow: collapsed ? "none" : "15px 0 30px rgba(0,0,0,0.08)",
    visibility: collapsed ? "hidden" : "visible"
  };

  const navLinkStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 25px",
    textDecoration: "none",
    color: isActive ? colors.primary : colors.text,
    background: isActive ? colors.bgLight : "transparent",
    borderLeft: isActive ? `6px solid ${colors.primary}` : "6px solid transparent",
    fontSize: "15px",
    fontWeight: isActive ? "700" : "500",
    transition: "0.2s",
    cursor: "pointer"
  });

  const subLinkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 25px 10px 60px",
    textDecoration: "none",
    color: isActive ? colors.primary : colors.muted,
    fontSize: "14px",
    fontWeight: "500",
    transition: "0.2s"
  });

  const sectionHeader = {
    padding: "25px 25px 10px",
    fontSize: "11px",
    fontWeight: "900",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: "1.5px"
  };

  return (
    <aside style={sidebarStyle} className="buyer-sidebar-scroll">
      <style>{`
        .buyer-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .buyer-sidebar-scroll::-webkit-scrollbar-thumb { background: ${colors.primary}; border-radius: 10px; }
        .sentence-case { text-transform: lowercase; display: inline-block; }
        .sentence-case::first-letter { text-transform: uppercase; }
        .hover-effect:hover { background: ${colors.bgLight}; }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "25px", borderBottom: `1px solid ${colors.border}` }}>
        <button onClick={onClose} style={{ 
            width: "100%", padding: "12px", border: `2px solid ${colors.primary}`, 
            color: colors.primary, background: "white", cursor: "pointer", 
            fontWeight: "900", borderRadius: "8px", display: "flex", 
            justifyContent: "center", alignItems: "center", gap: "10px"
          }}>
          <MdOutlineClose size={20}/> <span className="sentence-case">Close Buyer Menu</span>
        </button>
      </div>

      <nav style={{ paddingBottom: "50px" }}>
        
        <div style={sectionHeader}>Marketplace Hub</div>
        
        {/* SUBMENU: LIVESTOCK */}
        <div onClick={() => toggleSubMenu("livestock")} style={navLinkStyle(openSubMenu === "livestock")} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><GiCow size={22}/> <span className="sentence-case">Livestock Market</span></div>
          {openSubMenu === "livestock" ? <FaChevronDown size={12}/> : <FaChevronRight size={12}/>}
        </div>
        {openSubMenu === "livestock" && (
          <div style={{background: '#fcfcfc'}}>
            <NavLink to="/marketplace/cattle/bulls" style={subLinkStyle}><GiCow/> Bulls & Oxen</NavLink>
            <NavLink to="/marketplace/cattle/sheep" style={subLinkStyle}><GiSheep/> Sheep & Lambs</NavLink>
            <NavLink to="/marketplace/cattle/goats" style={subLinkStyle}><GiGoat/> Goats</NavLink>
            <NavLink to="/marketplace/cattle/poultry" style={subLinkStyle}><GiChicken/> Poultry</NavLink>
          </div>
        )}

        {/* SUBMENU: PRODUCE */}
        <div onClick={() => toggleSubMenu("produce")} style={navLinkStyle(openSubMenu === "produce")} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><GiFruitBowl size={22}/> <span className="sentence-case">Fresh Produce</span></div>
          {openSubMenu === "produce" ? <FaChevronDown size={12}/> : <FaChevronRight size={12}/>}
        </div>
        {openSubMenu === "produce" && (
          <div style={{background: '#fcfcfc'}}>
            <NavLink to="/marketplace/fruits" style={subLinkStyle}><GiFruitBowl/> Seasonal Fruits</NavLink>
            <NavLink to="/marketplace/vegetables" style={subLinkStyle}><FaLeaf/> Vegetables</NavLink>
            <NavLink to="/marketplace/grains" style={subLinkStyle}><FaSeedling/> Grains & Cereals</NavLink>
          </div>
        )}

        <div style={sectionHeader}>My Activity</div>
        
        {/* SUBMENU: ORDERS */}
        <div onClick={() => toggleSubMenu("orders")} style={navLinkStyle(openSubMenu === "orders")} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><MdLocalShipping size={22}/> <span className="sentence-case">Orders & Tracking</span></div>
          {openSubMenu === "orders" ? <FaChevronDown size={12}/> : <FaChevronRight size={12}/>}
        </div>
        {openSubMenu === "orders" && (
          <div style={{background: '#fcfcfc'}}>
            <NavLink to="/orders/active" style={subLinkStyle}>Active Shipments</NavLink>
            <NavLink to="/orders/history" style={subLinkStyle}>Past Purchases</NavLink>
            <NavLink to="/orders/returns" style={subLinkStyle}>Returns & Refunds</NavLink>
          </div>
        )}

        <NavLink to="/wishlist" style={navLinkStyle()} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FaHeart size={20} color="#e74c3c"/> <span className="sentence-case">Saved Wishlist</span></div>
        </NavLink>

        <div style={sectionHeader}>Financials</div>
        <NavLink to="/dashboard/wallet" style={navLinkStyle()} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FaWallet size={20}/> <span className="sentence-case">Agri-Wallet</span></div>
        </NavLink>
        <NavLink to="/dashboard/payments" style={navLinkStyle()} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><MdPayments size={22}/> <span className="sentence-case">Payment Methods</span></div>
        </NavLink>

        <div style={sectionHeader}>Privacy & Safety</div>
        <NavLink to="/dashboard/wishlist/drop" style={{...navLinkStyle(), color: colors.danger}} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FaTrashAlt /> <span className="sentence-case">DROP Wishlist</span></div>
        </NavLink>
        <NavLink to="/dashboard/history/drop" style={{...navLinkStyle(), color: colors.danger}} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FaHistory /> <span className="sentence-case">DROP Search History</span></div>
        </NavLink>
        <NavLink to="/dashboard/account/drop" style={{...navLinkStyle(), color: colors.danger}} className="hover-effect">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}><FaGavel /> <span className="sentence-case">DROP Account</span></div>
        </NavLink>

      </nav>
    </aside>
  );
};

export default BuyerDashboardSidebar;