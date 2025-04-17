import React, { useEffect, useState } from "react";
import { COLOR, FONT, IMAGE } from "../../../../Config/Color";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { Api, BaseUrl, ImagePath, ImagePath1 } from "../../../../Config/Api";
import { setEmployeeindex } from "../../../../Redux/Action";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import "../Style/SingleEmployeeAttendance.css";
import PullToRefresh from "react-simple-pull-to-refresh";
import EditEmployeeAttendance from "../../../AdminComponent/EditEmployeeAttendance";
import { CSVLink } from "react-csv";
// import { Dialog, DialogContent } from "@material-ui/core";
import WHFComponnent from "../../../AdminComponent/WHFComponnent";
const SingleEmployeeAttendance = ({ data }) => {
  const dispatch = useDispatch();
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const getEmployeeindex = useSelector((state) => state.getEmployeeindex);
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [filteremployeeAttendance, setFilterEmployeeAttendance] = useState([]);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState();
  const token = sessionStorage.getItem("authToken");
const setLoading = () => { };
  const logout = () => { };
  const [test1, setTest1] = useState([]);
  const [filteredCategories, setFilteredCategories] =
    useState(getEmployeeDetails);
  const [query, setQuery] = useState("");
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const currentDay = new Date().getDate();
  const [whfmodal, setWhfModal] = useState(false);
  const [countData, setcountData] = useState({
    leave: 0,
    onTime: 0,
    halfDay: 0,
    late: 0,
  });
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
    leaveYear: currentYear?.toString(),
    leaveMonth: months[currentMonthIndex],

    leaveDate: currentFormattedDate,
    leaveDates: [],
    statusType: "ALL Data",
  });
  useEffect(() => {
    updateDatesForMonth(formData.leaveMonth);
  }, []);
  useEffect(() => {
    if (getEmployeeDetails?.length > 0) {
      getEmployeeAttendance(getEmployeeindex);
    }
  }, [editmodalOpen]);
  const generateYears = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };
  const handleYearChange = (e) => {
    setFormData({ ...formData, leaveYear: e.target.value });
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    updateDatesForMonth(selectedMonth);
  };

  const handalEmployeeStatus = (e) => {
    setFormData({ ...formData, statusType: e.target.value });
  };

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
  const handleRefresh = async () => {
    await getEmployeeAttendance(getEmployeeindex);
  };
  const handleClearFilter = () => {
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: months[currentMonthIndex], // Reset to current month
      leaveDate: currentFormattedDate, // Reset to current date
      leaveDates: test1,
      statusType: "ALL Data",
    });
  };

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
  useEffect(() => {
    const filterEmpAttendance = () => {
      const filteredData = employeeAttendance?.filter((leave) => {
        const isDateMatch =
          leave.year === formData.leaveYear &&
          leave.month === formData.leaveMonth;

        if (formData.statusType === "ALL Data") {
          if (data) {
            return isDateMatch && leave.attendance_status !== "Week Off";
          }
          return isDateMatch;
        } else {
          if (data) {
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
      {
        console.log("Data", filteredData);
      }
      setFilterEmployeeAttendance(filteredData);
      getCountAttendanceDarta(filteredData);
    };

    filterEmpAttendance();
  }, [
    formData.leaveYear,
    formData.leaveMonth,
    formData.leaveDate,
    formData.statusType,
    employeeAttendance,
    data,
  ]);
  const editEmployeeDetails = (empData) => {
    setEmployee(empData);
    setEditModalOpen(true);
  };
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",
      width: 80,
      key: "sn",
      fixed: "left",
      render: (_, record, index) => (
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={getRowStyle(record)}></div>
          {index + 1}
        </div>
      ),
    },
    {
      title: "NAME",
      dataIndex: "name",
      filterMultiple: true,
      key: "name",
      width: 150,
      fixed: "left",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
            color: COLOR.GRAY4,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },

    {
      title: "EMP. CODE",
      dataIndex: "employee_code",
      key: "employee_code",
      width: 150,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
            color: COLOR.GRAY4,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "CONTACT",
      dataIndex: "mobile",
      key: "mobile",
      width: 100,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "DAY",
      dataIndex: "day",
      key: "day",
      width: 120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "MONTH",
      dataIndex: "month",
      width: 100,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "YEAR",
      dataIndex: "year",
      key: "year",
      width: 100,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },

    {
      title: "IN TIME",
      dataIndex: "login_time",
      key: "login_time",
      width: 100,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "IMAGE IN",
      dataIndex: "login_image",
      key: "login_image",
      width:100,
      render: (img) =>
        img ? (
          <img
            src={ImagePath1 + img}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
            onClick={() => handleClickOpen(img)}
          />
        ) : (
          <img
            src={IMAGE.NOIMAGE}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
          />
        ),
    },
    {
      title: "OUT TIME",
      dataIndex: "logout_time",
      key: "logout_time",
      width: 100,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "IMAGE OUT",
      dataIndex: "logout_image",
      key: "logout_image",
      width:120,
      render: (img) =>
        img ? (
          <img
            src={ImagePath1 + img}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
            onClick={() => handleClickOpen(img)}
          />
        ) : (
          <img
            src={IMAGE.NOIMAGE}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
          />
        ),
    },
    {
      title: "STATUS",
      dataIndex: "attendance_status",
      key: "status",
      width: 100,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "WORK STATUS",
      dataIndex: "work_status",
      key: "work_status",
      width: 150,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
     {
          title: "OFFICE LOCATION",
          dataIndex: "office_location",
          key: "office_location",
          width: 180,
          render: (text) => (
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "22px",
                color: COLOR.GRAY3,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                display: "block", // Ensures it takes full width
                overflowWrap: "break-word",
              }}
            >
              {text}
            </span>
          ),
        },
    {
      title: "ACTION",
      width:100,
      render: (rowData) => (
        <div>
          <img
            src={IMAGE.EDIT}
            style={{ width: 20, height: 20 }}
            onClick={() => editEmployeeDetails(rowData)}
          />
        </div>
      ),
    },
  ];
  const getRowStyle = (data) => {
    const LATE_THRESHOLD = "09:15:59";
    const { login_time, attendance_status } = data;

    let style = {};

    if (attendance_status === "Leave") {
      style = {
        width: 5,
        height: 50,
        background: "#DE232A",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "Half-Day") {
      style = {
        width: 5,
        height: 50,
        background: "#1E40AF",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "Week Off") {
      style = {
        width: 5,
        height: 50,
        background: "#8CC4FF",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "Late") {
      style = {
        width: 5,
        height: 50,
        background: "#FFCC00",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "On Time") {
      style = {
        width: 5,
        height: 50,
        background: "#009A20",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else {
      style = {
        width: 5,
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
      {
        console.log("item", item);
      }
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
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  const handleClickOpen = (image) => {
    setSelectedImage(image || null);
    setOpen(true);
  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: "75%",

          // maxHeight: "82vh",
          // overflowY: "auto",
          // overflowX: "hidden",
        }}
      >
        <div className="p-4 rounded-lg bg-white shadow-sm">
          <div className="flex items-start space-x-6 p-4">
            {getEmployeeDetails[getEmployeeindex]?.image == null ? (
              <div
                style={{
                  width: "60px",
                  height: "50px",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  backgroundColor: "#155596",
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
                src={ImagePath + getEmployeeDetails[getEmployeeindex]?.image}
                alt="User"
                className="w-14 h-14 rounded-md object-cover"
              />
            )}

            <div className="flex flex-col">
              <h2
                style={{
                  fontSize: "18px",
                  fontFamily: "Inter",
                  fontWeight: "600",
                  lineHeight: "20px",
                  color: COLOR.BLACK,
                }}
              >
                {getEmployeeDetails[getEmployeeindex]?.name}
              </h2>
              <h2
                style={{
                  fontSize: "14px",
                  fontFamily: FONT.INTER,
                  fontWeight: "500",
                  lineHeight: "22px",
                  marginTop: "5px",
                  color: COLOR.BLACK1,
                }}
              >
                {getEmployeeDetails[getEmployeeindex]?.designation}
              </h2>

              <div className="flex flex-wrap mt-2 gap-2">
                <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                  <img src={IMAGE.CONTACT} className="w-4 h-4" alt="icon" />
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: FONT.INTER,
                      fontWeight: "500",
                      lineHeight: "22px",

                      color: COLOR.GRAY4,
                    }}
                  >
                    {getEmployeeDetails[getEmployeeindex]?.employee_code}
                  </span>
                </div>
                <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                  <img src={IMAGE.PHONE} className="w-4 h-4" alt="icon" />
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: FONT.INTER,
                      fontWeight: "500",
                      lineHeight: "22px",

                      color: COLOR.GRAY4,
                    }}
                  >
                    {" "}
                    {getEmployeeDetails[getEmployeeindex]?.mobile}
                  </span>
                </div>
                <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                  <img src={IMAGE.EMAIL} className="w-4 h-4" alt="icon" />
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: FONT.INTER,
                      fontWeight: "500",
                      lineHeight: "22px",

                      color: COLOR.GRAY4,
                    }}
                  >
                    {" "}
                    {getEmployeeDetails[getEmployeeindex]?.email}
                  </span>
                </div>

                <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                  <img src={IMAGE.LOCATION} className="w-4 h-4" alt="icon" />
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: FONT.INTER,
                      fontWeight: "500",
                      lineHeight: "22px",

                      color: COLOR.GRAY4,
                    }}
                  >
                    {getEmployeeDetails[getEmployeeindex]?.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="leave-summary-container flex justify-between items-center mt-2 px-4">
            <div className="flex flex-wrap gap-4">
              <div className="leave-card annual-leaves">
                <span
                  style={{
                    fontFamily: FONT.INTER,
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#FFCC00",
                    fontWeight: "600",
                  }}
                >
                  {getTotalLate(filteremployeeAttendance)}
                </span>
                <span
                  style={{
                    fontFamily: FONT.INTER,
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: COLOR.GRAY4,
                    fontWeight: "500",
                  }}
                >
                  Total Late
                </span>
              </div>

              <div className="leave-card leave-collected">
                <span
                  style={{
                    fontFamily: FONT.INTER,
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#34C759",
                    fontWeight: "600",
                  }}
                >
                  {getPresent(filteremployeeAttendance)}
                </span>
                <span
                  style={{
                    fontFamily: FONT.INTER,
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: COLOR.GRAY4,
                    fontWeight: "500",
                  }}
                >
                  Present Days
                </span>
              </div>

              <div className="leave-card paid-leaves">
                <span
                  style={{
                    fontFamily: FONT.INTER,
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#AF52DE",
                    fontWeight: "600",
                  }}
                >
                  {getLeavs(filteremployeeAttendance)}
                </span>
                <span
                  style={{
                    fontFamily: FONT.INTER,
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: COLOR.GRAY4,
                    fontWeight: "500",
                  }}
                >
                  Total Leaves
                </span>
              </div>
            </div>

            <button
              className="apply-wfh-btn ml-auto"
              onClick={() => {
                setWhfModal(true);
              }}
            >
              Apply WFH
            </button>
          </div>
        </div>
        <PullToRefresh onRefresh={handleRefresh} canFetchMore={true}>
          <div className="p-4 rounded-lg bg-white shadow-sm mt-5">
            <div className="flex items-center justify-between ">
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Inter",
                  color: COLOR.BLACK,
                  lineHeight: "20px",
                }}
              >
                Attendance History
              </h3>

              <div className="flex items-center space-x-4 ">
                <div>
                  <span
                    className="mr-2"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      fontFamily: "Inter",
                      color: COLOR.GRAY3,
                      lineHeight: "18px",
                    }}
                  >
                    Current Year
                  </span>

                  <select
                    name="experience"
                    id="experience"
                    value={formData.leaveYear}
                    onChange={handleYearChange}
                    required
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      fontFamily: "Inter",
                      color: COLOR.BLACK,
                      lineHeight: "18px",
                    }}
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span
                    className="mr-2"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      fontFamily: "Inter",
                      color: COLOR.GRAY3,
                      lineHeight: "18px",
                    }}
                  >
                    Month
                  </span>

                  <select
                    name="leaveMonth"
                    id="leaveMonth"
                    value={formData.leaveMonth}
                    onChange={handleMonthChange}
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      fontFamily: "Inter",
                      color: COLOR.BLACK,
                      lineHeight: "18px",
                    }}
                  >
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span
                    className="mr-2"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      fontFamily: "Inter",
                      color: COLOR.GRAY3,
                      lineHeight: "18px",
                    }}
                  >
                    Status
                  </span>

                  <select
                    name="statusType"
                    id="statusType"
                    value={formData.statusType}
                    onChange={handalEmployeeStatus}
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      fontFamily: "Inter",
                      color: COLOR.BLACK,
                      lineHeight: "18px",
                    }}
                  >
                    <option value="ALL Data">All Data</option>
                    <option value="On Time">On Time</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                    <option value="Half-Day">Half-Day</option>
                    <option value="WFH">WFH</option>
                  </select>
                </div>

                <button
                  onClick={handleClearFilter}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    fontFamily: "Inter",
                    color: COLOR.BLACK,
                    lineHeight: "18px",
                  }}
                >
                  Clear Filter
                </button>

                <CSVLink
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    fontFamily: "Inter",
                    color: "white",
                    lineHeight: "18px",
                  }}
                  className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 flex items-center justify-center"
                  filename={`${
                    getEmployeeDetails[getEmployeeindex]?.name
                  }${" "}${formData.leaveMonth}${" "}${formData.leaveYear}.csv`}
                  data={downloadCsvData}
                >
                  Export to CSV
                </CSVLink>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <div className="flex space-x-4 items-center">
                <span className="flex items-center space-x-1 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full "></span>
                  <span
             
                    style={{
                      color: "blue",
                      fontSize: "12px",
                      fontWeight: "400",
                      fontFamily: "Inter",
                      lineHeight: "20px",
                    }}
                  >
                    On Time({countData?.onTime})
                  </span>
                </span>
                <span className="flex items-center space-x-1 text-sm text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span
               
                    style={{
                      color: "blue",
                      fontSize: "12px",
                      fontWeight: "400",
                      fontFamily: "Inter",
                      lineHeight: "20px",
                    }}
                  >
                    Half Day({countData?.halfDay})
                  </span>
                </span>
                <span className="flex items-center space-x-1 text-sm text-purple-500">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span
               
                    style={{
                      color: "blue",
                      fontSize: "12px",
                      fontWeight: "400",
                      fontFamily: "Inter",
                      lineHeight: "20px",
                    }}
                  >
                    WFH(0)
                  </span>
                </span>
                <span className="flex items-center space-x-1 text-sm text-yellow-500">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span
                   
                    style={{
                      color: "blue",
                      fontSize: "12px",
                      fontWeight: "400",
                      fontFamily: "Inter",
                      lineHeight: "20px",
                    }}
                  >
                    Late({countData?.late})
                  </span>
                </span>
                <span className="flex items-center space-x-1 text-sm text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span
             
                    style={{
                      color: "blue",
                      fontSize: "12px",
                      fontWeight: "400",
                      fontFamily: "Inter",
                      lineHeight: "20px",
                    }}
                  >
                    Leave({countData?.leave})
                  </span>
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                width: "100%",
                maxHeight: "39vh",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <Table
                dataSource={filteremployeeAttendance}
                className="dotted-border-table"
                columns={columns}
                // pagination={{ pageSize: 8, position: ["bottomRight"] }}
                rowClassName={() => "custom-row"}
                bordered={false}
                // style={{ tableLayout: "auto" }}
                tableLayout="fixed"
                rowKey="key"
                // scroll={{ x: 1000 }} // Ensures proper scrolling behavior
                scroll={{ y:1000, x: 1000 }}
                pagination={false}
                locale={{
                  emptyText: (
                    <div className="custom-no-data">No Attendance Data Found</div>
                  ),
                }}
              />
            </div>

            {/* <Dialog open={open} onClose={handleClose}>
              <DialogContent style={{ padding: 0 }}>
                {selectedImage ? (
                  <img
                    src={ImagePath1 + selectedImage}
                    style={{
                      width: 500,
                      height: 500,
                    }}
                  />
                ) : (
                  <img
                    src={IMAGE.NOIMAGE}
                    style={{ width: 500, height: 500 }}
                  />
                )}
              </DialogContent>
            </Dialog> */}
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
          </div>
        </PullToRefresh>
      </div>
      <div
        style={{
          width: "24%",
          justifyContent: "flex-start",
          maxHeight: "82vh", // Adjust height as needed
          overflowY: "auto",
          overflowX: "hidden",
        }}
        className=" border-gray-300 px-5 py-5 bg-white rounded-lg shadow-sm"
      >
        <h1
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "16px",
            color: COLOR.BLACK,
            lineHeight: "20px",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          Employees
        </h1>
        <div className="searchBar-2" sty>
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
                  width: 45,
                  height: 45,
                  marginRight: 10,
                  borderRadius: "6px",
                  borderWidth: 2,
                  borderColor: "#E2E8F099",
                }}
              />
              <div>
                <span
                  style={{
                    fontSize: "14px",
                    fontFamily: "Inter",
                    fontWeight: "600",
                    lineHeight: "20px",
                    color: COLOR.GRAY4,
                  }}
                >
                  {emp?.name}
                </span>
                <h4
                  className="employee-name1"
                  style={{
                    fontSize: "12px",
                    fontFamily: "Inter",
                    fontWeight: "500",
                    lineHeight: "16px",
                    color: COLOR.GRAY2,
                  }}
                >
                  {emp?.employee_code}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleEmployeeAttendance;
