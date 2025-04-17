import React, { useEffect, useState } from "react";
import "./AdminLeaves.css";
import { FaEdit, FaSearch, FaTrash, FaUser } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { MdLaptopChromebook } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import { TfiLocationPin } from "react-icons/tfi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { BsFillLightbulbFill } from "react-icons/bs";
import AddLeaveStatusModal from "../AdminComponent/AddLeaveStatusModal";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import {
  setEmployeeLeaveDetails,
  setEmployeeindex,
  setWorkFromHome,
} from "../../Redux/Action";
import { FaHospitalUser } from "react-icons/fa";
import Lottie from "lottie-react";
import EditLeaveStatusModal from "../AdminComponent/EditLeaveStatusModal";
import { useCallback } from "react";
import WHFComponnent from "../AdminComponent/WHFComponnent";
import Animation from "../../Assets/animation.json";
import EditWHFComponnent from "../AdminComponent/EditWHFComponnent";

const AdminLeaves = () => {
  const [query, setQuery] = useState("");
const setLoading = () => { };
  const logout = () => { };
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [editWHFOpen, setEditWHFOpen] = useState(false);
  const [employeeLeave, setEmployeeLeave] = useState();
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [whfmodal, setWhfModal] = useState(false);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const getWorkFromHome = useSelector((state) => state.getWorkFromHome);
  const getEmployeeindex = useSelector((state) => state.getEmployeeindex);

  const [employee, setEmployee] = useState();
  const getEmployeeLeaveDetails = useSelector(
    (state) => state.getEmployeeLeaveDetails
  );
  const [filteredCategories, setFilteredCategories] =
    useState(getEmployeeDetails);
  const [filteredWfhData, setFilteredWfh] = useState(getWorkFromHome);
  const token = sessionStorage.getItem("authToken");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth(); // This gives you the month index (0-11)
  const currentMonthName = new Date(0, currentMonthIndex).toLocaleString(
    "default",
    { month: "long" }
  );
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: "All Data",
  });
  const [wfhData, setWfhData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: "All Data",
  });

  const [selectedText, setSelectedText] = useState("Leaves");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };

  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getEmployeeDetails.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.employee_code.toLowerCase().includes(lowerCaseQuery) ||
        item.email.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredCategories(filteredItems);
  };
  const handleClick = () => {
    // setOpen(true)
    if (selectedText == "Leaves") {
      setModalOpen(true);
    } else {
      setWhfModal(true);
    }
  };

  const getEmployeeLeavdDetails = useCallback(
    async (data) => {
      setLoading(true);

      try {
        const responseData = await axios.get(
          `${BaseUrl}${Api.GET_EMPLOYEE_LEAVE_DETAILS}?id=${getEmployeeDetails[data]?.id}`,
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
            dispatch(setEmployeeLeaveDetails(responseData?.data));
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
    },
    [token, dispatch, setLoading, logout]
  );
  const getEmployeeWorkfromdata = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GETWFH_DATA}?employee_id=${getEmployeeDetails[data]?.id}`,
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
  const handleRowClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    const index = getEmployeeDetails.findIndex((emp) => emp.id === employeeId);
   
    dispatch(setEmployeeindex(index));
    getEmployeeLeavdDetails(index);
    getEmployeeWorkfromdata(index);
  };
  useEffect(() => {
    if (getEmployeeDetails.length > 0) {
      getEmployeeLeavdDetails(getEmployeeindex);
      getEmployeeWorkfromdata(getEmployeeindex);
    }
  }, [dispatch, token, modalOpen, editmodalOpen, getEmployeeindex]);

  const editEmployeeLeaveDetails = (empData) => {
    setEmployeeLeave(empData);
    setTimeout(() => {
      setEditModalOpen(true);
    }, 1000);
  };

  const handleYearChange = (e) => {
    if (selectedText == "Leaves") {
      setFormData({ ...formData, leaveYear: e.target.value });
    } else {
      setWfhData({ ...wfhData, leaveYear: e.target.value });
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
      return months.slice(0, currentMonthIndex + 2);
    }
    return months;
  };
  useEffect(() => {
    const filterLeaveData = () => {
      const filteredData = getEmployeeLeaveDetails?.data?.filter((leave) => {
        // return (
        //   leave.year === formData.leaveYear
        //   &&leave.month === formData.leaveMonth
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
  }, [formData.leaveYear, formData.leaveMonth, getEmployeeLeaveDetails]);
  const handleClearFilter = () => {
    if (selectedText == "Leaves") {
      setFormData({
        leaveYear: currentYear.toString(),
        leaveMonth: "All Data",
      });
    } else {
      setWfhData({
        leaveYear: currentYear.toString(),
        leaveMonth: "All Data",
      });
    }
  };
  const commonTextStyle = {
    fontWeight: "500",
    fontSize: "13px",
    textAlign: "center",
    // marginLeft: 10,
    marginTop: 5,
    color: "#155596",
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
  const changeText = (text) => {
    setSelectedText(text);
  };

  const deleteEmployeeDetails = async () => {
    setLoading(true);
    try {
      const response = await axios(`${BaseUrl}${Api.DELETE_WFH}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: {
          auto_generated_id: employee?.id,
          employee_id: employee?.employee_id,
        },
      });

      if (response?.data?.authenticated === false) {
        toast.error(response?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (response?.data?.success === true) {
          toast.success(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          getEmployeeWorkfromdata(getEmployeeindex);
          setShowDialog(false);
          setLoading(false);
        } else {
          toast.error(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          setShowDialog(false);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
      setShowDialog(false);
      setLoading(false);
    } finally {
      setLoading(false);
      setShowDialog(false);
    }
  };
  const editEmployeeWHFdetails = (data) => {
    setEmployee(data);
    setTimeout(() => {
      setEditWHFOpen(true);
    }, 1000);
  };

  return (
    <div className="mainDivleave">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 20,
          color: "black",
          // padding: 15,
          marginTop:'15px',
          marginBottom:'15px',
          textAlign: "left",
        }}
      >
        Leaves & WFH
      </h1>
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
                  src={ImagePath + getEmployeeDetails[getEmployeeindex]?.image}
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
              justifyContent: "space-between",
              gap: "15px",
              alignItems: "center",
            }}
          >
            {/* Annual Leaves */}
            <div
              style={{
                flex: "1 1 calc(20% - 15px)",
                maxWidth: "250px",
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
                  {getEmployeeLeaveDetails?.leave_data?.total_leave_entitled}
                </h1>
              </div>
            </div>

            {/* Leave Collected */}
            <div
              style={{
                flex: "1 1 calc(20% - 15px)",
                maxWidth: "250px",
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
                  {getEmployeeLeaveDetails?.leave_data?.leave_collected}
                </h1>
              </div>
            </div>

            {/* Paid Leaves */}
            <div
              style={{
                flex: "1 1 calc(20% - 15px)",
                maxWidth: "250px",
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
                  {getEmployeeLeaveDetails?.leave_data?.paid_leave_taken}
                </h1>
              </div>
            </div>

            {/* Unpaid Leaves */}
            <div
              style={{
                flex: "1 1 calc(20% - 15px)",
                maxWidth: "250px",
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
                  {getEmployeeLeaveDetails?.leave_data?.unpaid_leave_taken}
                </h1>
              </div>
            </div>

            <div
              style={{
                flex: "1 1 calc(20% - 15px)",
                maxWidth: "250px",
                minWidth: "150px",
                display: "flex",
                // justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={handleClick}
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
                }}
              >
                {selectedText == "Leaves" ? "Apply Leave" : "Apply WFH"}
              </button>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: 50,
              marginTop: -20,
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
                flexDirection: "row",
                display: "flex",
                marginTop: 20,
                alignItems: "center",
              }}
            >
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
            </div>
          </div>
          {selectedText === "Leaves" ? (
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
                    Leave History
                  </h1>

                  <div className="form-group4">
                    <label htmlFor="leaveYear">Year: </label>

                    <select
                      name="leaveYear"
                      id="leaveYear"
                      value={formData.leaveYear}
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
                      value={formData.leaveMonth}
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
                <div className="employee-table12-container">
                  <table className="employee-table12">
                    <thead>
                      <tr>
                        <th>S.N</th>
                        <th>Leave Code</th>
                        <th>Leave Type</th>
                        <th>Leave Status</th>
                        <th>Salary Dec Day</th>
                        <th>Leave Reason</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Total Days</th>
                       
                        <th>Action</th>
                      </tr>
                    </thead>
                    {filteredLeaveData?.length > 0 ? (
                      <tbody>
                        {filteredLeaveData?.map((emp, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{emp?.leave_code}</td>
                            <td>{emp?.leave_type}</td>
                            <td>{emp?.leave_status}</td>
                            <td>{emp?.salary_deduction_days}</td>
                            <td>{emp?.reason}</td>
                            <td>{emp?.leave_start_date}</td>
                            <td>{emp?.leave_end_date}</td>
                            <td>{emp?.total_days}</td>
                            
                            <td>
                              <button
                                className="action-button"
                                onClick={() => {
                                  editEmployeeLeaveDetails(emp);
                                }}
                              >
                                <FaEdit />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tr>
                        <td colSpan="10" style={{ textAlign: "center" }}>
                          <Lottie
                            animationData={Animation}
                            loop={true}
                            style={{
                              height: "300px",
                              width: "300px",
                              margin: "0 auto",
                            }}
                          />
                        </td>
                      </tr>
                    )}
                  </table>
                </div>
              </div>
            </>
          ) : (
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

                <table className="employee-table12">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>WFH Status</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Total Days</th>
                      <th>WFH Reason</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  {filteredWfhData?.length > 0 ? (
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
                                  (endDate - startDate) /
                                    (1000 * 60 * 60 * 24) +
                                  1; // Include both start and end date
                                return totalDays > 0
                                  ? totalDays
                                  : "Invalid Dates";
                              }
                              return "N/A"; // If either date is missing
                            })()}
                          </td>
                          {/* <td>{emp?.reason}</td> */}
                          {/* <td
                            style={{
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              maxWidth: "250px",
                            }}
                          >
                            {emp?.reason?.split(" ").length > 14 ? (
                              <>
                                {emp?.reason.split(" ").slice(0, 14).join(" ")}
                                <br />
                                {emp?.reason.split(" ").slice(14).join(" ")}
                              </>
                            ) : (
                              emp?.reason
                            )}
                          </td> */}
                          <td
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              maxWidth: "550px",
                            }}
                          >
                            {(() => {
                              const words = emp?.reason?.split(" ") || [];
                              const chunkSize = 30; // Change this to 20 or 30 if needed

                              return words.length > chunkSize ? (
                                <>
                                  {words.slice(0, chunkSize).join(" ")}
                                  <br />
                                  {words.slice(chunkSize).join(" ")}
                                </>
                              ) : (
                                emp?.reason
                              );
                            })()}
                          </td>
                          <td>
                            <button
                              className="action-button"
                              onClick={() => {
                                editEmployeeWHFdetails(emp);
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-button"
                              onClick={() => {
                                setEmployee(emp);
                                setShowDialog(true);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ textAlign: "center" }}>
                        <Lottie
                          animationData={Animation}
                          loop={true}
                          style={{
                            height: "300px",
                            width: "300px",
                            margin: "0 auto",
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </table>
              </div>
            </>
          )}
          {showDialog && (
            <div className="dialog-backdrop">
              <div className="dialog">
                <p>Alert!</p>
                <p>Do you want employee WFH details?</p>

                <div className="dialog-buttons">
                  <button
                    onClick={() => deleteEmployeeDetails()}
                    className="confirm-btn"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDialog(false)}
                    className="cancel-btn"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
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

          {filteredCategories?.map((emp) => (
            <div key={emp.id}>
              <div
                className={`employee-item ${
                  getEmployeeDetails.findIndex((e) => e.id === emp.id) ===
                  getEmployeeindex
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleRowClick(emp.id)}
              >
                <img
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
                  <h3 className="employee-name12">{emp.name}</h3>
                  <h4 className="employee-name1">{emp.employee_code}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {getEmployeeDetails?.length > 0 && (
        <>
          <AddLeaveStatusModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            user={getEmployeeDetails[getEmployeeindex]}
          />

          <WHFComponnent
            open={whfmodal}
            onClose={() => setWhfModal(false)}
            user={getEmployeeDetails[getEmployeeindex]}
          />
          <EditWHFComponnent
            open={editWHFOpen}
            onClose={() => setEditWHFOpen(false)}
            user={getEmployeeDetails[getEmployeeindex]}
            wdfData={employee}
          />

          <EditLeaveStatusModal
            open={editmodalOpen}
            onClose={() => setEditModalOpen(false)}
            user={getEmployeeDetails[getEmployeeindex]}
            leave={employeeLeave}
          />
        </>
      )}
    </div>
  );
};

export default AdminLeaves;
