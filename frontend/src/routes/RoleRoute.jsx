import { Api } from "../contexts/contextApi.jsx"; 
import { useApi } from "../contexts/contextApi.jsx";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const RoleRoute = ({ allowedRoles }) => {
  
const { user } = useApi();
  
  
  const token = localStorage.getItem("token");
  if(!token){
    return <Navigate to="/login" />
  }
  
  if (!allowedRoles.includes(user?.accountType)) {
    if(user?.accountType == 'admin'){
      return <Navigate to='/admin'/>
    }
    else if(user?.accountType == 'superadmin'){
      return <Navigate to='/superadmin'/>
    }
  
  }
 
  return <Outlet />;
};
