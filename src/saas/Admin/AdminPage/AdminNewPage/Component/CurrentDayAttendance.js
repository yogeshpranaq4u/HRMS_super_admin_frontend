import React, { useEffect, useState } from "react";
import { COLOR } from "../../../../Config/Color";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import NOIMAGE from "../../../../Assets/NewImage/NoImage.png";
import EDIT from "../../../../Assets/NewImage/edit.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Api, BaseUrl, ImagePath1 } from "../../../../Config/Api";
// import { Dialog, DialogContent } from "@material-ui/core";
import EditEmployeeAttendance from "../../../AdminComponent/EditEmployeeAttendance";
import PullToRefresh from "react-simple-pull-to-refresh";
import { setAllUserAttendance } from "../../../../Redux/Action";
import axios from "axios";
import { toast } from "react-toastify";
import { getEmployeeAttendanceData } from "../../../../../redux/actions/adminAction";
const { Option } = Select;
const CurrentDayAttendance = ({ data }) => {
  const dispatch = useDispatch();
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const getEmployeeindex = useSelector((state) => state.getEmployeeindex);
  const [employee, setEmployee] = useState();
  const [test1, setTest1] = useState([]);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [filterallAttendanceData, setAllAttendanceData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const currentDay = new Date().getDate();
  const token = sessionStorage.getItem("authToken");
  const setLoading = () => { };
  const logout = () => { };
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [countData, setcountData] = useState({
    leave: 0,
    onTime: 0,
    halfDay: 0,
    late: 0,
    wfh: 0,
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
  const getAllUserAttendance = useSelector(
    (state) => state?.adminData?.employeeAttendanceData
  );
  useEffect(() => {
    dispatch(getEmployeeAttendanceData());
  }, []);

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
    officeLocation: "ALL Data",
  });

  useEffect(() => {
    updateDatesForMonth(formData.leaveMonth);
  }, []);
  const generateYears = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const handleYearChange = (e) => {
    setFormData({ ...formData, leaveYear: e.target.value });
    setIsDisabled(false);
    setIsFilterApplied(true);
  };

  const handleMonthChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    const selectedMonth = e.target.value;
    updateDatesForMonth(selectedMonth);
  };
  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      leaveDate: e.target.value,
    });
    setIsDisabled(false);
    setIsFilterApplied(true);
  };
  const handalEmployeeStatus = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, statusType: e.target.value });
  };
  const handalOfficeLocation = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, officeLocation: e.target.value });
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

  const handleClearFilter = () => {
    setIsDisabled(true);
    setIsFilterApplied(false);
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: months[currentMonthIndex], // Reset to current month
      leaveDate: currentFormattedDate, // Reset to current date
      leaveDates: test1,
      statusType: "ALL Data",
      officeLocation: "ALL Data",
    });
  };

  useEffect(() => {
    const filterAttendanceData = () => {
      if (
        formData.statusType === "ALL Data" &&
        formData.officeLocation === "ALL Data"
      ) {
        const filteredData = getAllUserAttendance?.filter((leave) => {
          const isDateMatch =
            leave.year === formData.leaveYear &&
            leave.month === formData.leaveMonth &&
            leave.date === formData.leaveDate;

          if (data) {
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

          if (data) {
            return (
              isDateMatch &&
              leave.attendance_status !== "Week Off" &&
              (leave.attendance_status === formData.statusType ||
                leave.work_status === formData.statusType ||
                leave.office_location == formData.officeLocation)
            );
          }

          return (
            isDateMatch &&
            (leave.attendance_status === formData.statusType ||
              leave.work_status === formData.statusType ||
              leave.office_location == formData.officeLocation)
          );
        });

        setAllAttendanceData(filteredData);
        getCountAttendanceDarta(filteredData);
      }
    };

    filterAttendanceData();
  }, [
    formData.leaveYear,
    formData.leaveMonth,
    formData.leaveDate,
    formData.statusType,
    formData.officeLocation,
    getAllUserAttendance,

    data,
  ]);


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
          <div style={getRowStyle(record)}></div> {/* Pass record (emp data) */}
          {index + 1}
        </div>
      ),
    },
    {
      title: "NAME",
      dataIndex: "name",
      filterMultiple: true,
      key: "name",
      width: 200,
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name), // Correct sorting for string values
      defaultSortOrder: "ascend",
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
      dataIndex: "employee_code", // Ensure this matches your data key
      key: "employee_code",
      sorter: (a, b) => a.employee_code.localeCompare(b.employee_code), // Correct sorting for string values
      defaultSortOrder: "ascend",
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
      title: "DAY",
      dataIndex: "day",
      key: "day",
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
      title: "DATE",
      dataIndex: "date",
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
      title: "MONTH",
      dataIndex: "month",
      key: "month",
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
      title: "IMAGE IN",
      dataIndex: "login_image",
      key: "login_image",
      width: 120,
      render: (img) =>
        img ? (
          <img
            src={ImagePath1 + img}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
            onClick={() => handleClickOpen(img)}
          />
        ) : (
          <img
            src={NOIMAGE}
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
      width: 120,
      render: (img) =>
        img ? (
          <img
            src={ImagePath1 + img}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
            onClick={() => handleClickOpen(img)}
          />
        ) : (
          <img
            src={NOIMAGE}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
          />
        ),
    },

    {
      title: "STATUS",
      dataIndex: "attendance_status",
      key: "attendance_status",
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
      width: 100,
      render: (rowData) => (
        <div>
          <img
            src={EDIT}
            style={{ width: 20, height: 20 }}
            onClick={() => editEmployeeDetails(rowData)}
          />
        </div>
      ),
    },
  ];
  const handleClickOpen = (image) => {
    setSelectedImage(image || null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  const editEmployeeDetails = (empData) => {
    setEmployee(empData);
    setEditModalOpen(true);
  };
  const handleRefresh = () => {
    dispatch(getEmployeeAttendanceData());
  };

  const getRowStyle = (data) => {
    const LATE_THRESHOLD = "09:15:59";
    const { login_time, attendance_status, work_status } = data;

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
    } else if (attendance_status === "On Time" && work_status !== "WFH") {
      style = {
        width: 5,
        height: 50,
        background: "#009A20",
        marginRight: 20,
        marginLeft: -8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
      };
    } else if (attendance_status === "On Time" && work_status == "WFH") {
      style = {
        width: 5,
        height: 50,
        background: "#9370DB",
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

    let leaveCount = 0;
    let halfDayCount = 0;
    let lateCount = 0;
    let onTimeCount = 0;

    let totalWfhCount = 0;
    let wfhLateCount = 0;
    let wfhOnTimeCount = 0;
    let wfhHalfDayCount = 0;

    data?.forEach((item) => {
      if (item?.work_status === "WFH") {
        totalWfhCount += 1;

        // Count WFH attendance statuses
        if (item?.attendance_status === "Late") {
          wfhLateCount += 1;
          lateCount += 1; // WFH Late also counts as total Late
        } else if (item?.attendance_status === "On Time") {
          wfhOnTimeCount += 1;
          onTimeCount += 1; // WFH On Time also counts as total On Time
        } else if (item?.attendance_status === "Half-Day") {
          wfhHalfDayCount += 1;
          halfDayCount += 1; // WFH Half-Day also counts as total Half-Day
        }
      } else {
        // Non-WFH attendance statuses
        if (item?.attendance_status === "Leave") {
          leaveCount += 1;
        } else if (item?.attendance_status === "Half-Day") {
          halfDayCount += 1;
        } else if (item?.attendance_status === "Late") {
          lateCount += 1;
        } else if (item?.attendance_status === "On Time") {
          onTimeCount += 1;
        }
      }
    });

    setcountData({
      leave: leaveCount,
      onTime: onTimeCount,
      halfDay: halfDayCount,
      late: lateCount,
      wfh: totalWfhCount,

      // wfhLate: wfhLateCount,
      // wfhOnTime: wfhOnTimeCount,
      // wfhHalfDay: wfhHalfDayCount,
    });
  };
  return (
    <div
      className="  border-gray-300 px-5 py-5 bg-white rounded-lg shadow-sm"
      style={{
        maxHeight: "80vh", // Adjust height as needed
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <PullToRefresh onRefresh={handleRefresh} canFetchMore={true}>
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
                Date
              </span>

              <select
                name="leaveDate"
                id="leaveDate"
                value={formData.leaveDate} // Set the current selected date
                onChange={handleDateChange}
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  fontFamily: "Inter",
                  color: COLOR.BLACK,
                  lineHeight: "18px",
                }}
              >
                <option value="">Select Date</option>
                {formData?.leaveDates?.length > 0 ? (
                  formData?.leaveDates?.map((formattedDate, index) => (
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
                Office Location
              </span>

              <select
                name="officeLocation"
                id="officeLocation"
                value={formData.officeLocation}
                onChange={handalOfficeLocation}
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  fontFamily: "Inter",
                  color: COLOR.BLACK,
                  lineHeight: "18px",
                }}
              >
                <option value="ALL Data">All Data</option>
                <option value="Noida">Noida</option>
                <option value="Gurugram">Gurugram</option>
              </select>
            </div>

            <button
              onClick={handleClearFilter}
              disabled={isDisabled}
              className={`px-3 py-1 rounded flex items-center justify-center transition-colors ${isFilterApplied
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-black"
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "Inter",
                lineHeight: "18px",
              }}
            >
              Clear Filter
            </button>
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
                On Time ({countData?.onTime})
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
                Half Day ({countData?.halfDay})
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
                WFH({countData?.wfh})
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
            maxHeight: "90vh", // Adjust height as needed
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          {/* <Table
            dataSource={filterallAttendanceData}
            className="dotted-border-table"
            columns={columns}
            // pagination={{ pageSize: 8, position: ["bottomRight"] }}
            rowClassName={() => "custom-row"}
            bordered={false}
            // style={{ tableLayout: "auto" }}
            tableLayout="fixed"
            rowKey="key"
            scroll={{ y: "70vh", x: 1000 }} 
            locale={{
              emptyText: (
                <div className="custom-no-data">No Attendance Data Found</div>
              ),
            }}

          /> */}

          <Table
            dataSource={filterallAttendanceData}
            className="dotted-border-table"
            columns={columns}
            rowClassName={() => "custom-row"}
            bordered={false}
            tableLayout="fixed"
            rowKey="key"
            scroll={{ y: "70vh", x: 1000 }}
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
                  // objectFit: "cover",
                  // borderRadius: 10,
                }}
              />
            ) : (
              <img src={NOIMAGE} style={{ width: 500, height: 500 }} />
            )}
          </DialogContent>
        </Dialog> */}
        <EditEmployeeAttendance
          open={editmodalOpen}
          onClose={() => setEditModalOpen(false)}
          user={employee}
        />
      </PullToRefresh>
    </div>
  );
};

export default CurrentDayAttendance;
