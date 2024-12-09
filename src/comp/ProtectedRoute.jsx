import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, isBanned, children }) => {
   
  
    if (isBanned) {
      console.log("Redirecting banned user"); // Debug: Check if this is triggered
      return <Navigate to="/banned" replace />; // Redirect banned users
    }
  
    return children; // Render protected content
  };
export default ProtectedRoute;
