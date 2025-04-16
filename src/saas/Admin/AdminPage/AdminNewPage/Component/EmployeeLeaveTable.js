import React, { useEffect, useState } from "react";
import { Table, Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./EmployeeLeaveTable.css"; // Import CSS
import axios from "axios";
import { Api, BaseUrl } from "../../../../Config/Api";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import Modal from "react-responsive-modal";
import { useNavigate } from "react-router-dom";
import { COLOR } from "../../../../Config/Color";

const EmployeeLeaveTable = () => {
  const { setLoading, logout } = useAuth();
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  const [leaveData, setLeaveData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectData, setSelectData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getAllLeaveWfhRequest();
  }, []);
  const getAllLeaveWfhRequest = async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_ALL_LEAVE_WFH_REQUEST}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else if (responseData?.data?.valid === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
      } else if (responseData?.data?.success === true) {
        const tableData = responseData?.data?.data?.filter((item) => {
          return item.status === "Pending";
        });
        setLeaveData(tableData);
      } else {
        toast.error(responseData?.data?.mssg, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleActionChange = (key, status, record) => {
    if (status == "Approve") {
      approvedLeaveRequest(record);
    } else {
      setSelectData(record);

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
  const getMenu = (record) => (
    <Menu>
      <Menu.Item
        key="approve"
        onClick={() => handleActionChange("approve", "Approve", record)}
      >
        Approve
      </Menu.Item>
      <Menu.Item
        key="unapprove"
        onClick={() => handleActionChange("unapprove", "Unapprove", record)}
      >
        Unapprove
      </Menu.Item>
    </Menu>
  );
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",
      width: 80,
      key: "sn",
      render: (_, record, index) => <span> {index + 1}</span>,
    },
    {
      title: "EMP NAME",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => (
        <span
          style={{
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
      title: "TYPE",

      dataIndex: "request_for",
      key: "request_for",
      width: 150,
      render: (text) => (
        <span
          style={{
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
      title: "HALF DAY PERIOD",
      dataIndex: "time_period",
      key: "time_period",
      width: 180,
      render: (_, record) => {
        if (record.request_for === "Half Day") {
          return (
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "22px",
                color: COLOR.GRAY3,
              }}
            >
              {record.time_period}
            </span>
          );
        } else {
          return (
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "22px",
                color: COLOR.GRAY3,
              }}
            >
              N/A
            </span>
          );
        }
      },
    },
    {
      title: "REASON",
      width: 250,
      dataIndex: "reason",
      key: "reason",
      width: 650,
      render: (text) => (
        <span
          style={{
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
      title: "FROM DATE",
      dataIndex: "start_date",
      key: "start_date",
      width: 150,
      render: (text) => (
        <span
          style={{
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
      title: "TO DATE",
      dataIndex: "end_date",
      key: "end_date",
      width: 150,
      render: (text) => (
        <span
          style={{
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
      title: "DAYS",
      dataIndex: "total_days",
      key: "total_days",
      width:100,
      render: (text) => (
        <span
          style={{
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
      title: "ACTIONS",
      dataIndex: "status",
      key: "status",
      width: 150,

      render: (status, record) => {
        let color, backgroundColor, text;
        switch (status) {
          case "Pending":
            color = "#595959";
            backgroundColor = "#E0E0E0";
            text = "Pending";
            break;
          case "Unapprove":
            color = "#B45309";
            backgroundColor = "#FEF3C7";
            text = "Unapproved";
            break;
          case "Approve":
            color = "#065F46";
            backgroundColor = "#D1FAE5";
            text = "Approve";
            break;
          case "Reject":
            color = "#D32F2F";
            backgroundColor = "#FEE2E2";
            text = "Rejected";
            break;
          default:
            color = "#595959";
            backgroundColor = "#E0E0E0";
            text = status;
        }

        return (
          <Dropdown overlay={getMenu(record)} trigger={["click"]}>
            <Button
              style={{
                backgroundColor,
                color,
                borderRadius: "5px",
                fontWeight: "bold",
                padding: "5px 12px",
              }}
            >
              {text} <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  const RemarkModel = ({ open, onClose, user }) => {
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
    <div className="table-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <h2 className="table-title">Employee Leave/ WFH requests</h2>
        <p
          onClick={() => {
            navigate("/adminhome/adminLeaverrequestHistory");
          }}
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            color: "#1B84FF",
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "12px",
          }}
        >
          View All
        </p>
      </div>
      
      <Table
        className="dotted-border-table"
        columns={columns}
        dataSource={leaveData?.slice(0, 3)}
        pagination={{ pageSize: 8, position: ["bottomRight"] }}
        rowClassName={() => "custom-row"}
        bordered={false}
        // style={{ tableLayout: "auto" }}
        tableLayout="fixed"
        rowKey="key"
        scroll={{ x: 1000 }} // Ensures proper scrolling behavior
        locale={{
          emptyText: (
            <div className="custom-no-data">No Leave Request Data Found</div>
          ),
        }}
      />
      <RemarkModel
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectData}
      />
    </div>
  );
};

export default EmployeeLeaveTable;
