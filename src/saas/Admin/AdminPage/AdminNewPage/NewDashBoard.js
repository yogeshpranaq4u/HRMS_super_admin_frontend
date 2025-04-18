import React, { useEffect, useState, useMemo, useCallback } from "react";
import "../AdminNewPage/Style/NewDashBoard.css";
import { COLOR, FONT, IMAGE } from "../../../Config/Color";
import { ImageUrl } from "../../../Config/Image";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import axios from "axios";
import { Api, BaseUrl } from "../../../Config/Api";
import { toast } from "react-toastify";
import {
  setAllInactiveEmployee,
  setAllUserAttendance,
  setCustomeDetails,
  setDepartement,
  setEmployeeHoliday,
  setGiftCardShow,
  setManagerData,
  setMonthlyAttendance,
  setUserDetails,
} from "../../../Redux/Action";
import AddEmployeeModal from "../../AdminComponent/AddEmployeeModal";
import Card from "../../../Component/Card";
import EmployeeLeaveTable from "./Component/EmployeeLeaveTable";
import debounce from "lodash/debounce";
import MainLayout from "../../../../layouts/MainLayout";
import { getReminder } from "../../../../redux/actions/employeeActions";
import {
  getEmployeeAttendanceData,
  getEmployeeData,
} from "../../../../redux/actions/adminAction";
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
const NewDashBoard = () => {
  const details = JSON.parse(sessionStorage.getItem("userDetails")) || {};

  const dispatch = useDispatch();
  const [filterAttendance, setFilterAttendance] = useState([]);
  const error = useSelector((state) => state?.adminData?.error);
  const loading = useSelector((state) => state?.adminData?.loading);
  const getAllUsersData = useSelector(
    (state) => state?.adminData?.employeeListData
  );

  const getAllUserAttendance = useSelector(
    (state) => state?.adminData?.employeeAttendanceData
  );

  useEffect(() => {
    dispatch(getEmployeeData());
    dispatch(getEmployeeAttendanceData());
  }, []);

  // const { setLoading, logout } = useAuth();
  const setLoading = () => {};
  const logout = () => {}; 
  const token = sessionStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCardOpen, setModalCardOpen] = useState(false);
  const getEmployeeHoliday = useSelector((state) => state.getEmployeeHoliday);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);

  const getGiftCardShow = useSelector((state) => state.getGiftCardShow);
  const [cardType, setCardType] = useState("");
  const [cardData, setCardData] = useState([]);
  // const getAllUserAttendance = useSelector(
  //   (state) => state.getAllUserAttendance
  // );

  const currentDate = format(new Date(), "yyyy-MM-dd");
  const currentYear = new Date().getFullYear(); // Get current year
  const currentMonthIndex = new Date().getMonth();
  const currentDate1 = new Date();
  const month = months[currentDate1.getMonth() + 0];
  const day = currentDate1.getDate();
  const employeeId = sessionStorage.getItem("employeeId");
  const [profileData, setProfileData] = useState();

  const reminderData = useSelector((state) => state.employeeData?.reminder);
  useEffect(() => {
    dispatch(getReminder())
  }, []);
  
  const fetchAllData = useCallback(
    debounce(() => {
    
      fetchEmployeProfile();
      getHolidayList();

      getManagerList();
      getDepartmentList();
      getMonthlyAttendance1();
      fetchCustomerDetails();
      fetchAllInactiveEmployee();
    }, 300), // 300ms debounce delay
    []
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  useEffect(() => {
    const filteredData = getAllUserAttendance?.filter((attendance) => {
      const isDateMatch =
        attendance?.year == currentYear &&
        attendance?.month == month &&
        attendance?.date == currentDate;

      return isDateMatch;
    });
    setFilterAttendance(filteredData);
  }, [getAllUserAttendance]);


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
        toast.error(responseData?.data?.mssg[0]);
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0]);
          setLoading(false);
        } else {
          setProfileData(responseData?.data?.data);
          const date = new Date(responseData?.data?.data?.dob);
          const month1 = date.toLocaleString("default", { month: "long" });
          const day1 = date.getDate();

          const date1 = new Date(responseData?.data?.data?.doj);
          const month2 = date1.toLocaleString("default", { month: "long" });
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
        toast.error(responseData?.data?.mssg[0]);
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0]);
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
        toast.error(responseData?.data?.mssg[0]);
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0]);
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
        toast.error(responseData?.data?.mssg[0]);
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0]);
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
        toast.error(responseData?.data?.mssg[0]);
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0]);
          setLoading(false);
        } else {
          //  console.log("responseData?.data" ,responseData?.data);

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
        toast.error(responseData?.data?.mssg[0]);
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0]);
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

  const getHolidayList = async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_HOLIDAY}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0]);
        logout();
      } else if (responseData?.data?.valid === false) {
        toast.error(responseData?.data?.mssg[0]);
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
  const getHolidatData = (data) => {
    const todayHoliday = data.find((holiday) => holiday?.date === currentDate);

    if (todayHoliday != undefined && getGiftCardShow == false) {
      setCardType(todayHoliday?.holiday_name);
      setCardData(todayHoliday);
      openGift();
    }
  };
  const openGift = () => {
    setModalCardOpen(true);
  };
  const totalPresent = useMemo(() => {
    const filteredData = getAllUserAttendance?.filter((attendance) => {
      const isDateMatch =
        attendance?.year == currentYear &&
        attendance?.month == month &&
        attendance?.date == currentDate &&
        (attendance?.attendance_status == "On Time" ||
          attendance?.attendance_status == "Half-Day" ||
          attendance?.attendance_status == "Late" ||
          attendance?.work_status == "WFH");

      return isDateMatch;
    });
    // console.log("Total Present", filteredData);
    return filteredData?.length || 0;
  }, [getAllUserAttendance, currentYear, month, currentDate]);

  const totalPresentGurugram = useMemo(() => {
    const filteredData = getAllUserAttendance?.filter((attendance) => {
      const isDateMatch =
        attendance?.year == currentYear &&
        attendance?.month == month &&
        attendance?.date == currentDate &&
        attendance?.office_location === "Gurugram";

      // Exclude WFH employees, even if they are "On Time"
      const isPhysicallyPresent =
        (attendance?.attendance_status === "On Time" ||
          attendance?.attendance_status === "Half-Day" ||
          attendance?.attendance_status === "Late") &&
        attendance?.work_status !== "WFH";

      return isDateMatch && isPhysicallyPresent;
    });
    // console.log("GUrugram", filteredData);
    return filteredData?.length || 0;
  }, [getAllUserAttendance, currentYear, month, currentDate]);
  const totalPresentNoida = useMemo(() => {
    const filteredData = getAllUserAttendance?.filter((attendance) => {
      const isDateMatch =
        attendance?.year == currentYear &&
        attendance?.month == month &&
        attendance?.date == currentDate &&
        attendance?.office_location === "Noida";

      // Exclude WFH employees, even if they are "On Time"
      const isPhysicallyPresent =
        (attendance?.attendance_status === "On Time" ||
          attendance?.attendance_status === "Half-Day" ||
          attendance?.attendance_status === "Late") &&
        attendance?.work_status !== "WFH";

      return isDateMatch && isPhysicallyPresent;
    });
    // console.log("Noida", filteredData);
    return filteredData?.length || 0;
  }, [getAllUserAttendance, currentYear, month, currentDate]);
  const totalWfh = useMemo(() => {
    const filteredData = getAllUserAttendance?.filter((attendance) => {
      const isDateMatch =
        attendance?.year == currentYear &&
        attendance?.month == month &&
        attendance?.date == currentDate &&
        attendance?.work_status == "WFH";

      return isDateMatch;
    });

    return filteredData?.length || 0;
  }, [getAllUserAttendance, currentYear, month, currentDate]);

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
  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <div className="dashboard">
            <header className="dash-header">
              <span>👋 Welcome, {profileData?.name}</span>

              <div
                style={{
                  width: 100,
                  height: 32,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "#047EFF",
                  marginLeft: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#E6F2FF",
                }}
              >
                <img
                  src={IMAGE.MEDAL}
                  style={{
                    width: "15px",
                    height: "18px",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT.INTER,
                    fontWeight: "500",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#047EFF",
                    marginLeft: "5px",
                  }}
                >
                  Admin
                </span>
              </div>
            </header>
            <div
              style={{
                width: "100%",
                height: "250px",
                display: "flex",
                marginTop: "20px",

                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "20%",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "30%",
                    backgroundColor: "white",

                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: 16,
                    }}
                  >
                    <img
                      src={ImageUrl.EMPLOYEE}
                      style={{
                        width: "40px",
                        height: "40px",
                        alignContent: "center",
                        alignSelf: "center",
                      }}
                    />
                  </div>

                  <div style={{ marginLeft: "16px" }}>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: "Inter",
                        color: COLOR.BLACK,
                        margin: "0px",
                      }}
                    >
                      {getAllUsersData?.length}
                    </p>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontFamily: "Inter",
                        color: COLOR.BLACK1,
                      }}
                    >
                      Total Employees
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "5%",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "30%",
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: 16,
                    }}
                  >
                    <img
                      src={IMAGE?.GURUGRAM}
                      style={{
                        width: "40px",
                        height: "40px",
                        alignContent: "center",
                        alignSelf: "center",
                      }}
                    />
                  </div>
                  <div style={{ marginLeft: "16px" }}>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: "Inter",
                        color: COLOR.BLACK,
                        margin: "0px",
                      }}
                    >
                      {
                        getAllUsersData?.filter(
                          (emp) => emp.officeLocation === "Gurugram"
                        )?.length
                      }
                    </p>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontFamily: "Inter",
                        color: COLOR.BLACK1,
                      }}
                    >
                      Total Gurgaon Office
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "5%",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "30%",
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      marginLeft: 16,
                    }}
                  >
                    <img
                      src={IMAGE?.NOIDA}
                      style={{
                        width: "40px",
                        height: "40px",
                        alignContent: "center",
                        alignSelf: "center",
                      }}
                    />
                  </div>
                  <div style={{ marginLeft: "16px" }}>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: "Inter",
                        color: COLOR.BLACK,
                        margin: "0px",
                      }}
                    >
                      {
                        getAllUsersData?.filter(
                          (emp) => emp.officeLocation === "Noida"
                        )?.length
                      }
                    </p>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontFamily: "Inter",
                        color: COLOR.BLACK1,
                      }}
                    >
                      Total Noida Office
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: "39%",
                  height: "100%",
                  display: "flex",
                  background: COLOR.WHITE,
                  borderRadius: "8px",
                  borderWidth: 1,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "5px",
                }}
              >
                <div className="w-full bg-white  rounded-lg p-2">
                  <div className="flex items-center mb-4">
                    <div style={{}}>
                      <img
                        src={IMAGE.CURRENT}
                        style={{
                          width: "32px",
                          height: "32px",
                          alignContent: "center",
                          alignSelf: "center",
                          marginRight: "10px",
                        }}
                      />
                    </div>
                    <h3
                      style={{
                        fontFamily: FONT.INTER,
                        fontWeight: "600",
                        fontSize: 16,
                        lineHeight: "24px",
                        color: "#2D3142",
                      }}
                    >
                      Today Active Employees
                    </h3>
                  </div>

                  <div
                    className="rounded-md p-4 space-y-1"
                    style={{ backgroundColor: "#FAFAFA" }}
                  >
                    <div className="flex justify-between">
                      <span
                        style={{
                          fontFamily: FONT.INTER,
                          fontWeight: "500",
                          fontSize: 14,
                          color: "#2D3142",
                          lineHeight: "20px",
                          marginTop: "5px",
                        }}
                      >
                        ●{" "}
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            fontSize: 14,
                            color: "#2D3142",
                            marginLeft: "5px",
                          }}
                        >
                          Total Active
                        </span>
                      </span>
                      <span className="font-semibold">{totalPresent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        style={{
                          fontFamily: FONT.INTER,
                          fontWeight: "500",
                          fontSize: 14,
                          color: "#2D3142",
                          lineHeight: "24px",
                          marginTop: "5px",
                        }}
                      >
                        ●{" "}
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            fontSize: 14,
                            color: "#2D3142",
                            marginLeft: "5px",
                          }}
                        >
                          Gurgaon Office
                        </span>
                      </span>
                      <span className="font-semibold">
                        {totalPresentGurugram}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        style={{
                          fontFamily: FONT.INTER,
                          fontWeight: "500",
                          fontSize: 14,
                          color: "#2D3142",
                          lineHeight: "24px",
                          marginTop: "5px",
                        }}
                      >
                        ●{" "}
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            fontSize: 14,
                            color: "#2D3142",
                            marginLeft: "5px",
                          }}
                        >
                          Noida Office
                        </span>
                      </span>
                      <span className="font-semibold">{totalPresentNoida}</span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        style={{
                          fontFamily: FONT.INTER,
                          fontWeight: "500",
                          fontSize: 14,
                          color: "#2D3142",
                          lineHeight: "24px",
                          marginTop: "5px",
                        }}
                      >
                        ●{"  "}
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            fontSize: 14,
                            color: "#2D3142",
                            marginLeft: "5px",
                          }}
                        >
                          WFH
                        </span>
                      </span>
                      <span className="font-semibold">{totalWfh}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div
          style={{
            width: "39%",
            height: "100%",
            display: "flex",
            background: COLOR.WHITE,
            borderRadius: "8px",
            borderWidth: 1,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            // border: 1px solid #ddd;
            // border-radius: 8px;
          }}
        >
            <div className="cta">
            <h2
              style={{
                fontFamily: "Inter",
                fontWeight: "600",
                fontSize: 16,
                marginTop: "10px",
                color: COLOR.BLACK,
              }}
            >
              Grow Your Team, Grow Your Success!
            </h2>
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: 14,
                color: COLOR.BLACK1,
              }}
            >
              Easily onboard new talent and keep your workforce thriving. Add
              new employee with just a click.
            </p>
            <button className="ctaButton" onClick={() => setModalOpen(true)}>
              Add Employee
            </button>
          </div>
          <img
            src={ImageUrl.ADDEMPLOYEE}
            style={{
              width: "110px",
              height: "110px",
              alignContent: "center",
              alignSelf: "center",
              marginRight: "16px",
              marginTop:'70px'
            }}
          />
        </div> */}
              <div
                style={{
                  width: "39%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: COLOR.WHITE,
                  borderRadius: "8px",
                  borderWidth: 1,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                    gap: "10px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        fontFamily: "Inter",
                        fontWeight: "600",
                        fontSize: 16,
                        color: COLOR.BLACK,
                        marginBottom: "8px",
                      }}
                    >
                      Grow Your Team, Grow Your Success!
                    </h2>
                    <p
                      style={{
                        fontFamily: "Inter",
                        fontWeight: "500",
                        fontSize: 14,
                        color: COLOR.BLACK1,
                        marginBottom: "16px",
                      }}
                    >
                      Easily onboard new talent and keep your workforce
                      thriving. Add new employee with just a click.
                    </p>
                    <button
                      className="ctaButton"
                      onClick={() => setModalOpen(true)}
                      style={{
                        width: "100%",
                        maxWidth: "150px",
                        marginTop: "30px",
                      }}
                    >
                      Add Employee
                    </button>
                  </div>
                  <img
                    src={ImageUrl.ADDEMPLOYEE}
                    style={{
                      width: "130px",
                      height: "130px",
                      objectFit: "contain",
                      marginTop: "70px",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "272px",
                marginTop: "16px",
                display: "flex",

                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "49%",
                  height: "100%",
                  borderRadius: "8px",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  flexShrink: 0,
                  overflowY: "auto",
                  maxHeight: "270px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div style={{ width: "95%", height: 240 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 48,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex", // Add this
                        gap: "8px",
                        justifyContent: "center", // Center horizontally
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#F8F8F8",
                          borderRadius: "6px",
                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <img
                          src={ImageUrl.CALENDER}
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          // width: "32px",
                          height: "32px",

                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "8px",
                            fontWeight: "600",
                            fontSize: "16px",
                            fontFamily: "Inter",
                            color: COLOR.BLACK2,
                          }}
                        >
                          On Leave/WFH Today
                        </h2>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "42px",
                        height: "28px",
                        background: "#F8F8F8",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 5,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          lineHeight: "20px",
                          fontWeight: "500",
                          fontSize: "14px",
                          fontFamily: "Inter",
                          color: COLOR.BLACK2,
                        }}
                      >
                        {
                          filterAttendance?.filter((attendance) => {
                            return (
                              attendance?.attendance_status == "Leave" ||
                              attendance?.attendance_status == "Half-Day" ||
                              attendance?.work_status == "WFH"
                            );
                          })?.length
                        }
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 1.5,
                      background: "#EDEDED",
                      marginTop: "-5px",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "100%",
                      height: "175px",
                      marginTop: "16px",
                      borderRadius: "4px",
                      background: COLOR.GRAY,
                      overflowY: "auto", // Enables vertical scrolling
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "155px",
                        alignSelf: "center",
                        padding: "10px",
                      }}
                    >
                      {filterAttendance?.filter((attendance) => {
                        return (
                          attendance?.attendance_status == "Leave" ||
                          attendance?.attendance_status == "Half-Day" ||
                          attendance?.work_status == "WFH"
                        );
                      })?.length > 0 ? (
                        filterAttendance?.map((leaveItem, index) => {
                          if (
                            leaveItem?.attendance_status == "Leave" ||
                            leaveItem?.attendance_status == "Half-Day" ||
                            leaveItem?.work_status == "WFH"
                          ) {
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
                                }}
                              >
                                <div style={{ display: "flex" }}>
                                  <span
                                    style={{
                                      color:
                                        leaveItem.attendance_status === "Leave"
                                          ? "#B91C1C"
                                          : leaveItem.attendance_status ===
                                            "Half-Day"
                                          ? "#1E40AF"
                                          : "#9370DB",
                                    }}
                                  >
                                    ●
                                  </span>
                                  <h3
                                    style={{
                                      marginLeft: "10px",
                                      fontWeight: "600",
                                      color: COLOR.BLACK2,
                                      fontSize: "14px",
                                      fontFamily: "Inter",
                                    }}
                                  >
                                    {leaveItem.name}
                                  </h3>
                                </div>

                                <div style={{ display: "flex", gap: "10px" }}>
                                  {/* Attendance Status Display (Leave) */}

                                  {leaveItem.attendance_status === "Leave" && (
                                    <div
                                      style={{
                                        width: "80px",
                                        height: "25px",
                                        color: "#B91C1C",
                                        background: "#FECACA",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "30px",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        paddingTop: 3,
                                      }}
                                    >
                                      <span
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          gap: "5px",
                                          lineHeight: "1",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "#B91C1C",
                                            fontSize: "14px",
                                          }}
                                        >
                                          ●
                                        </span>
                                        {leaveItem.attendance_status}
                                      </span>
                                    </div>
                                  )}
                                  {leaveItem.work_status == "WFH" && (
                                    <div
                                      style={{
                                        width: "80px",
                                        height: "25px",
                                        color: "#115E59",
                                        background: "#F7EEFC",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "30px",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        paddingTop: 3,
                                      }}
                                    >
                                      <span
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          gap: "5px",
                                          color: "#9370DB",
                                          lineHeight: "1",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "#9370DB",
                                            fontSize: "14px",
                                          }}
                                        >
                                          ●
                                        </span>
                                        {leaveItem.work_status}
                                      </span>
                                    </div>
                                  )}
                                  {leaveItem?.attendance_status ==
                                    "Half-Day" && (
                                    <div
                                      style={{
                                        width: "80px",
                                        height: "25px",
                                        color: "#1E40AF",
                                        background: "#b0c3ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "30px",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          gap: "5px",
                                          lineHeight: "1",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "#1E40AF",
                                            fontSize: "14px",
                                          }}
                                        >
                                          ●
                                        </span>
                                        {leaveItem.attendance_status}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        })
                      ) : (
                        <div
                          style={{
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "25px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No one on leave or WFH today.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "49%",
                  height: "100%",
                  borderRadius: "8px",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  flexShrink: 0,
                  overflowY: "auto",
                  maxHeight: "270px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div style={{ width: "95%", height: 240 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 48,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex", // Add this
                        gap: "8px",
                        justifyContent: "center", // Center horizontally
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#F8F8F8",
                          borderRadius: "6px",
                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <img
                          src={ImageUrl.CAKE}
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          // width: "32px",
                          height: "32px",

                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "8px",
                            fontWeight: "600",
                            fontSize: "16px",
                            fontFamily: "Inter",
                            color: COLOR.BLACK2,
                          }}
                        >
                          Birthday’s This Month
                        </h2>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "42px",
                        height: "28px",
                        background: "#F8F8F8",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 5,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          lineHeight: "20px",
                          fontWeight: "500",
                          fontSize: "14px",
                          fontFamily: "Inter",
                          color: COLOR.BLACK2,
                        }}
                      >
                        {reminderData?.current_events?.length > 0 ||
                        reminderData?.upcoming_events?.length > 0
                          ? (() => {
                              // Filter and combine the data
                              const birthdayItems = [
                                ...(reminderData?.current_events || []),
                                ...(reminderData?.upcoming_events || []),
                              ].filter((item) => {
                                if (item.type !== "Birthday") return false;

                                const itemDate = new Date(item.date);
                                const currentMonth = new Date().getMonth();
                                const currentYear = new Date().getFullYear();

                                return (
                                  itemDate.getMonth() === currentMonth &&
                                  itemDate.getFullYear() === currentYear
                                );
                              });

                              return birthdayItems?.length;
                            })()
                          : 0}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 1.5,
                      background: "#EDEDED",
                      marginTop: "-5px",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "100%",
                      height: "175px",
                      marginTop: "16px",
                      borderRadius: "4px",
                      background: COLOR.GRAY,
                      overflowY: "auto", // Enables vertical scrolling
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "155px",
                        alignSelf: "center",
                        padding: "10px",
                      }}
                    >
                      {reminderData?.current_events?.length > 0 ||
                      reminderData?.upcoming_events?.length > 0 ? (
                        (() => {
                          const birthdayItems = [
                            ...(reminderData?.current_events || []),
                            ...(reminderData?.upcoming_events || []),
                          ].filter((item) => {
                            if (item.type !== "Birthday") return false;

                            const itemDate = new Date(item.date);
                            const currentMonth = new Date().getMonth();
                            const currentYear = new Date().getFullYear();

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
                                    <span style={{ color: "#115E59" }}>●</span>
                                    <h3
                                      style={{
                                        marginLeft: "10px",
                                        fontWeight: "600",
                                        color: COLOR.BLACK2,
                                        fontSize: "14px",
                                        fontFamily: "Inter",
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
                                display: "flex", // Add this line
                                flexDirection: "column", // Add this line to stack items vertically
                                color: "#888888",
                                fontWeight: "600",
                                marginTop: "20px",
                                justifyContent: "center",
                                alignItems: "center",
                                // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                              }}
                            >
                              <img
                                src={ImageUrl.NODATA}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                }}
                              />
                              <p
                                style={{
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  fontFamily: "Inter",
                                  color: COLOR.GRAY1,
                                }}
                              >
                                No birthdays this month.
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        <div
                          style={{
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No events data available.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "272px",
                marginTop: "16px",
                display: "flex",

                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "49%",
                  height: "100%",
                  borderRadius: "8px",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  flexShrink: 0,
                  overflowY: "auto",
                  maxHeight: "270px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div style={{ width: "95%", height: 240 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 48,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex", // Add this
                        gap: "8px",
                        justifyContent: "center", // Center horizontally
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#F8F8F8",
                          borderRadius: "6px",
                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <img
                          src={ImageUrl.WATCH}
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          // width: "32px",
                          height: "32px",

                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "8px",
                            fontWeight: "600",
                            fontSize: "16px",
                            fontFamily: "Inter",
                            color: COLOR.BLACK2,
                          }}
                        >
                          Late's Today
                        </h2>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "42px",
                        height: "28px",
                        background: "#F8F8F8",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 5,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          lineHeight: "20px",
                          fontWeight: "500",
                          fontSize: "14px",
                          fontFamily: "Inter",
                          color: COLOR.BLACK2,
                        }}
                      >
                        {
                          filterAttendance?.filter((attendance) => {
                            return attendance?.attendance_status == "Late";
                          })?.length
                        }
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 1.5,
                      background: "#EDEDED",
                      marginTop: "-5px",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "100%",
                      height: "175px",
                      marginTop: "16px",
                      borderRadius: "4px",
                      background: COLOR.GRAY,
                      overflowY: "auto", // Enables vertical scrolling
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "155px",
                        alignSelf: "center",
                        padding: "10px",
                      }}
                    >
                      {Array.isArray(filterAttendance) &&
                      filterAttendance.length > 0 &&
                      filterAttendance.some(
                        (attendance) => attendance?.attendance_status === "Late"
                      ) ? (
                        filterAttendance
                          .filter(
                            (attendance) =>
                              attendance?.attendance_status === "Late"
                          )
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
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <span style={{ color: "#FFCC00" }}>●</span>
                                <h3
                                  style={{
                                    marginLeft: "10px",
                                    fontWeight: "600",
                                    color: COLOR.BLACK2,
                                    fontSize: "14px",
                                    fontFamily: "Inter",
                                  }}
                                >
                                  {leaveItem.name}
                                </h3>
                              </div>

                              <div style={{ display: "flex", gap: "10px" }}>
                                {leaveItem.attendance_status === "Late" && (
                                  <div
                                    style={{
                                      // background: "#FECACA",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "80px",
                                      height: "25px",
                                      borderRadius: "30px",
                                      fontWeight: "600",
                                      fontSize: "14px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "50px",
                                        lineHeight: "1",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "#2D3142",
                                          fontSize: "14px",
                                          fontWeight: "500",
                                        }}
                                      ></span>

                                      {leaveItem?.login_time}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <div
                          style={{
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "25px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No late attendance records found
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "49%",
                  height: "100%",
                  borderRadius: "8px",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  flexShrink: 0,
                  overflowY: "auto",
                  maxHeight: "270px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div style={{ width: "95%", height: 240 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 48,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex", // Add this
                        gap: "8px",
                        justifyContent: "center", // Center horizontally
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#F8F8F8",
                          borderRadius: "6px",
                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <img
                          src={ImageUrl.MILESTONE}
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          // width: "32px",
                          height: "32px",

                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "8px",
                            fontWeight: "600",
                            fontSize: "16px",
                            fontFamily: "Inter",
                            color: COLOR.BLACK2,
                          }}
                        >
                          Milestone's This Month
                        </h2>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "42px",
                        height: "28px",
                        background: "#F8F8F8",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 5,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          lineHeight: "20px",
                          fontWeight: "500",
                          fontSize: "14px",
                          fontFamily: "Inter",
                          color: COLOR.BLACK2,
                        }}
                      >
                        {reminderData?.current_events?.length > 0 ||
                        reminderData?.upcoming_events?.length > 0
                          ? (() => {
                              // Filter and combine the data
                              const birthdayItems = [
                                ...(reminderData?.current_events || []),
                                ...(reminderData?.upcoming_events || []),
                              ].filter((item) => {
                                if (item.type !== "Anniversary") return false;

                                const itemDate = new Date(item.date);
                                const currentMonth = new Date().getMonth();
                                const currentYear = new Date().getFullYear();

                                return (
                                  itemDate.getMonth() === currentMonth &&
                                  itemDate.getFullYear() === currentYear
                                );
                              });

                              return birthdayItems?.length;
                            })()
                          : 0}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 1.5,
                      background: "#EDEDED",
                      marginTop: "-5px",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "100%",
                      height: "175px",
                      marginTop: "16px",
                      borderRadius: "4px",
                      background: COLOR.GRAY,
                      overflowY: "auto", // Enables vertical scrolling
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "155px",
                        alignSelf: "center",
                        padding: "10px",
                      }}
                    >
                      {reminderData?.current_events?.length > 0 ||
                      reminderData?.upcoming_events?.length > 0 ? (
                        (() => {
                          const birthdayItems = [
                            ...(reminderData?.current_events || []),

                            ...(reminderData?.upcoming_events || []),
                          ].filter((item) => {
                            if (item.type != "Anniversary") return false;

                            const itemDate = new Date(item.date);
                            const currentMonth = new Date().getMonth();
                            const currentYear = new Date().getFullYear();

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
                                    <div style={{ display: "flex" }}>
                                      <span style={{ color: "#115E59" }}>
                                        ●
                                      </span>
                                      <h3
                                        style={{
                                          fontWeight: "600",
                                          color: COLOR.BLACK2,
                                          fontSize: "14px",
                                          fontFamily: "Inter",
                                          marginLeft: 10,
                                        }}
                                      >
                                        {birthdayItem?.name}({birthdayItem.type}
                                        )
                                      </h3>
                                    </div>
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
                                display: "flex", // Add this line
                                flexDirection: "column", // Add this line to stack items vertically
                                color: "#888888",
                                fontWeight: "600",
                                marginTop: "25px",
                                justifyContent: "center",
                                alignItems: "center",
                                // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                              }}
                            >
                              <img
                                src={ImageUrl.NODATA}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                }}
                              />
                              <p
                                style={{
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  fontFamily: "Inter",
                                  color: COLOR.GRAY1,
                                }}
                              >
                                No events this month
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        <div
                          style={{
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "25px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No events this month
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "272px",
                marginTop: "16px",
                display: "flex",

                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "49%",
                  height: "100%",
                  borderRadius: "8px",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  flexShrink: 0,
                  overflowY: "auto",
                  maxHeight: "270px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div style={{ width: "95%", height: 240 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 48,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex", // Add this
                        gap: "8px",
                        justifyContent: "center", // Center horizontally
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#F8F8F8",
                          borderRadius: "6px",
                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <img
                          src={ImageUrl.LATE}
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          // width: "32px",
                          height: "32px",

                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "8px",
                            fontWeight: "600",
                            fontSize: "16px",
                            fontFamily: "Inter",
                            color: COLOR.BLACK2,
                          }}
                        >
                          Most Lates This Month
                        </h2>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "42px",
                        height: "28px",
                        background: "#F8F8F8",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 5,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          lineHeight: "20px",
                          fontWeight: "500",
                          fontSize: "14px",
                          fontFamily: "Inter",
                          color: COLOR.BLACK2,
                        }}
                      >
                        {groupedLateArray?.length}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 1.5,
                      background: "#EDEDED",
                      marginTop: "-5px",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "100%",
                      height: "175px",
                      marginTop: "16px",
                      borderRadius: "4px",
                      background: COLOR.GRAY,
                      overflowY: "auto", // Enables vertical scrolling
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "155px",
                        alignSelf: "center",
                        padding: "10px",
                      }}
                    >
                      {Array.isArray(groupedLateArray) &&
                      groupedLateArray.length > 0 ? (
                        groupedLateArray.map((person, index) => (
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
                            <div style={{ display: "flex" }}>
                              <span style={{ color: "#FFCC00" }}>●</span>
                              <h3
                                style={{
                                  marginLeft: "10px",
                                  fontWeight: "600",
                                  color: COLOR.BLACK2,
                                  fontSize: "14px",
                                  fontFamily: "Inter",
                                }}
                              >
                                {person?.name}
                              </h3>
                            </div>
                            <span
                              style={{
                                fontWeight: "600",
                                color: COLOR.BLACK2,
                                fontSize: "14px",
                                fontFamily: "Inter",
                              }}
                            >
                              {person?.count}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No late records found
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "49%",
                  height: "100%",
                  borderRadius: "8px",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  flexShrink: 0,
                  overflowY: "auto",
                  maxHeight: "270px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div style={{ width: "95%", height: 240 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 48,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex", // Add this
                        gap: "8px",
                        justifyContent: "center", // Center horizontally
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "#F8F8F8",
                          borderRadius: "6px",
                          display: "flex", // Add this
                          alignItems: "center", // Center vertically
                          justifyContent: "center", // Center horizontally
                        }}
                      >
                        <img
                          src={ImageUrl.CALENDER1}
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "8px",
                            fontWeight: "600",
                            fontSize: "16px",
                            fontFamily: "Inter",
                            color: COLOR.BLACK2,
                          }}
                        >
                          Holiday's This Month
                        </h2>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "42px",
                        height: "28px",
                        background: "#F8F8F8",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 5,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          lineHeight: "20px",
                          fontWeight: "500",
                          fontSize: "14px",
                          fontFamily: "Inter",
                          color: COLOR.BLACK2,
                        }}
                      >
                        {Array.isArray(getEmployeeHoliday)
                          ? getEmployeeHoliday.filter((item) => {
                              const holidayDate = new Date(item.date);
                              const currentMonth = new Date().getMonth();
                              const currentYear = new Date().getFullYear();
                              return (
                                holidayDate.getMonth() === currentMonth &&
                                holidayDate.getFullYear() === currentYear
                              );
                            }).length
                          : 0}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 1.5,
                      background: "#EDEDED",
                      marginTop: "-5px",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "100%",
                      height: "175px",
                      marginTop: "16px",
                      borderRadius: "4px",
                      background: COLOR.GRAY,
                      overflowY: "auto",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "155px",
                        alignSelf: "center",
                        padding: "10px",
                      }}
                    >
                      {getEmployeeHoliday && getEmployeeHoliday?.length > 0 ? (
                        (() => {
                          const currentMonth = new Date().getMonth();
                          const currentYear = new Date().getFullYear();

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
                                    <div style={{ display: "flex" }}>
                                      <span style={{ color: "#FEAABC" }}>
                                        ●
                                      </span>
                                      <h3
                                        style={{
                                          marginLeft: "10px",
                                          fontWeight: "600",
                                          color: COLOR.BLACK2,
                                          fontSize: "14px",
                                          fontFamily: "Inter",
                                        }}
                                      >
                                        {holidayItem?.holiday_name}
                                      </h3>
                                    </div>
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
                                display: "flex", // Add this line
                                flexDirection: "column", // Add this line to stack items vertically
                                color: "#888888",
                                fontWeight: "600",
                                marginTop: "20px",
                                justifyContent: "center",
                                alignItems: "center",
                                // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                              }}
                            >
                              <img
                                src={ImageUrl.NODATA}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                }}
                              />
                              <p
                                style={{
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  fontFamily: "Inter",
                                  color: COLOR.GRAY1,
                                }}
                              >
                                No holiday this month.
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        <div
                          style={{
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No holiday this month.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <EmployeeLeaveTable />
            </div>

            <AddEmployeeModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
            />
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
        </div>
      </div>
    </MainLayout>
  );
};

export default NewDashBoard;
