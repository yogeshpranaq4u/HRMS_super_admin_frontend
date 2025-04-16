import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../Component/NotificationsComponent";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import { COLOR, FONT, IMAGE } from "../../Config/Color";
import { BsFillLightbulbFill } from "react-icons/bs";
import EmployeeLeave from "./EmployeeComponent/EmployeeLeave";
import EmployeeWfh from "./EmployeeComponent/EmployeeWfh";
import EmployeeLeaveApplyHistory from "./EmployeeComponent/EmployeeLeaveApplyHistory";
import EmployeeWfhApplyHistory from "./EmployeeComponent/EmployeeWfhApplyHistory";
import { setLeaveWfhRequest, setWorkFromHome } from "../../Redux/Action";
import MainLayout from "../../../layouts/MainLayout";

const LeaveWfhRequest = () => {
  const getWorkFromHome = useSelector((state) => state.getWorkFromHome);
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  // const { setLoading, logout } = useAuth();
  const setLoading = () => { };
  const logout = () => { };
  const [profileData, setProfileData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [totalleaveData, setTotalLeaveData] = useState([]);
  const [selectedText, setSelectedText] = useState("Leaves");
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const getLeaveWfhRequest = useSelector((state) => state.getLeaveWfhRequest);
  const [activeTab, setActiveTab] = useState("Leaves");
  const tabs = ["Leaves", "WFH", "Leave Request", "WFH Request"];

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
  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <div className="newattendance-container ">
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
              Leaves & WFH
            </h2>

            <div
              style={{
                width: "100%",
                //   display: "flex",
                //   justifyContent: "space-between",
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
                          {totalleaveData[0]?.total_leave_entitled}
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
                          {totalleaveData[0]?.leave_collected}
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
                          {totalleaveData[0]?.paid_leave_taken}
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
                          {totalleaveData[0]?.unpaid_leave_taken}
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
                  </div>
                  <div
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
              </div>
              <div style={{ marginTop: "20px", }}>
                {activeTab === "Leaves" && <EmployeeLeave leaveData={leaveData} />}
                {activeTab === "WFH" && <EmployeeWfh />}
                {activeTab === "Leave Request" && <EmployeeLeaveApplyHistory />}
                {activeTab === "WFH Request" && <EmployeeWfhApplyHistory />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LeaveWfhRequest;
