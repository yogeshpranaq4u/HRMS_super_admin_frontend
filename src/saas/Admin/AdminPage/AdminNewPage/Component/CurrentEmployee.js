import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { COLOR, FONT, IMAGE } from "../../../../Config/Color";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import { Api, BaseUrl, ImagePath } from "../../../../Config/Api";
import AddEmployeeModal from "../../../AdminComponent/AddEmployeeModal";
import EditEmployeeModal from "../../../AdminComponent/EditEmployeeModal";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import { setUserDetails } from "../../../../Redux/Action";
const CurrentEmployee = () => {
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const getReportingManager = useSelector((state) => state.getReportingManager);
  const getDepartement = useSelector((state) => state.getDepartement);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const token = sessionStorage.getItem("authToken");
  const { setLoading, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [employee, setEmployee] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [filteredCategories, setFilteredCategories] =
    useState(getEmployeeDetails);
  const [filteremployeeData, setFilterEmployeeData] = useState([]);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    manager: "All Data",
    statusType: "All Employee",
    department: "All Data",
    officeLocation: "ALL Data",
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
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
  const handleStatusChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, statusType: e.target.value });
  };
  const handleDepartmentChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, department: e.target.value });
  };
  const handleManagerChange = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, manager: e.target.value });
  };

  const handalOfficeLocation = (e) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setFormData({ ...formData, officeLocation: e.target.value });
  };
  useEffect(() => {
    const filterEmployeeData = () => {
      let filteredData;
      if (
        formData.manager === "All Data" &&
        formData.department === "All Data" &&
        formData.statusType === "All Employee"&&
        formData.officeLocation === "ALL Data"
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
            const matchesLocation =
            formData.officeLocation === "All Data" ||
            emp?.officeLocation === formData.officeLocation;

          return matchesManager && matchesDepartment && matchesStatus&&matchesLocation;
        });
      }

      setFilterEmployeeData(filteredData);
    };

    filterEmployeeData();
  }, [
    formData.manager,
    formData.department,
    formData.statusType,
    formData?.officeLocation,
    filteredCategories,
    getEmployeeDetails,
    dispatch,
  ]);
  const editEmployeeDetails = (empData) => {
    setEmployee(empData);
    setEditModalOpen(true);
  };

  const columns = [
    {
      title: "SN.",
      dataIndex: "sn",
      key: "sn",
      render: (text, record, index) => index + 1,
      width: 60,
      fixed: "left",
    },

    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", width: 200 }}>
          <img
            src={record?.image ? ImagePath + record.image : IMAGE.NOIMAGE}
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
              borderRadius: 10,
              border: "2px solid #E2E8F099",
            }}
            alt="Employee"
          />
          <span
            style={{
              fontFamily: FONT.INTER,
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "20px",
              color: COLOR.GRAY4,
            }}
          >
            {record.name}
          </span>
        </div>
      ),
    },

    {
      title: "EMPLOYEE TYPE",
      width: 150,
      dataIndex: "type",
      filterMultiple: true,
      key: "type",
    },
    {
      title: "EMP CODE",
      width: 150,
      dataIndex: "employee_code",
      key: "employee_code",
    },
    {
      title: "EMAIL ID",
      dataIndex: "email",
      filtering: false,
      width: 250,
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
    { title: "CONTACT", dataIndex: "mobile", filtering: false, width: 150 },
    {
      title: "MARITAL STATUS",
      dataIndex: "marital_status",
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
          {text == null ? "N/A" : text}
        </span>
      ),
    },
    { title: "BG", dataIndex: "blood_group", filtering: false, width: 100 },

    {
      title: "ADDRESS",
      dataIndex: "location",
      key: "location",
      width: 300, // Set a fixed width
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
      title: "DESIGNATION",
      dataIndex: "designation",
      filtering: false,
      width: 200,

      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
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
      title: "EXP. LEVEL",
      dataIndex: "experience",
      filtering: false,
      width: 150,
    },
    {
      title: "TOTAL EXP",
      field: "total_experience",
      width: 150,
      render: (_, rowData) =>
        rowData.total_experience === null ? "NA" : rowData.total_experience,
      filtering: false,
    },
    { title: "DATE OF BIRTH", dataIndex: "dob", filtering: false, width: 200 },
    {
      title: "DATE OF JOINING",
      dataIndex: "doj",
      filtering: false,
      width: 200,
    },
    {
      title: "DEPARTMENT",
      dataIndex: "department",
      filtering: false,
      width: 200,

      render: (text) => (
              <span
                style={{
                  fontFamily: "Inter",
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
      title: "REPORTING MANAGER",
      dataIndex: "reporting_manager",
      width: 200,
      filtering: false,
    },
    { title: "EMP. STATUS", dataIndex: "status", filtering: false, width: 200 },
    {
      title: "SHIFT TIMING",
      dataIndex: "shift_timing",
      filtering: false,
      width: 200,
    },
    {
      title: "OFFICE LOCATION",
      dataIndex: "officeLocation",
      width: 200,
      filtering: false,
    },
    {
      title: "NOTICE END DATE",
      field: "notice_period_end_date",
      width: 200,
      filtering: false,
      render: (_, rowData) =>
        rowData?.notice_period_end_date === null
          ? "NA"
          : rowData?.notice_period_end_date,
    },

    {
      title: "PROHIBITION END DATE",
      dataIndex: "prohibition_end_date",
      width: 200,
      filtering: false,
      render: (_, rowData) =>
        rowData?.prohibition_end_date === null
          ? "NA"
          : rowData?.prohibition_end_date,
    },

    {
      title: "INTERNSHIP END DATE",
      dataIndex: "intern_end_date",
      width: 200,
      filtering: false,
      render: (_, rowData) =>
        rowData?.intern_end_date === null ? "NA" : rowData?.intern_end_date,
    },

    { title: "PASSWORD", dataIndex: "password", filtering: false, width: 200 },
    {
      title: "ACTION",
      width: 200,
      filtering: false,
      render: (_, rowData) => (
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
  }, [token, dispatch, setLoading, logout, editmodalOpen]);
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
  useEffect(() => {
    fetchEmployees();
  }, [editmodalOpen, modalOpen]);
  const handleClearFilter = () => {
    setFormData({
      manager: "All Data",
      statusType: "All Employee",
      department: "All Data",
      officeLocation: "ALL Data",
    });
    setIsDisabled(true);
    setIsFilterApplied(false);
  };
  const handleClick = () => {
    // setOpen(true)
    setModalOpen(true);
  };
  return (
    <div
      className="  border-gray-300 px-5 py-5 bg-white rounded-lg shadow-sm"
      style={{
        maxHeight: "80vh", // Adjust height as needed
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="flex items-center justify-between ">
        <div
          style={{
            width: 250,
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
          className="flex items-center space-x-4 "
          style={{
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
          }}
        >
          <div>
            <span
              className="ml-2"
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.GRAY3,
                lineHeight: "18px",
              }}
            >
              Employee Status:
            </span>

            <select
              name="statusType"
              id="statusType"
              value={formData.statusType}
              onChange={handleStatusChange}
              required
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.BLACK,
                lineHeight: "18px",
              }}
            >
              <option value="All Employee">All Employee</option>
              <option value="Prohibition">Prohibition</option>
              <option value="Full time">Full time</option>
              <option value="Notice Period">Notice Period</option>
              <option value="Intern">Intern</option>
             
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
              Department:
            </span>

            <select
              name="department"
              id="department"
              value={formData.department}
              onChange={handleDepartmentChange}
              required
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.BLACK,
                lineHeight: "18px",
              }}
            >
              <option value="All Data">All Data</option>
              {getDepartement?.map((data) => (
                <option key={data?.id} value={data?.department}>
                  {data.department}
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
              Reporting Manager:
            </span>

            <select
              name="manager"
              id="manager"
              value={formData.manager}
              onChange={handleManagerChange}
              required
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.BLACK,
                lineHeight: "18px",
              }}
            >
              <option value="All Data">All Data</option>
              {getReportingManager?.map((data) => (
                <option key={data?.id} value={data?.name}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span
              // className="mr-2"
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.GRAY3,
                lineHeight: "18px",
              }}
            >
              Office Location
            </span>

            <select
              name="officeLocation"
              id="officeLocation"
              value={formData.officeLocation}
              onChange={handalOfficeLocation}
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.BLACK,
                lineHeight: "18px",
              }}
            >
              <option value="ALL Data">All Data</option>
              <option value="Noida">Noida</option>
              <option value="Gurugram">Gurugram</option>
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
            onClick={handleClick}
            className={`px-3 py-1 rounded flex items-center justify-center transition-colors ${"bg-blue-500 text-white hover:bg-blue-600"} `}
            style={{
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "Inter",
              lineHeight: "18px",
            }}
          >
            Add Employee
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
          width: "100%",
        }}
      >
        <div
          style={{
            marginTop: "20px",
            width: "100%",

            overflowX: "auto",
          }}
        >
          <Table
            dataSource={filteremployeeData}
            className="dotted-border-table"
            columns={columns}
            // pagination={{ pageSize: 8, position: ["bottomRight"] }}
            rowClassName={() => "custom-row"}
            bordered={false}
            // style={{ tableLayout: "auto" }}
            tableLayout="fixed"
            rowKey="key"
            // scroll={{ x: 1000 }} // Ensures proper scrolling behavior
            scroll={{ y: "70vh", x: 1000 }}
            pagination={false}
            locale={{
              emptyText: (
                <div className="custom-no-data">No Employee Data Found</div>
              ),
            }}
          />
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
      <AddEmployeeModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditEmployeeModal
        open={editmodalOpen}
        onClose={() => setEditModalOpen(false)}
        user={employee}
      />
    </div>
  );
};

export default CurrentEmployee;
