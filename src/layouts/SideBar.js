import React, { useState } from "react";
import { Link } from "react-router-dom";

function SideBar() {
  const sideBarContent = [
    {
      title: "Dashboard",
      pathname: "/superadmin/",
      iconName: "ti ti-smart-home"

    },
    {
      title: "Companies",
      pathname: "/superadmin/company",
      iconName: "ti ti-building"

    },
    {
      title: "Demo",
      pathname: "/superadmin/demo-requests",
      iconName: "ti ti-screen-share"
    },
    {
      title: "Payments",
      // pathname: "/superadmin#",
      pathname: "/superadmin/plans",
      iconName: "ti ti-credit-card-pay"
    },
    {
      title: "Manage Policy",
      pathname: "/superadmin/manage-policy",
      iconName: "ti ti-shield-cog "
    },
    {
      title: "Admins",
      pathname: "/superadmin/admin-list",
      iconName: "ti ti-circle-dotted-letter-p"
    },
  ]

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <a href="/" className="logo logo-normal">
          <img src="/assets/img/logoNew.png" alt="Logo" style={{ width: 200, height: 50 }} />
        </a>
        <a href="/" className="logo-small">
          <img src="/assets/img/logoNew.png" alt="Logo" />
        </a>
        <a href="/" className="dark-logo">
          <img src="/assets/img/logoNew.png" alt="Logo" />
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
