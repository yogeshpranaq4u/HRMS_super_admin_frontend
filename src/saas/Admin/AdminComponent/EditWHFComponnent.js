import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Modal from "react-responsive-modal";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { setWorkFromHome } from "../../Redux/Action";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";

const EditWHFComponnent = ({ open, onClose, user, wdfData }) => {
  const dispatch = useDispatch();
  const getEmployeeindex = useSelector((state) => state.getEmployeeindex);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const token = sessionStorage.getItem("authToken");
const setLoading = () => { };
  const logout = () => { };
  const initialFormData = {
    start_date: "",
    end_date: "",
    reason: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    if (wdfData) {
      setFormData({
        start_date: wdfData?.wfh_start_date,
        end_date: wdfData?.wfh_end_date,
        reason: wdfData?.reason,
      });
    }
  }, [wdfData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("auto_generated_id", wdfData?.id);
      formDataToSend.append("employee_id", user?.id);
      formDataToSend.append("start_date", formData.start_date);
      formDataToSend.append("end_date", formData.end_date);
      formDataToSend.append("reason", formData.reason);

      const response = await axios.post(
        `${BaseUrl}${Api.UPDATE_WHF}`,
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

            setFormData(initialFormData);
            getEmployeeWorkfromdata();
          } else if (response?.data?.success === false) {
            toast.error(response?.data?.mssg, {
              position: "top-center",
              autoClose: 2000,
            });
            setLoading(false);
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
  const getEmployeeWorkfromdata = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GETWFH_DATA}?employee_id=${user?.id}`,
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
          dispatch(setWorkFromHome(responseData?.data?.data));
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
      classNames={{ modal: "custom-modal13" }}
    >
      <div style={styles.container}>
        <h2 style={styles.title}>Edit Work From Home</h2>
        <p style={styles.subtitle}>Please fill in the below details for WFH</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="employeeStatus">
              Employee Name
            </label>
            <input
              style={styles.input}
              type="text"
              id="employeeStatus"
              value={user?.name}
              readOnly
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="employeeStatus">
              Employee Status
            </label>
            <input
              style={styles.input}
              type="text"
              id="employeeStatus"
              value="WFH"
              readOnly
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="reason">
              Description
            </label>
            <textarea
              style={styles.textarea}
              id="reason"
              name="reason"
              rows={4}
              value={formData?.reason}
              onChange={handleChange}
              required
              placeholder="Enter description"
            ></textarea>
          </div>

          {/* Dates */}
          <div style={styles.dateRow}>
            <div style={{ width: "50%", height: 20 }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="start_date">
                  Start Date
                </label>
                <input
                  style={styles.dateInput}
                  type="date"
                  id="start_date"
                  name="start_date"
                  onChange={handleChange}
                  required
                  value={formData?.start_date}
                  placeholder="Select date"
                />
              </div>
            </div>
            <div style={{ width: "50%", height: 20 }}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="end_date">
                  End Date
                </label>
                <input
                  style={styles.dateInput}
                  type="date"
                  id="end_date"
                  name="end_date"
                  onChange={handleChange}
                  value={formData?.end_date}
                  required
                  placeholder="Select date"
                />
              </div>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => {
                onClose();
                setFormData(initialFormData);
              }}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditWHFComponnent;
const styles = {
  container: {
    width: "100%",
    margin: "20px auto",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    textAlign: "center",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#888",
    fontWeight: "500",
    marginBottom: "20px",
  },
  form: {
    textAlign: "left",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#FBFCFD",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "none",
    outline: "none",
  },
  textareaSelection: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  radioGroup: {
    display: "flex",
    alignItems: "center",
  },
  dateRow: {
    display: "flex",

    gap: "20px", // Adds space between the date inputs
    width: "100%", // Ensures the dateRow takes the full width of the container
    marginBottom: "15px",
  },
  dateInput: {
    flex: 1, // Ensures both inputs take equal space
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end", // Aligns buttons to the right
    gap: "10px", // Adds space between buttons
    marginTop: "80px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },
};
