import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { COLOR, FONT, IMAGE } from "../../../Config/Color";
import { Api, BaseUrl, ImagePath } from "../../../Config/Api";
import { setEmployeeindex } from "../../../Redux/Action";
import axios from "axios";
import { toast } from "react-toastify";
import { Table } from "antd";
import AllEmployeeSalaryPage from "./Component/AllEmployeeSalaryPage";

const NewSalaryPage = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  // const { setLoading, logout } = useAuth();
  const setLoading = () => { };
  const logout = () => { };
  const token = sessionStorage.getItem("authToken");
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const getEmployeeindex = useSelector((state) => state.getEmployeeindex);
  const [filteredCategories, setFilteredCategories] =useState(getEmployeeDetails);
  const [employeeSalary, setEmployeeSalary] = useState([]);
  const [query, setQuery] = useState("");
  const [salaryCount, setSalaerCount] = useState([]);
  const [salaryDays, setSalaryDays] = useState(0);
  const [amount, setAmount] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [inputValue, setInputValue] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [weekOn, setWeekOn] = useState(false);
  const [EmployeeSalaryHistory, setEmployeeSalaryHistory] = useState([]);

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
    [token, dispatch]
    // [token, dispatch, setLoading, logout]
  );
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
    [token, dispatch]
  );
  useEffect(() => {
    if (getEmployeeDetails.length > 0) {
      getEmployeeSalary(getEmployeeindex);
      getEmployeeSalaryDetails(getEmployeeindex);
      allSalary();
    }
  }, [dispatch, token]);
  useEffect(() => {
    getLateCount();
  }, [inputValue, salaryCount, salaryDays]);
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
    setSalaryDays(0);
    const index = getEmployeeDetails.findIndex((emp) => emp.id === employeeId);
    dispatch(setEmployeeindex(index));
    getEmployeeSalary(index);
    getEmployeeSalaryDetails(index);
    setAmount(0);
    setNetSalary(0);
  };
  const handleInput = (event) => {
    setInputValue(event.target.value);
  };
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
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",
      width: 80,
      key: "sn",
      render: (_, record, index) => <span> {index + 1}</span>,
    },
    {
      title: "NAME",
      dataIndex: "name",
      filterMultiple: true,
      key: "name",
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
      title: "MONTH",
      dataIndex: "month",
      key: "month",
      width: 120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
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
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
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
      title: "PAID LEAVE",
      width: 150,
      render: (rowData) => {
        const totalPaidLeave =
          (rowData.paid_full_day || 0) + (rowData.paid_half_day || 0);
          
        return totalPaidLeave.toString();
      },
    },
    {
      title: "TOTAL LATE",
      dataIndex: "lateCount",
      key: "date",
     width:120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
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
      title: "UNPAID LEAVE",
      width:150,
      render: (rowData) => {
        const totalPaidLeave =
          (rowData.unaprove_full_day || 0) +
          (rowData.unaprove_half_day || 0) +
          (rowData.unpaid_full_day || 0) +
          (rowData.unpaid_half_day || 0);
        return totalPaidLeave.toString();
      },
    },
    {
      title: "TOTAL LEAVE",
      dataIndex: "total_Leave",
      key: "total_Leave",
      width:150,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
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
      title: "TOTAL DAYS",
      dataIndex: "total_days",
      key: "total_days",
      width: 120,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
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
      title: "TOTAL DEDUCTION",
      dataIndex: "total_salary_deduction",
      key: "total_salary_deduction",
      width: 170,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
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
      title: "TOTAL SALARY DAYS",
      dataIndex: "salary_days",
      key: "salary_days",
      width:150,
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
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
  ];
  return (
    <div className="newattendance-container">
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
            marginTop: "15px",
            marginBottom: "15px",
            textAlign: "left",
            fontSize: "24px",
            fontWeight: "700",
            fontFamily: "Inter",
            color: COLOR.BLACK,
          }}
        >
          Salary Details
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: "30px",
          }}
        >
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={weekOn}
                onChange={() => setWeekOn(!weekOn)}
                className="sr-only peer"
              />
              {/* Switch Background */}
              <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 relative flex items-center">
                {/* Toggle Thumb */}
                <div
                  className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full transition ${
                    weekOn ? "translate-x-6" : ""
                  }`}
                ></div>
              </div>
            </label>
            <span
              style={{
                color: "#343741",
                fontSize: "14px",
                fontFamily: "Inter",
                fontWeight: "400",
                marginLeft: "10px",
              }}
            >
              {weekOn ? "Switch to single employee" : "Switch to all employees"}
            </span>
          </div>
        </div>
      </div>
      {!weekOn ? (
        <>
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
                      src={
                        ImagePath + getEmployeeDetails[getEmployeeindex]?.image
                      }
                      alt="User"
                      className="w-14 h-14 rounded-md object-cover"
                    />
                  )}

                  <div className="flex flex-col">
                    <h2
                      style={{
                        fontSize: "18px",
                        fontFamily: FONT.INTER,
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
                        <img
                          src={IMAGE.CONTACT}
                          className="w-4 h-4"
                          alt="icon"
                        />
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
                          {getEmployeeDetails[getEmployeeindex]?.email}
                        </span>
                      </div>

                      <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                        <img
                          src={IMAGE.LOCATION}
                          className="w-4 h-4"
                          alt="icon"
                        />
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
              </div>

              <div className="p-0 rounded-lg mt-4">
                <div className="flex gap-4 w-full">
                  <div className="bg-white shadow-sm rounded-lg p-4 w-[25%] h-32 flex flex-col justify-between">
                    <h3
                      style={{
                        fontSize: "16px",
                        fontFamily: FONT.INTER,
                        fontWeight: "600",
                        lineHeight: "24px",
                        color: COLOR.GRAY4,
                      }}
                    >
                      Total Days ({salaryCount[0]?.month})
                    </h3>
                    <span className="font-semibold text-gray-800">
                      {salaryCount[0]?.total_days}
                    </span>
                  </div>
                  <div className="bg-white shadow-sm rounded-lg p-4 w-[25%] h-32 flex flex-col justify-between">
                    <h3
                      style={{
                        fontSize: "16px",
                        fontFamily: FONT.INTER,
                        fontWeight: "600",
                        lineHeight: "24px",
                        color: COLOR.GRAY4,
                      }}
                    >
                      Paid Leave
                    </h3>
                    <div className="flex justify-between items-center border-b-2 border-dotted py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: FONT.INTER,
                            fontWeight: "400",
                            lineHeight: "20px",
                            color: COLOR.GRAY3,
                          }}
                        >
                          Full Day
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {salaryCount[0]?.paid_full_day}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pr-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: FONT.INTER,
                            fontWeight: "400",
                            lineHeight: "20px",
                            color: COLOR.GRAY3,
                          }}
                        >
                          Half Day
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {salaryCount[0]?.paid_half_day}
                      </span>
                    </div>
                  </div>
                  {/* Unpaid Leave Card */}
                  <div className="bg-white shadow-sm rounded-lg p-4 w-[50%] h-32 flex flex-col justify-between">
                    <h3
                      style={{
                        fontSize: "16px",
                        fontFamily: FONT.INTER,
                        fontWeight: "600",
                        lineHeight: "24px",
                        color: COLOR.GRAY4,
                      }}
                    >
                      Unpaid Leave
                    </h3>
                    <div>
                      <div className="flex justify-between items-center border-b-2 border-dotted pb-2 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span
                            style={{
                              fontSize: "14px",
                              fontFamily: FONT.INTER,
                              fontWeight: "400",
                              lineHeight: "20px",
                              color: COLOR.GRAY3,
                            }}
                          >
                            Approved
                          </span>
                        </div>
                        <div className="text-gray-600 text-sm">
                          Full Day -{" "}
                          <span className="font-semibold text-gray-800">
                            {salaryCount[0]?.unpaid_full_day}
                          </span>
                          &nbsp;&nbsp; Half Day -{" "}
                          <span className="font-semibold">
                            {salaryCount[0]?.unpaid_half_day}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <span
                            style={{
                              fontSize: "14px",
                              fontFamily: FONT.INTER,
                              fontWeight: "400",
                              lineHeight: "20px",
                              color: COLOR.GRAY3,
                            }}
                          >
                            Unapproved
                          </span>
                        </div>
                        <div className="text-gray-600 text-sm">
                          Full Day -{" "}
                          <span className="font-semibold">
                            {salaryCount[0]?.unaprove_full_day}
                          </span>
                          &nbsp;&nbsp; Half Day -{" "}
                          <span className="font-semibold">
                            {salaryCount[0]?.unaprove_half_day}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 rounded-lg mt-4">
                <div className="bg-white shadow-md rounded-lg p-6 w-3/5">
                  <h3
                    style={{
                      fontSize: "16px",
                      fontFamily: FONT.INTER,
                      fontWeight: "600",
                      lineHeight: "24px",
                      color: COLOR.GRAY4,
                    }}
                  >
                    Attendance
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Total Leave . {salaryCount[0]?.total_Leave}
                  </p>

                  <div className="mt-3 space-y-3">
                    <div className="flex justify-between items-center border-b-2 border-dotted pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            lineHeight: "20px",
                            color: COLOR.GRAY3,
                          }}
                        >
                          On Time
                        </span>
                      </div>
                      <span className="text-gray-800 font-semibold">
                        {salaryCount[0]?.ontime}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b-2 border-dotted pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            lineHeight: "20px",
                            color: COLOR.GRAY3,
                          }}
                        >
                          Late
                        </span>
                      </div>
                      <span className="text-gray-800 font-semibold">
                        {salaryCount[0]?.lateCount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b-2 border-dotted pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            lineHeight: "20px",
                            color: COLOR.GRAY3,
                          }}
                        >
                          Allow Late
                        </span>

                        <img
                          src={IMAGE.PEN}
                          className="w-4 h-4"
                          alt="icon"
                          onClick={() => {
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                        />
                      </div>
                      <input
                        className="w-10 h-8 text-center border border-gray-300 rounded-md text-gray-800 font-semibold leading-tight flex items-center justify-center ml"
                        type="number"
                        value={inputValue}
                        ref={inputRef}
                        min="0"
                        onChange={handleInput}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: FONT.INTER,
                            fontWeight: "500",
                            lineHeight: "20px",
                            color: COLOR.GRAY3,
                          }}
                        >
                          Total Late
                        </span>
                      </div>
                      <span className="text-gray-800 font-semibold">
                        {lateCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 w-3/5 flex flex-col items-center">
                  <h3
                    style={{
                      fontSize: "16px",
                      fontFamily: FONT.INTER,
                      fontWeight: "600",
                      lineHeight: "24px",
                      color: COLOR.GRAY4,
                    }}
                  >
                    {" "}
                    {salaryDays} Days
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      fontFamily: FONT.INTER,
                      fontWeight: "500",
                      lineHeight: "20px",
                      color: COLOR.BLACK1,
                    }}
                  >
                    Total Salary Day
                  </p>

                  <input
                    type="text"
                    name="employeeCode"
                    placeholder="Enter salary amount"
                    id="employeeCode"
                    value={amount}
                    onChange={(data) => {
                      setAmount(data.target.value);
                    }}
                    className="mt-4 w-120 text-center border border-gray-300 rounded-md text-gray-900 p-2"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    onFocus={(e) => {
                      e.target.parentElement.style.borderColor = "#007BFF";
                    }}
                    onBlur={(e) => {
                      e.target.parentElement.style.borderColor = "#ccc";
                    }}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      fontFamily: FONT.INTER,
                      fontWeight: "600",
                      lineHeight: "20px",
                      color: "#1A202C",
                      marginTop: "10px",
                    }}
                  >
                    Total amount after calculate:{" "}
                    <span className="font-semibold">{netSalary}</span>
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
                      onClick={() => {
                        calculateSalaryDays();
                      }}
                    >
                      Calculate Salary
                    </button>
                    <button
                      className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold"
                      onClick={() => {
                        saveSalaryDetails(salaryCount);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white shadow-sm mt-5">
                <div className="flex items-center justify-between ">
                  <h3
                    style={{
                      fontSize: "16px",
                      fontFamily: FONT.INTER,
                      fontWeight: "600",
                      lineHeight: "24px",
                      color: COLOR.GRAY4,
                    }}
                  >
                    Salary History
                  </h3>
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
                    dataSource={employeeSalary}
                    locale={{
                      emptyText: (
                        <div className="custom-no-data">
                          No Salary Data Found
                        </div>
                      ),
                    }}
                    pagination={{ pageSize: 5, position: ["bottomRight"] }}
                    rowClassName={() => "custom-row"}
                    bordered={false}
                    tableLayout="fixed"
                    rowKey="key"
                    scroll={{ x: 1000 }} // Ensures proper scrolling behavior
                  />
                </div>
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
                  <i className="ti ti-search " />

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
        </>
      ) : (
        <AllEmployeeSalaryPage sallaryHistory={EmployeeSalaryHistory} />
      )}
    </div>
  );
};

export default NewSalaryPage;
