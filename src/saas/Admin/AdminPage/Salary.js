import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Salary.css";
import { FaEdit, FaSearch, FaUser } from "react-icons/fa";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { FaHospitalUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MdLaptopChromebook } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import { TfiLocationPin } from "react-icons/tfi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import Lottie from "lottie-react";
import Animation from "../../Assets/animation.json";
import { setEmployeeindex } from "../../Redux/Action";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { toast } from "react-toastify";
import SalaryBack from "../../Assets/salaryback.png";
import { GrEdit } from "react-icons/gr";
import axios from "axios";
import MaterialTable from "material-table";

const commonTextStyle = {
  fontWeight: "500",
  fontSize: "13px",
  textAlign: "center",
  // marginLeft: 10,
  marginTop: 5,
  color: "#155596",
};
const Salary = () => {
  const [query, setQuery] = useState("");
  const token = sessionStorage.getItem("authToken");
  const dispatch = useDispatch();
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const getEmployeeindex = useSelector((state) => state.getEmployeeindex);
  const [salaryCount, setSalaerCount] = useState([]);
  const [lateCount, setLateCount] = useState(0);
  const [salaryDays, setSalaryDays] = useState(0);
  const [inputValue, setInputValue] = useState(3);
  const [employeeSalary, setEmployeeSalary] = useState([]);
  const [EmployeeSalaryHistory, setEmployeeSalaryHistory] = useState([]);
  const inputRef = useRef(null);
  const [amount, setAmount] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const employeeId = sessionStorage.getItem("employeeId");
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const [filterSalaryData, setFilteredSalaryData] = useState([]);
  const currentMonthName = new Date(0, currentMonthIndex).toLocaleString(
    "default",
    { month: "long" }
  );
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: "All Data",
  });

  const [filteredCategories, setFilteredCategories] =
    useState(getEmployeeDetails);
