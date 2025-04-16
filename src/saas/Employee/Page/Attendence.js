import React, { useCallback, useEffect, useState } from "react";
import "./Attendence.css";

import NoImage from "../../Assets/imageno.png";
import { BiBuildings } from "react-icons/bi";
import { TfiLocationPin } from "react-icons/tfi";
import { LuPhone } from "react-icons/lu";
import { Dialog, DialogContent } from "@material-ui/core";
import { Api, BaseUrl, ImagePath, ImagePath1 } from "../../Config/Api";
import { MdLaptopChromebook, MdOutlineMailOutline } from "react-icons/md";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHospitalUser } from "react-icons/fa";

const commonTextStyle = {
  fontWeight: "500",
  fontSize: "13px",
  textAlign: "center",
  // marginLeft: 10,
  marginTop: 5,
  color: "#155596",
};
const Attendence = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  const { setLoading, logout } = useAuth();
  const [profileData, setProfileData] = useState();
  const [attendanceData, setAttandanceData] = useState([]);
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
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
    setFormData({ ...formData, leaveYear: e.target.value });
  };
  const handleMonthChange = (e) => {
    setFormData({ ...formData, leaveMonth: e.target.value });
  };

  const handalEmployeeStatus = (e) => {
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
    const LATE_THRESHOLD = "09:00";
    const totalOnTime = data.filter(
      (entry) => entry.login_time <= LATE_THRESHOLD
    ).length;
    return totalOnTime;
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
  };
  return (
    <div class="mainDivlea1">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 30,
          color: "black",
          padding: 15,
          textAlign: "left",
        }}
      >
        Attendance Sheet
      </h1>
      <div class="mainDiv3">
        <div class="detailContainer1">
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
                  {profileData?.name}
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
                <h3 style={commonTextStyle}>{profileData?.employee_code}</h3>
                <MdLaptopChromebook color="#155596" size={15} />
                <h3 style={commonTextStyle}>{profileData?.designation}</h3>
                <BiBuildings color="#155596" size={15} />
                <h3 style={commonTextStyle}>{profileData?.department}</h3>
                <TfiLocationPin color="#155596" size={15} />
                <h3 style={commonTextStyle}>{profileData?.location}</h3>
                <LuPhone color="#155596" size={15} />
                <h3 style={commonTextStyle}>{profileData?.mobile}</h3>
                <MdOutlineMailOutline color="#155596" size={15} />
                <h3 style={commonTextStyle}>{profileData?.email}</h3>
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
              {profileData?.image == null ||
              profileData?.image == "undefined" ? (
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
                    {profileData?.name?.charAt(0)?.toUpperCase()}
                  </h1>
                </div>
              ) : (
                <img
                  src={ImagePath + profileData?.image}
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
              height: 100,
              marginTop: 20,
              flexDirection: "row",
              display: "flex",
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "85%",
                height: 100,
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderWidth: 1,
                  borderColor: "#f7f360",
                  flexDirection: "row",
                  display: "flex",
                  // background: "#F3F4F6",
                  background: "#FEF9C3",
                  border: "1px solid #f7f360",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{ width: 15, height: "100%", background: "#f7f360" }}
                ></div>
                <div
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: "100%",
                    justifyContent: "center",
                    display: "flex",
                    marginTop: 20,
                  }}
                >
                  <div>
                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "700",
                        color: "black",
                      }}
                    >
                      Total Late
                    </h1>

                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: 25,
                        fontWeight: "700",
                        color: "black",
                      }}
                    >
                      {getTotalLate(filteredLeaveData)}
                    </h1>
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: "100%",
                  borderWidth: 1,

                  flexDirection: "row",
                  display: "flex",
                  background: "#cdf2df",
                  marginLeft: 20,
                  border: "1px solid #32b472",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{ width: 15, height: "100%", background: "#32b472" }}
                ></div>
                <div
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: "100%",
                    justifyContent: "center",
                    display: "flex",
                    marginTop: 20,
                  }}
                >
                  <div>
                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#2f669e",
                      }}
                    >
                      ON Time
                    </h1>
                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#32b472",
                      }}
                    >
                      {getOntime(filteredLeaveData)}
                    </h1>
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: "100%",
                  borderWidth: 1,
                  borderColor: "#0f8e4d",
                  flexDirection: "row",
                  display: "flex",
                  background: "#cdf2df",
                  marginLeft: 20,
                  border: "1px solid #32b472",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{ width: 15, height: "100%", background: "#32b472" }}
                ></div>
                <div
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: "100%",
                    justifyContent: "center",
                    display: "flex",
                    marginTop: 20,
                  }}
                >
                  <div>
                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#2f669e",
                      }}
                    >
                      Present Days
                    </h1>
                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#32b472",
                      }}
                    >
                      {getPresent(filteredLeaveData)}
                    </h1>
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: "100%",
                  borderWidth: 1,
                  border: "1px solid red",
                  flexDirection: "row",
                  display: "flex",
                  background: "#ec9aa3",
                  marginLeft: 20,

                  borderRadius: "5px",
                }}
              >
                <div
                  style={{ width: 15, height: "100%", background: "red" }}
                ></div>
                <div
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: "100%",
                    justifyContent: "center",
                    display: "flex",
                    marginTop: 20,
                  }}
                >
                  <div>
                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#000",
                      }}
                    >
                      Total Leaves
                    </h1>
                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#000",
                      }}
                    >
                      {getLeavs(filteredLeaveData)}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: "100%", marginTop: 20 }}>
            <div
              style={{
                marginBottom: 20,

                flexDirection: "row",
                display: "flex",
              }}
            >
              <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 25 }}>
                Attendance History
              </h1>
              <div className="form-group2">
                <label htmlFor="leaveYear">Year: </label>

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
              <div className="form-group2">
                <label htmlFor="leaveYear">Month: </label>

                <select
                  name="experience"
                  id="experience"
                  value={formData.leaveMonth}
                  onChange={handleMonthChange}
                >
                  {generateMonths().map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group2">
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
                    //background: "#009A20",
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
                  >
                    <h3
                      style={{
                        color: "#047EFF",
                        margin: "0 0 0 5px",
                      }}
                    >
                      ({countData?.weekOff})
                    </h3>
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div class="table-container1">
            <table class="employee-table20">
              <thead>
                <tr>
                  <th>S.N</th>
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
                </tr>
              </thead>
              <tbody>
                {filteredLeaveData?.map((emp, index) => (
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
                          emp.login_image == null ||
                          emp.login_image == undefined
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
                            emp?.logout_image == null ? null : emp?.logout_image
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
                    <td>{emp?.attendance_status}</td>
                    <td>{emp?.work_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ padding: 0 }}>
          {selectedImage ? (
            <img
              alt="NoImage"
              src={ImagePath1 + selectedImage}
              style={{
                width: 500,
                height: 500,
                // objectFit: "cover",
                // borderRadius: 10,
              }}
            />
          ) : (
            <img
              src={NoImage}
              style={{ width: 500, height: 500 }}
              alt="NoImage"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendence;
