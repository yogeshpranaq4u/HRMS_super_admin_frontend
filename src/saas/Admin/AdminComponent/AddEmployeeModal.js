import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "../AdminComponent/AddEmployeeModal.css";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../Redux/Action";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
const AddEmployeeModal = ({ open, onClose }) => {
  const { setLoading, logout } = useAuth();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialFormData = {
    name: "",
    employeeCode: "",
    email: "",
    contact: "",
    bloodgroup: "",
    location: "",
    manager: "",
    password: "",
    dob: "",
    doj: "",
    department: "",
    status: "Prohibition",
    don: "",
    shift: "",
    designation: "",
    experience: "",
    image: null,
    totalExperiance: "",
    type: "",
    officeLocation: "",
    marital_status: "",
  };
  const [emptyFields, setEmptyFields] = useState([]);
  const [file, setFile] = useState(null);
  const getReportingManager = useSelector((state) => state.getReportingManager);
  const getDepartement = useSelector((state) => state.getDepartement);
  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    email: "",
    contact: "",
    bloodgroup: "",
    location: "",
    manager: "",
    password: "",
    dob: "",
    doj: "",
    department: "",
    status: "Prohibition",
    don: "",
    shift: "",
    designation: "",
    experience: "",
    image: null,
    totalExperiance: "",
    type: "",
    officeLocation: "",
    marital_status: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email" && value.includes("@")) {
      setErrorMessage("Please do not add the domain (e.g., @cvinfotech.com)");
    } else {
      setErrorMessage(""); // Clear error message if input is valid
    }
    if (name === "image") {
      setFile(e.target.files[0]);
    } else {
      const newValue = name === "bloodgroup" ? value.toUpperCase() : value;
      // setFormData({ ...formData, [name]: value });
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    }
    if (value.trim() !== "") {
      setEmptyFields(emptyFields.filter((field) => field !== name));
    }
  };

  const findEmptyFields = () => {
    const empty = Object.keys(formData).filter((key) => {
      if (key === "don" && formData.status !== "Notice Period") {
        return false;
      }
      if (key === "totalExperiance" && formData.status !== "Experienced") {
        return false;
      }

      if (key === "image") {
        return !file;
      }

      return !formData[key] || formData[key].trim() === "";
    });
    setEmptyFields(empty);
    return empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const empty = findEmptyFields();

    if (formData.status === "Notice Period" && !formData.don) {
      alert("Please fill in the Notice End Date.");
      return;
    }

    if (empty.length > 0) {
      alert(`Please fill in the following fields: ${empty.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData?.name);
      formDataToSend.append("employee_code", formData?.employeeCode);
      formDataToSend.append("email", formData?.email + "@cvinfotech.com");
      formDataToSend.append("mobile", formData?.contact);
      formDataToSend.append("marital_status", formData?.marital_status);
      formDataToSend.append("blood_group", formData?.bloodgroup);
      formDataToSend.append("location", formData?.location);
      formDataToSend.append("designation", formData?.designation);
      formDataToSend.append("password", formData?.password);
      formDataToSend.append("reporting_manager", formData?.manager);
      formDataToSend.append("doj", formData?.doj);
      formDataToSend.append("dob", formData?.dob);
      formDataToSend.append("department", formData?.department);
      formDataToSend.append("experience", formData?.experience);
      formDataToSend.append("status", formData?.status);
      formDataToSend.append("type", formData?.type);
      formDataToSend.append("shift_timing", formData?.shift);
      formDataToSend.append("officeLocation", formData?.officeLocation);
      if (file) formDataToSend.append("image", file);

      if (formData?.status === "Notice Period") {
        formDataToSend.append("notice_period_end_date", formData?.don);
      }
      if (formData.experience === "Experienced") {
        formDataToSend.append("total_experience", formData?.totalExperiance);
      }

      const response = await axios.post(
        `${BaseUrl}${Api.ADD_EMPLOYEE_DETAILS}`,
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
          if (response?.data?.success === true) {
            toast.success("Employee added successfully", {
              position: "top-center",
              autoClose: 1000,
            });

            fetchEmployees();
            setFormData(initialFormData);
          } else {
            toast.error(response?.data?.mssg, {
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
    }
  };

  const fetchEmployees = async () => {
    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_EMPLOYEE}`, {
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
        setLoading(false);
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          dispatch(setUserDetails(responseData?.data?.data));
          onClose();
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
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
            setShowPassword(false);
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
            Insert Employee Details
          </h2>
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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employeeCode">Employee Code:</label>
            <input
              type="text"
              name="employeeCode"
              id="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email ID:</label>

            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="off"
                style={{ paddingRight: "-10px" }}
              />
              <span style={{ marginLeft: -130 }}>@cvinfotech.com</span>
            </div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              name="contact"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              maxLength={10}
              minLength={10}
              pattern="\d{10}"
              title="Please enter exactly 10 digits"
            />
            {formData.contact.length !== 10 && (
              <span style={{ color: "red" }}>
                Contact number must be exactly 10 digits.
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="marital_status">Marital Status:</label>

            <select
              name="marital_status"
              id="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              required
            >
              <option value="">Select Marital Status</option>
              <option value="Married">Married</option>
              <option value="Single">Single</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <select
              name="department"
              id="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {getDepartement &&
                getDepartement?.map((employee, index) => (
                  <option key={index} value={employee.department}>
                    {employee.department}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="designation">Designation:</label>
            <input
              type="text"
              name="designation"
              id="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Employee Status:</label>
            {/* <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Prohibition">Prohibition</option>
              <option value="Full time">Full time</option>
              <option value="Notice Period">Notice Period</option>
              <option value="Intern">Intern</option>
              <option value="Inactive">Inactive</option>
            </select> */}
            <input
              type="text"
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              readOnly
            />
          </div>
          {formData.status === "Notice Period" && (
            <div className="form-group">
              <label htmlFor="don">Notice End Date:</label>
              <input
                type="date"
                name="don"
                id="don"
                value={formData.don}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="experience">Experience Level:</label>

            <select
              name="experience"
              id="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            >
              <option value="">Select Experience</option>
              <option value="Experienced">Experienced</option>
              <option value="Fresher">Fresher</option>
            </select>
          </div>
          {formData.experience === "Experienced" && (
            <div className="form-group">
              <label htmlFor="totalExperiance">Total Experience:</label>

              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  name="totalExperiance"
                  id="totalExperiance"
                  value={formData.totalExperiance}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="type">Role:</label>

            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="shift">Shift Timing:</label>

            <select
              name="shift"
              id="shift"
              value={formData?.shift}
              onChange={handleChange}
              required
            >
              <option value="">Select Shift</option>
              <option value="Shift-1">Shift-1</option>
              <option value="Shift-2">Shift-2</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>

            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  marginLeft: -30,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {showPassword ? <FaLockOpen /> : <FaLock />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="manager">Reporting Manager:</label>

            <select
              name="manager"
              id="manager"
              value={formData.manager}
              onChange={handleChange}
              required
            >
              <option value="">Select Reporting Manager</option>
              {getReportingManager &&
                getReportingManager?.map((employee, index) => (
                  <option key={index} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              max={minDate}
            />
          </div>

          <div className="form-group">
            <label htmlFor="doj">Date of Joining:</label>
            <input
              type="date"
              name="doj"
              id="doj"
              value={formData.doj}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bloodgroup">Blood Group:</label>
            <input
              type="text"
              name="bloodgroup"
              id="bloodgroup"
              value={formData.bloodgroup}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Address:</label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="officeLocation">Office Location:</label>

            <select
              name="officeLocation"
              id="officeLocation"
              value={formData?.officeLocation}
              onChange={handleChange}
              required
            >
              <option value="">Select Office Location</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Noida">Noida</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="image">Employee Image:</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
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

export default AddEmployeeModal;
