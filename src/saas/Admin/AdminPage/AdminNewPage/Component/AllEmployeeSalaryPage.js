import React, { useEffect, useState } from "react";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import { COLOR } from "../../../../Config/Color";

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
const AllEmployeeSalaryPage = ({ sallaryHistory }) => {
  // console.log("sallaryHistory", sallaryHistory);
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const [filterSalaryData, setFilteredSalaryData] = useState([]);
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: months[currentMonthIndex-1],
  });

  const handleYearChange = (e) => {
    setFormData({ ...formData, leaveYear: e.target.value });
  };
  useEffect(() => {
    updateDatesForMonth(formData.leaveMonth);
  }, []);
  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    updateDatesForMonth(selectedMonth);
  };
  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };
  const updateDatesForMonth = (selectedMonth) => {
    const selectedMonthIndex = months.indexOf(selectedMonth);
    const daysInSelectedMonth = Array.from({
      length: getDaysInMonth(currentYear, selectedMonthIndex),
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      leaveMonth: selectedMonth,
    }));
  };
  const generateYears = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const handleClearFilter = () => {
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth:months[currentMonthIndex-1],
    });
  };
  useEffect(() => {
    const monthIndex = months.indexOf(formData.leaveMonth);
    const year = parseInt(formData.leaveYear, 10);

    const daysInMonth = getDaysInMonth(year, monthIndex);
  }, [formData.leaveMonth, formData.leaveYear]);
  useEffect(() => {
    const filterLeaveData = () => {
      if (!sallaryHistory || sallaryHistory.length === 0) return;

      const filteredData = sallaryHistory?.filter((leave) => {
        return (
          leave.year.toString() == formData.leaveYear &&
          leave.month == formData.leaveMonth
        );
      });

      setFilteredSalaryData(filteredData);
    };

    filterLeaveData();
  }, [sallaryHistory, formData?.leaveYear, formData?.leaveMonth]);

  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",

      key: "sn",
      render: (_, record, index) => <span> {index + 1}</span>,
    },
    {
      title: "NAME",
      dataIndex: "name",
      filterMultiple: true,
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

    {
      title: "MONTH",
      dataIndex: "month",
      key: "month",

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
      title: "YEAR",
      dataIndex: "year",
      key: "year",
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
      title: "PAID LEAVE",

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
      title: "UNPAID LEAVE",
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
      title: "TOTAL DEDUCTION",
      dataIndex: "total_salary_deduction",
      key: "total_salary_deduction",
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
      title: "TOTAL SALARY DAYS",
      dataIndex: "salary_days",
      key: "salary_days",
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
    <div
      className="  border-gray-300 px-5 py-5 bg-white rounded-lg shadow-sm"
      style={{
        maxHeight: "90vh", // Adjust height as needed
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
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
          Salary History
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
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClearFilter}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "Inter",
              color: COLOR.BLACK,
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
          maxHeight: "90vh", // Adjust height as needed
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <Table
          className="dotted-border-table"
          columns={columns}
          dataSource={filterSalaryData}
          pagination={{ pageSize: 10 }}
          rowClassName={() => "custom-row"}
          bordered={false}
          style={{ tableLayout: "fixed" }}
          rowKey="key"
          locale={{
            emptyText: (
              <div className="custom-no-data">No Salary Data Found</div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default AllEmployeeSalaryPage;
