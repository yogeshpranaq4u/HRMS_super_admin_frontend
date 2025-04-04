import React, { useState } from "react";
import { Link } from "react-router-dom";

function SideBar() {
  const sideBarContent = [
    {
      title: "Dashboard",
      pathname: "/",
      iconName: "ti ti-smart-home"

    },
    {
      title: "Companies",
      pathname: "/company",
      iconName: "ti ti-building"

    },
    // {
    //   title: "Tickets",
    //   pathname: "/tickets",
    //   iconName: "ti ti-report"
    // },
    {
      title: "Demo",
      pathname: "/demo-requests",
      iconName: "ti ti-message-circle"
    },
    {
      title: "Payments",
      pathname: "#",
      iconName: "ti ti-credit-card-pay"
    },
    {
      title: "Manage Policy",
      pathname: "/manage-policy",
      iconName: "ti ti-device-desktop-cog"
    },
  ]

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <a href="/" className="logo logo-normal">
          <img src="assets/img/logoNew.png" alt="Logo" style={{ width: 200, height: 50 }} />
        </a>
        <a href="/" className="logo-small">
          <img src="assets/img/logoNew.png" alt="Logo" />
        </a>
        <a href="/" className="dark-logo">
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
                {
                  sideBarContent?.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={`submenu ${item?.pathname == window.location.pathname ? "active" : ""}  `}
                      >
                        <Link
                          to={item?.pathname}
                        >
                          <i className={item?.iconName}></i>
                          <span>{item?.title}</span>
                        </Link>
                      </li>
                    )
                  })
                }
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
