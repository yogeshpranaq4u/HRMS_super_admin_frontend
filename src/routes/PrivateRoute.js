import React from 'react'
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element }) {
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    console.log("details" ,details);
    
    return details.token ? element : <Navigate to="/login" />;
};

export default PrivateRoute
