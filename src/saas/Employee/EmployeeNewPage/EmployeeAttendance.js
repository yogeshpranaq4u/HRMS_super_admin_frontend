import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { Api, BaseUrl, ImagePath, ImagePath1 } from "../../Config/Api";
import { toast } from "react-toastify";
import axios from "axios";
import { COLOR, FONT, IMAGE } from "../../Config/Color";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import MainLayout from "../../../layouts/MainLayout";
// import { Dialog, DialogContent } from "@material-ui/core";
const EmployeeAttendance = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  // const { setLoading, logout } = useAuth();
  const setLoading = () => { };
  const logout = () => { };
  const [profileData, setProfileData] = useState();
  const [attendanceData, setAttandanceData] = useState([]);
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [countData, setcountData] = useState({
    leave: 0,
    onTime: 0,
    halfDay: 0,
    late: 0,
  });
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
          setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
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
      setLoading(false);
    }
  }, [token, setLoading, logout]);

  const fetchEmployeeAttendance = useCallback(async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_ATTENDANCE}?employee_id=${employeeId}`,
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
          setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          setAttandanceData(responseData?.data?.data);
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
  }, [token, setLoading, logout]);

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const currentMonthName = new Date(0, currentMonthIndex).toLocaleString(
    "default",
    { month: "long" }
  );
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: currentMonthName,
    statusType: "ALL Data",
  });

  useEffect(() => {
    const filterLeaveData = () => {
      if (formData.statusType === "ALL Data") {
        const allData = attendanceData?.filter((leave) => {
          return (
            leave.year === formData.leaveYear &&
            leave.month === formData.leaveMonth
          );
        });

        setFilteredLeaveData(allData);
        getCountAttendanceDarta(allData);
      } else {
        const filteredData = attendanceData?.filter((leave) => {
          return (
            leave.year === formData.leaveYear &&
            leave.month === formData.leaveMonth &&
            // leave.attendance_status === formData.statusType
            (leave.attendance_status === formData.statusType ||
              leave.work_status == formData.statusType)
          );
        });
        setFilteredLeaveData(filteredData);
        getCountAttendanceDarta(filteredData);
      }
    };

    filterLeaveData();
  }, [
    formData.leaveYear,
    formData.leaveMonth,
    formData.statusType,
    attendanceData,
  ]);
  const getCountAttendanceDarta = (data) => {
    let leaveCount = 0;
    let halfDayCount = 0;
    let lateCount = 0;
    let onTimeCount = 0;
    let weekOff = 0;

    data?.forEach((item) => {
      if (item?.attendance_status === "Leave") {
        leaveCount += 1;
      } else if (item?.attendance_status === "Half-Day") {
        halfDayCount += 1;
      } else if (item?.attendance_status === "Late") {
        lateCount += 1;
      } else if (item?.attendance_status === "On Time") {
        onTimeCount += 1;
      } else if (item?.attendance_status === "Week Off") {
        weekOff += 1;
      }
    });
    setcountData({
      leave: leaveCount,
      onTime: onTimeCount,
      halfDay: halfDayCount,
      late: lateCount,
      weekOff: weekOff,
    });
  };
  useEffect(() => {
    fetchEmployeProfile();
    fetchEmployeeAttendance();
  }, []);
  const handleYearChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, leaveYear: e.target.value });
  };
  const handleMonthChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, leaveMonth: e.target.value });
  };

  const handalEmployeeStatus = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, statusType: e.target.value });
  };
  const generateYears = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const generateMonths = () => {
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

    if (formData.leaveYear === currentYear.toString()) {
      return months.slice(0, currentMonthIndex + 1);
    }
    return months;
  };
  const getTotalLate = (data) => {
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
  const getOntime = (data) => {
    // const LATE_THRESHOLD = "09:00";
    // const totalOnTime = data.filter(
    //   (entry) => entry.login_time <= LATE_THRESHOLD
    // ).length;
    // return totalOnTime;
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

  const getRowStyle = (data) => {
    const { attendance_status } = data;

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

  const handleClickOpen = (image) => {
    setSelectedImage(image || null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleClearFilter = () => {
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: currentMonthName,
      statusType: "ALL Data",
    });
    setIsDisabled(true);
    setIsFilterApplied(false);
  };
  const handleRefresh = async () => {
    await fetchEmployeProfile();
    await fetchEmployeeAttendance();
  };
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",
      width: 80,
      key: "sn",
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
      title: "REPORTING MANAGER",
      dataIndex: "reporting_manager",
      filterMultiple: true,
      width: 200,
      key: "reporting_manager",
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
      title: "EMP. STATUS",
      dataIndex: "status",
      key: "status",
      width: 150,
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
      width: 150,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
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
      width: 150,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
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
      width: 120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
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
      width: 120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
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
            src={IMAGE.NOIMAGE}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
          />
        ),
    },
    {
      title: "OUT TIME",
      dataIndex: "logout_time",
      key: "logout_time",
      width: 120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
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
            src={IMAGE.NOIMAGE}
            style={{ width: 40, height: 40, borderRadius: "5px" }}
          />
        ),
    },
    {
      title: "STATUS",
      dataIndex: "attendance_status",
      key: "status",
      width: 120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
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
          }}
        >
          {text}
        </span>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <h2
            style={{
              marginBottom: "10px",
              marginTop: "10px",
              fontSize: "24px",
              fontWeight: "700",
              fontFamily: "Inter",
              color: COLOR.BLACK,
            }}
          >
            Attendance Sheet
          </h2>
          <div
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                maxHeight: "90vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <div className="flex items-start space-x-6 p-4">
                  {profileData?.image == null ? (
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
                        {profileData?.name
                          ? profileData.name.charAt(0).toUpperCase()
                          : ""}
                      </h1>
                    </div>
                  ) : (
                    <img
                      src={ImagePath + profileData?.image}
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
                      {profileData?.name}
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
                      {profileData?.designation}
                    </h2>

                    <div className="flex flex-wrap mt-2 gap-2">
                      <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                        <img src="/assets/contact.png" className="w-4 h-4" alt="icon" />
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            lineHeight: "22px",

                            color: COLOR.GRAY4,
                          }}
                        >
                          {profileData?.employee_code}
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
                          {profileData?.mobile}
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
                          {profileData?.email}
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
                          {profileData?.location}
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
                        {getTotalLate(filteredLeaveData)}
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
                        {getOntime(filteredLeaveData)}
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
                        {getLeavs(filteredLeaveData)}
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
                          id="experience"
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
                          {generateMonths().map((month) => (
                            <option key={month} value={month}>
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

                      {/* <button
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
                  </button> */}
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
                          // className="underline"
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
                          // className="underline"
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
                          // className="underline"
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
                          // className="underline"
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
                          // className="underline"
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
                      maxHeight: "90vh",
                      overflowY: "auto",
                      overflowX: "auto",
                    }}
                  >
                    <Table
                      className="dotted-border-table"
                      columns={columns}
                      dataSource={filteredLeaveData}
                      style={{ tableLayout: "fixed" }}
                      locale={{
                        emptyText: (
                          <div className="custom-no-data">
                            No Attendance Data Found
                          </div>
                        ),
                      }}
                      pagination={{ pageSize: 8, position: ["bottomRight"] }}
                      rowClassName={() => "custom-row"}
                      bordered={false}
                      // style={{ tableLayout: "auto" }}
                      tableLayout="fixed"
                      rowKey="key"
                      scroll={{ x: 1000 }} // Ensures proper scrolling behavior
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
                </div>
              </PullToRefresh>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeAttendance;
