import React, { useEffect, useState } from "react";
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

const EditEmployeeModal = ({ open, onClose, user }) => {
  // const { setLoading, logout } = useAuth();
  const setLoading = () => { };
  const logout = () => { };
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const [showPassword, setShowPassword] = useState(false);

  const [file, setFile] = useState(null);
  const getReportingManager = useSelector((state) => state.getReportingManager);
  const getDepartement = useSelector((state) => state.getDepartement);

  const [formData, setFormData] = useState();
  console.log("DDDddddd", user);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name,
        employee_code: user?.employee_code,
        email: user?.email,
        mobile: user?.mobile,
        blood_group: user?.blood_group,
        location: user?.location,
        designation: user?.designation,
        password: user?.password,
        reporting_manager: user?.reporting_manager,
        dob: user?.dob,
        doj: user?.doj,
        notice_period_end_date: user?.notice_period_end_date,
        department: user?.department,
        experience: user?.experience,
        status: user?.status,
        image: null,
        prohibition_end_date: user?.prohibition_end_date,
        total_experience: user?.total_experience,
        type: user?.type,
        intern_end_date: user?.intern_end_date,
        shift: user?.shift_timing,
        officeLocation: user?.officeLocation,
        marital_status: user?.marital_status,
      });
    } else {
      setFormData({
        name: "",
        employee_code: "",
        email: "",
        mobile: "",
        blood_group: "",
        location: "",
        designation: "",
        password: "",
        reporting_manager: "",
        dob: "",
        doj: "",
        notice_period_end_date: "",
        department: "",
        experience: "",
        status: "",
        image: null,
        prohibition_end_date: "",
        total_experience: "",
        type: "",
        intern_end_date: "",
        leaving_date: "",
        shift: "",
        officeLocation: "",
        inactiveComment: "",
        marital_status: "",
      });
    }
  }, [user]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFile(e.target.files[0]);
    } else {
      // setFormData({ ...formData, [name]: value });

      const newValue = name === "blood_group" ? value.toUpperCase() : value;

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData?.name);
      formDataObj.append("employee_code", formData?.employee_code);
      formDataObj.append("email", formData?.email);
      formDataObj.append("mobile", formData?.mobile);
      formDataObj.append("marital_status", formData?.marital_status);
      formDataObj.append("blood_group", formData?.blood_group);
      formDataObj.append("location", formData?.location);
      formDataObj.append("designation", formData?.designation);
      formDataObj.append("password", formData?.password);
      formDataObj.append("reporting_manager", formData?.reporting_manager);
      formDataObj.append("doj", formData?.doj);
      formDataObj.append("dob", formData?.dob);
      formDataObj.append("department", formData?.department);
      formDataObj.append("experience", formData?.experience);
      formDataObj.append("total_experience", formData?.total_experience);
      formDataObj.append("status", formData?.status);
      formDataObj.append("type", formData?.type);
      formDataObj.append("shift_timing", formData?.shift);
      formDataObj.append("officeLocation", formData?.officeLocation);
      formDataObj.append("id", user.id);
      if (formData?.status === "Intern") {
        formDataObj?.append("intern_end_date", formData?.intern_end_date);
      }
      if (file) formDataObj?.append("image", file);
      if (formData?.status === "Notice Period") {
        formDataObj?.append(
          "notice_period_end_date",
          formData?.notice_period_end_date
        );
      }
      if (formData?.status === "Prohibition") {
        formDataObj.append(
          "prohibition_end_date",
          formData?.prohibition_end_date
        );
      }
      if (formData?.status === "Inactive") {
        formDataObj?.append("leaving_date", formData?.leaving_date);
      }
      if (formData?.status === "Inactive") {
        formDataObj?.append("inactive_comments", formData?.inactiveComment);
      }
      const response = await axios.post(
        `${BaseUrl}${Api.UPDATE_EMPLOYEE_DETAILS}`,
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
            toast.success(response?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });

            fetchEmployees();
            // setFormData(initialFormData);
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
      console.error("Failed to update employee:", error);
      toast.error("An error occurred while updating employee details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_EMPLOYEE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        responseData?.data?.mssg === "unothorized token please go to login page"
      ) {
        setLoading(false);
      } else {
        dispatch(setUserDetails(responseData?.data?.data));
        setLoading(false);
        onClose();
      }
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
            // setFormData(initialFormData);
            setShowPassword(false);
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
            Update Employee Details
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData?.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="employee_code">Employee Code:</label>
            <input
              type="text"
              name="employee_code"
              id="employee_code"
              value={formData?.employee_code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email ID:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData?.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Contact:</label>
            <input
              type="text"
              name="mobile"
              id="mobile"
              value={formData?.mobile}
              onChange={handleChange}
              required
              maxLength={10}
              minLength={10}
              pattern="\d{10}"
              title="Please enter exactly 10 digits"
            />
            {formData?.mobile?.length !== 10 && (
              <span className="error">
                Contact number must be exactly 10 digits.
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="marital_status">Marital Status:</label>

            <select
              name="marital_status"
              id="marital_status"
              value={formData?.marital_status}
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
              value={formData?.department}
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
              value={formData?.designation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Employee Status:</label>
            <select
              name="status"
              id="status"
              value={formData?.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Prohibition">Prohibition</option>
              <option value="Full time">Full time</option>
              <option value="Notice Period">Notice Period</option>
              <option value="Intern">Intern</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {formData?.status == "Intern" && (
            <div className="form-group">
              <label htmlFor="intern_end_date">Iternship end date:</label>
              <input
                type="date"
                name="intern_end_date"
                id="intern_end_date"
                value={formData?.intern_end_date}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {formData?.status == "Notice Period" && (
            <div className="form-group">
              <label htmlFor="notice_period_end_date">Notice End Date:</label>
              <input
                type="date"
                name="notice_period_end_date"
                id="notice_period_end_date"
                value={formData?.notice_period_end_date}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {formData?.status == "Prohibition" && (
            <div className="form-group">
              <label htmlFor="prohibition_end_date">
                Prohibition End Date:
              </label>
              <input
                type="date"
                name="prohibition_end_date"
                id="prohibition_end_date"
                value={formData?.prohibition_end_date}
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
              value={formData?.experience}
              onChange={handleChange}
              required
            >
              <option value="">Select Experience</option>
              <option value="Experienced">Experienced</option>
              <option value="Fresher">Fresher</option>
            </select>
          </div>
          {formData?.experience === "Experienced" && (
            <div className="form-group">
              <label htmlFor="total_experience">Total Experience:</label>

              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  name="total_experience"
                  id="total_experience"
                  value={formData?.total_experience}
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
              value={formData?.type}
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
                value={formData?.password}
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
            <label htmlFor="reporting_manager">Reporting Manager:</label>

            <select
              name="reporting_manager"
              id="reporting_manager"
              value={formData?.reporting_manager}
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
              value={formData?.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="doj">Date of Joining:</label>
            <input
              type="date"
              name="doj"
              id="doj"
              value={formData?.doj}
              onChange={handleChange}
              required
            />
          </div>
          {formData?.status == "Inactive" && (
            <div className="form-group">
              <label htmlFor="leaving_date">Date of Leaving:</label>
              <input
                type="date"
                name="leaving_date"
                id="leaving_date"
                value={formData?.leaving_date}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="blood_group">Blood Group:</label>
            <input
              type="text"
              name="blood_group"
              id="blood_group"
              value={formData?.blood_group}
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
              value={formData?.location}
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
              name="image"
              id="image"
              onChange={handleChange}
            />
          </div>
          {formData?.status == "Inactive" && (
            <div className="form-group212">
              <label htmlFor="inactiveComment">Inactive Comments:</label>
              <textarea
                type="text"
                name="inactiveComment"
                placeholder="Enter Comments"
                id="inactiveComment"
                value={formData?.inactiveComment}
                onChange={handleChange}
                required
                rows="2"
              />
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

export default EditEmployeeModal;
