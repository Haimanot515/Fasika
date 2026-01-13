import React from "react";
import { Navigate } from "react-router-dom";
import FarmerNavbar from "./FarmerNavbar";
import BuyerNavbar from "./BuyerNavbar";
import BuyerTopNavbar from "./BuyerTopNavbar"; // new top navbar
import AdminNavbar from "./AdminNavbar";

const DynamicNavbar = ({ role }) => {
  // If no role, redirect to login
  if (!role || role.length === 0) {
    return <Navigate to="/login" replace />;
  }

  // Farmer Navbar
  if (role.includes("farmer")) return <FarmerNavbar />;

  // Buyer Navbar + Top Navbar
  if (role.includes("buyer")) {
    return (
      <>
        <BuyerTopNavbar />
        <BuyerNavbar />
      </>
    );
  }

  // Admin Navbar
  if (role.includes("admin")) return <AdminNavbar />;

  return null;
};

export default DynamicNavbar;
