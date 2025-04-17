import React, { useEffect, useState } from "react";
import { COLOR } from "../../../Config/Color";
import { useSelector } from "react-redux";
import PullToRefresh from "react-simple-pull-to-refresh";
import axios from "axios";
import { Api, BaseUrl } from "../../../Config/Api";
import { useAuth } from "../../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import { setLeaveWfhRequest } from "../../../Redux/Action";
import { toast } from "react-toastify";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../../Component/NotificationsComponent";
import { FaTrash } from "react-icons/fa";
import Modal from "react-responsive-modal";
const EmployeeLeaveApplyHistory = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
const setLoading = () => { };
  const logout = () => { };
  const getLeaveWfhRequest = useSelector((state) => state.getLeaveWfhRequest);
  const currentYear = new Date().getFullYear();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [leavceRequestData, setLeaveRequestData] = useState([]);
  useEffect(() => {
    getEmployeeLeaveWfhrequest();
    onMessage(messaging, (payload) => {
      getEmployeeLeaveWfhrequest();
      toast.success(payload.notification.body, {
        position: "top-center",
        autoClose: 1000,
      });
    });
  }, []);
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
  });
  const [filteredLeaveWfhRequestData, setFilteredLeaveWfhRequestData] =
    useState(getLeaveWfhRequest);
  const generateYears = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const handleYearChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, leaveYear: e.target.value });
  };

  const handleClearFilter = () => {
    setFormData({
      leaveYear: currentYear.toString(),
    });
    setIsDisabled(true);
    setIsFilterApplied(false);
  };
  useEffect(() => {
    const filterLeaveWfhRequest = () => {
      const filteredData = getLeaveWfhRequest?.filter((leave) => {
        return leave?.year == formData?.leaveYear;
      });

      setFilteredLeaveWfhRequestData(filteredData);
    };

    filterLeaveWfhRequest();
  }, [formData.leaveYear, formData.leaveMonth, getLeaveWfhRequest]);
  const handleRefresh = async () => {
    await getEmployeeLeaveWfhrequest();
  };
  const getEmployeeLeaveWfhrequest = async () => {
    setLoading(true);

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
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",
      width: 70,
      key: "sn",
      render: (_, record, index) => <span> {index + 1}</span>,
    },

    {
      title: "LEAVE CODE",
      dataIndex: "leave_name",
      key: "leave_name",
      width: 200,
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
      title: "LEAVE REQUEST",
      dataIndex: "request_for",
      key: "request_for",
      width: 200,
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
      title: "LEAVE REASON",
      dataIndex: "reason",
      key: "reason",
      width: 300,
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
      title: "LEAVE STATUS",
      dataIndex: "status",
      key: "status",
      width: 200,
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
      title: " REMARK",
      width: 250,
      dataIndex: "remarks",
      key: "remarks",

      render: (_, record, index) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
            whiteSpace: "normal", // Allows text to wrap
            wordBreak: "break-word", // Breaks long words if necessary
          }}
        >
          {record?.remarks ? record.remarks : "Waiting for response"}
        </span>
      ),
    },
    {
      title: "FROM DATE",
      dataIndex: "start_date",
      key: "start_date",

      width: 200,
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
      dataIndex: "end_date",
      key: "end_date",

      width: 200,
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
      title: "TOTAL DAYS",
      dataIndex: "total_days",
      key: "total_days",
      width: 200,
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
      width: 200,
      filtering: false,
      render: (_, rowData) => (
        <div>
   
          <button
            className="action-button"
            disabled={rowData?.status}
            onClick={() => {
              setLeaveRequestData(rowData);
              setModalOpen(true);
            }}
            
          >
            <FaTrash />
            
          </button>
        </div>
      ),
    },
  ];

  const RemarkModel = ({ open, onClose, user }) => {
    const [remark, setRemark] = useState("");

    const appliedLeaveDelete = async () => {
      console.log("XCvxcvcxvcxv", user);
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

        formDataToSend.append("id", user?.id);
        formDataToSend.append("cancel_reasone", remark);

        const response = await axios.post(
          `${BaseUrl}${Api.EMPLOYEE_LEAVEWFH_REQUESR_CANCEL}`,
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
              getEmployeeLeaveWfhrequest();
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
                appliedLeaveDelete();
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
            Leave Request History
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
                name="leaveYear"
                id="leaveYear"
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

            <button
              onClick={handleClearFilter}
              disabled={isDisabled}
              className={`px-3 py-1 rounded flex items-center justify-center transition-colors ${
                isFilterApplied
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
            dataSource={filteredLeaveWfhRequestData?.filter(
              (emp) => emp?.request_for !== "WFH"
            )}
            rowClassName={() => "custom-row"}
            bordered={false}
            style={{ tableLayout: "fixed" }}
            tableLayout="fixed"
            rowKey="key"
            locale={{
              emptyText: (
                <div className="custom-no-data">
                  No Leave Request Data Found
                </div>
              ),
            }}
            pagination={{ pageSize: 8, position: ["bottomRight"] }}
            scroll={{ x: 800 }} // Ensures proper scrolling behavior
          />
        </div>
        <RemarkModel
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={leavceRequestData}
        />
      </div>
    </PullToRefresh>
  );
};

export default EmployeeLeaveApplyHistory;
