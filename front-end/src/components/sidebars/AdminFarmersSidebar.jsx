import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [collapsed, setCollapsed] = useState(!isOpen);
  const [farmerCount, setFarmerCount] = useState(0);
  
  // Accordion state for the 3 requested parts
  const [openL1, setOpenL1] = useState({ FARMERS: true, LAND: false, PRODUCTS: false });

  const API_BASE = 'http://localhost:5000/api/admin/farmers';
  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // Fetch count logic
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(`${API_BASE}/all/count`, getHeaders());
        setFarmerCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching count", error);
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
    width: collapsed ? "70px" : "320px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    position: "fixed", top: "78px", height: "calc(100vh - 78px)", left: 0,
    zIndex: 100, overflowY: "auto", boxShadow: "4px 0 10px rgba(0,0,0,0.05)"
  };

  const subLinkStyle = ({ isActive }) => ({
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 20px 12px 50px",
    textDecoration: "none", fontSize: "13px",
    color: isActive ? "#059669" : "#64748b",
    background: isActive ? "#ecfdf5" : "transparent",
    fontWeight: isActive ? "700" : "500",
  });

  return (
    <aside ref={sidebarRef} style={sidebarStyle}>
      <div style={{ padding: "20px" }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", color: "#065f46", background: "#f8fafc", cursor: "pointer", fontWeight: "800", borderRadius: "8px", fontSize: "11px" }}>
          {collapsed ? "☰" : "EXIT CONTROL PANEL"}
        </button>
      </div>

      <nav>
        {/* 1. FARMERS MANAGEMENT */}
        <SectionItem icon={<HiOutlineUserGroup/>} label="FARMERS MANAGEMENT" isOpen={openL1.FARMERS} collapsed={collapsed} toggle={() => toggleL1('FARMERS')}>
          <NavLink style={subLinkStyle} to="/admin/farmers/view">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlineViewList /> View All Farmers</span>
          </NavLink>
          
          <NavLink style={subLinkStyle} to="/admin/farmers/stats">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlineChartPie /> Total Farmers</span>
            {!collapsed && <span style={{background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '10px'}}>{farmerCount}</span>}
          </NavLink>

          <NavLink style={subLinkStyle} to="/admin/farmers/register">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlinePlusCircle /> Register New Farmer</span>
          </NavLink>
        </SectionItem>

        {/* 2. LAND MANAGEMENT */}
        <SectionItem icon={<HiOutlineMap/>} label="LAND MANAGEMENT" isOpen={openL1.LAND} collapsed={collapsed} toggle={() => toggleL1('LAND')}>
          <NavLink style={subLinkStyle} to="/admin/farmers/land/view">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlineViewList /> View Land Records</span>
          </NavLink>
          <NavLink style={subLinkStyle} to="/admin/farmers/land/post">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlinePlusCircle /> Register New Plot</span>
          </NavLink>
        </SectionItem>

        {/* 3. PRODUCT LISTING MANAGEMENT */}
        <SectionItem icon={<HiOutlineShoppingCart/>} label="PRODUCT LISTINGS" isOpen={openL1.PRODUCTS} collapsed={collapsed} toggle={() => toggleL1('PRODUCTS')}>
          <NavLink style={subLinkStyle} to="/admin/farmers/market/view">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlineViewList /> View Marketplace</span>
          </NavLink>
          <NavLink style={subLinkStyle} to="/admin/farmers/market/post">
            <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}><HiOutlinePlusCircle /> Create New Listing</span>
          </NavLink>
        </SectionItem>
      </nav>
    </aside>
  );
};

const SectionItem = ({ icon, label, isOpen, collapsed, toggle, children }) => (
  <div style={{borderBottom: '1px solid #f1f5f9'}}>
    <button style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 20px", cursor: "pointer", background: "#fff", border: 'none', width: "100%",
      color: "#065f46", fontWeight: "800", fontSize: "11px"
    }} onClick={toggle}>
      <span style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <span style={{fontSize: '18px'}}>{icon}</span>
        {!collapsed && label}
      </span>
      {!collapsed && <span style={{color: '#cbd5e1'}}>{isOpen ? "−" : "+"}</span>}
    </button>
    {isOpen && !collapsed && <div style={{paddingBottom: "10px"}}>{children}</div>}
  </div>
);

export default AdminFarmersSidebar;
