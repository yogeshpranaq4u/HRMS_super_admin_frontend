import React, { useEffect, useState } from "react";
import { COLOR, IMAGE } from "../../../../Config/Color";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import Modal from "react-responsive-modal";
import { useNavigate } from "react-router-dom";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { messaging } from "../../../../Component/NotificationsComponent";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../../../../Config/Api";
import { useSelector } from "react-redux";
import { setEmployeeindex } from "../../../../Redux/Action";
import { useDispatch } from "react-redux";

const NewWfhRequest = () => {
  const token = sessionStorage.getItem("authToken");
  const setLoading = () => { };
  const logout = () => { };
  const employeeId = sessionStorage.getItem("employeeId");
  const [leaveData, setLeaveData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectData, setSelectData] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [filterWfhData, setFilterWfhData] = useState([]);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const [statuses, setStatuses] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    wfhStatus: "All Data",
  });
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

  useEffect(() => {
    if (leaveData && leaveData.length > 0) {
      const initialStatuses = leaveData.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: item.status || "Pending",
        }),
        {}
      );
      setStatuses(initialStatuses);
    }
  }, [leaveData]);
  const handleStatusChange = (status, record) => {
    setSelectData(record);
    setStatuses((prev) => ({ ...prev, [record.id]: status }));
    if (status == "Approve") {
      approvedLeaveRequest(record);
    } else if (status == "Unapprove") {
      setModalOpen(true);
    }
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
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",

      key: "sn",
      render: (_, record, index) => <span> {index + 1}</span>,
    },
    {
      title: "EMPLOYEE NAME",
      dataIndex: "name",

      key: "name",

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

    // {
    //   title: "WFH POLICY",
    //   dataIndex: "leave_name", // Ensure this matches your data key
    //   key: "leave_name",

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
      dataIndex: "start_date",
      key: "start_date",
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
      title: "WFH REASON",
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
      title: "WFH STATUS",
      dataIndex: "status",
      key: "status",
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
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Select
            value={statuses[record.id]}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(value, record)}
            disabled={statuses[record.id] === "Approve"}
            options={[
              { label: "Pending", value: "Pending" },
              { label: "Approve", value: "Approve" },
              { label: "Unapprove", value: "Unapprove" },
            ]}
          />
          {}

          {(statuses[record?.id] === "Approve" ||
            statuses[record?.id] === "Unapprove") && (
            <Button
              type="primary"
              onClick={() => {
                const index = getEmployeeDetails.findIndex(
                  (emp1) => emp1.id == record?.employee_id
                );

                dispatch(setEmployeeindex(index));
                navigate("/adminhome/adminleaves");
              }}
            >
              Mark Leave
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleClearFilter = () => {
    setIsDisabled(true);
    setIsFilterApplied(false);
    setFormData({
      wfhStatus: "All Data",
    });
  };
  const handleLeaveStatus = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, wfhStatus: e.target.value });
  };

  useEffect(() => {
    const filterEmployeeData = () => {
      let filteredData;
      if (formData.wfhStatus === "All Data") {
        filteredData = leaveData?.filter((item) => item?.request_for === "WFH");
      } else {
        filteredData = leaveData
          ?.filter((item) => item?.request_for === "WFH")
          ?.filter((emp) => {
            const matchesLeave =
              formData.wfhStatus === "All Data" ||
              emp?.status === formData.wfhStatus;

            return matchesLeave;
          });
      }

      setFilterWfhData(filteredData);
    };

    filterEmployeeData();
  }, [formData.wfhStatus, leaveData, dispatch]);
  return (
    <div className="items-end justify-between border-b border-gray-300 px-10 py-1 bg-white rounded-lg shadow-sm mt-5">
       <div className="flex items-center justify-between">
            {/* Right Aligned Filters */}
            <div className="flex items-center space-x-4 ml-auto">
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
                  WFH Status
                </span>
    
                <select
                  name="statusType"
                  id="statusType"
                  value={formData.wfhStatus}
                  onChange={handleLeaveStatus}
                  required
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    fontFamily: "Inter",
                    color: COLOR.BLACK,
                    lineHeight: "18px",
                  }}
                >
                  <option value="All Employee">All Data</option>
                  <option value="Pending">Pending</option>
                  <option value="Unapprove">Unapprove</option>
                  <option value="Approve">Approve</option>
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
          maxHeight: "80vh", // Adjust height as needed
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <Table
          className="dotted-border-table"
          columns={columns}
          dataSource={filterWfhData}
          pagination={false}
          rowClassName={() => "custom-row"}
          bordered={false}
          style={{ tableLayout: "fixed" }}
          rowKey="key"
          locale={{
            emptyText: (
              <div className="custom-no-data">No WFH Request Data Found</div>
            ),
          }}
        />
      </div>
      <RemarkModel
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectData}
        // type={leaveText}
      />
    </div>
  );
};

export default NewWfhRequest;
