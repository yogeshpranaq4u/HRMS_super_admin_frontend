import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ element }) {
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const location = useLocation();
    // const isSuperAdmin = pathname?.includes("/superadmin/") && details.user.role?.includes("SuperAdmin")
    
    // return details.token  ? element : <Navigate to="/login" />;
    const { token, user = {} } = details;
    const pathname = location.pathname;
    // Define role-based URL restrictions
    const roleRoutes = {
        SuperAdmin: '/superadmin/',
        Admin: '/admin/',
        Employee: '/employee/',
    };
    const userRole = user.role;
    // If not logged in, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    // Check if user's role matches the URL pattern
    const allowedPath = roleRoutes[userRole];
    // console.log("details" ,pathname.startsWith(allowedPath) , user.role ,allowedPath , pathname);
    if (allowedPath && pathname.startsWith(allowedPath)) {
        return element;
    }
    // If role doesn't match the path, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute
