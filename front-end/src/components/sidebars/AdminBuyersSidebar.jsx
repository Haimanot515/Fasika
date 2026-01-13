import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const AdminFullEcommerceSidebar = ({ isOpen = true }) => {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const sidebarRef = useRef(null);

  const [openL1, setOpenL1] = useState({ INVENTORY: true });
  const [openL2, setOpenL2] = useState({});

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

  const l3LinkStyle = ({ isActive, isDelete }) => ({
    display: "block", 
    padding: "8px 10px 8px 70px", 
    textDecoration: "none",
    fontSize: "12px", 
    color: isDelete ? "#e74c3c" : (isActive ? "#27ae60" : "#7f8c8d"),
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
          .hamburger-btn:hover { background-color: #f0faf4 !important; transform: scale(1.05); }
          .has-tooltip { position: relative; }
          .tooltip-text {
            visibility: hidden; width: 160px; background-color: #333; color: #fff;
            text-align: center; border-radius: 4px; padding: 6px; position: absolute;
            z-index: 101; left: 110%; top: 50%; transform: translateY(-50%);
            opacity: 0; transition: opacity 0.3s; font-size: 11px; pointer-events: none;
          }
          .has-tooltip:hover .tooltip-text { visibility: visible; opacity: 1; }
        `}
      </style>

      <aside ref={sidebarRef} style={sidebarStyle} className="admin-sidebar-scroll">
        <div style={{ padding: collapsed ? "15px 10px" : "10px 20px", textAlign: "center" }}>
          <button className="hamburger-btn has-tooltip" onClick={toggleSidebar} style={{ width: "100%", padding: collapsed ? "12px 0" : "12px", border: "2px solid #27ae60", color: "#27ae60", background: "white", cursor: "pointer", fontWeight: "900", borderRadius: "4px", display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.2s ease", fontSize: collapsed ? "22px" : "14px" }}>
            {collapsed ? "⚙️" : <span className="sentence-case">Close master admin</span>}
            {collapsed && <span className="tooltip-text">Open Master Console</span>}
          </button>
        </div>

        <nav>
          {/* --- INVENTORY & CATALOG --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('INVENTORY')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "📦" : <span className="sentence-case">Catalog & inventory</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.INVENTORY ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Catalog & Inventory</span>}
            </button>
            {openL1.INVENTORY && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('CAT_MGMT')}>
                  <span className="sentence-case">Product master</span>
                  <span style={symbolStyle}>{openL2.CAT_MGMT ? "−" : "+"}</span>
                </button>
                {openL2.CAT_MGMT && (
                  <div className="l3-container">
                    <NavLink to="/admin/catalog/products" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Add/Edit products</span></NavLink>
                    <NavLink to="/admin/catalog/stock" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Low stock alerts</span></NavLink>
                    <NavLink to="/admin/catalog/categories" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Category management</span></NavLink>
                    <NavLink to="/admin/catalog/delete" style={({isActive}) => l3LinkStyle({isActive, isDelete: true})}><span className="sentence-case">Bulk delete products</span></NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- VENDOR CONTROL --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('VENDORS')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "🏢" : <span className="sentence-case">Vendor management</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.VENDORS ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Vendor Management</span>}
            </button>
            {openL1.VENDORS && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('VEN_OPS')}>
                  <span className="sentence-case">Seller approval</span>
                  <span style={symbolStyle}>{openL2.VEN_OPS ? "−" : "+"}</span>
                </button>
                {openL2.VEN_OPS && (
                  <div className="l3-container">
                    <NavLink to="/admin/vendors/verify" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Review applications</span></NavLink>
                    <NavLink to="/admin/vendors/commission" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Set commission rates</span></NavLink>
                    <NavLink to="/admin/vendors/suspend" style={({isActive}) => l3LinkStyle({isActive, isDelete: true})}><span className="sentence-case">Suspend seller store</span></NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- LOGISTICS & FULLFILLMENT --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('LOGISTICS')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "🚚" : <span className="sentence-case">Logistics & shipping</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.LOGISTICS ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Logistics & Shipping</span>}
            </button>
            {openL1.LOGISTICS && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('SHIP_OPS')}>
                  <span className="sentence-case">Delivery control</span>
                  <span style={symbolStyle}>{openL2.SHIP_OPS ? "−" : "+"}</span>
                </button>
                {openL2.SHIP_OPS && (
                  <div className="l3-container">
                    <NavLink to="/admin/shipping/zones" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Manage shipping zones</span></NavLink>
                    <NavLink to="/admin/shipping/tracking" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Global order tracking</span></NavLink>
                    <NavLink to="/admin/shipping/returns" style={({isActive}) => l3LinkStyle({isActive, isDelete: true})}><span className="sentence-case">Process return requests</span></NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- MARKETING & CRM --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('MARKETING')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "📢" : <span className="sentence-case">Marketing & sales</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.MARKETING ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Marketing & Sales</span>}
            </button>
            {openL1.MARKETING && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('CAMPAIGN')}>
                  <span className="sentence-case">Promotions</span>
                  <span style={symbolStyle}>{openL2.CAMPAIGN ? "−" : "+"}</span>
                </button>
                {openL2.CAMPAIGN && (
                  <div className="l3-container">
                    <NavLink to="/admin/marketing/coupons" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Coupon generator</span></NavLink>
                    <NavLink to="/admin/marketing/banners" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Manage ad banners</span></NavLink>
                    <NavLink to="/admin/marketing/newsletter" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Email marketing campaigns</span></NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- FINANCE & ANALYTICS --- */}
          <div className="section">
            <button style={l1Header} onClick={() => toggleL1('FINANCE')} className={collapsed ? "has-tooltip" : ""}>
              <span>{collapsed ? "📊" : <span className="sentence-case">Financial reports</span>}</span>
              {!collapsed && <span style={symbolStyle}>{openL1.FINANCE ? "−" : "+"}</span>}
              {collapsed && <span className="tooltip-text">Financial Reports</span>}
            </button>
            {openL1.FINANCE && !collapsed && (
              <div className="l2-container">
                <button style={l2Header} onClick={() => toggleL2('REV_OPS')}>
                  <span className="sentence-case">Revenue control</span>
                  <span style={symbolStyle}>{openL2.REV_OPS ? "−" : "+"}</span>
                </button>
                {openL2.REV_OPS && (
                  <div className="l3-container">
                    <NavLink to="/admin/finance/payouts" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Vendor payout history</span></NavLink>
                    <NavLink to="/admin/finance/tax" style={({isActive}) => l3LinkStyle({isActive})}><span className="sentence-case">Tax configuration</span></NavLink>
                    <NavLink to="/admin/finance/refunds" style={({isActive}) => l3LinkStyle({isActive, isDelete: true})}><span className="sentence-case">Master refund list</span></NavLink>
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

export default AdminFullEcommerceSidebar;