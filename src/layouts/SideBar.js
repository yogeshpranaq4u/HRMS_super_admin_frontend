import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sideBarContentAdmin, sideBarContentEmployee, sideBarContentSuperAdmin } from "../helpers/sideBarContent";
import { Api, BaseUrl } from "../saas/Config/Api";
import axios from "axios";
import { toast } from "react-toastify";

function SideBar() {
  const userRole = JSON.parse(sessionStorage.getItem("userDetails")) || {}
  const role = userRole?.user?.role?.toLowerCase() || userRole?.user?.type?.toLowerCase() || "guest";
  const sideBarContent = userRole?.user?.type?.toLowerCase() == "employee" ? sideBarContentEmployee : userRole?.user?.type?.toLowerCase() == "admin" ? sideBarContentAdmin : sideBarContentSuperAdmin
  // console.log("userRole" ,userRole);
  const [profileData, setProfileData] = useState();
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  useEffect(() => {
    if (employeeId) {
      fetchEmployeProfile();
    }
  }, []);

  const fetchEmployeProfile = useCallback(async () => {
    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_PROFILE}?employee_id=${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0]);
        // logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0]);
        } else {
          setProfileData(responseData?.data?.data);
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }, [token]);



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
        <div id="sidebar-menu" className="sidebar-menu sv-sidebar-menu">
          <ul>
            <li className="menu-title">
              <span>{role || "Super Admin"}</span>
            </li>
            <li>
              <ul>
                {
                  sideBarContent?.map((item, index) => {
                    if (item?.subMenu?.length > 0) {
                      return (
                        <li className={`submenu ${item?.paths?.includes(window.location.pathname )? "active" : ""}  `}>
                          <a href={item?.pathname||"#"} className={`${item?.paths?.includes(window.location.pathname )?"active " :""}`} data-discover="true">
                            <i className="ti ti-box"></i><span>{item?.title}</span>
                            <span className="menu-arrow">
                            </span></a>
                          <ul style={{ display:item?.paths?.includes(window.location.pathname )? "block":"none" }}>
                            {
                              item?.subMenu?.map((subLink, indexN) => {
                                return (
                                  <li key={indexN} className="">
                                    <a style={{background:"transparent"}} className={`  ${item?.pathname == window.location.pathname ? "active" : ""}  `} href={subLink?.pathname} data-discover="true">
                                      {subLink?.title}
                                      <span className=""></span></a>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </li>
                      )
                    }
                    return (
                      <li key={index} className={`submenu ${item?.pathname == window.location.pathname ? "active" : ""}  `}>
                        <Link to={item?.pathname}>
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
