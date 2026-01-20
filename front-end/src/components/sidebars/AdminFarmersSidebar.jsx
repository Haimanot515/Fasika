import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { 
  HiOutlineUserGroup, 
  HiOutlineMap, 
  HiOutlineShoppingCart,
  HiOutlineViewList,
  HiOutlinePlusCircle,
  HiOutlineChartPie
} from 'react-icons/hi';

const AdminFarmersSidebar = ({ isOpen = true }) => {
  const sidebarRef = useRef(null);
  const [collapsed, setCollapsed] = useState(!isOpen);
  const [farmerCount, setFarmerCount] = useState(0);
  
  const [openL1, setOpenL1] = useState({ FARMERS: true, LAND: false, PRODUCTS: false });

  // Fetch farmer count for the sub-link
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/farmers/count', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFarmerCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching farmer count", error);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleL1 = (key) => {
    if (collapsed) setCollapsed(false);
    setOpenL1(prev => ({
      FARMERS: false, LAND: false, PRODUCTS: false,
      [key]: !prev[key]
    }));
  };

  const sidebarStyle = {
    width: collapsed ? "70px" : "300px",
    transition: "all 0.3s ease",
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    position: "fixed", top: "78px", height: "calc(100vh - 78px)", left: 0,
    zIndex: 100, overflowY: "auto"
  };

  const subLinkStyle = ({ isActive }) => ({
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 20px 12px 50px",
    textDecoration: "none", fontSize: "14px",
    color: isActive ? "#059669" : "#64748b",
    background: isActive ? "#f0fdf4" : "transparent",
    fontWeight: isActive ? "600" : "500",
  });

  return (
    <aside ref={sidebarRef} style={sidebarStyle}>
      <div style={{ padding: "20px" }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", borderRadius: "6px" }}>
          {collapsed ? "☰" : "CLOSE MENU"}
        </button>
      </div>

      <nav>
        {/* 1. FARMERS MANAGEMENT */}
        <SectionItem icon={<HiOutlineUserGroup/>} label="FARMERS MANAGEMENT" isOpen={openL1.FARMERS} collapsed={collapsed} toggle={() => toggleL1('FARMERS')}>
          <NavLink style={subLinkStyle} to="/admin/farmers/view">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlineViewList /> View Farmers</span>
          </NavLink>
          
          {/* Sub-link showing the number of farmers */}
          <NavLink style={subLinkStyle} to="/admin/farmers/stats">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlineChartPie /> Total Farmers</span>
            {!collapsed && <span style={{background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px'}}>{farmerCount}</span>}
          </NavLink>

          <NavLink style={subLinkStyle} to="/admin/farmers/add">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlinePlusCircle /> Add Farmer</span>
          </NavLink>
        </SectionItem>

        {/* 2. LAND MANAGEMENT */}
        <SectionItem icon={<HiOutlineMap/>} label="LAND MANAGEMENT" isOpen={openL1.LAND} collapsed={collapsed} toggle={() => toggleL1('LAND')}>
          <NavLink style={subLinkStyle} to="/admin/land/view">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlineViewList /> View Land</span>
          </NavLink>
          <NavLink style={subLinkStyle} to="/admin/land/add">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlinePlusCircle /> Add Land</span>
          </NavLink>
        </SectionItem>

        {/* 3. PRODUCT LISTING MANAGEMENT */}
        <SectionItem icon={<HiOutlineShoppingCart/>} label="PRODUCT LISTINGS" isOpen={openL1.PRODUCTS} collapsed={collapsed} toggle={() => toggleL1('PRODUCTS')}>
          <NavLink style={subLinkStyle} to="/admin/products/view">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlineViewList /> View Listings</span>
          </NavLink>
          <NavLink style={subLinkStyle} to="/admin/products/add">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlinePlusCircle /> Add Listing</span>
          </NavLink>
        </SectionItem>
      </nav>
    </aside>
  );
};

const SectionItem = ({ icon, label, isOpen, collapsed, toggle, children }) => (
  <div style={{ borderBottom: '1px solid #f1f5f9' }}>
    <button style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer", background: "#fff", border: 'none', width: "100%", color: "#1e293b", fontWeight: "700", fontSize: "12px" }} onClick={toggle}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px', color: '#059669' }}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </span>
      {!collapsed && <span>{isOpen ? "−" : "+"}</span>}
    </button>
    {isOpen && !collapsed && <div style={{ paddingBottom: "10px" }}>{children}</div>}
  </div>
);

export default AdminFarmersSidebar;
