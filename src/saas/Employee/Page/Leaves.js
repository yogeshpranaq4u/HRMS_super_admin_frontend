import React, { useCallback, useEffect, useState } from "react";
import "./Leaves.css";
import { MdOutlineMailOutline } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import { TfiLocationPin } from "react-icons/tfi";
import { LuPhone } from "react-icons/lu";
import { MdLaptopChromebook } from "react-icons/md";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import { BsFillLightbulbFill } from "react-icons/bs";
import { FaHospitalUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { setWorkFromHome, setLeaveWfhRequest } from "../../Redux/Action";
import { useDispatch } from "react-redux";
import Lottie from "lottie-react";
import Animation from "../../Assets/animation.json";
import ApplyEmployeeLeavs from "../EmoployeeComponent/ApplyEmployeeLeavs";
import PullToRefresh from "react-simple-pull-to-refresh";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../Component/NotificationsComponent";
const commonTextStyle = {
  fontWeight: "500",
  fontSize: "13px",
  textAlign: "center",
  // marginLeft: 10,
  marginTop: 5,
  color: "#155596",
};
const Leaves = () => {
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const getWorkFromHome = useSelector((state) => state.getWorkFromHome);
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  const { setLoading, logout } = useAuth();
  const [profileData, setProfileData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [totalleaveData, setTotalLeaveData] = useState([]);
  const [selectedText, setSelectedText] = useState("Leaves");
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const getLeaveWfhRequest = useSelector((state) => state.getLeaveWfhRequest);
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: "All Data",
  });
  const [wfhData, setWfhData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: "All Data",
  });
  const [leaveWfhRequestdata, setLeaveWfhRequestdata] = useState({
    leaveYear: currentYear.toString(),
  });

  const [filteredWfhData, setFilteredWfh] = useState(getWorkFromHome);
  const [filteredLeaveWfhRequestData, setFilteredLeaveWfhRequestData] =
    useState(getLeaveWfhRequest);
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
  useEffect(() => {
    const filterLeaveData = () => {
      const filteredData = leaveData?.filter((leave) => {
        // return (
        //   leave.year === formData.leaveYear &&
        //   leave.month === formData.leaveMonth
        // );
        return (
          leave.year === formData.leaveYear &&
          (formData.leaveMonth === "All Data" ||
            leave.month === formData.leaveMonth)
        );
      });

      setFilteredLeaveData(filteredData);
    };

    filterLeaveData();
  }, [formData.leaveYear, formData.leaveMonth, leaveData]);
  const getEmployeeLeave = useCallback(async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_LEAVE}?employee_id=${employeeId}`,
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
          setLeaveData(responseData?.data?.leaves);
          setTotalLeaveData(responseData?.data?.total_leaves);
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
  const getEmployeeWorkfromdata = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GETWFH_DATA}?employee_id=${employeeId}`,
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
          dispatch(setWorkFromHome(responseData?.data?.data));
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
    const filterLeaveData = () => {
      const filteredData = getWorkFromHome?.filter((leave) => {
        return (
          leave.year === wfhData.leaveYear &&
          (wfhData.leaveMonth === "All Data" ||
            leave.month === wfhData.leaveMonth)
        );
      });

      setFilteredWfh(filteredData);
    };

    filterLeaveData();
  }, [wfhData.leaveYear, wfhData.leaveMonth, getWorkFromHome]);
  useEffect(() => {
    const filterLeaveWfhRequest = () => {
      const filteredData = getLeaveWfhRequest?.filter((leave) => {
        return leave.year == leaveWfhRequestdata.leaveYear;
      });

      setFilteredLeaveWfhRequestData(filteredData);
    };

    filterLeaveWfhRequest();
  }, [leaveWfhRequestdata.leaveYear, getLeaveWfhRequest]);

  useEffect(() => {
    fetchEmployeProfile();
    getEmployeeLeave();
    getEmployeeWorkfromdata();
    onMessage(messaging, (payload) => {
      getEmployeeLeaveWfhrequest();
      toast.success(payload.notification.body, {
        position: "top-center",
        autoClose: 1000,
      });
    });
  }, []);
  const handleYearChange = (e) => {
    if (selectedText == "Leaves") {
      setFormData({ ...formData, leaveYear: e.target.value });
    } else if (selectedText == "WFH") {
      setWfhData({ ...wfhData, leaveYear: e.target.value });
    } else if (selectedText == "Leaves Request") {
      setLeaveWfhRequestdata({
        ...leaveWfhRequestdata,
        leaveYear: e.target.value,
      });
    } else {
      setLeaveWfhRequestdata({
        ...leaveWfhRequestdata,
        leaveYear: e.target.value,
      });
    }
  };
  const handleMonthChange = (e) => {
    if (selectedText == "Leaves") {
      setFormData({ ...formData, leaveMonth: e.target.value });
    } else {
      setWfhData({ ...wfhData, leaveMonth: e.target.value });
    }
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
      return months.slice(0, currentMonthIndex + 12);
    }
    return months;
  };
  const changeText = (text) => {
    setSelectedText(text);
  };
  const handleClearFilter = () => {
    if (selectedText == "Leaves") {
      setFormData({
        leaveYear: currentYear.toString(),
        leaveMonth: "All Data",
      });
    } else if (selectedText == "WFH") {
      setWfhData({
        leaveYear: currentYear.toString(),
        leaveMonth: "All Data",
      });
    } else if (selectedText == "Leaves Request") {
      setLeaveWfhRequestdata({
        leaveYear: currentYear.toString(),
      });
    } else {
      setLeaveWfhRequestdata({
        leaveYear: currentYear.toString(),
      });
    }
  };
  const handleRefresh = async () => {
    await getEmployeeLeaveWfhrequest();
  };
  const getEmployeeLeaveWfhrequest = async () => {
    // setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMP_LEAVEREQUEST}?employee_id=${employeeId}`,
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
          dispatch(setLeaveWfhRequest(responseData?.data?.data));
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
  return (
    <div className="mainDivleave1">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 30,
          color: "black",
          padding: 15,
          textAlign: "left",
        }}
      >
        Leaves & WFH
      </h1>
      <div className="detailContainer1">
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
            {profileData?.image == null || profileData?.image == "undefined" ? (
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
            padding: "20px",
            display: "flex",
            flexWrap: "wrap",

            gap: "15px",
            alignItems: "center",
          }}
        >
          {/* Annual Leaves */}
          <div
            style={{
              flex: "1 1 calc(20% - 15px)",
              maxWidth: "200px",
              minWidth: "150px",
              height: "100px",
              border: "1px solid #fac4a7",
              display: "flex",
              marginLeft: -20,
              alignItems: "center",
              background: "#fff6f1",
              borderRadius: "5px",
            }}
          >
            <div
              style={{ width: "15px", height: "100%", background: "#f97d38" }}
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
                Annual Leaves
              </h1>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#f97d38",
                  //marginTop: -15,
                }}
              >
                {totalleaveData[0]?.total_leave_entitled}
              </h1>
            </div>
          </div>

          {/* Leave Collected */}
          <div
            style={{
              flex: "1 1 calc(20% - 15px)",
              maxWidth: "200px",
              minWidth: "150px",
              height: "100px",
              border: "1px solid #0f8e4d",
              display: "flex",
              alignItems: "center",
              background: "#cdf2df",
              borderRadius: "5px",
            }}
          >
            <div
              style={{ width: "15px", height: "100%", background: "#32b472" }}
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
                Leaves Collected
              </h1>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#2f669e",

                  margin: 0, // Completely removes margin
                  lineHeight: "1.2", // Keeps the spacing minimal
                }}
              >
                (current year + previous year)
              </h2>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#32b472",
                }}
              >
                {totalleaveData[0]?.leave_collected}
              </h1>
            </div>
          </div>

          {/* Paid Leaves */}
          <div
            style={{
              flex: "1 1 calc(20% - 15px)",
              maxWidth: "200px",
              minWidth: "150px",
              height: "100px",
              border: "1px solid #e2ac22",
              display: "flex",
              alignItems: "center",
              background: "#fffaee",
              borderRadius: "5px",
            }}
          >
            <div
              style={{ width: "15px", height: "100%", background: "#ffc834" }}
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
                {/* Paid Leaves */}
                Consumable Leaves
              </h1>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#ffc834",
                  // margin: "-10px",
                }}
              >
                {totalleaveData[0]?.paid_leave_taken}
              </h1>
            </div>
          </div>

          {/* Unpaid Leaves */}
          <div
            style={{
              flex: "1 1 calc(20% - 15px)",
              maxWidth: "200px",
              minWidth: "150px",
              height: "100px",
              border: "1px solid #d363ed",
              display: "flex",
              alignItems: "center",
              background: "#ead2ef",
              borderRadius: "5px",
            }}
          >
            <div
              style={{ width: "15px", height: "100%", background: "#c280d0" }}
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
                Unpaid Leaves
              </h1>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#c280d0",
                  // margin: "-10px 0",
                }}
              >
                {totalleaveData[0]?.unpaid_leave_taken}
              </h1>
            </div>
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
        >
          <BsFillLightbulbFill size={20} />
          <h1
            style={{
              fontSize: 16,
              fontWeight: "400",
              textAlign: "center",
              marginLeft: 10,
              marginTop: 10,
              textTransform: "none",
            }}
          >
            You will get 1 leave per month from your annual leave balance, as
            shown in the leave collected section.
          </h1>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 20,
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <h2
                style={{
                  borderBottom:
                    selectedText === "Leaves" ? "2px solid #047EFF" : "none",
                  paddingBottom: 8,
                  fontWeight: selectedText === "Leaves" ? "700" : "500",
                  cursor: "pointer",
                  color: selectedText === "Leaves" ? "#047EFF" : "#343741",
                }}
                onClick={() => changeText("Leaves")}
              >
                Leaves
              </h2>
              <h2
                style={{
                  marginLeft: 20,
                  borderBottom:
                    selectedText === "WFH" ? "2px solid #047EFF" : "none",
                  paddingBottom: 8,
                  fontWeight: selectedText === "WFH" ? "700" : "500",
                  cursor: "pointer",
                  color: selectedText === "WFH" ? "#047EFF" : "#343741",
                }}
                onClick={() => changeText("WFH")}
              >
                WFH
              </h2>
              <h2
                style={{
                  marginLeft: 20,
                  borderBottom:
                    selectedText === "Leaves Request"
                      ? "2px solid #047EFF"
                      : "none",
                  paddingBottom: 8,
                  fontWeight: selectedText === "Leaves Request" ? "700" : "500",
                  cursor: "pointer",
                  color:
                    selectedText === "Leaves Request" ? "#047EFF" : "#343741",
                }}
                onClick={() => changeText("Leaves Request")}
              >
                Leaves Request
              </h2>
              <h2
                style={{
                  marginLeft: 20,
                  borderBottom:
                    selectedText === "WFH Request"
                      ? "2px solid #047EFF"
                      : "none",
                  paddingBottom: 8,
                  fontWeight: selectedText === "WFH Request" ? "700" : "500",
                  cursor: "pointer",
                  color: selectedText === "WFH Request" ? "#047EFF" : "#343741",
                }}
                onClick={() => changeText("WFH Request")}
              >
                WFH Request
              </h2>
            </div>
            {(selectedText === "Leaves" || selectedText === "WFH") && (
              <div
                style={{
                  width: 100,
                  height: 35,
                  borderRadius: 6,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#047EFF", // Changed background color
                  marginLeft: "auto", // Push button to the end
                }}
              >
                <button
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  style={{
                    padding: "10px 10px",
                    fontSize: "16px",
                    color: "#fff",
                    background: "#007bff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "110px",
                    fontWeight: "500",
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedText === "Leaves" ? (
          <>
            <div style={{ width: "100%", marginTop: 20 }}>
              <div
                style={{
                  marginBottom: 20,

                  flexDirection: "row",
                  display: "flex",
                }}
              >
                <h1
                  style={{ color: "#155596", fontWeight: "700", fontSize: 25 }}
                >
                  Leaves History
                </h1>
                <div className="form-group2">
                  <label htmlFor="leaveYear">Year: </label>

                  <select
                    name="leaveYear"
                    id="leaveYear"
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
                  <label htmlFor="leaveMonth">Month: </label>

                  <select
                    name="leaveMonth"
                    id="leaveMonth"
                    value={formData.leaveMonth}
                    onChange={handleMonthChange}
                    required
                  >
                    <option value="All Data">All Data</option>
                    {generateMonths().map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                {(formData?.leaveYear !== currentYear.toString() ||
                  formData?.leaveMonth !== "All Data") && (
                  <div className="form-group32">
                    <button
                      type="button"
                      className="clear-filter-button"
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </div>

          
              <table className="employee-table23">
                <thead>
                  <tr>
                    <th>S.N</th>
                    <th>Leave Code</th>
                    <th>Leave Type</th>
                    <th>Leave Status</th>
                    <th>Salary Dec Day</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Total Days</th>
                    <th>Leave Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeaveData?.length > 0 ? (
                    filteredLeaveData.map((emp, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{emp.leave_code}</td>
                        <td>{emp.leave_type}</td>
                        <td>{emp.leave_status}</td>
                        <td>{emp?.salary_deduction_days}</td>
                        <td>{emp.leave_start_date}</td>
                        <td>{emp.leave_end_date}</td>
                        <td>{emp.total_days}</td>
                        <td>{emp.reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        <Lottie
                          animationData={Animation}
                          loop={true}
                          style={{
                            height: "300px",
                            width: "300px",
                            margin: "0 auto", // Ensures the Lottie animation is centered
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : selectedText === "WFH" ? (
          <>
            <div style={{ width: "100%", marginTop: 10 }}>
              <div
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center", // Align items vertically centered
                }}
              >
                <h1
                  style={{
                    color: "#155596",
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                >
                  WFH History
                </h1>

                <div className="form-group4">
                  <label htmlFor="leaveYear">Year: </label>

                  <select
                    name="leaveYear"
                    id="leaveYear"
                    value={wfhData.leaveYear}
                    onChange={handleYearChange}
                    required
                    style={{
                      height: "30px", // Reduced height for the dropdown
                      fontSize: "14px", // Adjusted font size for better readability
                      padding: "5px", // Added padding for a more consistent look
                    }}
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group4">
                  <label htmlFor="leaveMonth">Month: </label>

                  <select
                    name="leaveMonth"
                    id="leaveMonth"
                    value={wfhData.leaveMonth}
                    onChange={handleMonthChange}
                    required
                    style={{
                      height: "30px", // Reduced height for the dropdown
                      fontSize: "14px", // Adjusted font size
                      padding: "5px", // Added padding
                    }}
                  >
                    <option value="All Data">All Data</option>
                    {generateMonths().map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {(wfhData?.leaveYear !== currentYear.toString() ||
                  wfhData?.leaveMonth !== "All Data") && (
                  <div className="form-group32">
                    <button
                      type="button"
                      className="clear-filter-button"
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </div>

              {/* <table className="employee-table23">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>WFH Status</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Total Days</th>
                      <th>WFH Reason</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredWfhData?.map((emp, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>Approved</td>
                        <td>{emp?.wfh_start_date}</td>
                        <td>{emp?.wfh_end_date}</td>
                        <td>
                          {(() => {
                            if (emp?.wfh_start_date && emp?.wfh_end_date) {
                              const startDate = new Date(emp.wfh_start_date);
                              const endDate = new Date(emp.wfh_end_date);
                              const totalDays =
                                (endDate - startDate) / (1000 * 60 * 60 * 24) +
                                1; // Include both start and end date
                              return totalDays > 0
                                ? totalDays
                                : "Invalid Dates";
                            }
                            return "N/A"; // If either date is missing
                          })()}
                        </td>
                        <td>{emp?.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table> */}
              <table className="employee-table23">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>WFH Status</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Total Days</th>
                    <th>WFH Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredWfhData?.length > 0 ? (
                    filteredWfhData.map((emp, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>Approved</td>
                        <td>{emp?.wfh_start_date}</td>
                        <td>{emp?.wfh_end_date}</td>
                        <td>
                          {emp?.wfh_start_date && emp?.wfh_end_date
                            ? (() => {
                                const startDate = new Date(emp.wfh_start_date);
                                const endDate = new Date(emp.wfh_end_date);
                                const totalDays =
                                  (endDate - startDate) /
                                    (1000 * 60 * 60 * 24) +
                                  1;
                                return totalDays > 0
                                  ? totalDays
                                  : "Invalid Dates";
                              })()
                            : "N/A"}
                        </td>
                        <td>{emp?.reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        <Lottie
                          animationData={Animation}
                          loop={true}
                          style={{
                            height: "300px",
                            width: "300px",
                            margin: "0 auto", // Ensures proper centering
                          }}
                        />
                       
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : selectedText === "Leaves Request" ? (
          <PullToRefresh onRefresh={handleRefresh} canFetchMore={true}>
            <div style={{ width: "100%", marginTop: 10 }}>
              <div
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center", // Align items vertically centered
                }}
              >
                <h1
                  style={{
                    color: "#155596",
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                >
                  Leaves Request History
                </h1>

                <div className="form-group4">
                  <label htmlFor="leaveYear">Year: </label>

                  <select
                    name="leaveYear"
                    id="leaveYear"
                    value={leaveWfhRequestdata.leaveYear}
                    onChange={handleYearChange}
                    required
                    style={{
                      height: "30px", // Reduced height for the dropdown
                      fontSize: "14px", // Adjusted font size for better readability
                      padding: "5px", // Added padding for a more consistent look
                    }}
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {leaveWfhRequestdata?.leaveYear !== currentYear.toString() && (
                  <div className="form-group32">
                    <button
                      type="button"
                      className="clear-filter-button"
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </div>

              <table className="employee-table23">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Leave Code</th>
                    <th>Leave Type</th>
                    <th>Leave Status</th>
                    <th>Remark</th>
                    <th>From Date</th>
                    <th>TO Date</th>
                    <th>Total Days</th>
                    <th>Leave Reason</th>
                  </tr>
                </thead>

                {/* <tbody>
                    {filteredLeaveWfhRequestData
                      ?.filter((emp) => emp?.request_for !== "WFH") // Filter only 'WFH' requests
                      .map((emp, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{emp?.leave_name}</td>
                          <td>{emp?.request_for}</td>
                          <td
                            style={{
                              textAlign: "center",

                              // width: "75px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                alignSelf: "center",
                                backgroundColor:
                                  emp?.status === "Pending"
                                    ? "#DBEAFE"
                                    : emp?.status === "Approved"
                                    ? "#CCFBF1"
                                    : emp?.status === "Unapproved"
                                    ? "#FEF9C3"
                                    : "transparent",
                                borderRadius: "10px",
                                height: "30px",
                                width: "120px",
                                marginLeft: "30px",
                              }}
                            >
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    emp?.status === "Pending"
                                      ? "#1E40AF"
                                      : emp?.status === "Approved"
                                      ? "#115E59"
                                      : emp?.status === "Unapproved"
                                      ? "#854D0E"
                                      : "transparent",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <div
                                style={{
                                  // width: "70px",
                                  color:
                                    emp?.status === "Pending"
                                      ? "#1E40AF"
                                      : emp?.status === "Approved"
                                      ? "#115E59"
                                      : emp?.status === "Unapproved"
                                      ? "#854D0E"
                                      : "transparent",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                {emp?.status}
                              </div>
                            </div>
                          </td>
                          <td>{emp?.remarks}</td>
                          <td>{emp?.start_date}</td>
                          <td>{emp?.end_date}</td>
                          <td>{emp?.total_days}</td>
                          <td>{emp?.reason}</td>
                        </tr>
                      ))}
                  </tbody> */}
                <tbody>
                  {filteredLeaveWfhRequestData &&
                  filteredLeaveWfhRequestData.length > 0 &&
                  filteredLeaveWfhRequestData.some(
                    (emp) => emp?.request_for !== "WFH"
                  ) ? (
                    filteredLeaveWfhRequestData
                      .filter((emp) => emp?.request_for !== "WFH")
                      .map((emp, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{emp?.leave_name}</td>
                          <td>{emp?.request_for}</td>
                          <td style={{ textAlign: "center" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  emp?.status === "Pending"
                                    ? "#DBEAFE"
                                    : emp?.status === "Approved"
                                    ? "#CCFBF1"
                                    : emp?.status === "Unapproved"
                                    ? "#FEF9C3"
                                    : "transparent",
                                borderRadius: "10px",
                                height: "30px",
                                width: "120px",
                                marginLeft: "30px",
                              }}
                            >
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    emp?.status === "Pending"
                                      ? "#1E40AF"
                                      : emp?.status === "Approved"
                                      ? "#115E59"
                                      : emp?.status === "Unapproved"
                                      ? "#854D0E"
                                      : "transparent",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <div
                                style={{
                                  color:
                                    emp?.status === "Pending"
                                      ? "#1E40AF"
                                      : emp?.status === "Approved"
                                      ? "#115E59"
                                      : emp?.status === "Unapproved"
                                      ? "#854D0E"
                                      : "transparent",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                {emp?.status}
                              </div>
                            </div>
                          </td>
                          <td>{emp?.remarks}</td>
                          <td>{emp?.start_date}</td>
                          <td>{emp?.end_date}</td>
                          <td>{emp?.total_days}</td>
                          <td>{emp?.reason}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "00px",
                            width: "100%",
                          }}
                        >
                          <Lottie
                            animationData={Animation}
                            loop={true}
                            style={{
                              height: "300px",
                              width: "300px",
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PullToRefresh>
        ) : (
          <PullToRefresh onRefresh={handleRefresh} canFetchMore={true}>
            <div style={{ width: "100%", marginTop: 10 }}>
              <div
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center", // Align items vertically centered
                }}
              >
                <h1
                  style={{
                    color: "#155596",
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                >
                  WFH Request History
                </h1>

                <div className="form-group4">
                  <label htmlFor="leaveYear">Year: </label>

                  <select
                    name="leaveYear"
                    id="leaveYear"
                    value={leaveWfhRequestdata.leaveYear}
                    onChange={handleYearChange}
                    required
                    style={{
                      height: "30px", // Reduced height for the dropdown
                      fontSize: "14px", // Adjusted font size for better readability
                      padding: "5px", // Added padding for a more consistent look
                    }}
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {leaveWfhRequestdata?.leaveYear !== currentYear.toString() && (
                  <div className="form-group32">
                    <button
                      type="button"
                      className="clear-filter-button"
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </div>

              <table className="employee-table23">
                <thead>
                  <tr>
                    <th>S.No</th>

                    <th>WFH Type</th>
                    <th>WFH Status</th>
                    <th>Remark</th>
                    <th>From Date</th>
                    <th>TO Date</th>
                    <th>Total Days</th>
                    <th>WFH Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeaveWfhRequestData?.filter(
                    (emp) => emp?.request_for === "WFH"
                  ).length > 0 ? (
                    filteredLeaveWfhRequestData
                      .filter((emp) => emp?.request_for === "WFH")
                      .map((emp, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{emp?.request_for}</td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  emp?.status === "Pending"
                                    ? "#DBEAFE"
                                    : emp?.status === "Approved"
                                    ? "#CCFBF1"
                                    : emp?.status === "Unapproved"
                                    ? "#FEF9C3"
                                    : "transparent",
                                borderRadius: "10px",
                                height: "30px",
                                width: "120px",
                                marginLeft: "30px",
                              }}
                            >
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    emp?.status === "Pending"
                                      ? "#1E40AF"
                                      : emp?.status === "Approved"
                                      ? "#115E59"
                                      : emp?.status === "Unapproved"
                                      ? "#854D0E"
                                      : "transparent",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <div
                                style={{
                                  color:
                                    emp?.status === "Pending"
                                      ? "#1E40AF"
                                      : emp?.status === "Approved"
                                      ? "#115E59"
                                      : emp?.status === "Unapproved"
                                      ? "#854D0E"
                                      : "transparent",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                {emp?.status}
                              </div>
                            </div>
                          </td>
                          <td>{emp?.remarks}</td>
                          <td>{emp?.start_date}</td>
                          <td>{emp?.end_date}</td>
                          <td>{emp?.total_days}</td>
                          <td>{emp?.reason}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "300px", // Ensures proper vertical centering
                            width: "100%",
                          }}
                        >
                          <Lottie
                            animationData={Animation}
                            loop={true}
                            style={{
                              height: "300px",
                              width: "300px",
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PullToRefresh>
        )}
      </div>
      <ApplyEmployeeLeavs
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedText}
      />
    </div>
  );
};

export default Leaves;
