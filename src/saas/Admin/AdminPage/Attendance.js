import React, { useEffect, useState } from "react";
import "./Attendance.css";
import { useDispatch, useSelector } from "react-redux";
import { MdLaptopChromebook, MdOutlineMailOutline } from "react-icons/md";
import { TbRefresh } from "react-icons/tb";

import { BiBuildings } from "react-icons/bi";
import { TfiLocationPin } from "react-icons/tfi";
import { LuPhone } from "react-icons/lu";
import { FaHospitalUser } from "react-icons/fa";
import { FaEdit, FaSearch, FaUser } from "react-icons/fa";
import { Api, BaseUrl, ImagePath, ImagePath1 } from "../../Config/Api";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  setAllUserAttendance,
  setEmployeeindex,
  setSwitchOnOff,
} from "../../Redux/Action";
import EditEmployeeAttendance from "../AdminComponent/EditEmployeeAttendance";
import { CSVLink } from "react-csv";
import NoImage from "../../Assets/imageno.png";
import { Dialog, DialogContent } from "@material-ui/core";
import { useRef } from "react";
import MonthlyAttendance from "../AdminComponent/MonthlyAttendance";
import PullToRefresh from "react-simple-pull-to-refresh";
import WHFComponnent from "../AdminComponent/WHFComponnent";
const commonTextStyle = {
  fontWeight: "500",
  fontSize: "13px",
  textAlign: "center",
  // marginLeft: 10,
  marginTop: 5,
  color: "#155596",
};
const Attendance = () => {
  const dispatch = useDispatch();
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const getEmployeeindex = useSelector((state) => state.getEmployeeindex);

  const [whfmodal, setWhfModal] = useState(false);
  const getAllUserAttendance = useSelector(
    (state) => state.getAllUserAttendance
  );
  const getSwitchOnOff = useSelector((state) => state.getSwitchOnOff);

  const [filterallAttendanceData, setAllAttendanceData] = useState([]);
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [filteremployeeAttendance, setFilterEmployeeAttendance] = useState([]);
  const [employee, setEmployee] = useState();
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [test, setTest] = useState(false);
  const [test1, setTest1] = useState([]);
  const [filteredCategories, setFilteredCategories] =
    useState(getEmployeeDetails);

  const token = sessionStorage.getItem("authToken");
const setLoading = () => { };
  const logout = () => { };
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [selectedText, setSelectedText] = useState("Current");
  const [countData, setcountData] = useState({
    leave: 0,
    onTime: 0,
    halfDay: 0,
    late: 0,
  });
  const handleRefresh = async () => {
    await getAllUserAttendanceData();
  };
  useEffect(() => {
    // getAllUserAttendanceData();
    if (getEmployeeDetails?.length > 0) {
      getEmployeeAttendance(getEmployeeindex);
    }
  }, [editmodalOpen]);
  const getEmployeeAttendance = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_USER_ATTENDANCE}?employee_id=${getEmployeeDetails[data]?.id}`,
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
       
          setEmployeeAttendance(responseData?.data?.data);
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

  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };
  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getEmployeeDetails.filter((item) => {
      return (
        item?.name.toLowerCase().includes(lowerCaseQuery) ||
        item?.employee_code.toLowerCase().includes(lowerCaseQuery) ||
        item?.email.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredCategories(filteredItems);
  };
  const handleRowClick = (employeeId) => {
    const index = getEmployeeDetails.findIndex((emp) => emp?.id === employeeId);

    dispatch(setEmployeeindex(index));

    getEmployeeAttendance(index);
  };
  const editEmployeeDetails = (empData) => {
    setEmployee(empData);
    setEditModalOpen(true);
  };

  const getRowStyle = (data) => {
    const LATE_THRESHOLD = "09:15:59";
    const { login_time, attendance_status } = data;

    let style = {};

    if (attendance_status === "Leave") {
      style = {
        width: 10,
        height: 50,
        background: "#DE232A",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "Half-Day") {
      style = {
        width: 10,
        height: 50,
        background: "#1E40AF",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "Week Off") {
      style = {
        width: 10,
        height: 50,
        background: "#8CC4FF",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "Late") {
      style = {
        width: 10,
        height: 50,
        background: "#FFCC00",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "On Time") {
      style = {
        width: 10,
        height: 50,
        background: "#009A20",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else {
      style = {
        width: 10,
        height: 50,
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    }

    return style;
  };
  const getCountAttendanceDarta = (data) => {
    const LATE_THRESHOLD = "09:15:59";
    let leaveCount = 0;
    let halfDayCount = 0;
    let lateCount = 0;
    let onTimeCount = 0;

    data?.forEach((item) => {
      if (item?.attendance_status === "Leave") {
        leaveCount += 1;
      } else if (item?.attendance_status === "Half-Day") {
        halfDayCount += 1;
      } else if (item?.attendance_status === "Late") {
        lateCount += 1;
      } else if (item?.attendance_status === "On Time") {
        onTimeCount += 1;
      }
    });
    setcountData({
      leave: leaveCount,
      onTime: onTimeCount,
      halfDay: halfDayCount,
      late: lateCount,
    });
  };
  const currentYear = new Date().getFullYear();

  const currentMonthIndex = new Date().getMonth();
  const currentDay = new Date().getDate();
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

  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const formatDate = (day, monthIndex, year) => {
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(monthIndex + 1).padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  const currentFormattedDate = formatDate(
    currentDay,
    currentMonthIndex,
    currentYear
  );

  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: months[currentMonthIndex],

    leaveDate: currentFormattedDate,
    leaveDates: [],
    statusType: "ALL Data",
  });
  const updateDatesForMonth = (selectedMonth) => {
    const selectedMonthIndex = months.indexOf(selectedMonth);
    const daysInSelectedMonth = Array.from(
      { length: getDaysInMonth(currentYear, selectedMonthIndex) },
      (_, i) => formatDate(i + 1, selectedMonthIndex, currentYear)
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      leaveMonth: selectedMonth,
      leaveDates: daysInSelectedMonth,
    }));

    setTest1(daysInSelectedMonth);
  };

  useEffect(() => {
    const monthIndex = months.indexOf(formData.leaveMonth);
    const year = parseInt(formData.leaveYear, 10);

    const daysInMonth = getDaysInMonth(year, monthIndex);
    const newLeaveDates = Array.from({ length: daysInMonth }, (_, i) =>
      formatDate(i + 1, monthIndex, year)
    );

    setFormData((prevData) => ({
      ...prevData,
      leaveDates: newLeaveDates,
      leaveDate:
        newLeaveDates.find((date) => date === currentFormattedDate) ||
        newLeaveDates[0],
    }));
  }, [formData.leaveMonth, formData.leaveYear]);
  const handleYearChange = (e) => {
    setFormData({ ...formData, leaveYear: e.target.value });
  };
  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    updateDatesForMonth(selectedMonth);
  };
  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      leaveDate: e.target.value,
    });
  };
  const handalEmployeeStatus = (e) => {
    setFormData({ ...formData, statusType: e.target.value });
  };
  useEffect(() => {
    updateDatesForMonth(formData.leaveMonth);
  }, []);
  // useEffect(() => {
  //   const filterAttendanceData = () => {
  //     if (formData.statusType === "ALL Data") {
  //       if (getSwitchOnOff == true) {
  //         const allData1 = getAllUserAttendance?.filter((leave) => {
  //           return leave?.attendance_status != "Week Off";
  //         });

  //         const allData = allData1?.filter((leave) => {
  //           return (
  //             leave.year === formData.leaveYear &&
  //             leave.month === formData.leaveMonth &&
  //             leave.date === formData.leaveDate
  //           );
  //         });
  //         setAllAttendanceData(allData);
  //         getCountAttendanceDarta(allData);
  //       } else {
  //         const allData = getAllUserAttendance?.filter((leave) => {
  //           return (
  //             leave.year === formData.leaveYear &&
  //             leave.month === formData.leaveMonth &&
  //             leave.date === formData.leaveDate
  //           );
  //         });
  //         setAllAttendanceData(allData);
  //         getCountAttendanceDarta(allData);
  //       }
  //     } else {
  //       if (getSwitchOnOff == true) {
  //         const allData1 = getAllUserAttendance?.filter((leave) => {
  //           return leave?.attendance_status != "Week Off";
  //         });

  //         const filteredData1 = allData1?.filter((leave) => {
  //           return (
  //             (leave.year === formData.leaveYear &&
  //               leave.month === formData.leaveMonth &&
  //               leave.date === formData.leaveDate &&
  //               leave.attendance_status === formData.statusType) ||
  //             leave.work_status === formData.statusType
  //           );
  //         });
  //         setAllAttendanceData(filteredData1);
  //         getCountAttendanceDarta(filteredData1);
  //       } else {
  //         const filteredData1 = getAllUserAttendance?.filter((leave) => {
  //           return (
  //             (leave.year === formData.leaveYear &&
  //               leave.month === formData.leaveMonth &&
  //               leave.date === formData.leaveDate &&
  //               leave.attendance_status === formData.statusType) ||
  //             leave.work_status === formData.statusType
  //           );
  //         });
  //         setAllAttendanceData(filteredData1);
  //         getCountAttendanceDarta(filteredData1);
  //       }
  //     }
  //   };
  //   const filterEmpAttendance = () => {
  //     if (getSwitchOnOff == true) {
  //       const allData1 = employeeAttendance?.filter((leave) => {
  //         return leave?.attendance_status != "Week Off";
  //       });
  //       if (formData.statusType === "ALL Data") {
  //         const allData = allData1?.filter((leave) => {
  //           return (
  //             leave.year === formData.leaveYear &&
  //             leave.month === formData.leaveMonth
  //           );
  //         });

  //         setFilterEmployeeAttendance(allData);
  //         getCountAttendanceDarta(allData);
  //       } else {
  //         const filteredData1 = allData1?.filter((leave) => {
  //           return (
  //             (leave.year === formData.leaveYear &&
  //               leave.month === formData.leaveMonth &&
  //               leave.attendance_status === formData.statusType) ||
  //             leave.work_status === formData.statusType
  //           );
  //         });
  //         setFilterEmployeeAttendance(filteredData1);
  //         getCountAttendanceDarta(filteredData1);
  //       }
  //       // setFilterEmployeeAttendance(allData);
  //       // getCountAttendanceDarta(allData);
  //     } else {
  //       if (formData.statusType === "ALL Data") {
  //         const allData = employeeAttendance?.filter((leave) => {
  //           return (
  //             leave.year === formData.leaveYear &&
  //             leave.month === formData.leaveMonth
  //           );
  //         });

  //         setFilterEmployeeAttendance(allData);
  //         getCountAttendanceDarta(allData);
  //       } else {
  //         const filteredData1 = employeeAttendance?.filter((leave) => {
  //           return (
  //             (leave.year === formData.leaveYear &&
  //               leave.month === formData.leaveMonth &&
  //               leave.attendance_status === formData.statusType) ||
  //             leave.work_status === formData.statusType
  //           );
  //         });
  //         setFilterEmployeeAttendance(filteredData1);
  //         getCountAttendanceDarta(filteredData1);
  //       }
  //     }
  //   };

  //   selectedText == "Current" ? filterAttendanceData() : filterEmpAttendance();
  // }, [
  //   formData.leaveYear,
  //   formData.leaveMonth,
  //   formData.leaveDate,
  //   formData.statusType,
  //   getAllUserAttendance,
  //   employeeAttendance,
  //   selectedText,
  //   getSwitchOnOff,
  // ]);

  useEffect(() => {
    const filterAttendanceData = () => {
      if (formData.statusType === "ALL Data") {
        const filteredData = getAllUserAttendance?.filter((leave) => {
          const isDateMatch =
            leave.year === formData.leaveYear &&
            leave.month === formData.leaveMonth &&
            leave.date === formData.leaveDate;

          if (getSwitchOnOff) {
            return isDateMatch && leave.attendance_status !== "Week Off";
          }
          return isDateMatch;
        });
        setAllAttendanceData(filteredData);
        getCountAttendanceDarta(filteredData);
      } else {
        const filteredData = getAllUserAttendance?.filter((leave) => {
          const isDateMatch =
            leave.year === formData.leaveYear &&
            leave.month === formData.leaveMonth &&
            leave.date === formData.leaveDate;

          if (getSwitchOnOff) {
            return (
              isDateMatch &&
              leave.attendance_status !== "Week Off" &&
              (leave.attendance_status === formData.statusType ||
                leave.work_status === formData.statusType)
            );
          }
          return (
            isDateMatch &&
            (leave.attendance_status === formData.statusType ||
              leave.work_status === formData.statusType)
          );
        });

        setAllAttendanceData(filteredData);
        getCountAttendanceDarta(filteredData);
      }
    };

    const filterEmpAttendance = () => {
      const filteredData = employeeAttendance?.filter((leave) => {
        const isDateMatch =
          leave.year === formData.leaveYear &&
          leave.month === formData.leaveMonth;

        if (formData.statusType === "ALL Data") {
          if (getSwitchOnOff) {
            return isDateMatch && leave.attendance_status !== "Week Off";
          }
          return isDateMatch;
        } else {
          if (getSwitchOnOff) {
            return (
              isDateMatch &&
              leave.attendance_status !== "Week Off" &&
              (leave.attendance_status === formData.statusType ||
                leave.work_status === formData.statusType)
            );
          }
          return (
            isDateMatch &&
            (leave.attendance_status === formData.statusType ||
              leave.work_status === formData.statusType)
          );
        }
      });
    
      setFilterEmployeeAttendance(filteredData);
      getCountAttendanceDarta(filteredData);
    };

    selectedText === "Current" ? filterAttendanceData() : filterEmpAttendance();
  }, [
    formData.leaveYear,
    formData.leaveMonth,
    formData.leaveDate,
    formData.statusType,
    getAllUserAttendance,
    employeeAttendance,
    selectedText,
    getSwitchOnOff,
  ]);

  const getTotalLate = (data) => {
    const LATE_THRESHOLD = "09:15";
    const totalLate = data.filter(
      (entry) => entry.attendance_status == "Late"
    ).length;
    return totalLate;
  };
  const getPresent = (data) => {
    const totalPresent = data.reduce((total, entry) => {
      if (
        entry.attendance_status === "On Time" ||
        entry.attendance_status == "Late"
      ) {
        return total + 1;
      } else if (entry.attendance_status === "Half-Day") {
        return total + 0.5;
      }
      return total;
    }, 0);
    return totalPresent;
  };

  const getLeavs = (data) => {
    const totalLeaves = data.reduce((total, entry) => {
      if (entry.attendance_status === "Leave") {
        return total + 1;
      } else if (entry.attendance_status === "Half-Day") {
        return total + 0.5;
      }
      return total;
    }, 0);
    return totalLeaves;
  };
  const downloadCsvData = filteremployeeAttendance.map((employee) => ({
    Name: employee.name,
    Day: employee.day,
    Date: employee.date,
    Month: employee.month,
    Year: employee.year,
    LoginTime: employee.login_time,
    LogoutTime: employee.logout_time,
  }));
  const handleClearFilter = () => {
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: months[currentMonthIndex], // Reset to current month
      leaveDate: currentFormattedDate, // Reset to current date
      leaveDates: test1,
      statusType: "ALL Data",
    });
  };
  const handleClearFilter1 = () => {
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: months[currentMonthIndex], // Reset to current month
      leaveDate: currentFormattedDate, // Reset to current date
      leaveDates: test1,
      statusType: "ALL Data",
    });
    setTest(true);
  };

  const handleClickOpen = (image) => {
    setSelectedImage(image || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  const changeText = (text) => {
    setSelectedText(text);
  };
  const toggleSwitch = () => {
    dispatch(setSwitchOnOff(!getSwitchOnOff));
  };
  const generateYears = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };
  return (
    <div className="mainDivleave">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontWeight: "700",
            fontSize: 20,
            color: "black",
            marginTop:'15px',
            marginBottom:'15px',
            textAlign: "left",
          }}
        >
          Attendance Sheet
        </h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TbRefresh size={18} />
          <p style={{ marginLeft: 10, marginRight: 10 }}>
            Pull to refresh the page for new data
          </p>
        </div>
      </div>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          marginTop: 20,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2
            style={{
              borderBottom:
                selectedText === "Current" ? "2px solid #047EFF" : "none",
              paddingBottom: 8,
              fontWeight: selectedText === "Current" ? "700" : "500",
              cursor: "pointer",
              color: selectedText === "Current" ? "#047EFF" : "#343741",
            }}
            onClick={() => changeText("Current")}
          >
            Current Day Attendance
          </h2>
          <h2
            style={{
              marginLeft: 20,
              borderBottom:
                selectedText === "Single" ? "2px solid #047EFF" : "none",
              paddingBottom: 8,
              fontWeight: selectedText === "Single" ? "700" : "500",
              cursor: "pointer",
              color: selectedText === "Single" ? "#047EFF" : "#343741",
            }}
            onClick={() => changeText("Single")}
          >
            Single Employee
          </h2>
          <h2
            style={{
              marginLeft: 20,
              borderBottom:
                selectedText === "Monthly" ? "2px solid #047EFF" : "none",
              paddingBottom: 8,
              fontWeight: selectedText === "Monthly" ? "700" : "500",
              cursor: "pointer",
              color: selectedText === "Monthly" ? "#047EFF" : "#343741",
            }}
            onClick={() => changeText("Monthly")}
          >
            Monthly History
          </h2>
        </div>

        <div
          className="switch-container"
          style={{ display: "flex", alignItems: "center", marginRight: 20 }}
        >
          <label className="switch">
            <input
              type="checkbox"
              checked={getSwitchOnOff}
              onChange={toggleSwitch}
            />
            <span className="slider"></span>
          </label>
          <p style={{ marginLeft: 10 }}>
            {getSwitchOnOff ? "Week On" : "Week Off"}
          </p>
        </div>
      </div>

      {selectedText === "Single" ? (
        <div className="mainDiv2">
          <div className="detailContainer">
            <div
              style={{
                width: "100%",
                padding: 5,
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                borderWidth: 1,
              }}
            >
              <div style={{ width: "93%", flex: 1 }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 15,

                    flexWrap: "wrap",
                  }}
                >
                  <h1
                    style={{
                      color: "#155596",
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    {getEmployeeDetails[getEmployeeindex]?.name}
                  </h1>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 10, // Added gap for spacing
                    paddingLeft: 15,
                    paddingTop: 10,
                  }}
                >
                  <FaHospitalUser color="#155596" size={15} />
                  <h3 style={commonTextStyle}>
                    {getEmployeeDetails[getEmployeeindex]?.employee_code}
                  </h3>
                  <MdLaptopChromebook color="#155596" size={15} />
                  <h3 style={commonTextStyle}>
                    {getEmployeeDetails[getEmployeeindex]?.designation}
                  </h3>
                  <BiBuildings color="#155596" size={15} />
                  <h3 style={commonTextStyle}>
                    {getEmployeeDetails[getEmployeeindex]?.department}
                  </h3>
                  <TfiLocationPin color="#155596" size={15} />
                  <h3 style={commonTextStyle}>
                    {getEmployeeDetails[getEmployeeindex]?.location}
                  </h3>
                  <LuPhone color="#155596" size={15} />
                  <h3 style={commonTextStyle}>
                    {getEmployeeDetails[getEmployeeindex]?.mobile}
                  </h3>
                  <MdOutlineMailOutline color="#155596" size={15} />
                  <h3 style={commonTextStyle}>
                    {getEmployeeDetails[getEmployeeindex]?.email}
                  </h3>
                </div>
              </div>

              <div
                style={{
                  width: "90px",
                  height: "90px",
                  marginLeft: 10,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {getEmployeeDetails[getEmployeeindex]?.image == null ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      backgroundColor: "#155596", // Added background for initials
                    }}
                  >
                    <h1
                      style={{
                        fontSize: 20,
                        fontFamily: "cursive",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {getEmployeeDetails[getEmployeeindex]?.name
                        .charAt(0)
                        .toUpperCase()}
                    </h1>
                  </div>
                ) : (
                  <img
                    src={
                      ImagePath + getEmployeeDetails[getEmployeeindex]?.image
                    }
                    alt="profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            </div>

            <div
              style={{
                width: "100%",
                marginTop: 20,
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",

                // alignItems: "center",
              }}
            >
              {/* Annual Leaves */}
              <div
                style={{
                  flex: "1 1 calc(20% - 15px)",
                  maxWidth: "180px",
                  minWidth: "180px",
                  height: "100px",
                  border: "1px solid #f7f360",
                  background: "#f4f3c8",
                  display: "flex",
                  alignItems: "center",

                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    width: "15px",
                    height: "100%",
                    background: "#f7f360",
                  }}
                ></div>
                <div
                  style={{
                    flex: 1,
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#2f669e",
                      margin: 0,
                    }}
                  >
                    Total Late
                  </h1>
                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#2f669e",
                    }}
                  >
                    {getTotalLate(filteremployeeAttendance)}
                  </h1>
                </div>
              </div>

              {/* Leave Collected */}
              <div
                style={{
                  flex: "1 1 calc(20% - 15px)",
                  maxWidth: "180px",
                  minWidth: "180px",
                  height: "100px",

                  border: "1px solid #0f8e4d",
                  display: "flex",
                  alignItems: "center",
                  background: "#cdf2df",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    width: "15px",
                    height: "100%",
                    background: "#32b472",
                  }}
                ></div>
                <div
                  style={{
                    flex: 1,
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#2f669e",
                      margin: 0, // Removes extra space
                      lineHeight: "1.2", // Adjust line height to control spacing
                    }}
                  >
                    Present Days
                  </h1>

                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#32b472",
                    }}
                  >
                    {getPresent(filteremployeeAttendance)}
                  </h1>
                </div>
              </div>

              {/* Paid Leaves */}
              <div
                style={{
                  flex: "1 1 calc(20% - 15px)",
                  maxWidth: "180px",
                  minWidth: "180px",
                  height: "100px",
                  background: "#ec9aa3 ",
                  borderColor: "red",

                  display: "flex",
                  alignItems: "center",
                  border: "1px solid red",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    width: "15px",
                    height: "100%",
                    background: "red",
                  }}
                ></div>
                <div
                  style={{
                    flex: 1,
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#000",
                      margin: 0,
                    }}
                  >
                    Total Leaves
                  </h1>
                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#000",
                    }}
                  >
                    {getLeavs(filteremployeeAttendance)}
                  </h1>
                </div>
              </div>
              <div
                style={{
                  flex: "1 1 calc(20% - 15px)",
                  maxWidth: "250px",
                  minWidth: "150px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => {
                    setWhfModal(true);
                  }}
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    color: "#fff",
                    background: "#007bff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "150px",
                  }}
                >
                  Apply WFH
                </button>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: 50,

                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            ></div>
            <div style={{ width: "100%", marginTop: -30 }}>
              <div
                style={{
                  marginBottom: 20,
                  alignItems: "center",
                  flexDirection: "row",
                  display: "flex",
                }}
              >
                <h1
                  style={{ color: "#155596", fontWeight: "700", fontSize: 20 }}
                >
                  Attendance History
                </h1>
                {/* <div className="form-group3">
                  <h3>Current Year: {formData.leaveYear}</h3>
                </div> */}
                <div className="form-group3">
                  <label htmlFor="leaveYear">Current Year: </label>

                  <select
                    name="experience"
                    id="experience"
                    value={formData.leaveYear}
                    onChange={handleYearChange}
                    required
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group3">
                  <label htmlFor="leaveMonth">Month: </label>

                  <select
                    name="leaveMonth"
                    id="leaveMonth"
                    value={formData.leaveMonth}
                    onChange={handleMonthChange}
                  >
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group3">
                  <label htmlFor="statusType">Status: </label>

                  <select
                    name="statusType"
                    id="statusType"
                    value={formData.statusType}
                    onChange={handalEmployeeStatus}
                  >
                    <option value="ALL Data">All Data</option>
                    <option value="On Time">On Time</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                    <option value="Half-Day">Half-Day</option>
                    <option value="WFH">WFH</option>
                  </select>
                </div>
                <div className="form-group32">
                  <button
                    type="button"
                    className="clear-filter-button"
                    onClick={handleClearFilter} // Add your clear filter function here
                  >
                    Clear Filter
                  </button>
                </div>
              </div>

              <div
                style={{
                  marginBottom: 20,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexDirection: "row",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: -5,
                  }}
                >
                  <div
                    style={{
                      background: "#009A20",
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      alignSelf: "center",
                      marginLeft: 10,
                    }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 5,
                      borderBottom: "2px solid #047EFF",
                      paddingBottom: -10,
                      lineHeight: "1",
                    }}
                  >
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      On Time{" "}
                    </h3>
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: "0 0 0 5px",
                      }}
                    >
                      ({countData?.onTime})
                    </h3>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: -5,
                    marginLeft: 10,
                  }}
                >
                  <div
                    style={{
                      background: "#1E40AF",
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      alignSelf: "center",
                      marginLeft: 10,
                    }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 5,
                      borderBottom: "2px solid #047EFF",
                      paddingBottom: -10,
                      lineHeight: "1",
                    }}
                  >
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      Half Day{" "}
                    </h3>
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: "0 0 0 5px",
                      }}
                    >
                      ({countData?.halfDay})
                    </h3>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: -5,
                    marginLeft: 10,
                  }}
                >
                  <div
                    style={{
                      background: "#FFCC00",
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      alignSelf: "center",
                      marginLeft: 10,
                    }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 5,
                      borderBottom: "2px solid #047EFF",
                      paddingBottom: -10,
                      lineHeight: "1",
                    }}
                  >
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      Late{" "}
                    </h3>
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: "0 0 0 5px",
                      }}
                    >
                      ({countData?.late})
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: -5,
                    marginLeft: 10,
                  }}
                >
                  <div
                    style={{
                      background: "#DE232A",
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      alignSelf: "center",
                      marginLeft: 10,
                    }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 5,
                      borderBottom: "2px solid #047EFF",
                      paddingBottom: -10,
                      lineHeight: "1",
                    }}
                  >
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      Leave{" "}
                    </h3>
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: "0 0 0 5px",
                      }}
                    >
                      ({countData?.leave})
                    </h3>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: -5,
                    marginLeft: 10,
                  }}
                >
                  <div
                    style={{
                      background: "#8CC4FF",
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      alignSelf: "center",
                      marginLeft: 10,
                    }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 5,
                      borderBottom: "2px solid #047EFF",
                      paddingBottom: -10,
                      lineHeight: "1",
                    }}
                  >
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      Week Off{" "}
                    </h3>
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: "0 0 0 5px",
                      }}
                    ></h3>
                  </div>
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: -5,
                    marginLeft: 10,
                  }}
                >
                  <div
                    style={{
                      background: "#9370DB",
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      alignSelf: "center",
                      marginLeft: 10,
                    }}
                  ></div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 5,
                      borderBottom: "2px solid #047EFF",
                      paddingBottom: -10,
                      lineHeight: "1",
                    }}
                  >
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      WFM{" "}
                    </h3>
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: "0 0 0 5px",
                      }}
                    ></h3>
                  </div>
                </div> */}
                <CSVLink
                  className="downloadbtn"
                  filename={`${
                    getEmployeeDetails[getEmployeeindex]?.name
                  }${" "}${formData.leaveMonth}${" "}${formData.leaveYear}.csv`}
                  data={downloadCsvData}
                >
                  Export to CSV
                </CSVLink>
              </div>

              <table className="employee-table15">
                <thead>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>S.N</th>
                    <th>Reporting Manager</th>
                    <th>Emp.Status</th>
                    <th>Day</th>
                    <th>Date</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>In-Time</th>
                    <th>In Image</th>
                    <th>Out-Time</th>
                    <th>Out Image</th>
                    <th>Status</th>
                    <th>Work Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteremployeeAttendance?.map((emp, index) => (
                    <tr key={index}>
                      <td>
                        <div
                          style={{
                            flexDirection: "row",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div style={getRowStyle(emp)}></div>

                          {index + 1}
                        </div>
                      </td>
                      <td>{emp?.reporting_manager}</td>
                      <td>{emp?.status}</td>
                      <td>{emp?.day}</td>
                      <td>{emp?.date}</td>
                      <td>{emp?.month}</td>
                      <td>{emp?.year}</td>
                      <td>{emp?.login_time}</td>
                      <td>
                        <img
                          src={
                            emp.login_image == null
                              ? NoImage
                              : ImagePath1 + emp?.login_image
                          }
                          onClick={() =>
                            handleClickOpen(
                              emp?.login_image == null ? null : emp?.login_image
                            )
                          }
                          alt={emp?.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "6px",
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                          }}
                        />
                      </td>
                      <td>{emp?.logout_time}</td>

                      <td>
                        <img
                          src={
                            emp.logout_image == null
                              ? NoImage
                              : ImagePath1 + emp?.logout_image
                          }
                          onClick={() =>
                            handleClickOpen(
                              emp?.logout_image == null
                                ? null
                                : emp?.logout_image
                            )
                          }
                          alt={emp?.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "6px",
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                          }}
                        />
                      </td>

                      <td
                        style={{
                          justifyContent: "center,",
                          alignItems: "center",
                        }}
                      >
                        <div>{emp?.attendance_status}</div>
                      </td>
                      <td>{emp?.work_status}</td>
                      <td>
                        <button
                          className="action-button"
                          onClick={() => {
                            editEmployeeDetails(emp);
                          }}
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="detailContainer2">
            <h1
              style={{
                fontWeight: "700",
                fontSize: 25,
                color: "black",
              }}
            >
              Employees
            </h1>
            <div className="searchBar-2">
              <div className="searchBar-wrapper">
                <input
                  type="text"
                  id="search-query"
                  name="query"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search..."
                  className="searchBar-input"
                  autoComplete="current-query"
                />

                <FaSearch className="search-icon" />
              </div>
            </div>

            {filteredCategories?.map((emp, index) => (
              <div key={index}>
                <div
                  className={`employee-item ${
                    getEmployeeDetails.findIndex((e) => e?.id === emp?.id) ===
                    getEmployeeindex
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleRowClick(emp?.id)} // Pass the employee ID instead of index
                >
                  <img
                    key={index}
                    src={ImagePath + emp?.image}
                    style={{
                      width: 35,
                      height: 35,
                      marginRight: 10,
                      borderRadius: "50%",
                      borderWidth: 2,
                      borderColor: "#E2E8F099",
                    }}
                  />
                  <div>
                    <h3 className="employee-name123">{emp?.name}</h3>
                    <h4 className="employee-name1">{emp?.employee_code}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedText == "Current" ? (
        <PullToRefresh onRefresh={handleRefresh} canFetchMore={true}>
          <div className="card-container1">
            <div
              style={{
                marginBottom: 20,
                alignItems: "center",
                flexDirection: "row",
                display: "flex",
              }}
            >
              <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 20 }}>
                Attendance History
              </h1>
              {/* <div className="form-group3">
                <h3>Current Year: {formData.leaveYear}</h3>
              </div> */}
              <div className="form-group3">
                <label htmlFor="leaveYear">Current Year: </label>

                <select
                  name="experience"
                  id="experience"
                  value={formData.leaveYear}
                  onChange={handleYearChange}
                  required
                >
                  {generateYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group3">
                <label htmlFor="leaveMonth">Month: </label>

                <select
                  name="leaveMonth"
                  id="leaveMonth"
                  value={formData.leaveMonth}
                  onChange={handleMonthChange}
                >
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group3">
                <label htmlFor="leaveDates">Date: </label>

                <select
                  name="leaveDate"
                  id="leaveDate"
                  value={formData.leaveDate} // Set the current selected date
                  onChange={handleDateChange}
                >
                  <option value="">Select Date</option>
                  {formData.leaveDates.length > 0 ? (
                    formData.leaveDates.map((formattedDate, index) => (
                      <option key={index} value={formattedDate}>
                        {formattedDate}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No dates available
                    </option>
                  )}
                </select>
              </div>
              <div className="form-group3">
                <label htmlFor="statusType">Status: </label>

                <select
                  name="statusType"
                  id="statusType"
                  value={formData.statusType}
                  onChange={handalEmployeeStatus}
                >
                  <option value="ALL Data">All Data</option>
                  <option value="On Time">On Time</option>
                  <option value="Late">Late</option>
                  <option value="Leave">Leave</option>
                  <option value="Half-Day">Half-Day</option>
                  <option value="WFH">WFH</option>
                </select>
              </div>
              <div className="form-group32">
                <button
                  type="button"
                  className="clear-filter-button"
                  onClick={handleClearFilter1} // Add your clear filter function here
                >
                  Clear Filter
                </button>
              </div>
            </div>
            <div
              style={{
                marginBottom: 20,
                justifyContent: "flex-end",
                alignItems: "center",
                flexDirection: "row",
                display: "flex",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: -5,
                }}
              >
                <div
                  style={{
                    background: "#009A20",
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    alignSelf: "center",
                    marginLeft: 10,
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                    borderBottom: "2px solid #047EFF",
                    paddingBottom: -10,
                    lineHeight: "1",
                  }}
                >
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    On Time{" "}
                  </h3>
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: "0 0 0 5px",
                    }}
                  >
                    ({countData?.onTime})
                  </h3>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: -5,
                  marginLeft: 10,
                }}
              >
                <div
                  style={{
                    background: "#1E40AF",
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    alignSelf: "center",
                    marginLeft: 10,
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                    borderBottom: "2px solid #047EFF",
                    paddingBottom: -10,
                    lineHeight: "1",
                  }}
                >
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    Half Day{" "}
                  </h3>
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: "0 0 0 5px",
                    }}
                  >
                    ({countData?.halfDay})
                  </h3>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: -5,
                  marginLeft: 10,
                }}
              >
                <div
                  style={{
                    background: "#FFCC00",
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    alignSelf: "center",
                    marginLeft: 10,
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                    borderBottom: "2px solid #047EFF",
                    paddingBottom: -10,
                    lineHeight: "1",
                  }}
                >
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    Late{" "}
                  </h3>
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: "0 0 0 5px",
                    }}
                  >
                    ({countData?.late})
                  </h3>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: -5,
                  marginLeft: 10,
                }}
              >
                <div
                  style={{
                    background: "#DE232A",
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    alignSelf: "center",
                    marginLeft: 10,
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                    borderBottom: "2px solid #047EFF",
                    paddingBottom: -10,
                    lineHeight: "1",
                  }}
                >
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    Leave{" "}
                  </h3>
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: "0 0 0 5px",
                    }}
                  >
                    ({countData?.leave})
                  </h3>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: -5,
                }}
              >
                <div
                  style={{
                    background: "#8CC4FF",
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    alignSelf: "center",
                    marginLeft: 10,
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 5,
                    borderBottom: "2px solid #047EFF",
                    paddingBottom: -10,
                    lineHeight: "1",
                  }}
                >
                  <h3
                    style={{
                      color: "#047EFF",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    Week Off
                  </h3>
                </div>
              </div>
            </div>
            <div className="table-container112">
              <table className="employee-table15">
                <thead>
                  <tr>
                    <th>S.N</th>
                    <th>Name</th>
                    <th style={{ width: 120 }}>Emp. Code</th>
                    <th style={{ width: 120 }}>Contact</th>
                    <th>Day</th>
                    <th>Date</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>IN Time</th>
                    <th>Image In</th>
                    <th>OUT Time</th>
                    <th>Image Out</th>
                    <th>Status</th>
                    <th>Work Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterallAttendanceData?.map((emp, index) => {
                    return (
                      <tr key={emp.auto_generated_id}>
                        <td>
                          <div
                            style={{
                              flexDirection: "row",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div style={getRowStyle(emp)}></div>

                            {index + 1}
                          </div>
                        </td>

                        <td>{emp?.name}</td>

                        <td style={{ width: 120 }}>{emp?.employee_code}</td>

                        <td style={{ width: 120 }}>{emp?.mobile}</td>
                        <td>{emp?.day}</td>
                        <td>{emp?.date}</td>
                        <td>{emp?.month}</td>
                        <td>{emp?.year}</td>
                        <td>{emp?.login_time}</td>
                        <td>
                          <img
                            src={
                              emp.login_image == null
                                ? NoImage
                                : ImagePath1 + emp?.login_image
                            }
                            onClick={() =>
                              handleClickOpen(
                                emp?.login_image == null
                                  ? null
                                  : emp?.login_image
                              )
                            }
                            alt={emp?.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "6px",
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                            }}
                          />
                        </td>
                        <td>{emp?.logout_time}</td>
                        <td>
                          <img
                            // src={ImagePath1 + emp?.logout_image}
                            src={
                              emp.logout_image == null
                                ? NoImage
                                : ImagePath1 + emp?.logout_image
                            }
                            alt={"image not available"}
                            onClick={() =>
                              handleClickOpen(
                                emp?.logout_image == null
                                  ? null
                                  : emp?.logout_image
                              )
                            }
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "6px",
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                            }}
                          />
                        </td>
                        <td
                          style={{
                            justifyContent: "center,",
                            alignItems: "center",
                          }}
                        >
                          {emp?.attendance_status}
                        </td>
                        <td>{emp?.work_status}</td>
                        <td>
                          <button
                            className="action-button"
                            onClick={() => {
                              editEmployeeDetails(emp);
                            }}
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </PullToRefresh>
      ) : (
        <div className="card-container1">
          <MonthlyAttendance />
        </div>
      )}

      <EditEmployeeAttendance
        open={editmodalOpen}
        onClose={() => setEditModalOpen(false)}
        user={employee}
      />
      <WHFComponnent
        open={whfmodal}
        onClose={() => setWhfModal(false)}
        user={getEmployeeDetails[getEmployeeindex]}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ padding: 0 }}>
          {selectedImage ? (
            <img
              src={ImagePath1 + selectedImage}
              style={{
                width: 500,
                height: 500,
                // objectFit: "cover",
                // borderRadius: 10,
              }}
            />
          ) : (
            <img src={NoImage} style={{ width: 500, height: 500 }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;
