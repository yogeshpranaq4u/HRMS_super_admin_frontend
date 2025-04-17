import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import "./EditInvoice.css";
import axios from "axios";
import { Api, BaseUrl } from "../../../../Config/Api";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import { toast } from "react-toastify";
import { setAllInvoice } from "../../../../Redux/Action";
import PreviewInvoice from "./PreviewInvoice";
const EditInvoice = ({ open, onClose, invoiceData }) => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
const setLoading = () => { };
  const logout = () => { };
  const [customerSymbol, setCustomerSymbol] = useState(null);
  const [sunTotal, setSubTotal] = useState(invoiceData?.sub_total);
  const [totalPrice, setTotalPrice] = useState(invoiceData?.total);
  const [discount, setDiscount] = useState(invoiceData?.discount_rate);
  const [paymentReceived, setPaymentReceived] = useState(0);
  const [emails, setEmails] = useState([]);
  const [paymentDone, setPaymentDone] = useState(false);

  const [addressData, setaddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    companyName: "",
    customerName: "",
  });
  const [finalPriceWord, setFinalPriceWord] = useState("");

  const [submitInvoive, setSubmitInvoice] = useState("");
  const [discountPrice, setDiscountPrice] = useState(
    invoiceData?.discount_amount
  );
  const [discountAmount, setDiscountAmount] = useState(
    invoiceData?.discount_price
  );

  const initialFormData = {
    customerName: "",
    invoice: "",
    invoiceDate: "",
    dueDate: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    if (invoiceData) {
      setFormData({
        customerName: invoiceData?.customer_name,
        invoice: invoiceData?.invoice_no,
        invoiceDate: invoiceData?.invoice_date,
        dueDate: invoiceData?.due_date,
      });
      setaddress({
        address: invoiceData?.address,
        city: invoiceData?.city,
        state: invoiceData?.state,
        pincode: invoiceData?.pincode,
        country: invoiceData?.country,
        companyName: invoiceData?.company_name,
        customerName: invoiceData?.customer_name,
      });
      setCustomerSymbol(invoiceData?.symbol);
      setSubTotal(invoiceData?.sub_total || 0);
      setTotalPrice(invoiceData?.total || 0);
      setDiscount(invoiceData?.discount_rate || 0);
      setDiscountPrice(invoiceData?.discount_amount || 0);
      setDiscountAmount(invoiceData?.discount_price || 0);
      const emailArray = JSON.parse(invoiceData?.email_addresses || "[]");
      setEmails((prevEmails) => [...emailArray]);
      setPaymentReceived(invoiceData?.payment_receiveed);
      setPaymentDone(invoiceData?.payment_receiveed ? true : false);
    }
  }, [invoiceData]);

  const [rows, setRows] = useState([
    { item: "", quantity: 0, rate: 0, tax: "Out of Scope", amount: 0 },
  ]);

  useEffect(() => {
    if (invoiceData?.item_array) {
      try {
        const parsedItems = JSON.parse(invoiceData.item_array); // Parse the JSON string
        setRows(parsedItems); // Set the parsed items to the state
      } catch (error) {
        console.error("Error parsing item_array:", error);
      }
    }
  }, [invoiceData]);
  useEffect(() => {
    const subtotal = calculateSubtotal();
    const discountData = calculateDiscountPrice();
    const finalPrice = calculateFinalPrice();
    convertNumberToWords(finalPrice);
    setSubTotal(subtotal);
    setTotalPrice(finalPrice);

    setDiscountAmount(discountData);
  }, [rows, discount, discountPrice, paymentReceived]);

  const addRow = () => {
    setRows([...rows, { item: "", quantity: 1, rate: 0, tax: "", amount: 0 }]);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
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
  // const handleInputChange = (index, field, value) => {
  //   const newRows = [...rows];

  //   newRows[index][field] = value;

  //   if (field === "quantity" || field === "rate") {
  //     const quantity = Number(newRows[index].quantity) || 0;
  //     const rate = Number(newRows[index].rate) || 0;
  //     newRows[index].amount = (quantity * rate).toFixed(2);
  //   }

  //   setRows(newRows);
  // };
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
  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
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
  const handleSubmit = async (type) => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      rows?.forEach((image) => {
        formDataToSend.append("details[]", JSON.stringify(image));
      });

      formDataToSend.append("id", invoiceData?.id);
      formDataToSend.append("invoice_date", formData?.invoiceDate);
      formDataToSend.append("due_date", formData?.dueDate);
      formDataToSend.append("sub_total", sunTotal);
      formDataToSend.append("discount_price", discountAmount);
      formDataToSend.append(
        "payment_receiveed",
        paymentReceived == null ? 0 : paymentReceived
      );
      formDataToSend.append("invoice_status", type?.type);
      formDataToSend.append("total", totalPrice);
      formDataToSend.append("price_in_words", finalPriceWord);
      if (discount > 0) {
        formDataToSend.append("discount_rate", discount);
      } else if (discountPrice > 0) {
        formDataToSend.append("discount_amount", discountPrice);
      }

      const response = await axios.post(
        `${BaseUrl}${Api.UPDATE_INVOICE}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmitInvoice("");
      setPaymentReceived(0);

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
          getAllInvoiceData();
          toast.success(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1500,
          });
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
  const updateReceivedPayment = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      formDataToSend.append("id", invoiceData?.id);

      formDataToSend.append(
        "payment_receiveed",
        paymentReceived == null ? 0 : paymentReceived
      );

      const response = await axios.post(
        `${BaseUrl}${Api.PAYMENT_UPDATE}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmitInvoice("");
      setPaymentReceived(0);

      if (response?.data?.authenticated === false) {
        toast.error(response?.data?.mssg[0], {
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
          getAllInvoiceData();
          toast.success(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1500,
          });
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
  useEffect(() => {
    if (submitInvoive === "Save As Draft") {
      handleSubmit({ type: "Drafts" });
    } else if (submitInvoive === "Save And Send") {
      handleSubmit({ type: "MailSent" });
    }
  }, [submitInvoive]);
  const getAllInvoiceData = async () => {
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

          onClose();
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
  const getFullAddress = () => {
    const { address, city, state, pincode, country } = addressData;
    return `${address}\n${city}, ${pincode}\n${state}\n${country}`;
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      showCloseIcon={false}
      closeOnOverlayClick={false}
      classNames={{ modal: "custom-modal" }}
    >
      <div
        style={{
          paddingBottom: 20,
          paddingTop: 20,
        }}
      >
        <button
          onClick={() => {
            onClose();

            setFormData(initialFormData);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "30px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          &times;
        </button>
        <h1>Update Invoice</h1>
        <p style={{ textAlign: "center" }}>
          Please fill in the below details for the new customer
        </p>
        {/* <div className="contentedit"> */}
        <div className="invoice-container111">
          <div className="form-gridinvoice">
            <div className="form-groupinvoice">
              <label htmlFor="customerName">Customer Name*</label>

              <input
                type="text"
                name="invoice"
                id="invoice"
                value={formData.customerName}
                // onChange={handleChange}
                required
              />
            </div>
            <div className="form-groupinvoice">
              <label htmlFor="companyName">Company Name:</label>
              <input
                type="text"
                name="invoice"
                id="invoice"
                value={invoiceData?.company_name}
                readOnly
              />
            </div>
            <div className="form-groupinvoice">
              <label htmlFor="invoice">Invoice#</label>
              <input
                type="text"
                name="invoice"
                id="invoice"
                value={formData.invoice}
                // onChange={handleChange}
                required
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
                      // value={currentEmail}
                      // onChange={(e) => setCurrentEmail(e.target.value)}
                      // onKeyDown={handleKeyDown}
                      placeholder="Enter email addresses"
                    /> */}
                </div>
              </div>
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
            <div className="form-groupinvoice">
              <label htmlFor="companyName">Address:</label>
              <textarea
                type="text"
                name="invoice"
                id="invoice"
                rows="4"
                value={getFullAddress()}
                // onChange={handleChange}

                readOnly
              />
            </div>
          </div>

          <div className="invoice-tableedit">
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

            <div
              style={{
                width: "100%",
                height: 40,
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "33%",
                }}
              >
                <span className="summary-title">Discount</span>
              </div>
              <div
                style={{
                  width: "50%",

                  alignItems: "center",
                  display: "flex",
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
              <div
                style={{
                  width: "20%",
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span className="summary-value">{customerSymbol}</span>
                  <span className="summary-value">
                    {calculateDiscountPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            {/* <div
              style={{
                width: "100%",
                height: 50,
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 50,
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <span className="summary-title">Payment received</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 50,
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  className="discountamount-input"
                  style={{ marginLeft: -40 }}
                >
                  <span className="summary-value">{customerSymbol}</span>
                  <input
                    type="text"
                    placeholder="Payment-Amount d"
                    value={paymentReceived}
                    onChange={(e) => {
                      setPaymentReceived(Number(e.target.value)); // Set fixed discount
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 50,
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span className="summary-value">{customerSymbol}</span>
                  <span className="summary-value">{paymentReceived}</span>
                </div>
              </div>
            </div> */}
            <div
              style={{
                width: "100%",
                height: 50,
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {/* Payment Received Title */}
              <div
                style={{
                  width: "100%",
                  height: 50,
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <span className="summary-title">Payment received</span>
              </div>

              {/* Centered Checkbox and Text */}
              <div
                style={{
                  width: "100%",
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={paymentDone}
                    onChange={(e) => {
                      setPaymentDone(e.target.checked);
                      setPaymentReceived(calculateFinalPrice().toFixed(2));
                    }} // Toggle payment done
                    style={{ transform: "scale(1.2)" }} // Optional: Larger checkbox for better visibility
                  />
                  Payment Done
                </label>
              </div>

              {/* Display Payment Received Value */}
              <div
                style={{
                  width: "100%",
                  height: 50,
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span className="summary-value">{customerSymbol}</span>
                  <span className="summary-value">
                    {" "}
                    {paymentDone ? calculateFinalPrice().toFixed(2) : 0}
                  </span>
                </div>
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

          <div className="invoice-actions">
            <button
              className="cancel-btn"
              style={{
                  justifyContent: "flex-end",
                  alignSelf: "flex-end",
                  display: "flex",
                }}
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </button>
            {paymentDone ? (
              <button
                className="save-send-btn"
                onClick={() => {
                  // setSubmitInvoice('Save As Draft')
                  updateReceivedPayment();
                }}
              >
                Save
              </button>
            ) : (
              <button
                className="save-send-btn"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                Preview
              </button>
            )}
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
      </div>
    </Modal>
  );
};

export default EditInvoice;
