import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



import { useSelector } from "react-redux";
import { Select } from "antd";
import { Api, BaseUrl } from "../../../Config/Api";
import axios from "axios";
import { useAuth } from "../../../Component/Authentication/AuthContext";
import { setAllInvoice } from "../../../Redux/Action";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import PreviewInvoice from "../../../Admin/AdminPage/Billing/Component/PreviewInvoice";


const AddInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const token = sessionStorage.getItem("authToken");
const setLoading = () => { };
  const logout = () => { };
  const [sunTotal, setSubTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCompany, setSelectedCompany] = useState();
  const getCustomerDetails = useSelector((state) => state.getCustomerDetails);
  const getAllinvoice = useSelector((state) => state.getAllinvoice);
  const [customerSymbol, setCustomerSymbol] = useState(null);
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [submitInvoive, setSubmitInvoice] = useState("");
  const [addressData, setaddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    companyName: "",
    customerName: "",
  });
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [finalPriceWord, setFinalPriceWord] = useState("");
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };
  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };
  const initialFormData = {
    customerName: "",
    invoice: "",
    invoiceDate: getCurrentDate(),
    dueDate: addDays(getCurrentDate(), 30),
  };
  const [formData, setFormData] = useState({
    customerName: "",
    invoice: "",
    invoiceDate: getCurrentDate(),
    dueDate: addDays(getCurrentDate(), 30),
  });

  const [rows, setRows] = useState([
    { item: "", quantity: 0, rate: 0, tax: "Out of Scope", amount: 0 },
  ]);

  // const addRow = () => {
  //   setRows([...rows, { item: "", quantity: 1, rate: , tax: "", amount: 0 }]);
  // };
  const addRow = () => {
    setRows([
      ...rows,
      { item: "", quantity: 0, rate: 0, tax: "Out of Scope", amount: 0 }, // Ensure rate defaults to 0
    ]);
  };
  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  useEffect(() => {
    if (getAllinvoice && getAllinvoice.length > 0) {
      const lastInvoice = getAllinvoice[0];
      const lastInvoiceNumber = lastInvoice?.invoice_no;

      if (lastInvoiceNumber) {
        const numericPart = parseInt(lastInvoiceNumber.split("-")[1]);
        const nextInvoiceNumber = `INV-${(numericPart + 1)
          .toString()
          .padStart(3, "0")}`;

        setFormData((prevData) => ({
          ...prevData,
          invoice: nextInvoiceNumber,
        }));
      } else {
        // Fallback if no valid invoice number
        setFormData((prevData) => ({
          ...prevData,
          invoice: "INV-001", // Start with "INV-001" if no invoice number is found
        }));
      }
    } else {
      // Handle the case when getAllinvoice is empty or undefined
      setFormData((prevData) => ({
        ...prevData,
        invoice: "INV-001", // Start with "INV-001"
      }));
    }
  }, []);

  const handleInputChange = (index, field, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const updatedRow = { ...updatedRows[index] };

      if (field === "quantity" || field === "rate") {
        if (value === "") {
          // If cleared, reset to 0
          updatedRow[field] = 0;
        } else if (!isNaN(value) && value >= 0) {
          updatedRow[field] = Number(value); // Update with valid numeric value
        }

        // Calculate the amount dynamically
        const quantity = Number(updatedRow.quantity) || 0;
        const rate = Number(updatedRow.rate) || 0;
        updatedRow.amount = (quantity * rate).toFixed(2);
      } else {
        updatedRow[field] = value; // Update other fields directly
      }

      updatedRows[index] = updatedRow;
      return updatedRows;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      if (name === "invoiceDate") {
        updatedFormData.dueDate = addDays(value, 30);
      }
      return updatedFormData;
    });
  };
  useEffect(() => {
    if (submitInvoive === "Save As Draft") {
      saveInvoice({ type: "Drafts" });
    } else if (submitInvoive === "Save And Send") {
      saveInvoice({ type: "MailSent" });
    }
  }, [submitInvoive]);

  const saveInvoice = async (type) => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      rows?.forEach((image) => {
        formDataToSend.append("item_array[]", JSON.stringify(image));
      });

      formDataToSend.append("customer_id", selectedCustomer);
      formDataToSend.append("invoice_no", formData?.invoice);
      formDataToSend.append("invoice_date", formData?.invoiceDate);
      formDataToSend.append("due_date", formData?.dueDate);
      formDataToSend.append("sub_total", sunTotal);
      formDataToSend.append("invoice_status", type?.type);
      formDataToSend.append("discount_price", discountAmount);
      formDataToSend.append("total", totalPrice);
      formDataToSend.append("price_in_words", finalPriceWord);
      if (discount > 0) {
        formDataToSend.append("discount_rate", discount);
      } else if (discountPrice > 0) {
        formDataToSend.append("discount_amount", discountPrice);
      }
      const response = await axios.post(
        `${BaseUrl}${Api.CREATE_INVOICE}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmitInvoice("");
      if (response?.data?.authenticated === false) {
        toast.error(response?.data?.mssg, {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (response?.data?.valid === false) {
          toast.error(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          toast.success(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          getAllInvoiceData();
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
      setSubmitInvoice("");
    } finally {
      setLoading(false);
      setSubmitInvoice("");
    }
  };

  const getAllInvoiceData = async () => {
    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_ALL_INVOICE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg, {
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

          goBack();
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

  const calculateSubtotal = () => {
    return rows.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
  };
  const calculateFinalPrice = () => {
    const subtotal = calculateSubtotal();

    let finalDiscount = 0;
    if (discount > 0) {
      finalDiscount = (subtotal * discount) / 100;
    } else if (discountPrice > 0) {
      finalDiscount = discountPrice;
    }

    finalDiscount = Math.min(finalDiscount, subtotal);

    return subtotal - finalDiscount;
  };
  const calculateDiscountPrice = () => {
    const subtotal = calculateSubtotal();
    let discountedPrice = 0;

    if (discount > 0 && discountPrice <= 0) {
      discountedPrice = (subtotal * discount) / 100;
    } else if (discountPrice > 0 && discount <= 0) {
      discountedPrice = discountPrice;
    }

    return discountedPrice;
  };

  useEffect(() => {
    const subtotal = calculateSubtotal();
    const discountData = calculateDiscountPrice();
    const finalPrice = calculateFinalPrice();
    setSubTotal(subtotal);
    setTotalPrice(finalPrice);
    setDiscountAmount(discountData);
    convertNumberToWords(finalPrice);
  }, [rows, discount, discountPrice]);

  const customerDetails = getCustomerDetails.map((customer) => ({
    value: customer.id,

    label: (
      <div style={{ lineHeight: "1.4" }}>
        <div>{customer.customer_name}</div>
        <div style={{ fontSize: "0.9em", color: "#888" }}>
          {customer.company_name}
        </div>
      </div>
    ),
    emails: JSON.parse(customer.email_addresses),
    symbol: customer.symbol,
  }));
  const goBack = () => {
    navigate(-1);
  };
  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);

    if (selectedOption) {
      const selectedCustomerDetails = getCustomerDetails.find(
        (customer) => customer.id === selectedOption
      );

      setSelectedCompany(selectedCustomerDetails?.company_name);
      setCustomerSymbol(selectedCustomerDetails.symbol); // Set the symbol
      const emailArray = JSON.parse(selectedCustomerDetails?.email_addresses);
      setEmails((prevEmails) => [...emailArray]);
      setaddress({
        address: selectedCustomerDetails?.address,
        city: selectedCustomerDetails?.city,
        state: selectedCustomerDetails?.state,
        pincode: selectedCustomerDetails?.pincode,
        country: selectedCustomerDetails?.country,
        companyName: selectedCustomerDetails?.company_name,
        customerName: selectedCustomerDetails?.customer_name,
      });
    }
  };
  // const getFullAddress = () => {
  //   const { address, city, state, pincode, country } = addressData;
  //   return `${address}\n${city}, ${pincode}\n${state}\n${country}`
  // };
  const getFullAddress = () => {
    const { address, city, state, pincode, country } = addressData || {};

    // Construct the address while avoiding empty fields
    const fullAddress = [
      address, // Address line
      [city, pincode].filter(Boolean).join(", "), // City and pincode
      state, // State
      country, // Country
    ]
      .filter(Boolean) // Remove empty or undefined values
      .join("\n"); // Join with newlines

    return fullAddress;
  };
  const convertNumberToWords = (n) => {
    if (n < 0) return false;

    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    let single_digit = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    let double_digit = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    let below_hundred = [
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (n === 0) return "Zero";

    // Recursive function to translate the number into words
    function translate(n) {
      let word = "";
      if (n < 10) {
        word = single_digit[n] + " ";
      } else if (n < 20) {
        word = double_digit[n - 10] + " ";
      } else if (n < 100) {
        let rem = translate(n % 10);
        word = below_hundred[(n - (n % 10)) / 10 - 2] + " " + rem;
      } else if (n < 1000) {
        word =
          single_digit[Math.trunc(n / 100)] + " Hundred " + translate(n % 100);
      } else if (n < 1000000) {
        word =
          translate(parseInt(n / 1000)).trim() +
          " Thousand " +
          translate(n % 1000);
      } else if (n < 1000000000) {
        word =
          translate(parseInt(n / 1000000)).trim() +
          " Million " +
          translate(n % 1000000);
      } else {
        word =
          translate(parseInt(n / 1000000000)).trim() +
          " Billion " +
          translate(n % 1000000000);
      }
      return word;
    }

    // Get the result by translating the given number
    let result = translate(n);
    setFinalPriceWord(result.trim() + ".");
    // return result.trim() + ".";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Prevent default comma behavior in input
      addEmail();
    }
  };

  const addEmail = () => {
    const trimmedEmail = currentEmail.trim();
    if (trimmedEmail && isValidEmail(trimmedEmail)) {
      if (!emails.includes(trimmedEmail)) {
        setEmails([...emails, trimmedEmail]);
        setCurrentEmail(""); // Clear input field
      } else {
        alert("This email is already added!");
      }
    } else if (trimmedEmail) {
      alert("Invalid email address!");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };
  return (
    <div className="addinvoicecontainer">
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
      <div className="content">
        <div className="section1">
          <h1>Create Invoice</h1>
          <p style={{ textAlign: "center" }}>
            Please fill in the details below to create a new invoice
          </p>

          <div className="invoice-container11">
            <div className="form-gridinvoice">
              <div className="form-groupinvoice">
                <label htmlFor="customerName">Customer Name*</label>

                <Select
                  options={customerDetails}
                  value={selectedCustomer}
                  required
                  // onChange={(selectedOption) => {
                  //   setSelectedCustomer(selectedOption);
                  // }}
                  onChange={handleCustomerChange}
                  style={{ height: 45 }}
                />
              </div>
              <div className="form-groupinvoice">
                <label htmlFor="companyName">Company Name:</label>
                <input
                  type="text"
                  name="invoice"
                  id="invoice"
                  value={selectedCompany}
                  readOnly
                />
              </div>
              <div className="form-groupinvoice">
                <label htmlFor="companyName">Email Address</label>
                <div className="email-input-containerinvoice">
                  <div className="email-input-wrapperinvoice">
                    {emails.map((email, index) => (
                      <div key={index} className="email-tag">
                        <span>{email}</span>
                        <button
                          type="button"
                          // onClick={() => removeEmail(email)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    {/* <input
                      type="text"
                      value={currentEmail}
                      // onChange={(e) => setCurrentEmail(e.target.value)}
                      // onKeyDown={handleKeyDown}
                      placeholder="Enter email addresses"
                    /> */}
                  </div>
                </div>
              </div>

              <div className="form-groupinvoice">
                <label htmlFor="invoice">Invoice#</label>
                <input
                  type="text"
                  name="invoice"
                  id="invoice"
                  value={formData.invoice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-groupinvoice">
                <label htmlFor="invoiceDate">Invoice Date:</label>
                <input
                  type="date"
                  name="invoiceDate"
                  id="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-groupinvoice">
                <label htmlFor="dueDate">Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-groupinvoice">
              <label htmlFor="companyName">Address:</label>
              <textarea
                type="text"
                name="invoice"
                id="invoice"
                rows="4"
                placeholder="Customer Address"
                value={getFullAddress()}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="invoice-table">
              <table>
                <thead>
                  <tr>
                    <th>Item Details</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Tax</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          placeholder="Type or select an item"
                          value={row.item}
                          onChange={(e) =>
                            handleInputChange(index, "item", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.quantity}
                          onChange={(e) => {
                            handleInputChange(
                              index,
                              "quantity",
                              Number(e.target.value)
                            );
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.rate}
                          // onChange={(e) => {
                          //   if (e.target.value > 0) {
                          //     handleInputChange(
                          //       index,
                          //       "rate",
                          //       Number(e.target.value)
                          //     );
                          //   }
                          // }}
                          onChange={(e) => {
                            handleInputChange(index, "rate", e.target.value);
                          }}
                        />
                      </td>
                      <td>
                        <select
                          value={"Out of Scope"}
                          // onChange={(e) =>
                          //   handleInputChange(index, "tax", e.target.value)
                          // }
                        >
                          <option value="Out of Scop">Out of Scope</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={(row.quantity * row.rate).toFixed(2)} // Auto-calculated
                          readOnly
                        />
                      </td>
                      <td>
                        <button onClick={() => removeRow(index)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button className="add-row-btn" onClick={addRow}>
                + Add New Row
              </button>
            </div>

            <div className="invoice-summary">
              <div className="summary-row">
                <span className="summary-title">
                  Sub Total
                  <small>(Tax Inclusive)</small>
                </span>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span className="summary-value">{customerSymbol}</span>
                  <span className="summary-value">
                    {calculateSubtotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="summary-row">
                <span className="summary-title">Discount</span>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className="discount-input">
                    <input
                      type="text"
                      placeholder="%"
                      value={discount}
                      onChange={(e) => {
                        setDiscount(Number(e.target.value)); // Set percentage discount
                        setDiscountPrice(0); // Clear fixed discount
                      }}
                      disabled={discountPrice > 0} // Disable if fixed discount is entered
                    />
                    <span className="summary-title">%</span>
                  </div>
                  <span className="summary-title" style={{ marginLeft: 10 }}>
                    OR
                  </span>
                  <div style={{ marginLeft: "20px" }}>
                    <div className="discountamount-input">
                      <span className="summary-value">{customerSymbol}</span>
                      <input
                        type="text"
                        placeholder="Discount in amount"
                        value={discountPrice}
                        onChange={(e) => {
                          setDiscountPrice(Number(e.target.value)); // Set fixed discount
                          setDiscount(0); // Clear percentage discount
                        }}
                        disabled={discount > 0} // Disable if percentage discount is entered
                      />
                      <span className="summary-title">Discount in amount</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span className="summary-value">{customerSymbol}</span>
                  <span className="summary-value">
                    {calculateDiscountPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="summary-row total">
                <span className="summary-title">Total</span>

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span className="summary-value">{customerSymbol}</span>
                  <span className="summary-value">
                    {calculateFinalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="invoice-actions12">
              <button
                className="cancel-btn"
                style={{
                  justifyContent: "flex-end",
                  alignSelf: "flex-end",
                  display: "flex",
                }}
                onClick={() => {
                  goBack();
                }}
              >
                Cancel
              </button>

              <button
                className="save-send-btn"
                // onClick={() => handleSubmit({ type: "MailSent" })}
                onClick={() => {
                  if (selectedCustomer) {
                    if (sunTotal > 0 && totalPrice > 0) {
                      setModalOpen(true);
                    } else {
                      alert(
                        "Add rate of the item to preview bill.",
                        selectedCustomer
                      );
                    }
                  } else {
                    alert("Please select customer details");
                  }
                }}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        <PreviewInvoice
          open={modalOpen}
          sunTotal={sunTotal}
          discount={discount}
          discountPrice={discountPrice}
          totalPrice={totalPrice}
          customerSymbol={customerSymbol}
          address={addressData}
          data={rows}
          data1={formData}
          setSubmitInvoice={setSubmitInvoice}
          onClose={() => setModalOpen(false)}
          // invoiceData={invoiceData}
        />
        {/* <div className="section2">
          <AdminBilling
            subtotal={sunTotal}
            discount={discount}
            totalPrice={totalPrice}
            data={rows}
            data1={formData}
          />
        </div> */}
      </div>
    </div>
  );
};

export default AddInvoice;
