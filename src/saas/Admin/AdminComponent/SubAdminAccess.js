import React, { useState } from "react";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Modal from "react-responsive-modal";

import { MultiSelect } from "primereact/multiselect";
import "./SubAdminAccess.css";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { setUserDetails } from "../../Redux/Action";
import { FaChevronDown } from "react-icons/fa";
const SubAdminAccess = ({ open, onClose }) => {
  const { setLoading, logout } = useAuth();
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");

  const options = [
    { name: "Billing", code: "Billing" },
    { name: "Attendance", code: "Attendance" },
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const initialFormData = {
    name: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("employee_id", formData.name);
      selectedOptions?.forEach((data) => {
        formDataToSend?.append("pages[]", data);
      });

      const response = await axios.post(
        `${BaseUrl}${Api.GIVE_ACCESS}`,
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
            autoClose: 1500,
          });
        } else {
          if (response?.data?.success === true) {
            toast.success(response?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });

            setFormData(initialFormData);
            setSelectedOptions([]);
            onClose();
            fetchEmployees();
          } else if (response?.data?.success === false) {
            toast.error(response?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
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
  const fetchEmployees = async () => {
    setLoading(true);

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
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          const employeeData = JSON.parse(
            JSON.stringify(responseData.data.data)
          );
          dispatch(setUserDetails(responseData?.data?.data));

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
            // paddingLeft: 100,
            fontWeight: 700,
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Add Employee To Access Page</h2>
        </div>
        <form onSubmit={handleSubmit} className="form-grid1">
          <div className="form-group1">
            <label htmlFor="name">Employee Name</label>
            <select
              name="name"
              id="name"
              value={formData.id}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee Name</option>
              {getEmployeeDetails &&
                getEmployeeDetails?.map((employee, index) => (
                  <option key={index} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group1">
            <label htmlFor="page">Page Name</label>
            <MultiSelect
              value={options.filter((option) =>
                selectedOptions.includes(option.name)
              )} // Match selected names to options
              options={options}
              onChange={(e) => {
                const selectedNames = e.value.map((item) => item.name); // Extract and store names
                setSelectedOptions(selectedNames);
              }}
              optionLabel="name"
              placeholder="Select Options"
              display="chip"
              className="w-full"
              dropdownIcon={<FaChevronDown style={{ marginLeft: 30 }} />}
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

export default SubAdminAccess;
