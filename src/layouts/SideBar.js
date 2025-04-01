import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function SideBar() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <a href="index.html" className="logo logo-normal">
          <img
            src="assets/img/logoNew.png"
            alt="Logo"
            style={{ width: 200, height: 50 }}
          />
        </a>
        <a href="index.html" className="logo-small">
          <img src="assets/img/logoNew.png" alt="Logo" />
        </a>
        <a href="index.html" className="dark-logo">
          <img src="assets/img/logoNew.png" alt="Logo" />
        </a>
      </div>

      <div className="sidebar-inner slimscroll mt-3">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">
              <span>Super Admin</span>
            </li>
            <li>
              <ul>
                <li
                  className="submenu"
                  onClick={() => setActiveMenu("Dashboard")}
                  style={
                    activeMenu === "Dashboard"
                      ? {
                          backgroundColor: "#f0f0f0",
                          color: "#007bff",
                          borderRadius: "6px",
                        }
                      : {}
                  }
                >
                  <Link
                    to="/"
                    style={
                      activeMenu === "Dashboard" ? { color: "#007bff" } : {}
                    }
                  >
                    <i className="ti ti-smart-home"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li
                  className="submenu"
                  onClick={() => setActiveMenu("Companies")}
                  style={
                    activeMenu === "Companies"
                      ? {
                          backgroundColor: "#f0f0f0",
                          color: "#007bff",
                          borderRadius: "6px",
                        }
                      : {}
                  }
                >
                  <Link
                    to="/company"
                    style={
                      activeMenu === "Companies" ? { color: "#007bff" } : {}
                    }
                  >
                    <i className="ti ti-layout-grid-add"></i>
                    <span>Companies</span>
                  </Link>
                </li>
                <li
                  className="submenu"
                  onClick={() => setActiveMenu("Tickets")}
                  style={
                    activeMenu === "Tickets"
                      ? {
                          backgroundColor: "#f0f0f0",
                          color: "#007bff",
                          borderRadius: "6px",
                        }
                      : {}
                  }
                >
                  <Link
                    to="#"
                    style={activeMenu === "Tickets" ? { color: "#007bff" } : {}}
                  >
                    <i className="ti ti-smart-home"></i>
                    <span>Tickets</span>
                  </Link>
                </li>
                <li
                  className="submenu"
                  onClick={() => setActiveMenu("Demo")}
                  style={
                    activeMenu === "Demo"
                      ? {
                          backgroundColor: "#f0f0f0",
                          color: "#007bff",
                          borderRadius: "6px",
                        }
                      : {}
                  }
                >
                  <Link
                    to="#"
                    style={activeMenu === "Demo" ? { color: "#007bff" } : {}}
                  >
                    <i className="ti ti-smart-home"></i>
                    <span>Demo</span>
                  </Link>
                </li>
                <li
                  className="submenu"
                  onClick={() => setActiveMenu("Payments")}
                  style={
                    activeMenu === "Payments"
                      ? {
                          backgroundColor: "#f0f0f0",
                          color: "#007bff",
                          borderRadius: "6px",
                        }
                      : {}
                  }
                >
                  <Link
                    to="#"
                    style={
                      activeMenu === "Payments" ? { color: "#007bff" } : {}
                    }
                  >
                    <i className="ti ti-smart-home"></i>
                    <span>Payments</span>
                  </Link>
                </li>
                <li
                  className="submenu"
                  onClick={() => setActiveMenu("Manage Policy")}
                  style={
                    activeMenu === "Manage Policy"
                      ? {
                          backgroundColor: "#f0f0f0",
                          color: "#007bff",
                          borderRadius: "6px",
                        }
                      : {}
                  }
                >
                  <Link
                    to="#"
                    style={
                      activeMenu === "Manage Policy" ? { color: "#007bff" } : {}
                    }
                  >
                    <i className="ti ti-smart-home"></i>
                    <span>Manage Policy</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
