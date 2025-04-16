import MaterialTable from "material-table";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl, ImagePath, ImagePath1 } from "../../Config/Api";
import { toast } from "react-toastify";
import NoImage from "../../Assets/imageno.png";
import "./MonthlyAttendance.css";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import PullToRefresh from "react-simple-pull-to-refresh";
import { setMonthlyAttendance } from "../../Redux/Action";
import { useDispatch } from "react-redux";
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
const MonthlyAttendance = () => {
  const employeeId = sessionStorage.getItem("employeeId");

  const [test1, setTest1] = useState([]);
  const { setLoading, logout } = useAuth();
  const token = sessionStorage.getItem("authToken");
  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };
  const getSwitchOnOff = useSelector((state) => state.getSwitchOnOff);
  const formatDate = (day, monthIndex, year) => {
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(monthIndex + 1).padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  const getMonthlyAttendance = useSelector(
    (state) => state.getMonthlyAttendance
  );
  const handleYearChange = (e) => {
    setFormData({ ...formData, leaveYear: e.target.value });
  };
  const generateYears = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };
  const [filteredCategories, setFilteredCategories] =
    useState(getMonthlyAttendance);

  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: months[currentMonthIndex], // Default to current month
  });
  const [currentMonth, setCurrentMonth] = useState(months[currentMonthIndex]);
  const handleRefresh = async () => {
    // await getMonthlyAttendance1();
  };
  useEffect(() => {
    getMonthlyAttendance1(months[currentMonthIndex]);
    setFormData({
      leaveYear: currentYear.toString(),
      leaveMonth: months[currentMonthIndex],
    });
  }, []);
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
      if (getSwitchOnOff && (dayName === "SATURDAY" || dayName === "SUNDAY")) {
        continue;
      }

      datesArray.push({
        title: (
          <div style={{ textAlign: "center", lineHeight: "1.2" }}>
            <div style={{ fontWeight: "bold", fontSize: "12px" }}>
              {day}/{monthIndex + 1}/{year}
            </div>
            <div style={{ fontSize: "14px", color: "#555", marginTop: 5 }}>
              {dayName}
            </div>
          </div>
        ),
        field: `day_${day}`,
        cellStyle: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "12px",
          padding: "10px",
        },
        headerStyle: {
          fontWeight: "bold",
          fontSize: "12px",
          textAlign: "center",
          padding: "10px",
          width: "150px",
        },
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
              {status === "Leave" || status === "Week Off"||status === "Holiday" ? (
                <div></div>
              ) : (
                <>
                  <div>In: {inTime}</div>
                  <div>Out: {outTime}</div>
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
                      : status == "Leave"
                      ? "#DE232A"
                      : status == "Week Off"
                      ? "#8CC4FF"
                      : status==
                      "Holiday"?"#FEAABC":"#fff",
                  borderRadius: 10,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <h3 style={{ marginTop: 5, display: "flex" }}>{status}</h3>
              </div>
              {status !== "Leave" && status !== "Week Off" &&status !== "Holiday"&& (
                <h3 style={{ top: 5, display: "flex" }}>
                  Work Status: {workStatus}
                </h3>
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
      field: "sn",
      filtering: false,
      cellStyle: {
        position: "sticky",
        left: -2,
        backgroundColor: "#fff",
        zIndex: 1,
        textAlign: "center",
        borderRight: "1px solid #ddd", // Border to separate sticky columns
      },
      headerStyle: {
        position: "sticky",
        left: 0,
        backgroundColor: "#f4f4f4",
        zIndex: 2,
        fontWeight: "bold",
        padding: "20px",
        fontSize: "13px",
        borderRight: "1px solid #ddd",
      },
    },
    {
      title: "EMPLOYEE NAME",
      field: "name",
      sorting: true,
      cellStyle: {
        position: "sticky",
        left: 80, // Offset by width of SN. column
        backgroundColor: "#fff",
        zIndex: 1,
        width: "250px",
        padding: "20px",
        fontSize: "14px",
        fontWeight: "600",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "center",
        borderRight: "1px solid #ddd",
      },
      headerStyle: {
        position: "sticky",
        left: 80,
        backgroundColor: "#f4f4f4",
        zIndex: 2,
        width: "250px",
        fontWeight: "bold",
        padding: "20px",
        fontSize: "13px",
        borderRight: "1px solid #ddd",
      },
      render: (rowData) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={rowData?.image ? ImagePath + rowData?.image : NoImage}
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
              borderRadius: "50%",
              borderWidth: 2,
              borderColor: "#E2E8F099",
            }}
          />
          <span>{rowData.name}</span>
        </div>
      ),
    },
    {
      title: "DEDUCTION SUMMARY",
      field: "name",
      sorting: true,
      cellStyle: {
        position: "sticky",
        left: 280, // Offset by width of SN. column
        backgroundColor: "#fff",
        zIndex: 1,
        width: "250px",

        fontSize: "14px",
        fontWeight: "600",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        //display: "flex",
        alignItems: "center",
        borderRight: "1px solid #ddd",
      },
      headerStyle: {
        position: "sticky",
        left: 280,
        backgroundColor: "#f4f4f4",
        zIndex: 2,
        width: "250px",
        fontWeight: "bold",
        padding: "20px",
        fontSize: "13px",
        borderRight: "1px solid #ddd",
      },
      render: (rowData) => (
        <>
       
          <div>Total Lates: {rowData?.late_count}</div>
          <div>Paid leaves: {rowData?.paid_Leave}</div>
          <div>UnPaid leaves : {rowData?.unpaid_leave}</div>
       
        </>
      ),
    },
    // ...getCurrentMonthDates().map((dateColumn) => ({
    //   ...dateColumn,
    //   sorting: true,
    //   cellStyle: {
    //     width: "150px",
    //     padding: "10px",
    //     fontSize: "12px",
    //     whiteSpace: "nowrap",
    //     overflow: "hidden",
    //     textAlign: "center",
    //     textOverflow: "ellipsis",
    //   },
    //   headerStyle: {
    //     width: "150px",
    //     textAlign: "center",
    //     fontWeight: "bold",
    //     fontSize: "13px",
    //   },
    // })),
    ...getCurrentMonthDates(currentMonth),
  ];
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
  const memoizedData = useMemo(() => {
    return filteredCategories?.map((employee, index) => ({
      ...employee,
      sn: index + 1,
    }));
  }, [filteredCategories, formData.leaveMonth, dispatch]);

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
    setTest1(daysInSelectedMonth);
    getMonthlyAttendance1(selectedMonth);
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    updateDatesForMonth(selectedMonth);
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
    }\nApprove Leave: ${employee?.paid_Leave || 0}\nUnapprove Leave: ${
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
    <PullToRefresh onRefresh={handleRefresh} canFetchMore={true}>
      <div>
        <div
          style={{
            marginBottom: 20,
            marginTop: 25,
            justifyContent: "space-between",
            flexDirection: "row",
            display: "flex",
          }}
        >
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
          <div
            style={{
              marginBottom: 20,
              alignItems: "center",
              flexDirection: "row",
              display: "flex",
            }}
          >
            <h2 style={{ color: "#155596", fontWeight: "700", fontSize: 20 }}>
              Attendance History
            </h2>
            {/* <div className="form-group3">
              <h3>Current Year: {formData.leaveYear}</h3>
            </div> */}
            <div className="form-group3">
              <label htmlFor="leaveYear">Current Year: </label>

              <select
                name="experience"
                id="experience"
                value={formData.leaveYear}
                onChange={handleYearChange}
                required
              >
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group3">
              <label htmlFor="leaveMonth">Month: </label>

              <select
                name="leaveMonth"
                id="leaveMonth"
                value={formData.leaveMonth}
                onChange={handleMonthChange}
              >
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <CSVLink
              className="downloadbtn"
              filename={"employee.csv"}
              data={downloadCsvData}
            >
              Export to CSV
            </CSVLink>
          </div>
        </div>
        <div style={{ marginBottom: 10 }}></div>
        <div
          style={{
            maxHeight: "650px",
            overflowY: "auto",
            overflowX: "auto",
          }}
          className="table-container"
        >
          <table className="employee-table1011">
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
          </table>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default MonthlyAttendance;
