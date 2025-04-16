import React, { useEffect, useMemo, useState } from "react";
import "./Invoice.css";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import MaterialTable from "material-table";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../../../Config/Api";
import { toast } from "react-toastify";
import { setAllInvoice } from "../../../Redux/Action";
import EditInvoice from "./Component/EditInvoice";
import Rec from "../../../Assets/pay.png";
import NotRec from "../../../Assets/rec.png";
import Sent from "../../../Assets/Send.png";
import NotSent from "../../../Assets/notSend.png";
import Pencile from "../../../Assets/pencil.png";
import Delete from "../../../Assets/Color.png";
import InvoicePic from "../../../Assets/Invoices.png";
import { Table } from "antd";

const Invoice = () => {
  const { setLoading, logout } = useAuth();
  const getAllinvoice = useSelector((state) => state.getAllinvoice);
  const [query, setQuery] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterInvoice, setFilterInvoice] = useState(getAllinvoice);
  const token = sessionStorage.getItem("authToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/adminhome/addinvoice");
  };

  useEffect(() => {
    getAllInvoiceData();
  }, [dispatch, token]);
  useEffect(() => {
    setFilterInvoice(getAllinvoice);
  }, [getAllinvoice]);
  const getAllInvoiceData = async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_ALL_INVOICE}`, {
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
          dispatch(setAllInvoice(responseData?.data?.data));
          // setFilterInvoice(responseData?.data?.data)
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred in load invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };
  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getAllinvoice.filter((item) => {
      return (
        item.company_name.toLowerCase().includes(lowerCaseQuery) ||
        item.customer_name.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilterInvoice(filteredItems);
  };

  //     title: "Invoice#",
  //     field: "invoice_no",
  //     filtering: false,
  //     headerStyle: {
  //       backgroundColor: "#f4f4f4",
  //       color: "#000",
  //       cursor: "pointer",
  //     },

  //     render: (data) => (
  //       <div
  //         className="invoice-header-hover"
  //         onClick={() => {
  //           downloadInvoice(data);
  //         }}
  //       >
  //         <h2
  //           style={{
  //             color: "blue",
  //             textDecoration: "underline",
  //           }}
  //         >
  //           {data?.invoice_no}
  //         </h2>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Date",
  //     field: "invoice_date",
  //     filtering: false,
  //     cellStyle: {
  //       position: "sticky",
  //       left: 60,
  //       backgroundColor: "#fff",
  //       zIndex: 1,
  //     },
  //   },
  //   // { title: "Company Name", field: "company_name", filtering: false },
  //   // { title: "Name", field: "customer_name", filtering: false },
  //   {
  //     title: "Company & Name",
  //     field: "company_name",
  //     filtering: false,
  //     render: rowData => `${rowData.customer_name}(${rowData.company_name})`
  //   },
  //   { title: "Amount", field: "total", filtering: false },
  //   { title: "Invoice Status", field: "invoice_status", filtering: false },
  //   { title: "Payment Received", field: "payment_receiveed", filtering: false },
  //   // { title: "Mobile", field: "mobile", filtering: false },
  //   // { title: "Office Number", field: "work_phone", filtering: false },
  //   // {
  //   //   title: "Email",
  //   //   field: "email_addresses",
  //   //   filtering: false,

  //   //   render: (rowData) => {
  //   //     let emailArray = [];
  //   //     try {
  //   //       emailArray = JSON.parse(rowData.email_addresses);
  //   //     } catch (e) {
  //   //       emailArray = [];
  //   //     }

  //   //     if (emailArray.length > 0) {
  //   //       return (
  //   //         <>
  //   //           {emailArray.map((email, index) => (
  //   //             <span key={index}>
  //   //               {email}
  //   //               {index < emailArray.length - 1 && <br />}
  //   //             </span>
  //   //           ))}
  //   //         </>
  //   //       );
  //   //     } else {
  //   //       return "No Emails";
  //   //     }
  //   //   },
  //   // },
  //   // {
  //   //   title: "Address",
  //   //   field: "fullAddress",
  //   //   filtering: false,
  //   //   render: (rowData) => (
  //   //     <>
  //   //       {rowData.address} <br />
  //   //       {rowData.city}, {rowData.pincode} <br />
  //   //       {rowData.state} <br />
  //   //       {rowData.country}
  //   //     </>
  //   //   ),
  //   // },
  //   {
  //     title: "Status",
  //     field: "mobile",
  //     filtering: false,
  //     render: (rowData) => (
  //       <div
  //         style={{
  //           display: "flex",
  //           flexDirection: "row",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           borderRadius: 20,
  //           background:
  //             rowData?.total == rowData?.payment_receiveed
  //               ? "#E5F7E8"
  //               : "#B1D7FF",
  //           padding: "5px 10px",
  //         }}
  //       >
  //         <div
  //           style={{
  //             background:
  //               rowData?.total == rowData?.payment_receiveed
  //                 ? "#009A20"
  //                 : " #1E40AF",
  //             width: 10,
  //             height: 10,
  //             borderRadius: "50%",
  //             // marginRight: 8, // Add spacing between the dot and text
  //           }}
  //         ></div>
  //         <h2
  //           style={{
  //             marginTop: 5,
  //             marginLeft: 5,
  //             fontWeight: "500",
  //             color:
  //               rowData?.total == rowData?.payment_receiveed
  //                 ? "#009A20"
  //                 : " #1E40AF",
  //           }}
  //         >
  //           {rowData?.total == rowData?.payment_receiveed ? "Paid" : "Due"}
  //         </h2>
  //       </div>
  //     ),
  //   },
  //   { title: "Due Date", field: "due_date", filtering: false },

  //   // {
  //   //   title: "Balance Due",
  //   //   field: "total",
  //   //   filtering: false,
  //   //   render: (data) => (
  //   //     <div>
  //   //       {data?.total === 0 ? 0 : data?.total - data?.payment_receiveed}
  //   //     </div>
  //   //   ),
  //   // },

  //   {
  //     title: "Action",
  //     filtering: false,
  //     render: (rowData) => (
  //       <div>
  //         <button
  //           className="action-button"
  //           onClick={() => {
  //             editInvoice(rowData);
  //           }}
  //         >
  //           <FaEdit />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  const columns = [
    {
      title: "INVOICE#",
      dataIndex: "invoice_no",
      filtering: false,
      width: 150,
      render: (_, data) => (
        <div
          className="invoice-header-hover"
          style={{
            display: "flex",
            flexDirection: "row", // Stack image and text vertically
            justifyContent: "center",
            alignItems: "center", // Center horizontally
            cursor: "pointer",
            height: "100%", // Ensures vertical centering in the cell
          }}
          onClick={() => downloadInvoice(data)}
        >
          <img
            src={InvoicePic}
            alt="Mail Sent"
            style={{ width: 25, height: 25, marginBottom: 5, marginRight: 5 }} // Add spacing between image and text
          />
          <h2
            style={{
              color: "blue",
              textDecoration: "underline",
              marginLeft: 10,
              margin: 0, // Remove default margin
            }}
          >
            {data?.invoice_no}
          </h2>
        </div>
      ),
    },

    {
      title: "DATE",
      dataIndex: "invoice_date",
      width: 150,
    },
 
    {
      title: "NAME & COMPANY",
      dataIndex: "company_name",
      width: 200,
      render: (_, rowData) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {rowData.customer_name} ({rowData.company_name})
        </span>
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "total",
      width: 150,
      render: (_, rowData) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {rowData.total}
        </span>
      ),
    },

    {
      title: "INVOICE STATUS",
      dataIndex: "invoice_status",
      width: 150,
      filtering: false,
      render: (rowData) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            gap: "5px", // Adds spacing between image and text
          }}
        >
          {rowData?.invoice_status === "MailSent" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img
                src={Sent}
                alt="Mail Sent"
                style={{ width: 20, height: 20 }}
              />
              <span style={{ verticalAlign: "middle" }}>Send</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img
                src={NotSent}
                alt="No Payment"
                style={{ width: 20, height: 20 }}
              />
              <span style={{ verticalAlign: "middle", textAlign: "center" }}>
                Draft
              </span>
            </div>
          )}
        </div>
      ),
    },

    {
      title: "PAYMENT RECEIVED",
      dataIndex: "payment_received",
      filtering: false,
      width: 200,
      render: (_, rowData) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {rowData?.payment_receiveed <= 0 ||
          rowData?.payment_receiveed == null ? (
            <img
              src={NotRec}
              alt="Payment Received"
              style={{ width: 25, height: 25 }}
            />
          ) : (
            <img src={Rec} alt="No Payment" style={{ width: 25, height: 25 }} />
          )}
        </div>
      ),
    },

    {
      title: "STATUS",
      dataIndex: "mobile",
      filtering: false,
      width: 150,
      render: (rowData) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            background:
              rowData?.total === rowData?.payment_receiveed ? "#E5F7E8" : "#B1D7FF",
            padding: "5px 10px",
          }}
        >
          <div
            style={{
              background:
                rowData?.total === rowData?.payment_receiveed ? "#009A20" : "#1E40AF",
              width: 10,
              height: 10,
              borderRadius: "50%",
            }}
          ></div>
          <span
            style={{
              marginLeft: 8,
              fontWeight: "500",
              color:
                rowData?.total === rowData?.payment_receiveed ? "#009A20" : "#1E40AF",
              fontSize: "16px",
            }}
          >
            {rowData?.total === rowData?.payment_receiveed ? "Paid" : "Due"}
          </span>
        </div>
      ),
    }
,    
    { title: "DUE DATE", dataIndex: "due_date", width: 150 },

    {
      title: "ACTION",
      filtering: false,
      width: 150,
      render: (rowData) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={Pencile}
            alt="Mail Sent"
            style={{ width: 25, height: 25 }}
            onClick={() => {
              editInvoice(rowData);
            }}
          />

          <img
            src={Delete}
            alt="Mail Sent"
            style={{ width: 25, height: 25, marginLeft: 10 }}
          />
        </div>
      ),
    },
  ];

  const editInvoice = (data) => {
    setInvoiceData(data);
    setTimeout(() => {
      setModalOpen(true);
    }, 1000);
  };
  const memoizedData = useMemo(() => {
    return filterInvoice?.map((employee, index) => ({
      ...employee,
      sn: index + 1,
    }));
  }, [getAllinvoice, filterInvoice]);
  const downloadInvoice = async (data) => {
    const invoiceLink = `${BaseUrl}${Api.DOWNLOAD_INVOICE}/${data?.invoice_no}`;
    if (data?.invoice_status == "Drafts") {
      alert("you can only show a bill after it has been sent by email");
    } else {
      try {
        const responseData = await axios.get(invoiceLink, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "arraybuffer",
        });

        if (responseData?.data && responseData.data.byteLength > 0) {
          const blob = new Blob([responseData.data], {
            type: "application/pdf",
          });

          const url = URL.createObjectURL(blob);

          const newTab = window.open(url, "_blank");
          if (newTab) {
            newTab.focus();
          } else {
            toast.error(
              "Unable to open PDF. Please check your browser's pop-up settings.",
              {
                position: "top-center",
                autoClose: 2000,
              }
            );
          }
        } else {
          toast.error("Invoice data is empty or not found.", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      } catch (error) {
        setLoading(false);
        console.error("API call failed:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mainDivInvoice" style={{maxHeight:'95vh'}}>
      <h1
        style={{
          fontWeight: "700",
          fontSize: 30,
          color: "black",
          padding: 15,
          textAlign: "left",
        }}
      >
        Invoice
      </h1>
      <div className="mainDivInvoice2">
        <div className="card-containerInvoice">
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
              <div className="invoicesearchBar-wrapper">
                <input
                  type="text"
                  id="search-query"
                  name="query"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search..."
                  autoComplete="current-query"
                  className="invoicesearchBar-input"
                />
                <FaSearch className="search-icon" />
              </div>
            </div>
            <div className="button-invoicecontainer">
              <button className="myInvoiceButton" onClick={handleClick}>
                <BsPlusCircle style={{ marginRight: "10px" }} />
                Create Invoice
              </button>
            </div>
          </div>
          {/* <div className="table-invoice_container">
            <table className="invoice-table">
              <MaterialTable
                columns={columns}
                //  data={getAllinvoice}
                data={memoizedData}
                ///data={JSON.parse(JSON.stringify(filteremployeeData))}
                title={null}
                // options={{
                //   paging: true,
                //   search: false,
                //   filtering: true,
                // }}
                options={{
                  paging: false,
                  search: false,
                  filtering: false,

                  sorting: true,
                  tableLayout: "auto",
                  maxBodyHeight: "745px",
                  headerStyle: {
                    whiteSpace: "nowrap",
                    padding: "10px",
                    // fontSize: 15,
                    // fontWeight: "500",
                  },
                }}
                components={{
                  Toolbar: () => null, // Completely removes the toolbar
                }}
                style={{
                  overflowX: "auto",
                  fontSize: 15,
                  fontWeight: "500",
                  marginTop: 10,
                  overflow: "hidden",
                  tableLayout: "auto",
                  boxShadow: "none",
                  border: "none",
                }}
              />
            </table>
          </div> */}
          <div
            style={{
              marginTop: "50px",
              width: "100%",
              maxHeight: "75vh",
              overflowX: "auto",
            }}
          >
            <Table
              dataSource={filterInvoice}
              className="dotted-border-table"
              columns={columns}
              pagination={{ pageSize: 7, position: ["bottomRight"] }}
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
      </div>

      <Outlet />
      <EditInvoice
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        invoiceData={invoiceData}
      />
    </div>
  );
};

export default Invoice;
