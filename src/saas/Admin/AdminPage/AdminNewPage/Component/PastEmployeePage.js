import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import EditEmployeeModal from "../../../AdminComponent/EditEmployeeModal";
import { FaSearch, FaTrash } from "react-icons/fa";

import { COLOR, FONT, IMAGE } from "../../../../Config/Color";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import { Api, BaseUrl, ImagePath } from "../../../../Config/Api";

const PastEmployeePage = () => {
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
      fixed: "left",
      width: 230,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
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
      title: "EMP. CODE",

      dataIndex: "employee_code",
      key: "employee_code",
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
      title: "EMAIL ID",
      dataIndex: "email",
      filtering: false,
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
      title: "CONTACT",
      dataIndex: "mobile",
      filtering: false,
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
    {
      title: "ADDRESS",
      dataIndex: "location",
      filtering: false,
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
      title: "DESIGNATION",
      dataIndex: "designation",
      filtering: false,
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
      title: "EXP. LEVEL",
      dataIndex: "experience",
      filtering: false,
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
      title: "TOTAL EXP",
      field: "total_experience",
      width: 150,
      render: (_, rowData) =>
        rowData.total_experience === null ? "NA" : rowData.total_experience,
      filtering: false,
    },
    {
      title: "DATE OF BIRTH",
      dataIndex: "dob",
      filtering: false,
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
      title: "DATE OF JOINING",
      dataIndex: "doj",
      filtering: false,
      width: 180,
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
      title: "DATE OF LEAVING",
      dataIndex: "leaving_date",
      filtering: false,
      width: 180,
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
      title: "DEPARTMENT",
      dataIndex: "department",
      filtering: false,
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
      title: "REPORTING MANAGER",
      dataIndex: "reporting_manager",
      filtering: false,
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
      title: "EMP. STATUS",
      dataIndex: "status",
      filtering: false,
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
      title: "INACTIVE COMMENTS",
      dataIndex: "inactive_comments",
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
      {text == null ? "N/A" : text}
        </span>
      ),
    },
    {
      title: "SHIFT TIMING ",
      dataIndex: "shift_timing",
      filtering: false,
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
      title: "OFFICE LOCATION",
      dataIndex: "office_location",
      width: 200,
      filtering: false,
    },
    {
      title: "ACTION",
      filtering: false,
      width: 100,
      render: (_, rowData) => (
        <div>
          <button
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
          {console.log("ddddddddddd",filteremployeeData)}
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
            scroll={{ y: "70vh", x: 1000 }}
            pagination={false}
            locale={{
              emptyText: (
                <div className="custom-no-data">No Past Employee Data Found</div>
              ),
            }}
          />
        </div>
      </div>

      <EditEmployeeModal
        open={editmodalOpen}
        onClose={() => setEditModalOpen(false)}
        user={employee}
      />
    </div>
  );
};

export default PastEmployeePage;
