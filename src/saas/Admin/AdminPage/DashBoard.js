import React, { useCallback, useEffect, useState } from "react";
import "./DashBord.css";
import NoImage from "../../Assets/imageno.png";
import Strucutre from "../../Assets/Strucutre.png";
import Admin from "../../Assets/admin.png";
import Leave from "../../Assets/event_busy.png";
import { PiClockCountdownLight } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import {
  setAllInactiveEmployee,
  setAllUserAttendance,
  setCustomeDetails,
  setDepartement,
  setEmployeeHoliday,
  setManagerData,
  setMonthlyAttendance,
  setUserDetails,
  setGiftCardShow,
} from "../../Redux/Action";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";
import { GoMilestone } from "react-icons/go";
import { format } from 'date-fns';
import Profile from "../../Assets/profile.png";
import { CiSquarePlus } from "react-icons/ci";
import AddEmployeeModal from "../AdminComponent/AddEmployeeModal";
import Card from "../../Component/Card";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DashBoard = () => {
  const { setLoading, logout } = useAuth();
  const token = sessionStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCardOpen, setModalCardOpen] = useState(false);
  const getEmployeeHoliday = useSelector((state) => state.getEmployeeHoliday);

  const getGiftCardShow = useSelector((state) => state.getGiftCardShow);
  const [cardType, setCardType] = useState("");
  const [cardData, setCardData] = useState([]);
  const getAllUserAttendance = useSelector(
    (state) => state.getAllUserAttendance
  );
 const currentDate = format(new Date(), 'yyyy-MM-dd');
  const currentMonthIndex = new Date().getMonth();
  const currentDate1 = new Date();
  const month = currentDate1.getMonth() + 1;
  const day = currentDate1.getDate();

  const employeeId = sessionStorage.getItem("employeeId");
  const [profileData, setProfileData] = useState();
  const [reminderData, setReminderData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getAllUserAttendanceData();
    getReminderDetails();
    getHolidayList();
    fetchEmployeProfile();
    fetchEmployees();
    getManagerList();
    getDepartmentList();
    getMonthlyAttendance1();
    fetchCustomerDetails();
    fetchAllInactiveEmployee();
  }, []);
  const getAllUserAttendanceData = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_ATTENDANCE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          // setAllAttendance(responseData?.data?.data);
          dispatch(setAllUserAttendance(responseData?.data?.data));
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getReminderDetails = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.ADMIN_REMINDER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      {
      }
      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        setReminderData(responseData?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getHolidayList = async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_HOLIDAY}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else if (responseData?.data?.valid === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        dispatch(setEmployeeHoliday(responseData?.data?.data));
        getHolidatData(responseData?.data?.data);
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeProfile = async () => {
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
          const date = new Date(responseData?.data?.data?.dob);
          const month1 = date.getMonth() + 1;
          const day1 = date.getDate();

          const date1 = new Date(responseData?.data?.data?.doj);
          const month2 = date1.getMonth() + 1;
          const day2 = date1.getDate();

          if (month1 === month && day1 === day && getGiftCardShow == false) {
            setCardType("BIRTHDAY");
            setCardData(responseData?.data?.data);
            openGift();
          } else if (
            month2 === month &&
            day2 === day &&
            getGiftCardShow == false
          ) {
            setCardType("Work Anniversary");
            setCardData(responseData?.data?.data);
            openGift();
          }
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
  };

  const fetchEmployees = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_EMPLOYEE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          const employeeData = JSON.parse(
            JSON.stringify(responseData.data.data)
          );
          dispatch(setUserDetails(responseData?.data?.data));

          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getManagerList = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_ROPORTING_MANAGER}`,
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
          dispatch(setManagerData(responseData?.data?.data));
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getDepartmentList = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_DEPARTMENT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          dispatch(setDepartement(responseData?.data?.data));
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getMonthlyAttendance1 = async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_MONTHLY_ATTENDANCE}?month=${months[currentMonthIndex]}`,
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
          // setAllAttendance(responseData?.data?.data);
          // setFilteredCategories(responseData?.data?.data);
          dispatch(setMonthlyAttendance(responseData?.data?.data));
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomerDetails = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_CUSTOMER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          dispatch(setCustomeDetails(responseData?.data?.data));
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const fetchAllInactiveEmployee = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_ALL_INACTIVE_EMPLOYEE}`,
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
          // setAllAttendance(responseData?.data?.data);
          dispatch(setAllInactiveEmployee(responseData?.data?.data));
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const groupedLateData = getAllUserAttendance
    ?.filter((item) => {
      if (item?.attendance_status !== "Late") return false;

      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString("default", {
        month: "long",
      });
      const currentYear = currentDate.getFullYear();

      return item.month === currentMonth && parseInt(item.year) === currentYear;
    })
    .reduce((acc, item) => {
      const { name } = item;
      if (!acc[name]) {
        acc[name] = { name, count: 0 }; // Initialize entry if not exists
      }
      acc[name].count += 1; // Increment the count for the name
      return acc;
    }, {});

  const groupedLateArray = Object.values(groupedLateData).sort(
    (a, b) => b.count - a.count
  );
  const openGift = () => {
    setModalCardOpen(true);
  };
  const getHolidatData = (data) => {
    const todayHoliday = data.find((holiday) => holiday.date === currentDate);

    if (todayHoliday != undefined && getGiftCardShow == false) {
      setCardType(todayHoliday?.holiday_name);
      setCardData(todayHoliday);
      openGift();
    }
  };
  return (
    <div className="mainDashbordContainer">
      <span
        style={{
          textAlign: "center",
          marginLeft: 10,
          marginTop: 0,
          color: "#000000",
          fontWeight: "500",
        }}
      >
        Add New Employee
      </span>
      <div
        className="card"
        style={{
          backgroundImage: `url(${Strucutre})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <img
          src={profileData?.image ? ImagePath + profileData?.image : Profile}
          alt="Profile"
          style={{
            width: "100px",
            height: "100px",
          }}
        />
        <div style={{ marginLeft: "25px" }}>
          <h2
            style={{
              fontWeight: "600",
              color: "#1E40AF",
              display: "flex",
              margin: 0, // Remove default margin from h2
              fontSize: "18px", // Adjust font size to fit better with the image
              textAlign: "center",
              fontFamily: "Inter",
            }}
          >
            {profileData?.name}
          </h2>
          <div
            style={{
              width: "100px",
              height: "40px",
              background: "#DBEAFE",
              borderRadius: 30,
              // marginTop: 10,
              display: "flex",
              alignItems: "center", // Vertically center the content
              justifyContent: "center", // Horizontally center the content
            }}
          >
            <img
              src={Admin}
              alt="Profile"
              style={{
                width: "20px",
                height: "20px",

                marginRight: 5, // Space between the image and the text
              }}
            />
            <div
              style={{
                height: "20px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h2
                style={{
                  fontWeight: "600",
                  color: "#1E40AF",
                  display: "flex",
                  margin: -3, // Remove default margin from h2
                  fontSize: "18px", // Adjust font size to fit better with the image
                  textAlign: "center",
                }}
              >
                {profileData?.type}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <button
          style={{
            marginLeft: "auto",
            background: "#2563EB",
            borderRadius: 8,
            padding: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setModalOpen(true)}
        >
          <CiSquarePlus size={20} color="white" />
          <span
            style={{
              textAlign: "center",
              marginLeft: 10,
              marginTop: 0,
              color: "white",
              fontWeight: "500",
            }}
          >
            Add New Employee
          </span>
        </button>
      </div>

      <div className="mainDashbord">
        <div
          style={{
            // width: "100%",
            flex: 1,
            display: "flex",
            marginTop: -30,
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "49%", height: "100%" }}>
            <div className="card2">
              <div
                style={{
                  width: "100%",

                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                Leave/WFH Today
                </h>
                <img
                  src={Leave}
                  alt="Profile"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              </div>
              <div
                style={{
                  width: "100%",

                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              ></div>

              {/* <div>
                <div>
                  {getAllUserAttendance
                    ?.filter((item) => {
                      if (
                        item?.attendance_status !== "Leave" &&
                        item?.work_status !== "WFH"
                      )
                        return false;

                      const currentDate = new Date();
                      const todayDate = currentDate.toISOString().split("T")[0];
                      const currentYear = currentDate.getFullYear();

                      return (
                        item.date === todayDate &&
                        parseInt(item.year) === currentYear
                      );
                    })
                    .map((leaveItem, index) => (
                      <div
                        key={index}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          padding: 10,
                          paddingRight: 20,
                          justifyContent: "space-between",
                          display: "flex",
                          alignItems: "center",

                          marginBottom: "10px",
                        }}
                      >
                        <h3 style={{ fontWeight: "600", color: "#888888" }}>
                          {leaveItem.name}
                        </h3>
                        <div
                          style={{
                            width: 80,
                            height: 25,
                            color: "#115E59",
                            background: "#CCFBF1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 30,
                            flexDirection: "row",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              fontWeight: "600",
                              textAlign: "center",
                              marginTop: -1,
                            }}
                          >
                            <span
                              style={{ color: "#115E59", marginRight: "5px" }}
                            >
                              ●
                            </span>
                            {leaveItem?.attendance_status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div> */}
              <div>
                {getAllUserAttendance
                  ?.filter((item) => {
                    const currentDate = new Date();
                    const todayDate = currentDate.toISOString().split("T")[0];
                    const currentYear = currentDate.getFullYear();

                    // Check if the user has either "Leave" or "WFH" status
                    return (
                      (item?.attendance_status === "Leave" ||
                        item?.work_status === "WFH") &&
                      item.date === todayDate &&
                      parseInt(item.year) === currentYear
                    );
                  })
                  .map((leaveItem, index) => (
                    <div
                      key={index}
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        padding: 10,
                        paddingRight: 20,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      {/* User Name */}
                      <h3 style={{ fontWeight: "600", color: "#888888" }}>
                        {leaveItem.name}
                      </h3>

                      <div style={{ display: "flex", gap: "10px" }}>
                        {/* Attendance Status Display (Leave) */}
                        {leaveItem.attendance_status === "Leave" && (
                          <div
                            style={{
                              width: 80,
                              height: 25,
                              color: "#B91C1C",
                              background: "#FECACA",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 30,
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "600",
                                textAlign: "center",
                              }}
                            >
                              <span
                                style={{ color: "#B91C1C", marginRight: "5px" }}
                              >
                                ●
                              </span>
                              {leaveItem.attendance_status}
                            </span>
                          </div>
                        )}

                        {/* Work Status Display (WFH) */}
                        {leaveItem.work_status === "WFH" && (
                          <div
                            style={{
                              width: 80,
                              height: 25,
                              color: "#115E59",
                              background: "#CCFBF1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 30,
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "600",
                                textAlign: "center",
                              }}
                            >
                              <span
                                style={{ color: "#115E59", marginRight: "5px" }}
                              >
                                ●
                              </span>
                              {leaveItem.work_status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="card2">
              <div
                style={{
                  width: "100%",

                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Late Today
                </h>
                <PiClockCountdownLight size={20} />
              </div>

              <div style={{ height: "200px", overflow: "auto" }}>
                <div>
                  {getAllUserAttendance && getAllUserAttendance.length > 0 ? (
                    (() => {
                      const lateAttendance = getAllUserAttendance.filter(
                        (item) => {
                          if (item?.attendance_status !== "Late") return false;

                          const currentDate = new Date();
                          const todayDate = currentDate
                            .toISOString()
                            .split("T")[0];
                          const currentYear = currentDate.getFullYear();

                          return (
                            item.date === todayDate &&
                            parseInt(item.year) === currentYear
                          );
                        }
                      );

                      return lateAttendance.length > 0 ? (
                        lateAttendance.map((leaveItem, index) => (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              padding: 10,
                              justifyContent: "space-between",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <h3 style={{ fontWeight: "600", color: "#888888" }}>
                              {leaveItem.name}
                            </h3>
                            <div
                              style={{
                                width: 100,
                                height: 20,
                                color: "black",
                                display: "flex",
                                alignItems: "center", // Centers vertically
                                justifyContent: "center", // Centers horizontally
                              }}
                            >
                              <span
                                style={{ fontWeight: "600", color: "#888888" }}
                              >
                                {leaveItem?.login_time}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            paddingBottom: "50px",
                          }}
                        >
                          Today, no person was late.
                        </div>
                      );
                    })()
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#888888",
                        fontWeight: "600",
                        marginTop: "20px",
                      }}
                    >
                      No attendance data available.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card2">
              <div
                style={{
                  width: "100%",

                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Most Lates This Month
                </h>
                <SlCalender size={20} />
              </div>

              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  height: "250px",
                  overflow: "auto",
                }}
              >
                {groupedLateArray.map((person, index) => (
                  <div
                    key={index}
                    style={{
                      width: "100%",
                      padding: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#888888" }}>
                      {person.name}
                    </span>
                    <span style={{ fontWeight: "600", color: "#888888" }}>
                      {person.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ width: "49%", height: "100%" }}>
            <div className="card2">
              <div
                style={{
                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Birthdays This Month
                </h>
                <LiaBirthdayCakeSolid size={20} />
              </div>

              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  height: "200px",
                  overflow: "auto",
                }}
              >
                {reminderData?.current_events?.length > 0 ||
                reminderData?.upcoming_events?.length > 0 ? (
                  (() => {
                    // Combine current events and upcoming events, then filter for birthdays in the current month
                    const birthdayItems = [
                      ...(reminderData?.current_events || []),
                      ...(reminderData?.upcoming_events || []),
                    ].filter((item) => {
                      if (item.type !== "Birthday") return false;

                      const itemDate = new Date(item.date);
                      const currentMonth = new Date().getMonth(); // Get current month (0-indexed)
                      const currentYear = new Date().getFullYear(); // Get current year

                      // Check if the item's month and year match the current month and year
                      return (
                        itemDate.getMonth() === currentMonth &&
                        itemDate.getFullYear() === currentYear
                      );
                    });

                    return birthdayItems.length > 0 ? (
                      birthdayItems.map((birthdayItem, index) => {
                        const date = new Date(birthdayItem.date);
                        const day = new Intl.DateTimeFormat("en-US", {
                          weekday: "long",
                        }).format(date);

                        return (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              padding: 10,
                              paddingRight: 20,
                              justifyContent: "space-between",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "40%",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                display: "flex",
                              }}
                            >
                              <h3
                                style={{
                                  fontWeight: "600",
                                  color: "#888888",
                                }}
                              >
                                {birthdayItem?.name}
                              </h3>
                            </div>
                            <div
                              style={{
                                width: "30%",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                display: "flex",
                              }}
                            >
                              <span
                                style={{
                                  color: "#115E59",
                                  fontWeight: "600",
                                }}
                              >
                                {birthdayItem?.date}
                              </span>
                            </div>

                            <div
                              style={{
                                width: "30%",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                display: "flex",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  color: "#115E59",
                                  alignItems: "center",
                                  fontWeight: "600",
                                }}
                              >
                                {day}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#888888",
                          fontWeight: "600",
                          marginTop: "20px",
                          marginBottom: "50px",
                        }}
                      >
                        No birthdays this month.
                      </div>
                    );
                  })()
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888888",
                      fontWeight: "600",
                      marginTop: "20px",
                    }}
                  >
                    No events data available.
                  </div>
                )}
              </div>
            </div>
            <div className="card2">
              <div
                style={{
                  width: "100%",

                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Milestones This Month
                </h>
                <GoMilestone size={20} />
              </div>

              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  height: "200px",
                  overflow: "auto",
                }}
              >
                {reminderData?.current_events?.length > 0 ||
                reminderData?.older_events?.length > 0 ||
                reminderData?.upcoming_events?.length > 0 ? (
                  (() => {
                    const birthdayItems = [
                      ...(reminderData?.current_events || []),
                      ...(reminderData?.older_events || []),
                      ...(reminderData?.upcoming_events || []),
                    ].filter((item) => {
                      if (item.type !== "Anniversary") return false;

                      const itemDate = new Date(item.date);
                      const currentDate = new Date();

                      {
                        /* const currentMonth = new Date().getMonth();
                      const currentYear = new Date().getFullYear(); */
                      }

                      {
                        /* return (
                        itemDate.getMonth() === currentMonth &&
                        itemDate.getFullYear() === currentYear
                      );
                    }); */
                      }
                      return (
                        itemDate >= currentDate &&
                        itemDate.getMonth() === currentDate.getMonth() &&
                        itemDate.getFullYear() === currentDate.getFullYear()
                      );
                    });

                    return birthdayItems.length > 0 ? (
                      birthdayItems.map((birthdayItem, index) => {
                        const date = new Date(birthdayItem.date);
                        const day = new Intl.DateTimeFormat("en-US", {
                          weekday: "long",
                        }).format(date);

                        return (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              padding: 10,
                              paddingRight: 20,
                              justifyContent: "space-between",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "40%",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                display: "flex",
                              }}
                            >
                              <h3
                                style={{
                                  fontWeight: "600",
                                  color: "#888888",
                                }}
                              >
                                {birthdayItem?.name}({birthdayItem.type})
                              </h3>
                            </div>
                            <div
                              style={{
                                width: "30%",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                display: "flex",
                              }}
                            >
                              <span
                                style={{
                                  color: "#115E59",
                                  fontWeight: "600",
                                }}
                              >
                                {birthdayItem?.date}
                              </span>
                            </div>
                            <div
                              style={{
                                width: "30%",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                display: "flex",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  color: "#115E59",
                                  alignItems: "center",
                                  fontWeight: "600",
                                }}
                              >
                                {day}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#888888",
                          fontWeight: "600",
                          marginTop: "20px",
                          marginBottom: "50px",
                        }}
                      >
                        No work Anniversary this month.
                      </div>
                    );
                  })()
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888888",
                      fontWeight: "600",
                      marginTop: "20px",
                    }}
                  >
                    No events data available.
                  </div>
                )}
              </div>
            </div>
            <div className="card2">
              <div
                style={{
                  width: "100%",

                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Holidays This Month
                </h>
                <IoCalendarOutline size={20} />
              </div>
              {/* <div
                style={{
                  width: "100%",

                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              ></div> */}

              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  height: "150px",
                  overflow: "auto",
                }}
              >
                <div>
                  {getEmployeeHoliday && getEmployeeHoliday.length > 0 ? (
                    (() => {
                      const currentMonth = new Date().getMonth(); // Current month (0-indexed)
                      const currentYear = new Date().getFullYear(); // Current year

                      const filteredHolidays = getEmployeeHoliday.filter(
                        (item) => {
                          const holidayDate = new Date(item.date);
                          return (
                            holidayDate.getMonth() === currentMonth &&
                            holidayDate.getFullYear() === currentYear
                          );
                        }
                      );

                      return filteredHolidays.length > 0 ? (
                        filteredHolidays.map((holidayItem, index) => {
                          const date = new Date(holidayItem.date);
                          const day = new Intl.DateTimeFormat("en-US", {
                            weekday: "long",
                          }).format(date);

                          return (
                            <div
                              key={index}
                              style={{
                                width: "100%",
                                flexDirection: "row",
                                padding: 10,
                                paddingRight: 20,
                                justifyContent: "space-between",
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px",
                              }}
                            >
                              <div style={{ width: "40%" }}>
                                <h3
                                  style={{
                                    fontWeight: "600",
                                    color: "#888888",
                                  }}
                                >
                                  {holidayItem?.holiday_name}
                                </h3>
                              </div>
                              <div
                                style={{
                                  width: "30%",
                                  alignItems: "flex-end",
                                  justifyContent: "flex-end",
                                  display: "flex",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#115E59",
                                    fontWeight: "600",
                                  }}
                                >
                                  {holidayItem?.date}
                                </span>
                              </div>
                              <div
                                style={{
                                  width: "30%",
                                  alignItems: "flex-end",
                                  justifyContent: "flex-end",
                                  display: "flex",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    color: "#115E59",
                                    alignItems: "center",
                                    fontWeight: "600",
                                  }}
                                >
                                  {day}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            marginBottom: "50px",
                          }}
                        >
                          No holidays this month.
                        </div>
                      );
                    })()
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#888888",
                        fontWeight: "600",
                        marginTop: "20px",
                        marginBottom: "50px",
                      }}
                    >
                      No holiday data available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEmployeeModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div>
        <Card
          open={modalCardOpen}
          onClose={() => {
            setModalCardOpen(false);
            dispatch(setGiftCardShow(true));
          }}
          data={cardData}
          type={cardType}
        />
      </div>
    </div>
  );
};

export default DashBoard;
