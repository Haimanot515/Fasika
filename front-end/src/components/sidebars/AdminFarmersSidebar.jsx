import React from "react";
import { NavLink } from "react-router-dom";
import { 
  HiOutlineViewGrid, 
  HiOutlinePlusCircle, 
  HiOutlineDatabase, 
  HiOutlineChartBar 
} from "react-icons/hi";

const AdminSidebar = () => {
  // Styles for the NavLinks
  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "0.3s"
  };

  const activeStyle = {
    background: "#1e3a8a",
    color: "#fff",
    borderLeft: "4px solid #3b82f6"
  };

  return (
    <div style={{ width: "260px", background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "20px", fontWeight: "bold", fontSize: "18px", borderBottom: "1px solid #1e293b" }}>
        ADMIN REGISTRY
      </div>

      <nav style={{ marginTop: "20px" }}>
        {/* DASHBOARD */}
        <NavLink 
          to="/admin/farmers/dashboard" 
          style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
        >
          <HiOutlineChartBar size={20} /> Farmer Stats
        </NavLink>

        <div style={{ padding: "20px 20px 10px 20px", fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
          Marketplace Authority
        </div>

        {/* VIEW ALL LISTINGS */}
        <NavLink 
          to="/admin/farmers/market/view" 
          style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
        >
          <HiOutlineDatabase size={20} /> Master Registry
        </NavLink>

        {/* ADD NEW LISTING */}
        <NavLink 
          to="/admin/farmers/market/add" 
          style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
        >
          <HiOutlinePlusCircle size={20} /> Add New Node
        </NavLink>

        <div style={{ padding: "20px 20px 10px 20px", fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
          Land & Resources
        </div>

        {/* LAND REGISTRY */}
        <NavLink 
          to="/admin/farmers/land/view" 
          style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
        >
          <HiOutlineViewGrid size={20} /> Land Registry
        </NavLink>

        {/* USER MANAGEMENT */}
        <NavLink 
          to="/admin/users/list" 
          style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
        >
          <HiOutlineDatabase size={20} /> User List
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
