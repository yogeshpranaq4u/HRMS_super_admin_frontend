import React, { useEffect, useState } from "react";
import { COLOR } from "../../../Config/Color";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import ApplyEmployeeLeavs from "../../EmoployeeComponent/ApplyEmployeeLeavs";
const EmployeeLeave = ({ leaveData }) => {
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: "All Data",
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
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

  const handleYearChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, leaveYear: e.target.value });
  };
  const handleMonthChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, leaveMonth: e.target.value });
  };

  const handleClearFilter = () => {
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: "All Data",
    });
    setIsDisabled(true);
    setIsFilterApplied(false);
  };
  useEffect(() => {
    const filterLeaveData = () => {
      const filteredData = leaveData?.filter((leave) => {
        return (
          leave.year === formData.leaveYear &&
          (formData.leaveMonth === "All Data" ||
            leave.month === formData.leaveMonth)
        );
      });

      setFilteredLeaveData(filteredData);
    };

    filterLeaveData();
  }, [formData.leaveYear, formData.leaveMonth, leaveData]);

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
      dataIndex: "leave_code",
      key: "leave_code",
      width: 170,

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
      width: 150,
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
      dataIndex: "leave_status", // Use appropriate dataIndex if needed
      key: "days",
      width: 150,
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
      title: "SALARY DEC DAYS",
      dataIndex: "salary_deduction_days",
      key: "salary_deduction_days",
      width: 220,
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
      width: 150,
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
      width: 150,
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
      title: "TOTAL DAYS",
      dataIndex: "total_days",
      key: "total_days",
      width: 150,
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
      title: "LEAVE REASON",
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
  ];
  return (
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
          Leave History
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
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.BLACK,
                lineHeight: "18px",
              }}
              required
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
          <button
            onClick={() => {
              setModalOpen(true);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "Inter",
              color: COLOR.WHITE,
              lineHeight: "18px",
            }}
          >
            Apply Leave
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
          dataSource={filteredLeaveData}
          pagination={{ pageSize: 5 }}
          rowClassName={() => "custom-row"}
          bordered={false}
          style={{ tableLayout: "fixed" }}
          tableLayout="fixed"
          rowKey="key"
          locale={{
            emptyText: (
              <div className="custom-no-data">No Leave Data Found</div>
            ),
          }}
        />
      </div>
      <ApplyEmployeeLeavs
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={"Leaves"}
      />
    </div>
  );
};

export default EmployeeLeave;
