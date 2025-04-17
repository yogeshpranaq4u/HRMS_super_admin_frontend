import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ element }) {
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const location = useLocation();
    const { token, user = {} } = details;
    const pathname = location.pathname;
    // Define role-based URL restrictions
    const roleRoutes = {
        SuperAdmin: '/superadmin/',
        Admin: '/admin/',
        Employee: '/employee/',
    };
    const userRole = user.role || user?.type;
    // If not logged in, redirect to login
    console.log("userRole" ,userRole,token);
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    // Check if user's role matches the URL pattern
    const allowedPath = roleRoutes[userRole];
    if (allowedPath && pathname.startsWith(allowedPath)) {
        return element;
    }
    // If role doesn't match the path, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute
