import MaterialTable from "material-table";
import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import EditInactiveEMployee from "./EditInactiveEMployee";
import "../AdminPage/AdminDashbord.css";
const InactiveEmployee = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [employee, setEmployee] = useState();
  const [filteremployeeData, setFilterEmployeeData] = useState([]);
  const getAllInactiveEmployee = useSelector(
    (state) => state.getAllInactiveEmployee
  );
  useEffect(() => {
    setFilterEmployeeData(getAllInactiveEmployee);
  }, [dispatch, getAllInactiveEmployee]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };

  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getAllInactiveEmployee.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.employee_code.toLowerCase().includes(lowerCaseQuery) ||
        item.email.toLowerCase().includes(lowerCaseQuery) ||
        item.location.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilterEmployeeData(filteredItems);
  };
  const columns = [
    {
      title: "SN.",
      field: "sn",

      filtering: false,
      cellStyle: {
        position: "sticky",
        left: 0,
        backgroundColor: "#fff",
        zIndex: 1,
      },
    },
    {
      title: "Name.",
      field: "name",
      filtering: false,
      cellStyle: {
        position: "sticky",
        left: 60,
        backgroundColor: "#fff",
        zIndex: 1,
      },
    },
    { title: "Employee Type", field: "type", filtering: false },
    { title: "Emp.Code", field: "employee_code", filtering: false },
    { title: "Email ID", field: "email", filtering: false },
    { title: "Contact", field: "mobile", filtering: false },

    { title: "Address", field: "location", filtering: false  ,cellStyle: {
      whiteSpace: "pre-wrap", // Ensures text wraps to the next line
      wordBreak: "break-word", // Break long words if needed
      minWidth: "300px", // Adjust width to prevent overflow
      maxWidth: "300px", // Prevents excessive column expansion
    },},
    { title: "Designation", field: "designation", filtering: false },
    { title: "Exp. Level", field: "experience", filtering: false },

    { title: "Date of Birth", field: "dob", filtering: false },
    { title: "Date of Joining", field: "doj", filtering: false },
    { title: "Department", field: "department", filtering: false },
    {
      title: "Reporting Manager",
      field: "reporting_manager",
      filtering: false,
    },
    { title: "Emp. Status", field: "status", filtering: false },

    {
      title: "Leaving Date",
      field: "leaving_date",
      filtering: false,
      render: (rowData) =>
        rowData?.leaving_date === null ? "NA" : rowData?.leaving_date,
    },
    {
      title: "Notice End Date",
      field: "notice_period_end_date",
      filtering: false,
      render: (rowData) =>
        rowData?.notice_period_end_date === null
          ? "NA"
          : rowData?.notice_period_end_date,
    },

    {
      title: "Prohibition End Date",
      field: "prohibition_end_date",
      filtering: false,
      render: (rowData) =>
        rowData?.prohibition_end_date === null
          ? "NA"
          : rowData?.prohibition_end_date,
    },

    {
      title: "Internship End Date",
      field: "intern_end_date",
      filtering: false,
      render: (rowData) =>
        rowData?.intern_end_date === null ? "NA" : rowData?.intern_end_date,
    },
    {
      title: "Action",
      filtering: false,
      render: (rowData) => (
        <div>
          <button
            s
            className="action-button"
            onClick={() => editEmployeeDetails(rowData)}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];
  const editEmployeeDetails = (empData) => {
    setEmployee(empData);
    setEditModalOpen(true);
  };
  const memoizedData = useMemo(() => {
    return filteremployeeData.map((employee, index) => ({
      ...employee,
      sn: index + 1, // Add SN number
    }));
  }, [getAllInactiveEmployee, filteremployeeData]);
  return (
    <div
      style={{
        width: "100%",
        // height: "100%",
        borderRadius: "5px",
        backgroundColor: "white",
        padding: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
      }}
    >
      <div
        className="search-bar"
        style={{
          justifyContent: "space-between",
          marginTop: 10,
          flexDirection: "row",
        }}
      >
        <h1 style={{ fontSize: 25 }}>
          Employees{" "}
          <span className="employee-count">
            ({getAllInactiveEmployee?.length})
          </span>
        </h1>
        <input
          type="text"
          id="search-query"
          name="query"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          autoComplete="current-query"
          className="search-input"
        />
        <FaSearch className="search-icon" style={{ marginRight: 10 }} />
      </div>
      {/* <div className="table-container123">
        <table className="table">
          <MaterialTable
            columns={columns}
            data={memoizedData}
            title={null}
            options={{
              paging: true,
              search: false,
              filtering: true,
            }}
            components={{
              Toolbar: () => null, // Completely removes the toolbar
            }}
            style={{
              overflow: "hidden",
              fontSize: 15,
              fontWeight: "500",
              boxShadow: "none",
              border: "none",
            }}
          />
        </table>
      </div> */}
      <div className="table-container123" style={{ marginTop: 10 }}>
        <table className="table">
          <MaterialTable
            columns={columns}
            data={memoizedData}
            title={null}
            options={{
              paging: true,
              search: false,
              filtering: true,
              headerStyle: {
                position: "sticky",
                top: 0,

                backgroundColor: "#f4f4f4",
                zIndex: 2,
              },
              maxBodyHeight: "65vh",
            }}
            components={{
              Toolbar: () => null,
            }}
            style={{
              overflow: "hidden",
              fontSize: 15,
              fontWeight: "500",
              boxShadow: "none",
              border: "none",
            }}
          />
        </table>
      </div>
      <EditInactiveEMployee
        open={editmodalOpen}
        onClose={() => setEditModalOpen(false)}
        user={employee}
      />
    </div>
  );
};

export default InactiveEmployee;
