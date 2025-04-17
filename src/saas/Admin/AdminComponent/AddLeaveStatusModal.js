import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "../AdminComponent/AddLeaveStatusModal.css";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import axios from "axios";
import { setEmployeeLeaveDetails } from "../../Redux/Action";

const AddLeaveStatusModal = ({ open, onClose, user }) => {
const setLoading = () => { };
  const logout = () => { };
  const getEmployeeLeaveDetails = useSelector(
    (state) => state.getEmployeeLeaveDetails
  );

  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");

  const initialFormData = {
    leave_code: "",
    leave_status:
      getEmployeeLeaveDetails?.leave_data?.leave_collected <= 0
        ? ""
        : "Approved",
    leave_type:
      user?.status === "Prohibition" ||
      getEmployeeLeaveDetails?.leave_data?.leave_collected <= 0
        ? "Unpaid"
        : "Paid",
    leave_unit: "days",
    leave_description: "",
    leave_start_date: "",
    leave_end_date: "",
    leave_start_datetime: "",
    leave_end_datetime: "",
  };
  const [emptyFields, setEmptyFields] = useState([]);
  const [formData, setFormData] = useState({
    leave_code: "",
    // leave_status: user.status === "Prohibition" ? "Unapproved" : "",
    leave_status:
      getEmployeeLeaveDetails?.leave_data?.leave_collected <= 0
        ? ""
        : "Approved",
    leave_type:
      user?.status === "Prohibition" ||
      getEmployeeLeaveDetails?.leave_data?.leave_collected <= 0
        ? "Unpaid"
        : "",
    leave_unit: "days",
    leave_description: "",
    leave_start_date: "",
    leave_end_date: "",
    leave_start_datetime: "",
    leave_end_datetime: "",
  });
  useEffect(() => {
    if (
      user?.status === "Prohibition" ||
      getEmployeeLeaveDetails?.leave_data?.leave_collected <= 0
    ) {
      setFormData((prevData) => ({
        ...prevData,
        leave_type: "Unpaid",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        leave_type: "Paid",
      }));
    }
    if (getEmployeeLeaveDetails?.leave_data?.leave_collected > 0) {
      setFormData((prevData) => ({
        ...prevData,
        leave_status: "Approved",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        leave_status: "",
      }));
    }
  }, [user?.status, getEmployeeLeaveDetails?.leave_data?.leave_collected]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (value.trim() !== "") {
      setEmptyFields(emptyFields.filter((field) => field !== name));
    }
  };

  const findEmptyFields = () => {
    const empty = Object.keys(formData).filter((key) => {
      if (formData.leave_unit === "Half-Day") {
        if (key === "leave_start_date" || key === "leave_end_date") {
          return false;
        }
        return formData[key].trim() === "";
      } else {
        if (key === "leave_start_datetime" || key === "leave_end_datetime") {
          return false;
        }
        return formData[key].trim() === "";
      }
    });
    setEmptyFields(empty);
    return empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const empty = findEmptyFields();

    if (formData.leave_unit === "Half-Day") {
      if (!formData.leave_start_datetime || !formData.leave_end_datetime) {
        alert("Please fill in the Start and End Date/Time for Half Day.");
        return;
      }
    } else {
      if (!formData.leave_start_date || !formData.leave_end_date) {
        alert("Please fill in the Start and End Date for Full Days.");
        return;
      }
    }

    if (empty.length > 0) {
      alert(`Please fill in the following fields: ${empty.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("leave_code", formData.leave_code);
      formDataToSend.append("leave_type", formData.leave_type);
      formDataToSend.append("leave_status", formData.leave_status);
      formDataToSend.append("leave_period", formData.leave_unit);
      formDataToSend.append("reasone", formData.leave_description);
      formDataToSend.append("id", user.id);

      if (formData.leave_unit === "Half-Day") {
        formDataToSend.append(
          "leave_start_date",
          formData.leave_start_datetime
        );
        formDataToSend.append("leave_end_date", formData.leave_end_datetime);
      } else {
        formDataToSend.append("leave_start_date", formData.leave_start_date);
        formDataToSend.append("leave_end_date", formData.leave_end_date);
      }

      const response = await axios.post(
        `${BaseUrl}${Api.ADD_LEAVE}`,
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
            autoClose: 2000,
          });
        } else {
          if (response?.data?.success === true) {
            toast.success(response?.data?.mssg, {
              position: "top-center",
              autoClose: 2000,
            });

            getEmployeeLeavdDetails();
            setFormData(initialFormData);
          } else if (response?.data?.success === false) {
            toast.error(response?.data?.mssg, {
              position: "top-center",
              autoClose: 2000,
            });
          }
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeLeavdDetails = useCallback(async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_LEAVE_DETAILS}?id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
          onClose();
        } else {
          dispatch(setEmployeeLeaveDetails(responseData?.data));
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
  }, []);
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
          //boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
            top: "0px",
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

            fontWeight: 700,
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Insert Employee Leave Details
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="form-grid1">
          <div className="form-group1">
            <label htmlFor="status">Employee Status:</label>
            <input
              type="text"
              name="status"
              id="status"
              value={user?.status}
              readOnly
              style={{ color: "#C0C0C0" }}
            />
          </div>

          <div className="form-group1">
            <label htmlFor="leave_code">Leave Code:</label>
            <select
              name="leave_code"
              id="leave_code"
              value={formData.leave_code}
              onChange={handleChange}
              required
            >
              <option value="">Select Leave Type</option>

              <option value="Sick leave">Sick leave</option>
              <option value="Casual">Casual</option>
              <option value="Emerygency leave">Emerygency leave</option>
              <option value="Personal leave">Personal leave</option>
            </select>
          </div>
          <div className="form-group1">
            <label htmlFor="leave_type">Leave Type:</label>

            <select
              name="leave_type"
              id="leave_type"
              onChange={handleChange}
              required
              value={
                user?.status === "Prohibition" ||
                getEmployeeLeaveDetails?.leave_data?.leave_collected <= 0
                  ? "Unpaid"
                  : formData.leave_type
              }
              disabled={
                user?.status === "Prohibition" ||
                getEmployeeLeaveDetails?.leave_data?.leave_collected <= 0
              }
              style={{
                color:
                  user?.status === "Prohibition" ||
                  getEmployeeLeaveDetails?.leave_data?.leave_collected <= 0
                    ? "#C0C0C0"
                    : "black",
              }}
            >
              <option value="">Select Type</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div className="form-group1">
            <label htmlFor="leave_status">Leave status:</label>
            <select
              name="leave_status"
              id="leave_status"
              value={formData.leave_status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Approved">Approved</option>
              {formData.leave_type != "Paid" && (
                <option value="Unapproved">Unapproved</option>
              )}
            </select>
          </div>

          <div className="form-group1">
            <label htmlFor="leave_unit">Unit:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="leave_unit"
                  value="days"
                  checked={formData.leave_unit === "days"}
                  onChange={handleChange}
                  required
                />
                Days
              </label>
              <label>
                <input
                  type="radio"
                  name="leave_unit"
                  value="Half-Day"
                  checked={formData.leave_unit === "Half-Day"}
                  onChange={handleChange}
                  required
                />
                Half Day
              </label>
            </div>
          </div>

          <div className="form-group1">
            <label htmlFor="leave_description">Description:</label>
            <textarea
              name="leave_description"
              id="leave_description"
              value={formData.leave_description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          {formData?.leave_unit === "days" ? (
            <div className="form-group1 validity-group">
              <label htmlFor="validity">Validity:</label>
              <div className="date-group">
                <div className="date-field">
                  <label htmlFor="leave_start_date">Start Date:</label>
                  <input
                    type="date"
                    name="leave_start_date"
                    id="leave_start_date"
                    value={formData.leave_start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="date-field">
                  <label htmlFor="leave_end_date">End Date:</label>
                  <input
                    type="date"
                    name="leave_end_date"
                    id="leave_end_date"
                    value={formData.leave_end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="form-group1 validity-group">
              <label htmlFor="validity">Validity:</label>
              <div className="date-group">
                <div className="date-field">
                  <label htmlFor="leave_start_datetime">
                    Start Date and Time:
                  </label>
                  <input
                    type="datetime-local"
                    name="leave_start_datetime"
                    id="leave_start_datetime"
                    value={formData.leave_start_datetime}
                    onChange={handleChange}
                  />
                </div>
                <div className="date-field">
                  <label htmlFor="leave_end_datetime">End Date and Time:</label>
                  <input
                    type="datetime-local"
                    name="leave_end_datetime"
                    id="leave_end_datetime"
                    value={formData.leave_end_datetime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
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

export default AddLeaveStatusModal;
