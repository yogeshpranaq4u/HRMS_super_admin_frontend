import React from "react";
import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const getEmployeeAuth = useSelector((state) => state.getEmployeeAuth);

  return getEmployeeAuth ===true ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;

