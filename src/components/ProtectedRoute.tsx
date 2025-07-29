import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "USER"; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const location = useLocation();

 
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  if (requiredRole && user?.role !== requiredRole) {
    // Se for admin-only mas usuário não for admin, manda pro dashboard
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
