import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import DynamicNavbar from "../components/navbar/DynamicNavbar";


const ProtectedLayout = ({ role }) => {
  if (!role || role.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <DynamicNavbar role={role} />
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
