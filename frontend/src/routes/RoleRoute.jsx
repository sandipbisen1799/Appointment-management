import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useApi } from "../contexts/contextApi.jsx";

export const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useApi();


  // Wait while auth/user state is being resolved to avoid incorrect routing on reload
  if (loading) return null;

  const localUser = JSON.parse(localStorage.getItem("user") || "null");
  const accountType = user?.accountType || localUser?.accountType;

  if (!allowedRoles.includes(accountType)) {
    if (accountType === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (accountType === "superadmin") {
      return <Navigate to="/superadmin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
