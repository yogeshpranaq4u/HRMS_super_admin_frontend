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
const EmployeeWfhApplyHistory = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const { setLoading, logout } = useAuth();
  const getLeaveWfhRequest = useSelector((state) => state.getLeaveWfhRequest);
  const currentYear = new Date().getFullYear();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
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
      width: 90,
      key: "sn",
      render: (_, record, index) => <span> {index + 1}</span>,
    },

    {
      title: "REQUEST",
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
      title: "WFH STATUS",
      dataIndex: "status",
      key: "status",
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
      title: "WFH REASON",
      dataIndex: "reason",
      key: "reason",
      width: 300, // Adjust width as needed

      render: (text) => (
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
          {text}
        </span>
      ),
    },
    {
      title: "REMARK",
      dataIndex: "remarks",
      key: "remarks",
      width: 300,
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
      width: 200,
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
      width: 200,
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
      width: 200,
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
  ];
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
            WFH Request History
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
              (emp) => emp?.request_for === "WFH"
            )}
            pagination={{ pageSize: 5 }}
            rowClassName={() => "custom-row"}
            bordered={false}
            style={{ tableLayout: "fixed" }}
            tableLayout="fixed"
            rowKey="key"
            locale={{
              emptyText: (
                <div className="custom-no-data">No WFH Request Data Found</div>
              ),
            }}
          />
        </div>
      </div>
    </PullToRefresh>
  );
};

export default EmployeeWfhApplyHistory;
