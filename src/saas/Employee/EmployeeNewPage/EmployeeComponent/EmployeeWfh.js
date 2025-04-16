import React, { useEffect, useState } from "react";
import { COLOR } from "../../../Config/Color";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import ApplyEmployeeLeavs from "../../EmoployeeComponent/ApplyEmployeeLeavs";
import { useSelector } from "react-redux";

const EmployeeWfh = () => {
  const getWorkFromHome = useSelector((state) => state.getWorkFromHome);
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const [filteredWfhData, setFilteredWfh] = useState(getWorkFromHome);
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

  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",
      width: 80,
      key: "sn",
      render: (_, record, index) => <span> {index + 1}</span>,
    },

    {
      title: "WFH STATUS",
      dataIndex: "Approved",
      key: "Approved",
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
          Approved
        </span>
      ),
    },

    {
      title: "FROM DATE",
      width: 200,
      dataIndex: "wfh_start_date",
      key: "wfh_start_date",
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
      dataIndex: "wfh_end_date",
      key: "wfh_end_date",
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
      render: (_, record, index) => (
        <span>
          {" "}
          {record?.wfh_start_date && record?.wfh_end_date
            ? (() => {
                const startDate = new Date(record.wfh_start_date);
                const endDate = new Date(record.wfh_end_date);
                const totalDays =
                  (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
                return totalDays > 0 ? totalDays : "Invalid Dates";
              })()
            : "N/A"}
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
          WFH History
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
            Apply WFH
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
          dataSource={filteredWfhData}
          pagination={{ pageSize: 5 }}
          rowClassName={() => "custom-row"}
          bordered={false}
          style={{ tableLayout: "fixed" }}
          tableLayout="fixed"
          rowKey="key"
          locale={{
            emptyText: <div className="custom-no-data">No WFH Data Found</div>,
          }}
        />
      </div>
      <ApplyEmployeeLeavs
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={"WFH"}
      />
    </div>
  );
};

export default EmployeeWfh;
