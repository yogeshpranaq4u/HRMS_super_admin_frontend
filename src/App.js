import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import allRoutes from "./routes/routes";

function App() {
  return (
    <Router>
      <Routes>
        {
          allRoutes.map((page, index) => {
            return (
              <Route key={index} path={page.path} element={page.element} />
            )
          })
        }
      </Routes>
    </Router>
  );
}

export default App;
