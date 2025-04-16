import React, { useEffect, useState } from "react";
import "./AdminLeaveRequestHistory.css";
import { Api, BaseUrl } from "../../Config/Api";
import Animation from "../../Assets/animation.json";
import Check from "../../Assets/check.json";
import Uncheck from "../../Assets/uncheck.json";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import Lottie from "lottie-react";
import Modal from "react-responsive-modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmployeeindex } from "../../Redux/Action";
import { useSelector } from "react-redux";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../Component/NotificationsComponent";
const AdminLeaveRequestHistory = () => {
  const token = sessionStorage.getItem("authToken");
  const { setLoading, logout } = useAuth();
  const employeeId = sessionStorage.getItem("employeeId");
  const [leaveData, setLeaveData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveText, setLeaveText] = useState("");
  const [selectData, setSelectData] = useState([]);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const [selectedText, setSelectedText] = useState("Leaves Request");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    getAllLeaveWfhRequest();
  }, []);
  useEffect(() => {
    onMessage(messaging, (payload) => {
      getAllLeaveWfhRequest();
      toast.success(payload.notification.body, {
        position: "top-center",
        autoClose: 1000,
      });
    });
  }, []);
  const getAllLeaveWfhRequest = async () => {
    // setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_ALL_LEAVE_WFH_REQUEST}`,
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
        } else if (responseData?.data?.success === true) {
          setLeaveData(responseData?.data?.data);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(responseData?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
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
  const changeText = (text) => {
    setSelectedText(text);
  };
  const approvedLeaveRequest = async (data) => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("employee_id", data?.employee_id);

      formDataToSend.append("auto_generated_id", data?.id);

      const response = await axios.post(
        `${BaseUrl}${Api.APPROVE_LEAVE_REQ}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

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
            autoClose: 2000,
          });
        } else {
          if (response?.data?.success === true) {
            toast.success(response?.data?.mssg, {
              position: "top-center",
              autoClose: 2000,
            });
            getAllLeaveWfhRequest();
          } else if (response?.data?.success === false) {
            toast.error(response?.data?.mssg, {
              position: "top-center",
              autoClose: 2000,
            });
          }
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const RemarkModel = ({ open, onClose, user, type }) => {
    const [remark, setRemark] = useState("");

    const unApprovedLeaveRequest = async () => {
      if (remark === "") {
        toast.error("Please select leave type", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }
      setLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("employee_id", user?.employee_id);

        formDataToSend.append("auto_generated_id", user?.id);
        formDataToSend.append("remarks", remark);

        const response = await axios.post(
          `${BaseUrl}${Api.UNAPPROVE_LEAVE_REQ}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);

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
              autoClose: 2000,
            });
          } else {
            if (response?.data?.success === true) {
              toast.success(response?.data?.mssg, {
                position: "top-center",
                autoClose: 2000,
              });
              getAllLeaveWfhRequest();
            } else if (response?.data?.success === false) {
              toast.error(response?.data?.mssg, {
                position: "top-center",
                autoClose: 2000,
              });
            }
          }
        }
      } catch (error) {
        console.error("API call failed:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    return (
      <Modal
        open={open}
        onClose={onClose}
        center
        showCloseIcon={false}
        closeOnOverlayClick={false}
        classNames={{ modal: "custom-modal1322" }}
      >
        <div className="wfh-container">
          <h2 className="text-lg font-semibold mb-4">Send your remark</h2>

          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your text"
            rows="4"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          ></textarea>

          <div className="flex justify-end mt-4 space-x-3">
            <button className="text-blue-500 hover:underline" onClick={onClose}>
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                unApprovedLeaveRequest();
                onClose();
              }}
            >
              Send Remark
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="leavewfhDiv">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 20,
          color: "black",

          textAlign: "left",
        }}
      >
        Leave/WFH Request
      </h1>
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
                selectedText === "Leaves Request"
                  ? "2px solid #047EFF"
                  : "none",
              paddingBottom: 8,
              fontWeight: selectedText === "Leaves Request" ? "700" : "500",
              cursor: "pointer",
              color: selectedText === "Leaves Request" ? "#047EFF" : "#343741",
            }}
            onClick={() => changeText("Leaves Request")}
          >
            Leaves Request
          </h2>
          <h2
            style={{
              marginLeft: 20,
              borderBottom:
                selectedText === " WFH Request" ? "2px solid #047EFF" : "none",
              paddingBottom: 8,
              fontWeight: selectedText === " WFH Request" ? "700" : "500",
              cursor: "pointer",
              color: selectedText === " WFH Request" ? "#047EFF" : "#343741",
            }}
            onClick={() => changeText(" WFH Request")}
          >
            WFH Request
          </h2>
        </div>
      </div>
      {selectedText === "Leaves Request" ? (
        <div className="container-leavewfh">
          <div className="employee-table1212-container">
            <table className="employee-table1212">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th>Employee Name</th>
                  <th>Leave Code</th>
                  <th>Leave Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Total Days</th>
                  <th>Leave Reason</th>
                  <th>Leave Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              {leaveData?.length > 0 ? (
                <tbody>
                  {leaveData
                    ?.filter((item) => item?.request_for !== "WFH")
                    .map((emp, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{emp?.name}</td>
                        <td>{emp?.leave_name}</td>
                        <td>{emp?.request_for}</td>

                        <td>{emp?.start_date}</td>
                        <td>{emp?.end_date}</td>
                        <td>{emp?.total_days}</td>
                        <td>{emp?.reason}</td>
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
                                // marginTop: "5px",
                              }}
                            >
                              {emp?.status}
                            </div>
                          </div>
                        </td>

                        <td>
                          {emp?.status === "Pending" ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: 100,
                                  height: 30,
                                  background: "#047EFF",
                                  borderRadius: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    approvedLeaveRequest(emp);
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Approve
                                </button>
                              </div>
                              <div
                                style={{
                                  width: 100,
                                  height: 30,
                                  background: "#BD271E",
                                  borderRadius: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginLeft: 10,
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setSelectData(emp);

                                    setModalOpen(true);
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Unapproved
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: 100,
                                  height: 30,
                                  background:
                                    emp?.status === "Approved"
                                      ? "#115E59"
                                      : "#854D0E",
                                  borderRadius: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    const index = getEmployeeDetails.findIndex(
                                      (emp1) => emp1.id == emp?.employee_id
                                    );

                                    dispatch(setEmployeeindex(index));
                                    navigate("/adminhome/adminleaves");
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Mark Leave
                                </button>
                              </div>
                            </div>
                          )}
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
      ) : (
        <div className="container-leavewfh1">
          <div className="employee-table1212-container12">
            <table className="employee-table121223">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th>Employee Name</th>
                  <th>WFH Policy</th>
                  {/* <th>Leave Type</th> */}
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Total Days</th>
                  <th>WFH Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              {leaveData?.length > 0 ? (
                <tbody>
                  {leaveData
                    ?.filter((item) => item?.request_for === "WFH")
                    .map((emp, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{emp?.name}</td>
                        <td>{emp?.request_for}</td>
                        {/* <td>{emp?.request_for}</td> */}
                        <td>{emp?.start_date}</td>
                        <td>{emp?.end_date}</td>
                        <td>{emp?.total_days}</td>
                        <td>{emp?.reason}</td>
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
                                // marginTop: "5px",
                              }}
                            >
                              {emp?.status}
                            </div>
                          </div>
                        </td>

                        <td>
                          {emp?.status === "Pending" ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: 100,
                                  height: 30,
                                  background: "#047EFF",
                                  borderRadius: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    approvedLeaveRequest(emp);
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Approve
                                </button>
                              </div>
                              <div
                                style={{
                                  width: 100,
                                  height: 30,
                                  background: "#BD271E",
                                  borderRadius: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginLeft: 10,
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setSelectData(emp);

                                    setModalOpen(true);
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Unapproved
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: 100,
                                  height: 30,
                                  background:
                                    emp?.status === "Approved"
                                      ? "#115E59"
                                      : "#854D0E",
                                  borderRadius: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    const index = getEmployeeDetails.findIndex(
                                      (emp1) => emp1.id == emp?.employee_id
                                    );

                                    dispatch(setEmployeeindex(index));
                                    navigate("/adminhome/adminleaves");
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color: "#fff",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  Mark WFH
                                </button>
                              </div>
                            </div>
                          )}
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
      )}

      <RemarkModel
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectData}
        type={leaveText}
      />
    </div>
  );
};

export default AdminLeaveRequestHistory;
