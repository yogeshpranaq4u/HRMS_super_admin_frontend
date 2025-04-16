import React, { useCallback, useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import { MdMenu } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Assets/logoNew.png";
import Home from "../Assets/home.png";
import Leave from "../Assets/event_busy.png";
import Attendance from "../Assets/Property.png";
import Holiday from "../Assets/calendar_month.png";
import Asset from "../Assets/Asset.png";
import Asset1 from "../Assets/Asset1.png";
import Logout from "../Assets/logout.png";
import Home1 from "../Assets/home1.png";
import Leave1 from "../Assets/event_busy1.png";
import Attendance1 from "../Assets/person_check1.png";
import Holiday1 from "../Assets/calendar_month1.png";
import Logout1 from "../Assets/logout1.png";
import Salary from "../Assets/salary.png";
import Salary1 from "../Assets/salary1.png";
import { useAuth } from "../Component/Authentication/AuthContext";
import { motion } from "framer-motion";
import Organisation from "../Assets/tree.png";
import Organisation1 from "../Assets/tree2.png";
import Password from "../Assets/encrypted.png";
import Password1 from "../Assets/encrypted1.png";
import Bill from "../Assets/bill.png";
import Bill1 from "../Assets/bill1.png";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import axios from "axios";
import { Api, BaseUrl } from "../Config/Api";
import { toast } from "react-toastify";

const EmployeeSlider = () => {
  const isTabletMid = useMediaQuery({ query: "(max-width: 1024px)" });
  const [open, setOpen] = useState(!isTabletMid);
  const [billingSubMenuOpen, setBillingSubMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // const { logout, setLoading } = useAuth();
  const logout =()=>{};
  const setLoading =()=>{};
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  useEffect(() => {
    setOpen(!isTabletMid);
  }, [isTabletMid]);

  useEffect(() => {
    if (isTabletMid) setOpen(false);
  }, [pathname, isTabletMid]);
  const toggleSubMenu = () => {
    setBillingSubMenuOpen((prev) => !prev);
  };
  const fetchEmployeProfile = useCallback(async () => {
    setLoading(true);

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
          setLoading(false);
        } else {
          setProfileData(responseData?.data?.data);

          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setLoading(false); // Hide loader after delay
    }
  }, [token, setLoading, logout]);
  useEffect(() => {
    fetchEmployeProfile();
  }, []);
  return (
    <div>
      <motion.div
        animate={open ? "open" : "closed"}
        className="bg-white text-gray shadow-xl z-[999] fixed h-screen overflow-hidden"
      >
        <div className="flex items-center gap-3 font-medium border-b py-4 border-slate-300 mx-3">
          <img src={Logo} width={150} alt="Logo" />
        </div>

        <div className="flex flex-col h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-y-auto">
            <li>
              <NavLink
                to={"/home/dashboard"}
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
                      Profile
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/home/leaves"}
                className={({ isActive }) => `link ${isActive ? "active" : ""}`}
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? Leave1 : Leave}
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
                      Leaves/WFH
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to={"/home/attendance"}
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
                to={"/home/employeesalary"}
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
                to={"/home/holiday"}
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
                      Holidays
                    </span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/home/employeeassetassign"}
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
                      Assets
                    </span>
                  </>
                )}
              </NavLink>
            </li>

            {profileData?.page_access == 1 &&
              JSON.parse(profileData.pages).includes("Billing") && (
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
                              to="/home/customer"
                              className={({ isActive }) =>
                                `flex items-center ${
                                  isActive ? "active p-2 rounded-md" : "ml-2"
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <span
                                    style={{
                                      color: "#000",
                                      marginRight: "0px",
                                    }}
                                  >
                                    ●
                                  </span>
                                  <span
                                    className={`ml-2 ${
                                      open ? "block" : "hidden"
                                    }`}
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
                              to="/home/invoice"
                              className={({ isActive }) =>
                                `flex items-center ${
                                  isActive ? "active p-2 rounded-md" : "ml-2"
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <span
                                    style={{
                                      color: "#000",
                                      marginRight: "0px",
                                    }}
                                  >
                                    ●
                                  </span>
                                  <span
                                    className={`ml-2 ${
                                      open ? "block" : "hidden"
                                    }`}
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
              )}

            <li>
              <NavLink
                to={"/home/employeeorganisationtree"}
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
                to={"/home/employeepasswordupdate"}
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
            <NavLink
              to={"/home/emplogout"}
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
          </ul>
        </div>
      </motion.div>
      <div className="m-3 md:hidden" onClick={() => setOpen(true)}>
        <MdMenu size={25} />
      </div>
    </div>
  );
};

export default EmployeeSlider;
