import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "react-responsive-modal";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { setEmployeeLeaveDetails } from "../../Redux/Action";

const EditLeaveStatusModal = ({ open, onClose, user, leave }) => {
  const { setLoading, logout } = useAuth();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const [emptyFields, setEmptyFields] = useState([]);
  const [dayCount, setDayCount] = useState(0);
  const initialFormData = {
    leave_code: "",
    leave_status: "",
    leave_type: "",
    reasone: "",
    leave_period: "days",
    leave_description: "",
    leave_start_date: "",
    leave_end_date: "",
    leave_start_datetime: "",
    leave_end_datetime: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (leave) {
      setFormData({
        leave_code: leave?.leave_code,
        leave_status: leave?.leave_status,
        leave_type: leave?.leave_type,
        reasone: leave?.reason,
        leave_period: leave?.leave_period,
        leave_start_date: leave?.leave_start_date,
        leave_end_date: leave?.leave_end_date,
        leave_start_datetime: leave?.leave_start_date,
        leave_end_datetime: leave?.leave_end_date,
      });
      if (leave?.leave_type === "Paid") {
        calculateTotalDays(leave?.leave_start_date, leave?.leave_end_date);
      }
    }
  }, [leave]);
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
  const handleSubmit1 = async (e) => {
    e.preventDefault();
    const startDate = new Date(formData.leave_start_date);
    const endDate = new Date(formData.leave_end_date);
    const differenceInTime = endDate - startDate;
    const differenceInDayss = differenceInTime / (1000 * 3600 * 24);
  

    const formDataObj = new FormData();

    formDataObj.append("leave_code", formData.leave_code);
    formDataObj.append("leave_status", formData.leave_status);
    formDataObj.append("leave_type", formData.leave_type);
    formDataObj.append("reasone", formData.reasone);
    formDataObj.append("leave_period", formData.leave_period);

    if (formData.leave_period === "Half-Day") {
      if (!formData.leave_start_datetime || !formData.leave_end_datetime) {
        alert("Please fill in the Start and End Date/Time for Half Day.");
        return;
      }

      formDataObj.append("leave_start_date", formData.leave_start_datetime);
      formDataObj.append("leave_end_date", formData.leave_end_datetime);
    } else {
      if (!formData.leave_start_date || !formData.leave_end_date) {
        alert("Please fill in the Start and End Date for Full Days.");
        return;
      }

      formDataObj.append("leave_start_date", formData.leave_start_date);
      formDataObj.append("leave_end_date", formData.leave_end_date);
    }

    formDataObj.append("auto_generated_id", leave.id);
    formDataObj.append("employee_id", user.id);

    if (formData?.leave_type === "Paid" && leave?.leave_collected == 0) {
      if (dayCount < differenceInDayss) {
        alert(
          "Oops! You can't apply Unpaid Leaves to Paid Leaves. This Employee has not collected leave in balance."
        );
      } else {
        setLoading(true);

        try {
          const response = await axios.post(
            `${BaseUrl}${Api.UPDATE_EMPLOYEE_LEAVE}`,
            formDataObj,
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
          } else {
            if (response?.data?.valid === false) {
              toast.error(response?.data?.mssg[0], {
                position: "top-center",
                autoClose: 1000,
              });
              setLoading(false);
              onClose();
            } else {
              if (response?.data?.success) {
                toast.success(response?.data?.mssg, {
                  position: "top-center",
                  autoClose: 1000,
                });
                getEmployeeLeavdDetails1();
              } else {
                toast.error(response?.data?.mssg, {
                  position: "top-center",
                  autoClose: 1000,
                });
              }
            }
          }
        } catch (error) {
          console.error("Failed to update employee:", error);
          toast.error("An error occurred while updating employee details.");
        } finally {
          setLoading(false);
        }
      }
    } else {
      setLoading(true);

      try {
        const response = await axios.post(
          `${BaseUrl}${Api.UPDATE_EMPLOYEE_LEAVE}`,
          formDataObj,
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
        } else {
          if (response?.data?.valid === false) {
            toast.error(response?.data?.mssg[0], {
              position: "top-center",
              autoClose: 1000,
            });
            setLoading(false);
            onClose();
          } else {
            if (response?.data?.success) {
              toast.success(response?.data?.mssg, {
                position: "top-center",
                autoClose: 1000,
              });
              getEmployeeLeavdDetails1();
            } else {
              toast.error(response?.data?.mssg, {
                position: "top-center",
                autoClose: 1000,
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to update employee:", error);
        toast.error("An error occurred while updating employee details.");
      } finally {
        setLoading(false);
      }
    }
  };
  const getEmployeeLeavdDetails1 = async (data) => {
    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_LEAVE_DETAILS}?id=${user?.id}`,
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
        } else {
          dispatch(setEmployeeLeaveDetails(responseData?.data));
          onClose();
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
  };
  const calculateTotalDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const differenceInTime = endDate - startDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    setDayCount(differenceInDays);
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
          // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
          <h2 style={{ marginBottom: "20px" }}>Edit Employee Leave Details</h2>
        </div>
        <form onSubmit={handleSubmit1} className="form-grid1">
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
              <option value="">Select Code</option>
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
              value={formData.leave_type}
              onChange={handleChange}
              required
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
              <option value="Unapproved">Unapproved</option>
            </select>
          </div>

          <div className="form-group1">
            <label htmlFor="leave_unit">Unit:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="leave_period"
                  value="days"
                  checked={formData.leave_period === "days"}
                  onChange={handleChange}
                  required
                />
                Days
              </label>
              <label>
                <input
                  type="radio"
                  name="leave_period"
                  value="Half-Day"
                  checked={formData.leave_period == "Half-Day"}
                  onChange={handleChange}
                  required
                />
                Half Day
              </label>
            </div>
          </div>

          <div className="form-group1">
            <label htmlFor="reasone">Description:</label>
            <textarea
              name="reasone"
              id="reasone"
              value={formData.reasone}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          {formData?.leave_period === "days" ? (
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
              Update Details
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditLeaveStatusModal;
