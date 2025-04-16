import React from "react";
import "./AdminRoot.css";

import AdminSlider from "./AdminSlider";

const AdminRootLayout = ({ children }) => {
  return (
    <div className="mainContainer">
      <div className="crow">
        <div className="sub">
          <AdminSlider />
        </div>

        <div className="sub1">{children}</div>
      </div>
    </div>
 
  );
};

export default AdminRootLayout;
