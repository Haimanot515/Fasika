import React from "react";

// Dashboards
import AdminDashboard from "./AdminDashboard";
import FarmerDashboard from "./FarmerDashboard";
import BuyerDashboard from "./BuyerDashboard";

const DynamicDashboard = ({ role }) => {
  if (!role || role.length === 0) {
    return <div className="p-8">Please log in to see your dashboard.</div>;
  }

  // Check roles in order of priority
  if (role.includes("admin")) return <AdminDashboard />;
  if (role.includes("farmer")) return <FarmerDashboard />;
  if (role.includes("buyer")) return <BuyerDashboard />;

  return <div className="p-8">No dashboard available for your role.</div>;
};

export default DynamicDashboard;
