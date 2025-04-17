import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { MdMenu } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Assets/logoNew.png";
import Home from "../Assets/home.png";
import Leave from "../Assets/event_busy.png";

import Holiday from "../Assets/calendar_month.png";
import ManageStructure from "../Assets/folder_managed.png";
import Profile from "../Assets/account_circle.png";
import Logout from "../Assets/logout.png";
import Password from "../Assets/encrypted.png";
import Home1 from "../Assets/home1.png";
import Leave1 from "../Assets/event_busy1.png";
import Attendance from "../Assets/attendancenew2.png";
import Attendance1 from "../Assets/attendancenew.png";
import Holiday1 from "../Assets/calendar_month1.png";
import ManageStructure1 from "../Assets/folder_managed1.png";
import Profile1 from "../Assets/account_circle1.png";
import Logout1 from "../Assets/logout1.png";
import Password1 from "../Assets/encrypted1.png";
import Salary from "../Assets/salary.png";
import Salary1 from "../Assets/salary1.png";
import Asset from "../Assets/Asset.png";
import Asset1 from "../Assets/Asset1.png";
import Reminder from "../Assets/reminder.png";
import Reminder1 from "../Assets/reminder1.png";
import Employee from "../Assets/employee.png";
import Employee1 from "../Assets/employee1.png";
import Bill from "../Assets/bill.png";
import Bill1 from "../Assets/bill1.png";
import Organisation from "../Assets/tree.png";
import Organisation1 from "../Assets/tree2.png";
import "./AdminSlider.css";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../Component/Authentication/AuthContext";
import { useSelector } from "react-redux";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../Config/Api";
import { toast } from "react-toastify";

