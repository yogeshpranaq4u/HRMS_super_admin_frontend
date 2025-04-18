import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { setAllUserAttendance, setMonthlyAttendance } from "../../Redux/Action";
import { useSelector } from "react-redux";
import { getEmployeeProfile } from "../../../redux/actions/employeeActions";

const EditEmployeeAttendance = ({ open, onClose, user }) => {
  const setLoading = () => { };
  const logout = () => { };
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.employeeData?.profile)
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  const initialFormData = {
    name: "",
    employee_code: "",
    email: "",
    mobile: "",
    designation: "",
    login_time: "",
    logout_time: "",
    reporting_manager: "",
    login_type: "",
    login_time: "",
    logout_time: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name,
        employee_code: user?.employee_code,
        email: user?.email,
        mobile: user.mobile,

        designation: user?.designation,
        login_time: user?.login_time,
        logout_time: user?.logout_time,
        reporting_manager: user?.reporting_manager,
        login_type: user?.attendance_status,
      });
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let timeValue = value;

    if (name === "login_time") {
      const [hours, minutes, seconds] = value.split(":");
      const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${seconds ? String(seconds).padStart(2, "0") : "00"}`;

      setFormData({
        ...formData,
        [name]: formattedTime,
      });
    } else if (name === "logout_time") {
      const [hours, minutes, seconds] = value.split(":");
      const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${seconds ? String(seconds).padStart(2, "0") : "00"}`;

      setFormData({
        ...formData,
        [name]: formattedTime,
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    if (employeeId == user?.employee_id) {
      alert("You can not change your own attendance");
    } else {
      const formDataObj = new FormData();
      formDataObj.append("auto_generated_id", user.auto_generated_id);
      formDataObj.append("status", formData.login_type);
      if (formData.login_type != "Leave") {
        formDataObj.append("login_time", formData.login_time);
        formDataObj.append(
          "logout_time",
          formData.logout_time == null ? null : formData.logout_time
        );
      }

      try {
        const response = await axios.post(
          `${BaseUrl}${Api.EMPLOYEE_ATTENDANCE_UPDATE}`,
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
              autoClose: 1500,
            });
            setLoading(false);
          } else {
            toast.success(response?.data?.mssg, {
              position: "top-center",
              autoClose: 1500,
            });
            onClose();
            setLoading(false);
            getAllUserAttendanceData();
            // getMonthlyAttendance1();
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
 
  useEffect(() => {
    if (employeeId && (!profileData?.name)) {
      dispatch(getEmployeeProfile(employeeId))
    }
  }, []);

  const getAllUserAttendanceData = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_ATTENDANCE}`, {
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
          // setAllAttendance(responseData?.data?.data);
          dispatch(setAllUserAttendance(responseData?.data?.data))
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

            fontWeight: 700,
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Edit Attendance Details</h2>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              readOnly
              autoComplete="name"
              style={{ color: "#C0C0C0" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="employee_code">Employee Code:</label>
            <input
              type="text"
              name="employee_code"
              id="employee_code"
              value={formData.employee_code}
              onChange={handleChange}
              readOnly
              style={{ color: "#C0C0C0" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email ID:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              readOnly
              autoComplete="email"
              style={{ color: "#C0C0C0" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Contact:</label>
            <input
              type="text"
              name="mobile"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              readOnly
              style={{ color: "#C0C0C0" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation:</label>
            <input
              type="text"
              name="designation"
              id="designation"
              value={formData.designation}
              onChange={handleChange}
              readOnly
              style={{ color: "#C0C0C0" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reporting_manager">Reporting Manager:</label>
            <input
              type="text"
              name="reporting_manager"
              id="reporting_manager"
              value={formData.reporting_manager}
              onChange={handleChange}
              readOnly
              style={{ color: "#C0C0C0" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login_type">Login Status:</label>

            <select
              name="login_type"
              id="login_type"
              value={formData.login_type}
              onChange={handleChange}
              required
            >
              <option value="">Present Status</option>
              <option value="Leave">Leave</option>
              <option value="Half-Day">Half-Day</option>
              <option value="Present">Present</option>
            </select>
          </div>
          {formData.login_type !== "Leave" && (
            <>
              <div className="form-group">
                <label htmlFor="login_time">Login Time:</label>
                <input
                  type="time"
                  name="login_time"
                  id="login_time"
                  value={formData.login_time}
                  onChange={handleChange}
                  step="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="logout_time">Logout Time:</label>
                <input
                  type="time"
                  name="logout_time"
                  id="logout_time"
                  value={formData.logout_time}
                  onChange={handleChange}
                  step="1"
                />
              </div>
            </>
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

export default EditEmployeeAttendance;
