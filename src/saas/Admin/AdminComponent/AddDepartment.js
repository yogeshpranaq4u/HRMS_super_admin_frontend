import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-responsive-modal";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import axios from "axios";
import { setDepartement, setManagerData } from "../../Redux/Action";

const AddDepartment = ({ open, onClose, user, AddType }) => {
  const { setLoading, logout } = useAuth();
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState();
  const token = sessionStorage.getItem("authToken");
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
      if (AddType === "department") {
        formDataToSend.append("department", formData.name);
      } else {
        formDataToSend.append("name", formData.name);
      }

      const response = await axios.post(
        `${BaseUrl}${
          AddType === "department"
            ? Api.ADD_DEPARTMENT
            : Api.ADD_REPORTING_MANAGER
        }`,
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
            getManagerList();
            getDepartmentList();
            setFormData(initialFormData);
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
  const getManagerList = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_ROPORTING_MANAGER}`,
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
          dispatch(setManagerData(responseData?.data?.data));
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
  const getDepartmentList = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_DEPARTMENT}`, {
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
          dispatch(setDepartement(responseData?.data?.data));
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
          <h2 style={{ marginBottom: "20px" }}>
            {AddType === "department"
              ? "Insert Department Name"
              : "Insert Repoting Manager"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="form-grid1">
          {AddType === "department" ? (
            <div className="form-group1">
              <label htmlFor="name">Department Name:</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          ) : (
            <div className="form-group1">
              <label htmlFor="name">
                {AddType === "department"
                  ? "Department Name: "
                  : "Manager Name"}
              </label>
              <select
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee Name</option>
                {getEmployeeDetails &&
                  getEmployeeDetails?.map((employee, index) => (
                    <option key={index} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
              </select>
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

export default AddDepartment;
