import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import MaterialTable from "material-table";
import "./Customer.css";
import AddCustomer from "./Component/AddCustomer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../../../Config/Api";
import { toast } from "react-toastify";
import { setCustomeDetails } from "../../../Redux/Action";
import EditCustomer from "./Component/EditCustomer";
import { Table } from "antd";
const Customer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const getCustomerDetails = useSelector((state) => state.getCustomerDetails);
  const [filterCustomer, setFilterCustomer] = useState(getCustomerDetails);
  const [customerData, setCustomerData] = useState();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const { setLoading, logout } = useAuth();
  const handleClick = () => {
    setModalOpen(true);
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
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
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
      title: "COMPANY NAME",
      dataIndex: "company_name",
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

    // {
    //   title: "Email",
    //   dataIndex: "email_addresses",
    //   width: 300,
    //   render: (_,rowData,index) => {
    //     let emailArray = [];
    //     try {
    //       emailArray = JSON.parse(rowData.email_addresses);
    //     } catch (e) {
    //       emailArray = [];
    //     }

    //     if (emailArray.length > 0) {
    //       return emailArray.join(" , ");
    //     } else {
    //       return "No Emails";
    //     }
    //   },
    // },
    {
      title: "EMAIL",
      dataIndex: "email_addresses",
      width: 300,
      render: (_, rowData, index) => {
        let emailArray = [];
        try {
          emailArray = JSON.parse(rowData.email_addresses);
        } catch (e) {
          emailArray = [];
        }
    
        const text = emailArray.length > 0 ? emailArray.join(" , ") : "No Emails";
    
        return (
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
        );
      },
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "work_phone",
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
      title: "MOBILE",
      dataIndex: "mobile",
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
      title: "COUNTRY",
      dataIndex: "country",
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
      title: "CURRENCY",
      dataIndex: "currency",
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
      title: "STATE",
      dataIndex: "state",
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
      title: "CITY",
      dataIndex: "city",
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
      title: "ADDRESS",
      dataIndex: "address",
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
    {
      title: "PINCODE",
      dataIndex: "pincode",
      width: 100,
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
      title: "ACTION",
      filtering: false,
      width: 100,
      render: (rowData) => (
        <div>
          <button
            className="action-button"
            onClick={() => {
              editcustomerDetails(rowData);
            }}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];
  const editcustomerDetails = (data) => {
    setCustomerData(data);
    setEditModalOpen(true);
  };
  const fetchCustomerDetails = useCallback(async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_CUSTOMER}`, {
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
          dispatch(setCustomeDetails(responseData?.data?.data));
          setFilterCustomer(responseData?.data?.data);
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
  useEffect(() => {
    fetchCustomerDetails();
  }, [dispatch, token, setLoading]);
  
  useEffect(() => {
    if (!modalOpen) {
      fetchCustomerDetails();
    }
  }, [modalOpen, dispatch, token, setLoading]);

  useEffect(() => {
    setFilterCustomer(getCustomerDetails);
  }, [getCustomerDetails]);
  // const memoizedData = useMemo(() => {
  //   return filterCustomer?.map((employee, index) => ({
  //     ...employee,
  //     sn: index + 1, // Add SN number
  //   }));
  // }, [filterCustomer, modalOpen]);
  const memoizedData = useMemo(() => {
    return (
      filterCustomer
        ?.filter((employee) => employee && Object.keys(employee).length > 0) // Remove empty objects
        .map((employee, index) => ({
          ...employee,
          sn: index + 1, // Add SN number
        })) || []
    );
  }, [filterCustomer, modalOpen]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };
  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getCustomerDetails.filter((item) => {
      return (
        item.company_name.toLowerCase().includes(lowerCaseQuery) ||
        item.customer_name.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilterCustomer(filteredItems);
  };
  return (
    <div className="mainDivCustomer">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 20,
          color: "black",
          padding: 15,
          textAlign: "left",
        }}
      >
        All Customers
      </h1>
      <div className="mainDivCustomer2">
        <div className="card-containerCustomer">
          <div
            style={{
              marginBottom: 20,
              justifyContent: "space-between",
              flexDirection: "row",
              display: "flex",
            }}
          >
            <div
              style={{
                width: 250,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <div className="customersearchBar-wrapper">
                <input
                  type="text"
                  id="search-query"
                  name="query"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search..."
                  autoComplete="current-query"
                  className="customersearchBar-input"
                />
                <FaSearch className="search-icon" />
              </div>
            </div>
            <div className="button-customercontainer">
              <button className="mycustomerButton" onClick={handleClick}>
                <BsPlusCircle style={{ marginRight: "10px" }} />
                New Customer
              </button>
            </div>
          </div>
          {/* <div className="table-customer_container">
            <table className="customer-table">
              <MaterialTable
                columns={columns}
                // data={memoizedData}
                data={memoizedData.filter(
                  (item) => item && Object.keys(item).length > 0
                )}
                title={null}
                options={{
                  paging: true,
                  search: false,
                  filtering: false,
                  sorting: true,
                  headerStyle: {
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  },
                  cellStyle: {
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  },
                }}
                components={{
                  Toolbar: () => null,
                }}
                style={{ marginTop: 10 }}
              />
             
            </table>
          </div> */}
          <Table
            dataSource={filterCustomer}
            className="dotted-border-table"
            columns={columns}
            pagination={{ pageSize: 10, position: ["bottomRight"] }}
            rowClassName={() => "custom-row"}
            bordered={false}
            // style={{ tableLayout: "auto" }}
            tableLayout="fixed"
            rowKey="key"
            scroll={{ x: 1000 }} // Ensures proper scrolling behavior
            locale={{
              emptyText: (
                <div className="custom-no-data">No Employee Data Found</div>
              ),
            }}
          />
        </div>
      </div>
      <AddCustomer open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditCustomer
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        customerDetails={customerData}
      />
    </div>
  );
};

export default Customer;
