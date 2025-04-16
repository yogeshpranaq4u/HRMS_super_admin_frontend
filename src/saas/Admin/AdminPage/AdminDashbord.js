import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./AdminDashbord.css";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AddEmployeeModal from "../AdminComponent/AddEmployeeModal";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { setUserDetails } from "../../Redux/Action";
import { toast } from "react-toastify";
import EditEmployeeModal from "../AdminComponent/EditEmployeeModal";

import MaterialTable from "material-table";

import InactiveEmployee from "../AdminComponent/InactiveEmployee";
const AdminDashbord = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const [employee, setEmployee] = useState();
  const token = sessionStorage.getItem("authToken");
  const [filteremployeeData, setFilterEmployeeData] = useState([]);
  const getReportingManager = useSelector((state) => state.getReportingManager);
  const getDepartement = useSelector((state) => state.getDepartement);
  const [selectedText, setSelectedText] = useState("Current");
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
        left: 80,
        backgroundColor: "#fff",
        zIndex: 1,
      },
    },
    { title: "Employee Type", field: "type", filtering: false },
    { title: "Emp.Code", field: "employee_code", filtering: false },
    { title: "Email ID", field: "email", filtering: false },
    { title: "Contact", field: "mobile", filtering: false },
    { title: "BG", field: "blood_group", filtering: false },
    {
      title: "Address",
      field: "location",
      filtering: false,
      cellStyle: {
        whiteSpace: "pre-wrap", // Ensures text wraps to the next line
        wordBreak: "break-word", // Break long words if needed
        minWidth: "300px", // Adjust width to prevent overflow
        maxWidth: "300px", // Prevents excessive column expansion
      },
    },
    { title: "Designation", field: "designation", filtering: false },
    { title: "Exp. Level", field: "experience", filtering: false },
    {
      title: "Total Experience",
      field: "total_experience",
      render: (rowData) =>
        rowData.total_experience === null ? "NA" : rowData.total_experience,
      filtering: false,
    },
    { title: "Date of Birth", field: "dob", filtering: false },
    { title: "Date of Joining", field: "doj", filtering: false },
    { title: "Department", field: "department", filtering: false },
    {
      title: "Reporting Manager",
      field: "reporting_manager",
      filtering: false,
    },
    { title: "Emp. Status", field: "status", filtering: false },
    { title: "Shift Timing", field: "shift_timing", filtering: false },
    {
      title: "Office Location",
      field: "officeLocation",
      filtering: false,
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

    { title: "Password", field: "password", filtering: false },
    {
      title: "Action",
      filtering: false,
      render: (rowData) => (
        <div>
          <button
            className="action-button"
            onClick={() => editEmployeeDetails(rowData)}
          >
            <FaEdit />
          </button>
          <button
            className="action-button"
            onClick={() => {
              setEmployee(rowData);
              setShowDialog(true);
            }}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const [formData, setFormData] = useState({
    manager: "All Data",
    statusType: "All Employee",
    department: "All Data",
  });

  const [filteredCategories, setFilteredCategories] =
    useState(getEmployeeDetails);

  useEffect(() => {
    setFilteredCategories(getEmployeeDetails);
  }, [dispatch, getEmployeeDetails]);
  const { setLoading, logout } = useAuth();

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };

  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getEmployeeDetails.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.employee_code.toLowerCase().includes(lowerCaseQuery) ||
        item.email.toLowerCase().includes(lowerCaseQuery) ||
        item.location.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredCategories(filteredItems);
  };

  const handleClick = () => {
    // setOpen(true)
    setModalOpen(true);
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_EMPLOYEE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          dispatch(setUserDetails(responseData?.data?.data));
          setFilteredCategories(responseData?.data?.data);
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
  }, [token, dispatch, setLoading, logout]);

  const deleteEmployeeDetails = async () => {
    setLoading(true);
    try {
      const response = await axios(`${BaseUrl}${Api.DELETE_EMPLOYEE}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: employee?.id,
        },
      });

      if (response?.data?.authenticated === false) {
        toast.error(response?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (response?.data?.success === true) {
          toast.success(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          fetchEmployees();
          setShowDialog(false);
        } else {
          toast.error(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          setShowDialog(false);
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
      setShowDialog(false);
    } finally {
      setLoading(false);
      setShowDialog(false);
    }
  };
  const editEmployeeDetails = (empData) => {
    setEmployee(empData);
    setEditModalOpen(true);
  };

  const handleStatusChange = (e) => {
    setFormData({ ...formData, statusType: e.target.value });
  };
  const handleDepartmentChange = (e) => {
    setFormData({ ...formData, department: e.target.value });
  };
  const handleManagerChange = (e) => {
    setFormData({ ...formData, manager: e.target.value });
  };
  useEffect(() => {
    const filterEmployeeData = () => {
      let filteredData;
      if (
        formData.manager === "All Data" &&
        formData.department === "All Data" &&
        formData.statusType === "All Employee"
      ) {
        filteredData = filteredCategories;
      } else {
        filteredData = filteredCategories?.filter((emp) => {
          const matchesManager =
            formData.manager === "All Data" ||
            emp?.reporting_manager === formData.manager;
          const matchesDepartment =
            formData.department === "All Data" ||
            emp?.department === formData.department;
          const matchesStatus =
            formData.statusType === "All Employee" ||
            emp?.status === formData.statusType;

          return matchesManager && matchesDepartment && matchesStatus;
        });
      }

      setFilterEmployeeData(filteredData);
    };

    filterEmployeeData();
  }, [
    formData.manager,
    formData.department,
    formData.statusType,
    filteredCategories,
    getEmployeeDetails,
    dispatch,
  ]);
  const handleClearFilter = () => {
    setFormData({
      manager: "All Data",
      statusType: "All Employee",
      department: "All Data",
    });
  };
  // const memoizedData = useMemo(() => {
  //   return filteremployeeData.map((employee, index) => ({
  //     ...employee,
  //     sn: index + 1, // Add SN number
  //   }));
  // }, [filteremployeeData, filteredCategories, getEmployeeDetails]);
  const memoizedData = useMemo(() => {
    if (!filteremployeeData || filteremployeeData.length === 0) {
      return []; // No data, return empty array
    }
    return filteremployeeData
      .filter((employee) => employee && Object.keys(employee).length > 0)
      .map((employee, index) => ({
        ...employee,
        sn: index + 1, // Add SN number
      }));
  }, [filteremployeeData]);

  const changeText = (text) => {
    setSelectedText(text);
  };
  return (
    <div className="admindashbord">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 20,
          color: "black",
          marginTop: "15px",
          marginBottom: "15px",
          textAlign: "left",
        }}
      >
        Employee Sheet
      </h1>
      <div>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <h2
            style={{
              borderBottom:
                selectedText === "Current" ? "2px solid #047EFF" : "none",
              paddingBottom: 8,
              fontWeight: selectedText === "Current" ? "700" : "500",
              cursor: "pointer",
              color: selectedText === "Current" ? "#047EFF" : "#343741",
            }}
            onClick={() => changeText("Current")}
          >
            Current Employees
          </h2>
          <h2
            style={{
              marginLeft: 20,
              borderBottom:
                selectedText === "Past" ? "2px solid #047EFF" : "none",
              paddingBottom: 8,
              fontWeight: selectedText === "Past" ? "700" : "500",
              cursor: "pointer",
              color: selectedText === "Past" ? "#047EFF" : "#343741",
            }}
            onClick={() => changeText("Past")}
          >
            Past Employees
          </h2>
        </div>
      </div>
      {selectedText === "Current" ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "5px",
            backgroundColor: "white",
            padding: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            overflowY: "auto",
            marginTop: 20,
          }}
        >
          <header className="page-header">
            <h1 tyle={{ fontSize: 25 }}>
              Employees{" "}
              <span className="employee-count">
                ({getEmployeeDetails?.length})
              </span>
            </h1>
            <button
              className="add-employee-button"
              onClick={handleClick}
              style={{
                justifyContent: "flex-end",
                alignSelf: "flex-end",
                alignItems: "flex-end",
                display: "flex",
              }}
            >
              + Add Employee
            </button>
          </header>

          <div className="filters-container" style={{ marginTop: 10 }}>
            <div className="filter-container">
              <label htmlFor="statusType" className="filter-label">
                Employee Status:
              </label>
              <select
                className="filter-dropdowndashbord"
                name="statusType"
                id="statusType"
                value={formData.statusType}
                onChange={handleStatusChange}
                required
              >
                <option value="All Employee">All Employee</option>
                <option value="Prohibition">Prohibition</option>
                <option value="Full time">Full time</option>
                <option value="Notice Period">Notice Period</option>
                <option value="Intern">Intern</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {/* <select
              className="filter-dropdowndashbord"
              name="statusType"
              id="statusType"
              value={formData.statusType}
              onChange={handleStatusChange}
              required
            >
              <option>Emp Status: All Employee</option>
              <option value="All Employee">All Employee</option>
              <option value="Prohibition">Prohibition</option>
              <option value="Full time">Full time</option>
              <option value="Notice Period">Notice Period</option>
              <option value="Intern">Intern</option>
              <option value="Inactive">Inactive</option>
            </select> */}
            <div className="filter-container">
              <label htmlFor="statusType" className="filter-label">
                Department:
              </label>
              <select
                className="filter-dropdowndashbord"
                name="department"
                id="department"
                value={formData.department}
                onChange={handleDepartmentChange}
                required
              >
                <option value="All Data">All Data</option>
                {getDepartement?.map((data) => (
                  <option key={data?.id} value={data?.department}>
                    {data.department}
                  </option>
                ))}
              </select>
            </div>
            {/* <select
              className="filter-dropdowndashbord"
              name="department"
              id="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              required
            >
              <option value="All Data">All Data</option>
              {getDepartement?.map((data) => (
                <option key={data?.id} value={data?.department}>
                  {data.department}
                </option>
              ))}
            </select> */}
            <div className="filter-container">
              <label htmlFor="statusType" className="filter-label">
                Reporting Manager:
              </label>
              {/* <select
                className="filter-dropdowndashbord"
                name="department"
                id="department"
                value={formData.department}
                onChange={handleDepartmentChange}
                required
              >
                <option value="All Data">All Data</option>
                {getDepartement?.map((data) => (
                  <option key={data?.id} value={data?.department}>
                    {data.department}
                  </option>
                ))}
              </select> */}
              <select
                className="filter-dropdowndashbord "
                name="manager"
                id="manager"
                value={formData.manager}
                onChange={handleManagerChange}
                required
              >
                <option value="All Data">All Data</option>
                {getReportingManager?.map((data) => (
                  <option key={data?.id} value={data?.name}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <select
              className="filter-dropdowndashbord "
              name="manager"
              id="manager"
              value={formData.manager}
              onChange={handleManagerChange}
              required
            >
              <option value="All Data">All Data</option>
              {getReportingManager?.map((data) => (
                <option key={data?.id} value={data?.name}>
                  {data.name}
                </option>
              ))}
            </select> */}
            {(formData?.manager !== "All Data" ||
              formData?.department !== "All Data" ||
              formData?.statusType !== "All Employee") && (
              <div className="form-group32">
                <button
                  type="button"
                  className="clear-filter-button"
                  onClick={handleClearFilter}
                >
                  Clear Filter
                </button>
              </div>
            )}

            <div className="search-bar">
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
          </div>

          <div className="table-container123">
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
          {showDialog && (
            <div className="dialog-backdrop">
              <div className="dialog">
                <p>Alert!</p>
                <p>Do you want to delete employee details?</p>

                <div className="dialog-buttons">
                  <button
                    onClick={() => deleteEmployeeDetails()}
                    className="confirm-btn"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDialog(false)}
                    className="cancel-btn"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <InactiveEmployee />
        </div>
      )}

      <AddEmployeeModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditEmployeeModal
        open={editmodalOpen}
        onClose={() => setEditModalOpen(false)}
        user={employee}
      />
    </div>
  );
};

export default AdminDashbord;
