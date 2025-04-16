import React, { useState, useMemo } from "react";
import { COLOR, FONT, IMAGE } from "../../../../Config/Color";
import { FaSearch } from "react-icons/fa";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Api, BaseUrl, ImagePath } from "../../../../Config/Api";
import MaterialTable from "material-table";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import { setMonthlyAttendance } from "../../../../Redux/Action";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
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
const MonthlyAttendanceHistory = ({ data }) => {
  const employeeId = sessionStorage.getItem("employeeId");

  const [test1, setTest1] = useState([]);
  const { setLoading, logout } = useAuth();
  const token = sessionStorage.getItem("authToken");
  const getMonthlyAttendance = useSelector(
    (state) => state.getMonthlyAttendance
  );
  const dispatch = useDispatch();
  const [filteredCategories, setFilteredCategories] =
    useState(getMonthlyAttendance);
  const [query, setQuery] = useState("");
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const currentDay = new Date().getDate();
  const formatDate = (day, monthIndex, year) => {
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(monthIndex + 1).padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  const currentFormattedDate = formatDate(
    currentDay,
    currentMonthIndex,
    currentYear
  );
  const [formData, setFormData] = useState({
    leaveYear: currentYear?.toString(),
    leaveMonth: months[currentMonthIndex],
    leaveDate: currentFormattedDate,
    leaveDates: [],
    statusType: "ALL Data",
  });
  const handleRefresh = async () => {
    // await getAllUserAttendanceData();
  };
  const generateYears = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };
  const handleYearChange = (e) => {
    setFormData({ ...formData, leaveYear: e.target.value });
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    updateDatesForMonth(selectedMonth);
  };
  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };
  const updateDatesForMonth = (selectedMonth) => {
    const selectedMonthIndex = months.indexOf(selectedMonth);
    const daysInSelectedMonth = Array.from(
      { length: getDaysInMonth(currentYear, selectedMonthIndex) },
      (_, i) => formatDate(i + 1, selectedMonthIndex, currentYear)
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      leaveMonth: selectedMonth,
      leaveDates: daysInSelectedMonth,
    }));
    setCurrentMonth(selectedMonth);

    getMonthlyAttendance1(selectedMonth);
  };
  const [currentMonth, setCurrentMonth] = useState(months[currentMonthIndex]);
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };
  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getMonthlyAttendance?.filter((item) => {
      return item.name.toLowerCase().includes(lowerCaseQuery);
    });

    setFilteredCategories(filteredItems);
  };
  const getMonthIndex = (monthName) => months.indexOf(monthName);
  const getCurrentMonthDates = (monthName) => {
    const year = new Date().getFullYear(); // You can modify this to accept dynamic years if needed.
    const monthIndex = getMonthIndex(monthName); // Get the zero-based index of the month.
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const datesArray = [];
    const weekdays = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dayName = weekdays[date.getDay()];
      if (data && (dayName === "SATURDAY" || dayName === "SUNDAY")) {
        continue;
      }

      datesArray.push({
        title: (
          <div style={{ textAlign: "center", lineHeight: "1.2" }}>
            <div
              style={{
                fontSize: "12px",
                fontFamily: FONT.INTER,
                color: "#9CA3AF",
                fontWeight: "600",
              }}
            >
              {day}/{monthIndex + 1}/{year}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontFamily: FONT.INTER,
                color: "#9CA3AF",
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              {dayName}
            </div>
          </div>
        ),
        field: `day_${day}`,

        render: (rowData) => {
          const attendanceData = rowData?.attendance;
          const dayData = attendanceData ? attendanceData[`Day ${day}`] : {};
          const inTime = dayData?.in_time || "N/A";
          const outTime = dayData?.out_time || "N/A";
          const status = dayData?.status || "";
          const workStatus = dayData?.work_status || "";

          return (
            <div
              style={{ fontSize: "13px", lineHeight: "1.5", fontWeight: "500" }}
            >
              {status === "Leave" ||
              status === "Week Off" ||
              status === "Holiday" ? (
                <div></div>
              ) : (
                <>
                  <div
                    style={{
                      margin: 0,
                      fontFamily: FONT.INTER,
                      fontWeight: "600",
                      fontSize: "12px",
                      lineHeight: "20px",
                      color: COLOR.GRAY4,
                    }}
                  >
                    In: {inTime}
                  </div>
                  <div
                    style={{
                      margin: 0,
                      fontFamily: FONT.INTER,
                      fontWeight: "600",
                      fontSize: "12px",
                      lineHeight: "20px",
                      color: COLOR.GRAY4,
                    }}
                  >
                    Out: {outTime}
                  </div>
                </>
              )}

              <div
                style={{
                  background:
                    status == "On Time"
                      ? "#009A20"
                      : status == "Half-Day"
                      ? "#1E40AF"
                      : status === "Late"
                      ? "#FFCC00"
                      : status == "Paid leave" || status == "Unpaid leave"
                      ? "#DE232A"
                      : status == "Week Off"
                      ? "#8CC4FF"
                      : status=='Holiday'?"#FEAABC":"#fff",
                  borderRadius: 6,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  height: "30px", // Added height
                  width: "100px", // Optional, based on your layout
                }}
              >
                <span
                  style={{
                    margin: 0,
                    fontFamily: FONT.INTER,
                    fontWeight: "600",
                    fontSize: "12px",
                    lineHeight: "20px",
                    color: status=='Half-Day'?'#fff':COLOR.GRAY4,
                  }}
                >
                  {status}
                </span>
              </div>
              {(status !== "Paid leave" || status !== "Unpaid leave") &&
                status !== "Week Off" &&
                status !== "Holiday" && (
                  <span
                    style={{
                      margin: 0,
                      fontFamily: FONT.INTER,
                      fontWeight: "600",
                      fontSize: "12px",
                      lineHeight: "20px",
                      color: COLOR.GRAY4,
                    }}
                  >
                    Work Status: {workStatus}
                  </span>
                )}
            </div>
          );
        },
      });
    }
    return datesArray;
  };
  const columns = [
    {
      title: "SN.",
      dataIndex: "sn",
      key: "sn",
      onHeaderCell: () => ({
        style: {
          fontSize: "12px",
          fontFamily: FONT.INTER,
          color: "#373A3C",
          fontWeight: "600",
        }, // Customize size here
      }),
      render: (text, record, index) => index + 1, // Generate SN dynamically
      width: 60,
      fixed: "left",
      // align: "center",
    },
    {
      title: "EMPLOYEE NAME",
      field: "name",
      fixed: "left",
      width: 200,
      onHeaderCell: () => ({
        style: {
          fontSize: "12px",
          fontFamily: FONT.INTER,
          color: "#9CA3AF",
          fontWeight: "600",
        }, // Customize size here
      }),
      render: (rowData) => (
        <div style={{ display: "flex", alignItems: "center", width: 200 }}>
          <img
            src={rowData?.image ? ImagePath + rowData?.image : IMAGE.NOIMAGE}
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "#E2E8F099",
            }}
          />
          <span
            style={{
              fontFamily: FONT.INTER,
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "20px",
              color: COLOR.GRAY4,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              display: "block", // Ensures it takes full width
              overflowWrap: "break-word",
            }}
          >
            {rowData.name}
          </span>
        </div>
      ),
    },
    {
      title: "DEDUCTION SUMMARY",
      field: "name",
      width: 200,
      onHeaderCell: () => ({
        style: {
          fontSize: "12px",
          fontFamily: FONT.INTER,
          color: "#9CA3AF",
          fontWeight: "600",
        }, // Customize size here
      }),
      render: (rowData) => (
        <>
          <div
            style={{
              fontFamily: FONT.INTER,
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "20px",
              color: COLOR.GRAY4,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              display: "block", // Ensures it takes full width
              overflowWrap: "break-word",
            }}
          >
            Total Lates: {rowData?.late_count}
          </div>
          <div
            style={{
              fontFamily: FONT.INTER,
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "20px",
              color: COLOR.GRAY4,
            }}
          >
            Paid leaves: {rowData?.paid_Leave}
          </div>
          <div
            style={{
              fontFamily: FONT.INTER,
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "20px",
              color: COLOR.GRAY4,
            }}
          >
            UnPaid leaves : {rowData?.unpaid_leave}
          </div>
        </>
      ),
    },

    ...getCurrentMonthDates(currentMonth),
  ];

  const getMonthlyAttendance1 = async (data) => {
    setLoading(true);
    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_MONTHLY_ATTENDANCE}?month=${data}`,
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
          // setAllAttendance(responseData?.data?.data);
          setFilteredCategories(responseData?.data?.data);

          dispatch(setMonthlyAttendance(responseData?.data?.data));
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
  const handleClearFilter = () => {
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: months[currentMonthIndex], // Reset to current month
    });
    updateDatesForMonth(months[currentMonthIndex]);
    setQuery(""); // Clear search input
    getMonthlyAttendance1(months[currentMonthIndex]); // Fetch data for the current month
  };
  const downloadCsvData = filteredCategories.map((employee) => {
    const attendanceDays = employee?.attendance || {};

    // Flatten attendance data into separate columns with status, login time, and logout time
    const flattenedAttendance = Object.keys(attendanceDays).reduce(
      (acc, day) => {
        const dayData = attendanceDays[day];
        acc[day] = dayData
          ? `${dayData.status || "N/A"} (Login: ${
              dayData.in_time || "N/A"
            }, Logout: ${dayData.out_time || "N/A"})`
          : "N/A";
        return acc;
      },
      {}
    );

    const deductionSummary = `Total Late: ${
      employee?.late_count || 0
    }\nPaid Leave: ${employee?.paid_Leave || 0}\nUnpaid Leave: ${
      employee?.unpaid_leave || 0
    }`;
    return {
      Name: employee?.name,
      Month: employee?.month,
      DeductionSummary: deductionSummary,
      ...flattenedAttendance, // Spread the flattened attendance data
    };
  });
  return (
    <div
      className="  border-gray-300 px-5 py-5 bg-white rounded-lg shadow-sm"
      style={{
        maxHeight: "80vh", // Adjust height as needed
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <PullToRefresh onRefresh={handleRefresh} canFetchMore={true}>
        <div className="flex items-center justify-between ">
          <div
            style={{
              width: 350,
              height: 40,

              display: "flex",
            }}
          >
            <div className="searchBar-wrapper">
              <input
                type="text"
                id="search-query"
                name="query"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
                autoComplete="current-query"
                className="searchBar-input"
              />
              <FaSearch className="search-icon" />
            </div>
          </div>
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
                name="experience"
                id="experience"
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
            {/* <CSVLink
              className="downloadbtn"
              filename={"employee.csv"}
              data={downloadCsvData}
            >
              Export to CSV
            </CSVLink> */}
            <CSVLink
              style={{
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "Inter",
                color: "white",
                lineHeight: "18px",
              }}
              className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 flex items-center justify-center"
              filename={"employee.csv"}
              data={downloadCsvData}
            >
              Export to CSV
            </CSVLink>
          </div>
        </div>
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            // maxHeight: "90vh", // Adjust height as needed
            // overflowY: "auto",
            // overflowX: "auto",
          }}
        >
          {/* <table className="employee-table1011">
            <tbody>
              <MaterialTable
                title={null}
                columns={columns}
                data={memoizedData}
                options={{
                  paging: false,
                  tableLayout: "auto",
                  sorting: true,
                  headerStyle: {
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f1f1f1",
                    zIndex: 1,
                  },
                  maxBodyHeight: "900px",
                }}
                style={{ width: "100%" }}
              />
            </tbody>
          </table> */}
          <div
            style={{
              marginTop: "20px",
              width: "100%",
              // maxHeight: "90vh",
              // // overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <Table
              className="dotted-border-table"
              columns={columns}
              dataSource={filteredCategories}
              locale={{
                emptyText: (
                  <div className="custom-no-data">No Attendance Data Found</div>
                ),
              }}
              // pagination={{ pageSize: 8, position: ["bottomRight"] }}
              rowClassName={() => "custom-row"}
              bordered={false}
              // style={{ tableLayout: "auto" }}
              tableLayout="fixed"
              rowKey="key"
              scroll={{ x: 5000 }} // Ensures proper scrolling behavior
              // scroll={{ y: 1000, x: 8000 }}
              pagination={false}
            />
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
};

export default MonthlyAttendanceHistory;
