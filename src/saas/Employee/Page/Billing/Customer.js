import React, { useState,useCallback,useEffect,useMemo} from 'react'
import AddCustomer from '../../../Admin/AdminPage/Billing/Component/AddCustomer'
import EditCustomer from '../../../Admin/AdminPage/Billing/Component/EditCustomer'
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../Component/Authentication/AuthContext';
import axios from 'axios';
import { Api, BaseUrl } from '../../../Config/Api';
import { useSelector } from 'react-redux';
import { BsPlusCircle } from "react-icons/bs";
import MaterialTable from "material-table";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { setCustomeDetails } from '../../../Redux/Action';
const Customer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const getCustomerDetails = useSelector((state) => state.getCustomerDetails);
  const [filterCustomer, setFilterCustomer] = useState(getCustomerDetails);
  const [customerData, setCustomerData] = useState();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
const setLoading = () => { };
  const logout = () => { };
  const handleClick = () => {
    setModalOpen(true);
  };
  const columns = [
    {
      title: "SN.",
      field: "sn",

      filtering: false,
    },
    {
      title: "Customer Name",
      field: "customer_name",
      filtering: false,
    },
    { title: "Company Name", field: "company_name", filtering: false },

    {
      title: "Email",
      field: "email_addresses",
      filtering: false,
      render: (rowData) => {
        let emailArray = [];
        try {
          emailArray = JSON.parse(rowData.email_addresses);
        } catch (e) {
          emailArray = [];
        }

        if (emailArray.length > 0) {
          return emailArray.join(" , ");
        } else {
          return "No Emails";
        }
      },
    },
    { title: "Phone Number", field: "work_phone", filtering: false },
    { title: "Mobile", field: "mobile", filtering: false },
    { title: "Country", field: "country", filtering: false },
    { title: "Currency", field: "currency", filtering: false },
    { title: "State", field: "state", filtering: false },
    { title: "City", field: "city", filtering: false },
    {
      title: "Address",
      field: "address",
      filtering: false,
      cellStyle: {
        width: "250px", // Set a fixed width (optional)
        whiteSpace: "normal", // Allow the text to wrap
        wordWrap: "break-word", // Ensure long words break and wrap properly
        height: "auto", // Let the height adjust based on content
      },
      headerStyle: {
        width: "250px", // Same width as cells (optional)
        whiteSpace: "normal", // Allow wrapping in the header as well
      },
    },
    { title: "PinCode", field: "pincode", filtering: false },
    {
      title: "Action",
      filtering: false,
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
          {/* <button
            className="action-button"
            onClick={() => {
              // setEmployee(rowData);
              // setShowDialog(true);
            }}
          >
            <FaTrash />
          </button> */}
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
  }, [dispatch, token, setLoading, ]);
  useEffect(() => {
    if (!modalOpen) {
      fetchCustomerDetails();
    }
  }, [modalOpen, dispatch, token, setLoading]);
  
  useEffect(() => {
    setFilterCustomer(getCustomerDetails);
  }, [getCustomerDetails]);
  const memoizedData = useMemo(() => {
    return filterCustomer?.map((employee, index) => ({
      ...employee,
      sn: index + 1, // Add SN number
    }));
  }, [filterCustomer, modalOpen]);
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };
  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getCustomerDetails.filter((item) => {
    
      return item.company_name.toLowerCase().includes(lowerCaseQuery)||item.customer_name.toLowerCase().includes(lowerCaseQuery)
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
        <div className="table-customer_container">
          <table className="customer-table">
            <MaterialTable
              columns={columns}
              data={memoizedData}
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
                Toolbar: () => null, // Completely removes the toolbar
              }}
              style={{marginTop:10}}
            />
          </table>
        </div>
      </div>
    </div>
   <AddCustomer open={modalOpen} onClose={() => setModalOpen(false)} />
    <EditCustomer
      open={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      customerDetails={customerData}
    /> 
  </div>
  )
}

export default Customer