import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import allRoutes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (

    <React.Fragment>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {
            allRoutes.map((page, index) => {
              return (
                <Route key={index} path={page.path} element={page.isPrivate ? <PrivateRoute element={page.element} />:page.element} />
              )
            })
          }
        </Routes>
      </BrowserRouter>
    </React.Fragment>

  );
}
export default App;
