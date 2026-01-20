import React from "react";
import { NavLink } from "react-router-dom";
// Assuming you are using these icons, keeping them the same
import { 
  HiOutlineViewGrid, 
  HiOutlinePlusCircle, 
  HiOutlineDatabase, 
  HiOutlineChartBar,
  HiOutlineUsers
} from "react-icons/hi";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      {/* Keeping your original headers and structure */}
      <div className="sidebar-header">
        <h3>ADMIN PANEL</h3>
      </div>

      <nav className="sidebar-nav">
        {/* 1. Farmer Stats - Kept the same */}
        <NavLink to="/admin/farmers/dashboard" className="nav-item">
          <HiOutlineChartBar /> <span>Farmer Stats</span>
        </NavLink>

        {/* 2. User List - Kept the same */}
        <NavLink to="/admin/users/list" className="nav-item">
          <HiOutlineUsers /> <span>User Management</span>
        </NavLink>

        <div className="nav-divider">MARKETPLACE</div>

        {/* UPDATED: View Listing Path */}
        <NavLink to="/admin/farmers/market/view" className="nav-item">
          <HiOutlineDatabase /> <span>View Listings</span>
        </NavLink>

        {/* UPDATED: Add Listing Path */}
        <NavLink to="/admin/farmers/market/add" className="nav-item">
          <HiOutlinePlusCircle /> <span>Add New Listing</span>
        </NavLink>

        <div className="nav-divider">RESOURCES</div>

        {/* 3. Land Management - Kept the same */}
        <NavLink to="/admin/farmers/land/view" className="nav-item">
          <HiOutlineViewGrid /> <span>Land Registry</span>
        </NavLink>

        <NavLink to="/admin/farmers/land/post" className="nav-item">
          <HiOutlinePlusCircle /> <span>Post Land</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
