import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../navbar/navbar.css"; // reuse sidebar CSS

const BuyerProfileSidebar = ({ user }) => {
  // Collapsible sections if needed in future
  const [sectionsOpen, setSectionsOpen] = useState({
    profileSummary: true,
  });

  const toggleSection = (section) => {
    setSectionsOpen({ ...sectionsOpen, [section]: !sectionsOpen[section] });
  };

  return (
    <div className="sidebar">
      <h2>Profile</h2>

      {/* 👤 Profile Summary */}
      <div className="sidebar-section">
        <button
          className="sidebar-section-header"
          onClick={() => toggleSection("profileSummary")}
        >
          Profile Summary {sectionsOpen.profileSummary ? "▲" : "▼"}
        </button>

        {sectionsOpen.profileSummary && (
          <ul>
            <li style={{ textAlign: "center", marginBottom: "8px" }}>
              <img
                src={user?.photo || "https://via.placeholder.com/80"}
                alt="Profile"
                style={{ borderRadius: "50%" }}
              />
            </li>
            <li>
              <Link to="/profile/username">
                Username: {user?.username || "Buyer"}
              </Link>
            </li>
            <li>Buyer ID: {user?.buyerId || "N/A"}</li>
            <li>
              Verified: {user?.verified ? "✅ Verified" : "❌ Not Verified"}
            </li>
            <li>Default Location: {user?.location || "Region / City"}</li>
          </ul>
        )}
      </div>

      {/* Logout */}
      <div className="sidebar-section">
        <Link
          to="/login"
          style={{
            color: "#065f46",
            fontWeight: 600,
            display: "block",
            marginTop: "1rem",
          }}
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default BuyerProfileSidebar;
