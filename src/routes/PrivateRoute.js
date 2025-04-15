import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ element }) {
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const {pathname} = useLocation()
    const isSuperAdmin = pathname?.includes("/superadmin/") && details.user.role?.includes("SuperAdmin")
    // console.log("details" ,details ,isSuperAdmin, details.user.role);
    
    return details.token && isSuperAdmin ? element : <Navigate to="/login" />;
};

export default PrivateRoute
