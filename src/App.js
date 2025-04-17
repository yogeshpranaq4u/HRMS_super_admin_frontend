import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import allRoutes, { getRoutesByRole } from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./routes/PrivateRoute";

function App() {

  const details = JSON.parse(sessionStorage.getItem("userDetails"))||{};
  const role = details?.user?.role?.toLowerCase() || details?.user?.type?.toLowerCase() || "guest";

  // Get role-based routes
  const roleRoutes = getRoutesByRole(role);
  // console.log("roleRoutes",roleRoutes ,role ,details);
  
  return (
    <React.Fragment>
      <ToastContainer position="top-center" autoClose={1500} />
      <BrowserRouter>
        <Routes>
          {
            roleRoutes.map((page, index) => {
              return (
                <Route key={index} path={page.path} element={page.isPrivate ? <PrivateRoute element={page.element} /> : page.element} />
              )
            })
          }
        </Routes>
      </BrowserRouter>
    </React.Fragment>

  );
}
export default App;