const setLoading = () => { };
  const logout = () => { };
  useEffect(() => {
    getLateCount();
  }, [inputValue, salaryCount, salaryDays]);
  const handleSubmit = async (e) => {};
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
  const handleRowClick = (employeeId) => {
    setSalaryDays(0);
    const index = getEmployeeDetails.findIndex((emp) => emp.id === employeeId);
    dispatch(setEmployeeindex(index));
    getEmployeeSalary(index);
    getEmployeeSalaryDetails(index);
    setAmount(0);
    setNetSalary(0);
  };
  const getEmployeeSalary = useCallback(
    async (data) => {
      setLoading(true);

      try {
        const responseData = await axios.get(
          `${BaseUrl}${Api.SALARY_CALCULATION}?id=${getEmployeeDetails[data]?.id}`,
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
            setSalaerCount(responseData?.data?.data);

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
  const getEmployeeSalaryDetails = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const responseData = await axios.get(
          `${BaseUrl}${Api.GET_EMPLOYEE_SALARY}?employee_id=${getEmployeeDetails[data]?.id}`,
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
          } else if (responseData?.data?.success == true) {
            setEmployeeSalary(responseData?.data?.data);
            setLoading(false);
          } else {
            setEmployeeSalary([]);
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
  useEffect(() => {
    if (getEmployeeDetails.length > 0) {
      getEmployeeSalary(getEmployeeindex);
      getEmployeeSalaryDetails(getEmployeeindex);
      allSalary();
    }
  }, [dispatch, token]);

  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  const columns = [
    {
      title: "SN.",
      field: "sn",

      cellStyle: {
        left: 0,
        backgroundColor: "#fff",
        zIndex: 1,
      },
    },
    { title: "Name", field: "name" },
    { title: "Month", field: "month" },
    {
      title: "Year",
      field: "year",
    },
    {
      title: "Paid Leave",
      field: "paidLeave",
      render: (rowData) => {
        const totalPaidLeave =
          (rowData.paid_full_day || 0) + (rowData.paid_half_day || 0);
        return totalPaidLeave.toString();
      },
    },
    { title: "Total Late", field: "lateCount" },
    {
      title: "UnPaid Leave",
      field: "unPaidLeave",
      render: (rowData) => {
        const totalPaidLeave =
          (rowData.unaprove_full_day || 0) +
          (rowData.unaprove_half_day || 0) +
          (rowData.unpaid_full_day || 0) +
          (rowData.unpaid_half_day || 0);
        return totalPaidLeave.toString();
      },
    },
    { title: "Total Leave", field: "total_Leave" },
    {
      title: "Total Days",
      field: "total_days",
    },
    {
      title: "Total Deduction",
      field: "total_salary_deduction",
      cellStyle: { color: "red", textAlign: "center" }, // Styling for the 'Total Deduction' column
    },

    {
      title: "Total Salary Days",
      field: "salary_days",
    },
  ];
  const getLateCount = () => {
    const lateCountValue = Number(salaryCount[0]?.lateCount);

    const inputValueNum = Number(inputValue);

    if (lateCountValue <= inputValueNum) {
      setLateCount(0);
    } else {
      const totalLate = lateCountValue - inputValueNum;
      setLateCount(totalLate);
    }
  };
  const calculateSalaryDays = () => {
    let salaryDaysdata = 0;

    if (lateCount > 0) {
      salaryDaysdata =
        salaryCount[0]?.total_days -
        salaryCount[0]?.total_salary_deduction -
        salaryCount[0]?.days_befor_joining -
        lateCount / 2;
    } else {
      salaryDaysdata =
        salaryCount[0]?.total_days -
        salaryCount[0]?.total_salary_deduction -
        salaryCount[0]?.days_befor_joining;
    }
    const result = (
      (amount / salaryCount[0]?.total_days) *
      salaryDaysdata
    ).toFixed(2);
    setNetSalary(result);

    setSalaryDays(salaryDaysdata);
  };
  const saveSalaryDetails = async (salaryData) => {
    if (salaryDays <= 0) {
      toast.error("Please Calculate Salary  First", {
        position: "top-center",
        autoClose: 1500,
      });
    } else {
      setLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("employee_id", salaryData[0]?.employee_id);
        formDataToSend.append("lateCount", salaryData[0]?.lateCount);
        formDataToSend.append("ontime", salaryData[0]?.ontime);
        formDataToSend.append("total_Leave", salaryData[0]?.total_Leave);
        formDataToSend.append("paid_full_day", salaryData[0]?.paid_full_day);
        formDataToSend.append("paid_half_day", salaryData[0]?.paid_half_day);
        formDataToSend.append(
          "unpaid_full_day",
          salaryData[0]?.unpaid_full_day
        );
        formDataToSend.append(
          "unpaid_half_day",
          salaryData[0]?.unpaid_half_day
        );
        formDataToSend.append(
          "unaprove_full_day",
          salaryData[0]?.unaprove_full_day
        );
        formDataToSend.append(
          "unaprove_half_day",
          salaryData[0]?.unaprove_half_day
        );
        if (lateCount > 0) {
          formDataToSend.append(
            "total_salary_deduction",
            salaryData[0]?.total_salary_deduction + lateCount / 2
          );
        } else {
          formDataToSend.append(
            "total_salary_deduction",
            salaryData[0]?.total_salary_deduction
          );
        }

        formDataToSend.append("total_days", salaryData[0]?.total_days);
        formDataToSend.append("salary_days", salaryDays);
        formDataToSend.append("salary_calculated_by", employeeId);

        const response = await axios.post(
          `${BaseUrl}${Api.SALARY_SUBMIT}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.authenticated === false) {
          toast.error(response?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          logout();
          setLoading(false);
        } else {
          if (response?.data?.valid === false) {
            setLoading(false);
            toast.error(response?.data?.mssg[0], {
              position: "top-center",
              autoClose: 1000,
            });
          } else {
            if (response?.data?.success === true) {
              toast.success("Salary submission completed successfully.", {
                position: "top-center",
                autoClose: 1000,
              });
              setLoading(false);
              setSalaryDays(0);
              getEmployeeSalary(getEmployeeindex);
              getEmployeeSalaryDetails(getEmployeeindex);
              allSalary();
            } else {
              toast.error(response?.data?.mssg, {
                position: "top-center",
                autoClose: 1000,
              });
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error("API call failed:", error);
        alert("An error occurred. Please try again.");
        setLoading(false);
      } finally {
      }
    }
  };
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  const memoizedData = useMemo(() => {
    return employeeSalary?.map((employee, index) => ({
      ...employee,
      sn: index + 1,
    }));
  }, [filteredCategories, employeeSalary]);
  const memoizedData1 = useMemo(() => {
    return filterSalaryData?.map((employee, index) => ({
      ...employee,
      sn: index + 1,
    }));
  }, [EmployeeSalaryHistory, filterSalaryData]);
  const allSalary = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_ALL_SALARY}`, {
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
        } else if (responseData?.data?.success == true) {
          setEmployeeSalaryHistory(responseData?.data?.data);
          // setFilteredSalaryData(responseData?.data?.data);

          setLoading(false);
        } else {
          setEmployeeSalaryHistory([]);
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

  const handleYearChange = (e) => {
    setFormData({ ...formData, leaveYear: e.target.value });
  };
  const handleMonthChange = (e) => {
    setFormData({ ...formData, leaveMonth: e.target.value });
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
  const handleClearFilter = () => {
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: "All Data",
    });
  };
  // useEffect(() => {
  //   const filterLeaveData = () => {
  //     const filteredData = EmployeeSalaryHistory?.filter((leave) => {
  //       return (
  //         leave.year == formData.leaveYear &&
  //         (formData.leaveMonth == "All Data" ||
  //           leave.month == formData.leaveMonth)
  //       );
  //     });

  //     setFilteredSalaryData(filteredData);
  //   };

  //   filterLeaveData();
  // }, [EmployeeSalaryHistory,formData.leaveYear, formData.leaveMonth,]);

  useEffect(() => {
    const filterLeaveData = () => {
      if (!EmployeeSalaryHistory || EmployeeSalaryHistory.length === 0) return;

      const filteredData = EmployeeSalaryHistory?.filter((leave) => {
        return (
          leave.year.toString() == formData.leaveYear &&
          (formData.leaveMonth == "All Data" ||
            leave.month == formData.leaveMonth)
        );
      });

      setFilteredSalaryData(filteredData);
    };

    filterLeaveData();
  }, [EmployeeSalaryHistory, formData?.leaveYear, formData?.leaveMonth]);
  return (
    <div className="mainDivleave">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 20,
          color: "black",
          marginTop: "15px",
          marginBottom: "15px",
          textAlign: "left",
        }}
      >
        Salary Details
      </h1>
      <div>
        <div className="switch-container" style={{}}>
          <label className="switch">
            <input type="checkbox" checked={isOn} onChange={toggleSwitch} />
            <span className="slider"></span>
          </label>
          <p>
            {isOn ? "Switch to single employee" : "Switch to all employees"}
          </p>
        </div>
      </div>
      {isOn === false ? (
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
            <div style={{ width: "100%", marginTop: 10 }}>
              <h1
                style={{
                  color: "#155596",
                  fontWeight: "700",
                  fontSize: 20,
                  textAlign: "left",
                }}
              >
                Salary Information ({salaryCount[0]?.month})
              </h1>

              <div className="summary-cards">
                <div className="totaldaycard">
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ justifyContent: "center" }}>
                      <h1
                        style={{
                          fontWeight: "600",
                          textAlign: "center",
                          fontSize: 17,
                          marginLeft: 20,
                          marginTop: 20,
                          color: "black",
                        }}
                      >
                        Total Days
                      </h1>
                      <h1
                        style={{
                          fontWeight: "600",
                          marginLeft: 25,
                          fontSize: 17,
                          marginTop: 20,
                          color: "black",
                        }}
                      >
                        {salaryCount[0]?.total_days}
                      </h1>
                    </div>

                    <img
                      src={SalaryBack}
                      style={{
                        width: 80,
                        height: 80,
                        marginTop: 40,
                      }}
                    />
                  </div>
                </div>
                <div className="mainLeavecxard">
                  <div
                    style={{
                      width: "49%",
                      height: "100%",
                      borderRadius: 8,
                      background: "#f9f9f9",

                      borderWidth: 2,
                      borderColor: "#EFF6FF",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "30%",
                        marginTop: 15,
                        alignItems: "center",
                      }}
                    >
                      <h2
                        style={{
                          fontWeight: "600",
                          fontSize: 25,
                          fontSize: 18,
                          color: "black",
                          textAlign: "center",
                        }}
                      >
                        Consumable Leaves
                      </h2>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "70%",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          height: "100%",
                          flexDirection: "row",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: "2%",
                            height: "100%",
                            marginLeft: 20,
                            background: "green",
                          }}
                        ></div>
                        <div
                          style={{
                            width: "98%",
                            height: "100%",
                          }}
                        >
                          <h2
                            style={{
                              fontWeight: "600",
                              fontSize: 18,
                              marginLeft: 20,
                              textAlign: "center",
                              color: "#6C757D",
                            }}
                          >
                            Full Days
                          </h2>
                          <h2
                            style={{
                              fontWeight: "600",
                              textAlign: "center",
                              marginLeft: 20,
                              color: "#1A202C",
                              marginTop: 10,
                            }}
                          >
                            {salaryCount[0]?.paid_full_day}
                          </h2>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "50%",
                          height: "100%",
                          flexDirection: "row",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: "2%",
                            height: "100%",
                            marginLeft: 20,
                            background: "#1E40AF",
                          }}
                        ></div>
                        <div
                          style={{
                            width: "98%",
                            height: "100%",
                          }}
                        >
                          <h2
                            style={{
                              fontWeight: "600",
                              textAlign: "center",
                              marginLeft: 20,
                              color: "#6C757D",
                            }}
                          >
                            Half Days
                          </h2>
                          <h2
                            style={{
                              fontWeight: "600",
                              textAlign: "center",
                              marginLeft: 20,
                              color: "#1A202C",
                              marginTop: 10,
                            }}
                          >
                            {salaryCount[0]?.paid_half_day}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "49%",
                      height: "100%",
                      borderRadius: 8,
                      background: "#f9f9f9",
                      borderWidth: 2,
                      borderColor: "#EFF6FF",
                      overflow: "hidden",
                    }}
                  >
                    <h2
                      style={{
                        fontWeight: "600",
                        fontSize: 18,
                        marginLeft: 20,
                        marginTop: 10,
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Unpaid Leave
                    </h2>
                    <div
                      style={{
                        width: "100%",
                        height: 40,
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span className="dot on-time"></span>

                      <h2
                        style={{
                          marginLeft: 10,
                          fontSize: 17,
                          fontWeight: "700",
                          color: "black",
                        }}
                      >
                        Approved
                      </h2>
                      <h2
                        style={{
                          marginLeft: 20,
                          fontSize: 16,
                          fontWeight: "500",
                          color: "#6C757D",
                        }}
                      >
                        Full Days-
                      </h2>
                      <h2
                        style={{
                          marginLeft: 5,
                          fontSize: 17,
                          fontWeight: "500",
                          color: "black",
                        }}
                      >
                        {salaryCount[0]?.unpaid_full_day}
                      </h2>
                      <h2
                        style={{
                          marginLeft: 20,
                          fontSize: 16,
                          fontWeight: "500",
                          color: "#6C757D",
                        }}
                      >
                        Half Days-
                      </h2>
                      <h2
                        style={{
                          marginLeft: 5,
                          fontSize: 16,
                          fontWeight: "500",
                          color: "black",
                        }}
                      >
                        {salaryCount[0]?.unpaid_half_day}
                      </h2>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 40,
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span className="dot late"></span>

                      <h2
                        style={{
                          marginLeft: 10,
                          fontSize: 17,
                          fontWeight: "700",
                          color: "black",
                        }}
                      >
                        Unapproved
                      </h2>
                      <h2
                        style={{
                          marginLeft: 20,
                          fontSize: 16,
                          fontWeight: "500",
                          color: "#6C757D",
                        }}
                      >
                        Full Days-
                      </h2>
                      <h2
                        style={{
                          marginLeft: 5,
                          fontSize: 16,
                          fontWeight: "500",
                          color: "black",
                        }}
                      >
                        {salaryCount[0]?.unaprove_full_day}
                      </h2>
                      <h2
                        style={{
                          marginLeft: 20,
                          fontSize: 16,
                          fontWeight: "500",
                          color: "#6C757D",
                        }}
                      >
                        Half Days-
                      </h2>
                      <h2
                        style={{
                          marginLeft: 5,
                          fontSize: 16,
                          fontWeight: "500",
                          color: "black",
                        }}
                      >
                        {salaryCount[0]?.unaprove_half_day}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mainAttendancecard">
                <div
                  style={{
                    width: "49%",
                    padding: 10,
                    borderRadius: 8,
                    borderWidth: 3,
                    borderColor: "#EFF6FF",
                  }}
                >
                  <h2
                    style={{
                      fontSize: 17,
                      fontWeight: "700",
                      color: "black",
                    }}
                  >
                    Attendance
                  </h2>
                  <p className="total-leaves">
                    Total Leaves{" "}
                    <span className="leave-count">
                      {" "}
                      {salaryCount[0]?.total_Leave}
                    </span>
                  </p>
                  <div className="attendance-details">
                    <div className="detail">
                      <div
                        style={{
                          width: "88%",

                          justifyContent: "center",
                        }}
                      >
                        <span className="dot on-time"></span>
                        <span style={{ marginLeft: 20 }}>On Time</span>
                      </div>
                      <div style={{ width: "10%", justifyContent: "center" }}>
                        <span className="value">{salaryCount[0]?.ontime}</span>
                      </div>
                    </div>
                    <div className="detail">
                      <div
                        style={{
                          width: "88%",

                          justifyContent: "center",
                        }}
                      >
                        <span className="dot late"></span>

                        <span style={{ marginLeft: 20 }}>Late</span>
                      </div>
                      <div style={{ width: "10%", justifyContent: "center" }}>
                        <span className="value">
                          {salaryCount[0]?.lateCount}
                        </span>
                      </div>
                    </div>
                    <div className="detail">
                      <div
                        style={{
                          width: "88%",
                          flexDirection: "row",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <span className="dot late2"></span>
                        <span style={{ marginLeft: 20 }}>Allow Late</span>
                        <GrEdit
                          onClick={() => {
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                          style={{
                            marginLeft: 10,
                            color: "#808080",
                            marginTop: -10,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          width: "10%",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <input
                          className="allow-late-input"
                          type="number"
                          value={inputValue}
                          ref={inputRef}
                          min="0"
                          onChange={handleInput}
                        />
                      </div>
                    </div>
                    <div className="detail">
                      <div
                        style={{
                          width: "88%",

                          justifyContent: "center",
                        }}
                      >
                        <span className="dot late3"></span>

                        <span style={{ marginLeft: 20 }}>Total Late</span>
                      </div>

                      <div style={{ width: "10%", justifyContent: "center" }}>
                        <span className="value">{lateCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: "49%",
                    padding: 10,
                    borderRadius: 8,
                    borderWidth: 3,

                    borderColor: "#EFF6FF",
                  }}
                >
                  <h4 className="salary-days">{salaryDays} Days</h4>
                  <p className="total-salary-day">Total Salary Day</p>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      height: 50,
                      // justifyContent: "space-evenly",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 8,
                        borderColor: "#ccc",
                        width: "fit-content",
                        marginRight: 10,
                      }}
                    >
                      <input
                        type="text"
                        name="employeeCode"
                        placeholder="Enter salary amount"
                        id="employeeCode"
                        value={amount}
                        onChange={(data) => {
                          setAmount(data.target.value);
                        }}
                        style={{
                          border: "none",
                          outline: "none",
                          width: "100%",
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        onFocus={(e) => {
                          e.target.parentElement.style.borderColor = "#007BFF";
                        }}
                        onBlur={(e) => {
                          e.target.parentElement.style.borderColor = "#ccc";
                        }}
                      />
                    </div>
                    <p className="total-salary-day">
                      Total Amount After Calculation:{netSalary}
                    </p>
                  </div>

                  <div style={{ marginBottom: 10 }} />
                  <div className="button-group">
                    <button
                      className="calculate-btn"
                      onClick={() => {
                        calculateSalaryDays();
                      }}
                    >
                      Calculate Salary
                    </button>
                    <button
                      className="save-btn"
                      onClick={() => {
                        saveSalaryDetails(salaryCount);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-containersalary">
              {employeeSalary?.length > 0 ? (
                <table className="tablesalary">
                  <MaterialTable
                    columns={columns}
                    data={memoizedData}
                    title="Salary History"
                    options={{
                      paging: true,
                      search: false,
                      filtering: false,
                      sorting: true,

                      maxBodyHeight: "800px",
                      headerStyle: {
                        whiteSpace: "nowrap",
                        padding: "16px",
                        // fontSize: "14px",
                        width: "250px",
                        textAlign: "center",
                      },
                      cellStyle: {
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      },
                    }}
                    style={{
                      overflowX: "auto",
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  />
                </table>
              ) : (
                <div
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Lottie
                    animationData={Animation}
                    loop={true}
                    style={{
                      height: "200px",
                      width: "300px",
                    }}
                  />
                </div>
              )}
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
                  {/* <FaUser className="user-icon" /> */}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",

                      marginRight: 10,
                    }}
                  >
                    <img
                      src={ImagePath + emp?.image}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 40,
                        marginRight: 10,

                        borderWidth: 2,
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="employee-namesalary">{emp.name}</h3>
                    <h4 className="employee-name1">{emp.employee_code}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, background: "white" }}>
          {/* <div style={{ width: "100%" }}>
            <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 25 }}>
              Salary Information
            </h1>
          </div> */}

          <div className="table-containersalary">
            <div style={{ width: "100%", paddingTop: 20 }}>
              <div
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h1
                  style={{
                    color: "#155596",
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                >
                  Salary History:
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
            </div>
            <table className="tablesalary">
              <MaterialTable
                columns={columns}
                data={memoizedData1}
                title={null}
                options={{
                  paging: true,
                  search: false,
                  filtering: false,
                  sorting: true,
                  tableLayout: "fixed",
                  maxBodyHeight: "400px",
                  headerStyle: {
                    whiteSpace: "nowrap",
                  },
                  cellStyle: {
                    whiteSpace: "nowrap",
                  },
                }}
                components={{
                  Toolbar: () => null, // Completely removes the toolbar
                }}
                style={{
                  overflowX: "auto",
                  fontSize: 15,
                  marginTop: 20,
                  fontWeight: "500",
                  boxShadow: "none",
                }}
              />
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary;
