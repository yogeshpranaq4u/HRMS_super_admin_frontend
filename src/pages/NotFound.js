import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="fs-4 text-secondary">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
