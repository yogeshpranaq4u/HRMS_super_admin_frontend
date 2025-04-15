import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center  p-5 rounded ">
        <h1 className="text-danger mb-3">⚠️ Unauthorized Access</h1>
        <p className="lead">You don’t have permission to access this page.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
