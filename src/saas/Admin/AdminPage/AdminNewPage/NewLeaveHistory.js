import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api, BaseUrl, ImagePath, ImagePath1 } from "../../../Config/Api";
import { COLOR, FONT, IMAGE } from "../../../Config/Color";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  setEmployeeindex,
  // setEmployeeLeaveDetails,
  setUserDetails,
  // setWorkFromHome,
} from "../../../Redux/Action";
import "../AdminNewPage/Style/NewLeaveHistory.css";
import { BsFillLightbulbFill } from "react-icons/bs";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import EditLeaveStatusModal from "../../AdminComponent/EditLeaveStatusModal";
import AddLeaveStatusModal from "../../AdminComponent/AddLeaveStatusModal";
import WHFComponnent from "../../AdminComponent/WHFComponnent";
import EditWHFComponnent from "../../AdminComponent/EditWHFComponnent";
import MainLayout from "../../../../layouts/MainLayout";
import { getEmployeeData } from "../../../../redux/actions/adminAction";
const NewLeaveHistory = () => {
  const dispatch = useDispatch();
  const setLoading = () => { };
  const logout = () => { };
  const token = sessionStorage.getItem("authToken");
  const [employeeLeave, setEmployeeLeave] = useState();
  const [query, setQuery] = useState("");
  const [editWHFOpen, setEditWHFOpen] = useState(false);
  const getEmployeeDetails = useSelector(
    (state) => state?.adminData?.employeeListData
  );
  const [currentEmpIndex, setCurrentEmpIndex] = useState(0);

  const [getWorkFromHome ,setWorkFromHome] = useState();
  // const getWorkFromHome = useSelector((state) => state.getWorkFromHome);
  // const currentEmpIndex = useSelector((state) => state.currentEmpIndex);
  const [filteredWfhData, setFilteredWfh] = useState(getWorkFromHome);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [activeTab, setActiveTab] = useState("Leaves");
  const tabs = ["Leaves", "WFH"];
  const [selectedText, setSelectedText] = useState("Leaves");
  const [employee, setEmployee] = useState();
  const [getEmployeeLeaveDetails ,setEmployeeLeaveDetails] = useState({})
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [whfmodal, setWhfModal] = useState(false);
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
  useEffect(() => {
    dispatch(getEmployeeData());
  }, []);
  const handleRowClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    const index = getEmployeeDetails.findIndex((emp) => emp.id === employeeId);
    setCurrentEmpIndex(index);
    getEmployeeLeavdDetails(index);
    getEmployeeWorkfromdata(index);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleYearChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    if (selectedText == "Leaves") {
      setFormData({ ...formData, leaveYear: e.target.value });
    } else {
      setWfhData({ ...wfhData, leaveYear: e.target.value });
    }
  };
  const handleMonthChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    if (activeTab == "Leaves") {
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
  const handleClick = () => {
    // setOpen(true)
    if (activeTab == "Leaves") {
      setModalOpen(true);
    } else {
      setWhfModal(true);
    }
  };

  useEffect(() => {
    const filterLeaveData = () => {
      const filteredData = getEmployeeLeaveDetails?.data?.filter((leave) => {
        return (
          leave?.year === formData?.leaveYear &&
          (formData?.leaveMonth === "All Data" ||
            leave?.month === formData.leaveMonth)
        );
      });

      setFilteredLeaveData(filteredData);
    };

    filterLeaveData();
  }, [formData.leaveYear, formData.leaveMonth, getEmployeeLeaveDetails]);
  useEffect(() => {
    const filterLeaveData = () => {
      const filteredData = getWorkFromHome?.filter((leave) => {
        return (
          leave.year === formData.leaveYear &&
          (formData.leaveMonth === "All Data" ||
            leave.month === formData.leaveMonth)
        );
      });

      setFilteredWfh(filteredData);
    };

    filterLeaveData();
  }, [formData.leaveYear, formData.leaveMonth, getWorkFromHome]);



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
          toast.error(responseData?.data?.mssg[0]);
          logout();
        } else {
          if (responseData?.data?.valid === false) {
            toast.error(responseData?.data?.mssg[0], {
              position: "top-center",
              autoClose: 1000,
            });
            setLoading(false);
          } else {
            setEmployeeLeaveDetails(responseData?.data);
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
        toast.error(responseData?.data?.mssg[0]);
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0]);
          setLoading(false);
        } else {
          setWorkFromHome(responseData?.data?.data);
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

  // console.log("getEmployeeDetails", getEmployeeDetails);

  useEffect(() => {
    if (getEmployeeDetails.length > 0) {
      getEmployeeLeavdDetails(currentEmpIndex);
      getEmployeeWorkfromdata(currentEmpIndex);
    }
  }, [dispatch, token, modalOpen, editmodalOpen, currentEmpIndex]);
  const handleClearFilter = () => {
    setIsDisabled(true);
    setIsFilterApplied(false);
    if (activeTab == "Leaves") {
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
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",

      key: "sn",
      render: (_, record, index) => (
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <div style={getRowStyle(record)}></div> */}
          {index + 1}
        </div>
      ),
    },
    {
      title: "LEAVE CODE",
      dataIndex: "leave_code",
      filterMultiple: true,
      key: "leave_code",
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
      title: "LEAVE TYPE",
      dataIndex: "leave_type",
      key: "leave_type",

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
      title: "LEAVE STATUS",
      dataIndex: "leave_status",
      key: "leave_status",
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
      title: "FROM DATE",
      dataIndex: "leave_start_date",
      key: "leave_start_date",
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
      title: "TO DATE",
      dataIndex: "leave_end_date",
      key: "leave_end_date",
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
      title: "DAYS",
      dataIndex: "total_days",
      key: "total_days",
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
      title: "SALARY DEDUCTION DAYS",
      dataIndex: "salary_deduction_days", // Use appropriate dataIndex if needed
      key: "salary_deduction_days",
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
      title: "LEAVE REASON",
      dataIndex: "reason",
      key: "reason",
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
      title: "ACTION",
      render: (rowData) => (
        <div>
          <img
            src={IMAGE.EDIT}
            style={{ width: 20, height: 20 }}
            onClick={() => editEmployeeLeaveDetails(rowData)}
          />
        </div>
      ),
    },
  ];
  const editEmployeeLeaveDetails = (empData) => {
    setEmployeeLeave(empData);
    setTimeout(() => {
      setEditModalOpen(true);
    }, 1000);
  };
  const editEmployeeWHFdetails = (data) => {
    setEmployee(data);
    setTimeout(() => {
      setEditWHFOpen(true);
    }, 1000);
  };
  const columns1 = [
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
          {/* <div style={getRowStyle(record)}></div> */}
          {index + 1}
        </div>
      ),
    },
    // {
    //   title: "WFH STATUS",
    //   dataIndex: "leave_code",
    //   filterMultiple: true,
    //   key: "leave_code",
    //   render: (text) => (
    //     <span
    //       style={{
    //         fontFamily: "Inter",
    //         fontWeight: "600",
    //         fontSize: "14px",
    //         lineHeight: "20px",
    //         color: COLOR.GRAY4,
    //       }}
    //     >
    //       {text}
    //     </span>
    //   ),
    // },

    {
      title: "FROM DATE",
      dataIndex: "wfh_start_date",
      key: "wfh_start_date",

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
      title: "TO DATE",
      dataIndex: "wfh_end_date",
      key: "wfh_end_date",
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
      title: "DAYS",
      dataIndex: "wfh_start_date", // Use appropriate dataIndex if needed
      key: "days",
      render: (_, emp) => {
        if (emp?.wfh_start_date && emp?.wfh_end_date) {
          const startDate = new Date(emp.wfh_start_date);
          const endDate = new Date(emp.wfh_end_date);
          const totalDays =
            Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Include both start and end date

          return totalDays > 0 ? totalDays : "Invalid Dates";
        }
        return "N/A"; // If either date is missing
      },
    },
    {
      title: "WFH REASON",
      dataIndex: "reason",
      key: "reason",
      width: 200,
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
      render: (rowData) => (
        <div>
          <img
            src={IMAGE.EDIT}
            style={{ width: 20, height: 20 }}
            onClick={() => editEmployeeWHFdetails(rowData)}
          />
        </div>
      ),
    },
  ];
  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <div className="newattendance-container">
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
              Leave & WFO History
            </h2>

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

                  maxHeight: "90vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <div className="p-4 rounded-lg bg-white shadow-sm">
                  <div className="flex items-start space-x-6 p-4">
                    {getEmployeeDetails[currentEmpIndex]?.image == null ? (
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
                          {getEmployeeDetails[currentEmpIndex]?.name
                            .charAt(0)
                            .toUpperCase()}
                        </h1>
                      </div>
                    ) : (
                      <img
                        src={ImagePath + getEmployeeDetails[currentEmpIndex]?.image}
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
                        {getEmployeeDetails[currentEmpIndex]?.name}
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
                        {getEmployeeDetails[currentEmpIndex]?.designation}
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
                            {getEmployeeDetails[currentEmpIndex]?.employee_code}
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
                            {getEmployeeDetails[currentEmpIndex]?.mobile}
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
                            {getEmployeeDetails[currentEmpIndex]?.email}
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
                            {getEmployeeDetails[currentEmpIndex]?.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="leave-summary-container flex justify-between items-center mt-2 px-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="leavehistory-card  annualhistory-leaves">
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontSize: "20px",
                            lineHeight: "28px",
                            color: "#FF9500",
                            fontWeight: "600",
                          }}
                        >
                          {getEmployeeLeaveDetails?.leave_data?.total_leave_entitled}
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
                          Annual Leaves
                        </span>
                      </div>
                      <div className="leavehistory-card collectedhistory-leaves">
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontSize: "20px",
                            lineHeight: "28px",
                            color: "#34C759",
                            fontWeight: "600",
                          }}
                        >
                          {getEmployeeLeaveDetails?.leave_data?.leave_collected}
                        </span>
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontSize: "11px",
                            lineHeight: "16px",
                            color: "#34C759",
                            fontWeight: "500",
                          }}
                        >
                          (Current year + Previous year)
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
                          Leave Collected
                        </span>
                      </div>
                      <div className="leavehistory-card paidhistory-collected">
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontSize: "20px",
                            lineHeight: "28px",
                            color: "#FFCC00",
                            fontWeight: "600",
                          }}
                        >
                          {getEmployeeLeaveDetails?.leave_data?.paid_leave_taken}
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
                          Consumable Leaves
                        </span>
                      </div>

                      <div className="leavehistory-card unpaidhistory-leaves">
                        <span
                          style={{
                            fontFamily: FONT.INTER,
                            fontSize: "20px",
                            lineHeight: "28px",
                            color: "#AF52DE",
                            fontWeight: "600",
                          }}
                        >
                          {getEmployeeLeaveDetails?.leave_data?.unpaid_leave_taken}
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
                          Unpaid Leaves
                        </span>
                      </div>
                    </div>

                    <button className="apply-wfh-btn ml-auto" onClick={handleClick}>
                      Apply {activeTab}
                    </button>
                  </div>
                  {/* <div
              style={{
                width: "100%",
                height: 50,
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "15px",
                justifyContent: "flex-start",
              }}
            >
              <BsFillLightbulbFill size={15} />
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  textAlign: "center",
                  marginLeft: 10,

                  textTransform: "none",
                }}
              >
                You will get 1 leave per month from your annual leave balance,
                as shown in the leave collected section.
              </h1>
            </div> */}
                  <div
                    style={{
                      width: "100%",
                      height: "auto",
                      marginTop: 10,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: "15px",
                      justifyContent: "flex-start",
                      borderBottom: "2px solid #F1F1F4", // Add this for the line
                      paddingBottom: 20, // Optional: Adds space between the text and the line
                      marginBottom: 20,
                    }}
                  >
                    <BsFillLightbulbFill size={15} />
                    <h1
                      style={{
                        fontSize: 16,
                        fontWeight: "400",
                        textAlign: "center",
                        marginLeft: 10,
                        marginTop: 15,
                        textTransform: "none",
                      }}
                    >
                      You will get 1 leave per month from your annual leave balance,
                      as shown in the leave collected section.
                    </h1>
                  </div>

                  <div className="flex space-x-7 ml-5">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          lineHeight: "24px",
                          fontFamily: "Inter",
                        }}
                        className={`pb-1 font-medium ${activeTab === tab
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-[#78829D]"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

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
                      {activeTab} History
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
                          <option value="All Data">All Data</option>
                          {generateMonths().map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
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

                  {activeTab === "Leaves" ? (
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
                        pagination={{ pageSize: 5 }}
                        rowClassName={() => "custom-row"}
                        bordered={false}
                        style={{ tableLayout: "fixed" }}
                        rowKey="key"
                        locale={{
                          emptyText: (
                            <div className="custom-no-data">No Leave Data Found</div>
                          ),
                        }}
                      />
                    </div>
                  ) : (
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
                        columns={columns1}
                        dataSource={filteredWfhData}
                        pagination={{ pageSize: 5, position: ["bottomRight"] }}
                        rowClassName={() => "custom-row"}
                        bordered={false}
                        tableLayout="fixed"
                        rowKey="key"
                        scroll={{ x: 1000 }} // Ensures proper scrolling behavior
                        locale={{
                          emptyText: (
                            <div className="custom-no-data">No WFH Data Found</div>
                          ),
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  width: "24%",
                  justifyContent: "flex-start",
                  maxHeight: "90vh", // Adjust height as needed
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
                {getEmployeeDetails?.filter((item) => {
                  if (query) {
                    return (
                      item?.name.toLowerCase().includes(query.toLowerCase()) ||
                      item?.employee_code.toLowerCase().includes(query.toLowerCase()) ||
                      item?.email.toLowerCase().includes(query.toLowerCase())
                    );
                  }
                  return item
                })?.map((emp, index) => (
                  <div key={index}>
                    <div
                      className={`employee-item ${getEmployeeDetails.findIndex((e) => e?.id === emp?.id) ===
                        currentEmpIndex
                        ? "selected"
                        : ""
                        }`}
                      onClick={() => handleRowClick(emp?.id)}
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
            {getEmployeeDetails?.length > 0 && (
              <>
                <AddLeaveStatusModal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  user={getEmployeeDetails[currentEmpIndex]}
                />

                <WHFComponnent
                  open={whfmodal}
                  onClose={() => setWhfModal(false)}
                  user={getEmployeeDetails[currentEmpIndex]}
                />
                <EditWHFComponnent
                  open={editWHFOpen}
                  onClose={() => setEditWHFOpen(false)}
                  user={getEmployeeDetails[currentEmpIndex]}
                  wdfData={employee}
                />

                <EditLeaveStatusModal
                  open={editmodalOpen}
                  onClose={() => setEditModalOpen(false)}
                  user={getEmployeeDetails[currentEmpIndex]}
                  leave={employeeLeave}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewLeaveHistory;
