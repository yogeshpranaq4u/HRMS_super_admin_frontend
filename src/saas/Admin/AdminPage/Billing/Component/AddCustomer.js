import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import "../../../AdminPage/Billing/Component/AddCustomer.css";
import { RiUser6Line } from "react-icons/ri";
import { MdOutlineHomeWork } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import { HiOutlinePhone } from "react-icons/hi2";
import { PiDeviceMobileSpeakerThin } from "react-icons/pi";
import Select from "react-select";
import { CiMoneyBill } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlinePinDrop } from "react-icons/md";

import countryToCurrency from "country-to-currency";
import { State } from "country-state-city";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import { toast } from "react-toastify";
import { Api, BaseUrl } from "../../../../Config/Api";
import axios from "axios";
import { setCustomeDetails } from "../../../../Redux/Action";
const AddCustomer = ({ open, onClose }) => {
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [currency, setCurrency] = useState("");
  const [currencySybmol, setCurrencySymbol] = useState("");
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const { setLoading, logout } = useAuth();
  const initialFormData = {
    customerName: "",
    companyName: "",
    workPhone: "",
    mobile: "",
    city: "",
    address: "",

    pin: "",
  };
  const [formData, setFormData] = useState({
    customerName: "",
    companyName: "",
    workPhone: "",
    mobile: "",
    city: "",
    address: "",

    pin: "",
  });

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);

        const stateData = State.getStatesOfCountry(
          data?.userSelectValue?.value
        );
        const formattedStates = stateData.map((state) => ({
          label: state.name,
          value: state.isoCode,
        }));
        const currency = countryToCurrency[data?.userSelectValue?.value];
        setCurrency(currency);
        setState(formattedStates);
        getCurrencySymbol(currency);
      });
  }, []);

  const getCurrencySymbol = (currencyCode) => {
    const formatter = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
    });
    const parts = formatter.formatToParts(0);
    const symbolPart = parts.find((part) => part.type === "currency");

    setCurrencySymbol(symbolPart ? symbolPart.value : "");
    // return symbolPart ? symbolPart.value : "";
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    if (selectedState?.length < 0) {
      toast.error("Please select state", {
        position: "top-center",
        autoClose: 1500,
      });
    } else {
      const countryName = selectedCountry.label.split(" ").slice(1).join(" ");
      try {
        setLoading(true);

        const formDataToSend = new FormData();
        emails?.forEach((data) => {
          formDataToSend?.append("email_addresses[]", data);
        });
        formDataToSend.append("customer_name", formData?.customerName);
        formDataToSend.append("company_name", formData?.companyName);
        formDataToSend.append("state", selectedState?.label);
        formDataToSend.append("work_phone", formData?.workPhone);
        formDataToSend.append("mobile", formData?.mobile);
        formDataToSend.append(
          "country",
          selectedCountry.label.split(" ").slice(1).join(" ")
        );
        formDataToSend.append("currency", currency);
        formDataToSend.append("city", formData?.city);
        formDataToSend.append("symbol", currencySybmol);
        formDataToSend.append("address", formData?.address);
        formDataToSend.append("pincode", formData?.pin);

        const response = await axios.post(
          `${BaseUrl}${Api.ADD_CUSTOMER}`,
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
            Insert Customer Details
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="form-gridcustomer">
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
          <label
            htmlFor="name"
            className="input-labell"
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "black",
            }}
          >
            Email Address:
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
                placeholder="Enter email addresses"
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

            <Select
              options={countries}
              value={selectedCountry}
              placeholder="Select country"
              onChange={(selectedOption) => {
                const currency = countryToCurrency[selectedOption?.value];

                const stateData = State.getStatesOfCountry(
                  selectedOption?.value
                );
                const formattedStates = stateData.map((state) => ({
                  label: state.name,
                  value: state.isoCode,
                }));

                setState(formattedStates);

                setCurrency(currency);
                getCurrencySymbol(currency);
                setSelectedCountry(selectedOption);
                setSelectedState("");
              }}
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
                value={currency}
                //onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-groupcustomer">
            <label htmlFor="name">State:</label>

            <Select
              options={state}
              value={selectedState}
              onChange={(selectedOption) => {
                setSelectedState(selectedOption);
              }}
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
           
              />
            </div>
          </div> */}
          {/* <div className="form-groupcustomer">
            <label htmlFor="address1">Address2:</label>
            <div className="input-with-icon">
              <span className="icon">
                <CiLocationOn color={"black"} />
              </span>
              <input
                type="text"
                name="address1"
                id="address1"
                value={formData?.address1}
                onChange={handleChange}
           
              />
            </div>
          </div> */}
          <div className="form-groupinvoice">
            <label
              htmlFor="address"
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "black",
              }}
            >
              Address:
            </label>
            <textarea
              type="text"
              name="address"
              id="address"
              rows="4"
              style={{width:'350px'}}
              placeholder="Enter your address here..."
              value={formData?.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-groupcustomer" style={{marginLeft:40,}}>
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

export default AddCustomer;
