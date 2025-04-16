import React, { useEffect, useState } from "react";
import "../../../AdminPage/Billing/Component/EditCustomer.css";
import Modal from "react-responsive-modal";
import { RiUser6Line } from "react-icons/ri";
import { MdOutlineHomeWork } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import { HiOutlinePhone } from "react-icons/hi2";
import { PiDeviceMobileSpeakerThin } from "react-icons/pi";
import Select from "react-select";
import { CiMoneyBill } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlinePinDrop } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import countryToCurrency from "country-to-currency";
import { State } from "country-state-city";
import axios from "axios";
import { Api, BaseUrl } from "../../../../Config/Api";
import { toast } from "react-toastify";
import { setCustomeDetails } from "../../../../Redux/Action";

const EditCustomer = ({ open, onClose, customerDetails }) => {
  const [emails, setEmails] = useState([]);

  const [currentEmail, setCurrentEmail] = useState("");
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const { setLoading, logout } = useAuth();
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const initialFormData = {
    customerName: "",
    companyName: "",
    workPhone: "",
    mobile: "",
    city: "",
    address: "",
    address1: "",
    city: "",
    state: "",
    country: "",
    currency: "",
    pin: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    if (customerDetails) {
      setFormData({
        customerName: customerDetails?.customer_name,
        companyName: customerDetails?.company_name,
        workPhone: customerDetails?.work_phone,
        mobile: customerDetails?.mobile,
        city: customerDetails?.city,
        address: customerDetails?.address,
        address1: customerDetails?.address,
        city: customerDetails?.city,
        state: customerDetails?.state,
        country: customerDetails?.country,
        currency: customerDetails?.currency,
        pin: customerDetails?.pincode,
      });
      const emailArray = JSON.parse(customerDetails?.email_addresses);
      setEmails((prevEmails) => [...emailArray]);
    }
  }, [customerDetails]);

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
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    const emails = event.target.value.split(",").map((email) => email.trim());
    const isValid = emails.every((email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
    if (!isValid) {
      console.log("One or more email addresses are invalid.");
    } else {
      console.log("All email addresses are valid:", emails);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      emails?.forEach((data) => {
        formDataToSend?.append("email_addresses[]", data);
      });
      formDataToSend.append("customer_id", customerDetails?.id);
      formDataToSend.append("customer_name", formData?.customerName);
      formDataToSend.append("company_name", formData?.companyName);
      formDataToSend.append("state", formData?.state);
      formDataToSend.append("work_phone", formData?.workPhone);
      formDataToSend.append("mobile", formData?.mobile);
      formDataToSend.append("country", formData?.country);
      formDataToSend.append("currency", formData?.currency);
      formDataToSend.append("city", formData?.city);
      // formDataToSend.append("symbol", formData?.companyName);
      formDataToSend.append("address", formData?.address);
      formDataToSend.append("pincode", formData?.pin);

      const response = await axios.post(
        `${BaseUrl}${Api.UPDATE_CUSTOMER}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.authenticated === false) {
        toast.error(response?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
        setLoading(false);
      } else {
        if (response?.data?.valid === false) {
          setLoading(false);
          toast.error(response?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          if (response?.data?.success == true) {
            toast.success(response?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });
            fetchCustomerDetails();
          } else {
            toast.error("Please check details ", {
              position: "top-center",
              autoClose: 1000,
            });
            setLoading(false);
          }
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const fetchCustomerDetails = async () => {
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
          setLoading(false);
          onClose();
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
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      showCloseIcon={false}
      closeOnOverlayClick={false}
      classNames={{ modal: "custom-modal1" }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          maxWidth: "800px",
          width: "100%",
          margin: "auto",
          paddingRight: 30,
          paddingLeft: 30,
          paddingBottom: 20,
          paddingTop: 20,
          position: "relative",
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            fontSize: 30,
            paddingLeft: 100,
            fontWeight: 700,
          }}
        >
          <h2 style={{ marginBottom: "20px", marginLeft: -50 }}>
            Update Customer Details
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="form-gridcustomeredit">
          <div className="form-groupcustomer">
            <label htmlFor="customerName">Customer Name:</label>
            <div className="input-with-icon">
              <span className="icon">
                <RiUser6Line color={"black"} />
              </span>
              <input
                type="text"
                name="customerName"
                id="customerName"
                value={formData?.customerName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-groupcustomer">
            <label htmlFor="companyName">Company Name:</label>
            <div className="input-with-icon">
              <span className="icon">
                <MdOutlineHomeWork color={"black"} />
              </span>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData?.companyName}
                onChange={handleChange}
              />
            </div>
          </div>
          <label htmlFor="name" className="input-labell">
            Email Address
          </label>
          <div className="email-input-container">
            <div className="email-input-wrapper">
              <span className="icon">
                <AiOutlineMail color={"black"} />
              </span>
              {emails.map((email, index) => (
                <div key={index} className="email-tag">
                  <span>{email}</span>
                  <button type="button" onClick={() => removeEmail(email)}>
                    &times;
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyDown={handleKeyDown}
           
              />
            </div>
          </div>
          <div className="form-groupcustomer">
            <label htmlFor="workPhone">Work Phone:</label>
            <div className="input-with-icon">
              <span className="icon">
                <HiOutlinePhone color={"black"} />
              </span>
              <input
                type="text"
                name="workPhone"
                id="workPhone"
                value={formData?.workPhone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-groupcustomer">
            <label htmlFor="mobile">Mobile Number:</label>
            <div className="input-with-icon">
              <span className="icon">
                <PiDeviceMobileSpeakerThin color={"black"} />
              </span>
              <input
                type="text"
                name="mobile"
                id="mobile"
                value={formData?.mobile}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-groupcustomer">
            <label htmlFor="name">Country/Region:</label>

            <input
              type="text"
              name="customerName"
              id="customerName"
              value={formData?.country}
              onChange={handleChange}
            />
          </div>
          <div className="form-groupcustomer">
            <label htmlFor="name">Currency:</label>
            <div className="input-with-icon">
              <span className="icon">
                <CiMoneyBill color={"black"} />
              </span>
              <input
                type="text"
                name="name"
                id="name"
                value={formData?.currency}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-groupcustomer">
            <label htmlFor="name">State:</label>

            <input
              type="text"
              name="customerName"
              id="customerName"
              value={formData?.state}
              onChange={handleChange}
            />
          </div>
          <div className="form-groupcustomer">
            <label htmlFor="city">City:</label>
            <div className="input-with-icon">
              <span className="icon">
                <MdOutlineHomeWork color={"black"} />
              </span>
              <input
                type="text"
                name="city"
                id="city"
                value={formData?.city}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* <div className="form-groupcustomer">
            <label htmlFor="address">Address:</label>
            <div className="input-with-icon">
              <span className="icon">
                <CiLocationOn color={"black"} />
              </span>
              <input
                type="text"
                name="address"
                id="address"
                value={formData?.address}
                onChange={handleChange}
                required
              />
            </div>
          </div> */}
          <div className="form-groupinvoice">
            <label htmlFor="address">Address:</label>
            <textarea
              type="text"
              name="address"
              id="address"
              value={formData?.address}
              onChange={handleChange}
              rows="4"
              placeholder="Enter your address here..."
              // value={formData?.address}
              // onChange={handleChange}
            />
          </div>

          <div className="form-groupcustomer">
            <label htmlFor="pin">Pin Code:</label>
            <div className="input-with-icon">
              <span className="icon">
                <MdOutlinePinDrop color={"black"} />
              </span>
              <input
                type="text"
                name="pin"
                id="pin"
                value={formData?.pin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button">
            <button type="submit" className="myButton2">
              Submit Details
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditCustomer;