const AdminSlider = () => {
  const isTabletMid = useMediaQuery({ query: "(max-width: 1024px)" });
  const [open, setOpen] = useState(!isTabletMid);
  const { pathname } = useLocation();
  const [billingSubMenuOpen, setBillingSubMenuOpen] = useState(false);
  const [leaveSubMenuOpen, setLeaveSubMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState();
  const token = sessionStorage.getItem("authToken");
  const employeeId = sessionStorage.getItem("employeeId");
const setLoading = () => { };
  const logout = () => { };
  // const { logout } = useAuth();
  useEffect(() => {
    fetchEmployeProfile();
  }, []);

  const fetchEmployeProfile = async () => {
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
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
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
  };
  useEffect(() => {
    setOpen(!isTabletMid);
  }, [isTabletMid]);

  useEffect(() => {
    if (isTabletMid) setOpen(false);
  }, [pathname, isTabletMid]);

  const Nav_animation = {
    open: {
      width: "16rem",
      transition: {
        damping: 40,
      },
    },
    closed: {
      width: "4rem",
      transition: {
        damping: 40,
      },
    },
  };
  // const handleLogoutClick = () => {
  //   // sessionStorage.setItem("EmployeeType", "Admin");
  // };

  const toggleSubMenu = () => {
    setBillingSubMenuOpen((prev) => !prev);
  };
  const toggleSubMenu1 = () => {
    setLeaveSubMenuOpen((prev) => !prev);
  };
  return (
    <div>
      <motion.div
        animate={open ? "open" : "closed"}
        className="bg-white text-gray-800 shadow-xl z-[999]  h-screen  flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-center py-4 border-b border-gray-300">
          <img src={Logo} width={200} alt="Logo" />
        </div>

        <div className="flex flex-col flex-grow overflow-hidden">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-y-auto">
            <li>
              <NavLink
                to={"/adminhome/dashboard"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Home1 : Home}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Dashboard
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/adminhome/admindashboard"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Employee1 : Employee}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Employees
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            <div className="flex flex-col h-full px-0">
              <ul className="  text-[0.9rem] py-1 flex flex-col gap-1 font-medium overflow-y-auto">
                <li>
                  <div
                    className="flex items-center justify-between cursor-pointer link"
                    onClick={toggleSubMenu1}
                  >
                    <div className="flex items-center">
                      <img
                        src={leaveSubMenuOpen ? Leave1 : Leave}
                        width={20}
                        alt="Billing"
                      />
                      <span
                        className={`ml-7 ${open ? "block" : "hidden"}`}
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        Leaves/WFH
                      </span>
                    </div>
                    {open && (
                      <span className="ml-auto">
                        {leaveSubMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    )}
                  </div>
                  {leaveSubMenuOpen && open && (
                    <ul className="ml-10 mt-0 text-sm">
                      <li className="flex items-center">
                        <NavLink
                          to="/adminhome/adminleaves"
                          className={({ isActive }) =>
                            `flex items-center ${
                              isActive ? "active p-2 rounded-md" : "ml-2"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                style={{ color: "#000", marginRight: "0px" }}
                              >
                                ●
                              </span>
                              <span
                                className={`ml-2 ${open ? "block" : "hidden"}`}
                                style={{
                                  fontSize: 15,
                                  fontWeight: "500",
                                }}
                              >
                              History
                              </span>
                            </>
                          )}
                        </NavLink>
                      </li>
                      <li className="flex items-center mt-3">
                        <NavLink
                          to="/adminhome/adminLeaverrequestHistory"
                          className={({ isActive }) =>
                            `flex items-center ${
                              isActive ? "active p-2 rounded-md" : "ml-2"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                style={{ color: "#000", marginRight: "0px" }}
                              >
                                ●
                              </span>
                              <span
                                className={`ml-2 ${open ? "block" : "hidden"}`}
                                style={{
                                  fontSize: 15,
                                  fontWeight: "500",
                                }}
                              >
                                Request
                              </span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
            <li>
              <NavLink
                to={"/adminhome/adminattendance"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Attendance1 : Attendance}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Attendance
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to={"/adminhome/Salary"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Salary1 : Salary}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Salary
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/adminhome/adminholiday"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Holiday1 : Holiday}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Holidays Calender
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/adminhome/reminder"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Reminder1 : Reminder}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Reminder
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/adminhome/admindepartment"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? ManageStructure1 : ManageStructure}
                      width={20}
                      alt="Dashboard"
                    />
                    <span className={`ml-1 ${open ? "block" : "hidden"}`}>
                      Manage Structure
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/adminhome/organisationTree"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Organisation1 : Organisation}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Organisation Tree
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to={"/adminhome/AssetManagement"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Asset1 : Asset}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Asset management
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            <div className="flex flex-col h-full">
              <ul className="  text-[0.9rem] py-1 flex flex-col gap-1 font-medium overflow-y-auto">
                <li>
                  <div
                    className="flex items-center justify-between cursor-pointer link"
                    onClick={toggleSubMenu}
                  >
                    <div className="flex items-center">
                      <img
                        src={billingSubMenuOpen ? Bill1 : Bill}
                        width={20}
                        alt="Billing"
                      />
                      <span
                        className={`ml-7 ${open ? "block" : "hidden"}`}
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                        }}
                      >
                        Billing
                      </span>
                    </div>
                    {open && (
                      <span className="ml-auto">
                        {billingSubMenuOpen ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </span>
                    )}
                  </div>
                  {billingSubMenuOpen && open && (
                    <ul className="ml-10 mt-0 text-sm">
                      <li className="flex items-center">
                        <NavLink
                          to="/adminhome/customer"
                          className={({ isActive }) =>
                            `flex items-center ${
                              isActive ? "active p-2 rounded-md" : "ml-2"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                style={{ color: "#000", marginRight: "0px" }}
                              >
                                ●
                              </span>
                              <span
                                className={`ml-2 ${open ? "block" : "hidden"}`}
                                style={{
                                  fontSize: 15,
                                  fontWeight: "500",
                                }}
                              >
                                Customers
                              </span>
                            </>
                          )}
                        </NavLink>
                      </li>
                      <li className="flex items-center mt-3">
                        <NavLink
                          to="/adminhome/invoice"
                          className={({ isActive }) =>
                            `flex items-center ${
                              isActive ? "active p-2 rounded-md" : "ml-2"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                style={{ color: "#000", marginRight: "0px" }}
                              >
                                ●
                              </span>
                              <span
                                className={`ml-2 ${open ? "block" : "hidden"}`}
                                style={{
                                  fontSize: 15,
                                  fontWeight: "500",
                                }}
                              >
                                Invoice
                              </span>
                            </>
                          )}
                        </NavLink>
                      </li>
                      {/* <li className="flex items-center mt-3">
                        <NavLink
                          to="/adminhome/paymentreceived"
                          className={({ isActive }) =>
                            `flex items-center ${
                              isActive ? "active p-2 rounded-md" : "ml-2"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                style={{ color: "#000", marginRight: "0px" }}
                              >
                                ●
                              </span>
                              <span
                                className={`ml-2 ${open ? "block" : "hidden"}`}
                              >
                                Payment Received
                              </span>
                            </>
                          )}
                        </NavLink>
                      </li> */}
                    </ul>
                  )}
                </li>

                {/* Other Nav Items */}
              </ul>
            </div>
            <li>
              <NavLink
                to={"/adminhome/adminprofile"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Profile1 : Profile}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Profile
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/adminhome/adminpasswordupdate"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Password1 : Password}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Update Password
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to={"/adminhome/logoutscreen"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Logout1 : Logout}
                      width={20}
                      alt="Dashboard"
                    />
                    <span
                      className={`ml-1 ${open ? "block" : "hidden"}`}
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Log Out
                    </span>
                  </>
                )}
              </NavLink>
            </li> */}
            <div className="border-t border-gray-250 py-0 px-0 flex items-center ">
              <div className="flex items-center gap-2 mt-10">
                <img
                  src={
                    profileData?.image
                      ? ImagePath + profileData?.image
                      : Profile
                  }
                  width={40}
                  alt="Profile"
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">
                  
                    {profileData?.name}
                  </p>
                  <p
                    className="text-sm text-gray-500 ml-1 "
                    style={{
                      width:200,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      display: "block", // Ensures it takes full width
                      overflowWrap: "break-word",
                    }}
                  >
                    {profileData?.email}
                   
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <NavLink
                to={"/adminhome/logoutscreen"}
                className="text-gray-500 hover:text-red-500 mt-0"
              >
                <FaSignOutAlt size={20} />
              </NavLink>
            </div>
          </ul>
        </div>
      </motion.div>
      <div className="m-3 md:hidden" onClick={() => setOpen(true)}>
        <MdMenu size={25} />
      </div>
    </div>
  );
};

export default AdminSlider;
