import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const AdminSystemSidebar = ({ isOpen = true }) => {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const toggleSidebar = () => setCollapsed(prev => !prev);

  return (
    <aside
      style={{
        width: collapsed ? "60px" : "220px",
        transition: "width 0.3s",
        background: "#2c3e50", // Darker theme for system settings
        color: "white",
        borderRight: "1px solid #1a252f",
        height: "100vh",
        padding: "10px"
      }}
    >
      <button onClick={toggleSidebar} style={{ marginBottom: "20px", background: "none", border: "1px solid white", color: "white" }}>
        {collapsed ? "⚙️" : "◀ System"}
      </button>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "15px" }}>
            <NavLink to="/admin/system/logs" style={{ color: "#ecf0f1" }}>
              {collapsed ? "LG" : "System Logs"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/system/config" style={{ color: "#ecf0f1" }}>
              {collapsed ? "CF" : "Global Config"}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSystemSidebar;