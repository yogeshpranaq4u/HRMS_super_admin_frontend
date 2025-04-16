import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import "../EmoployeeComponent/ApplyEmployeeLeavs.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { setLeaveWfhRequest } from "../../Redux/Action";

const ApplyEmployeeLeavs = ({ open, onClose, user }) => {
  const [selectedOption, setSelectedOption] = useState(
    user !== "WFH" ? "Full Day" : "WFH"
  );
  const [selectedHalf, setSelectedHalf] = useState();
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isToday, setIsToday] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [leavePolicy, setLeavePolicy] = useState("");
  const dispatch = useDispatch();
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  // const { setLoading, logout } = useAuth();
  const setLoading = ()=>{};
  const logout  = ()=>{};
  useEffect(() => {
    setSelectedOption(user !== "WFH" ? "Full Day" : "WFH");
  }, [user]);
  const handleSubmit = async () => {
  
    if (selectedOption === "Full Day" && leavePolicy === "") {
      toast.error("Please select leave type", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("employee_id", employeeId);
      if (selectedOption === "Half Day") {
        if (isToday) {
          formDataToSend.append("leave_end_date", selectedDate);
          formDataToSend.append("leave_start_date", selectedDate);
          formDataToSend.append("time_period", selectedHalf);
        } else {
          formDataToSend.append("leave_end_date", selectedDate);
          formDataToSend.append("leave_start_date", selectedDate);
          formDataToSend.append("time_period", selectedHalf);
        }
      } else {
        formDataToSend.append("leave_end_date", endDate);
        formDataToSend.append("leave_start_date", startDate);
      }

      formDataToSend.append("request_for", selectedOption);
      formDataToSend.append("reason", reason);
      formDataToSend.append("leave_name", leavePolicy);
      const response = await axios.post(
        `${BaseUrl}${Api.ADD_EMP_LEAVEREQUEST}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

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
            setReason("");
            setStartDate("");
            setEndDate("");
            setIsToday(false);
            setSelectedDate("");
            setLeavePolicy("");
            getEmployeeLeaveWfhrequest();
            onClose();
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

  const handleCheckboxChange = () => {
    setIsToday(!isToday);
    if (!isToday) {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
    } else {
      setSelectedDate("");
    }
  };

  const getEmployeeLeaveWfhrequest = async () => {
    // setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMP_LEAVEREQUEST}?employee_id=${employeeId}`,
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
          setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          dispatch(setLeaveWfhRequest(responseData?.data?.data));
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
      classNames={{ modal: "custom-modal1322" }}
    >
      <div className="wfh-container">
        <h2 className="wfh-title">
          {selectedOption === "WFH" ? "Apply Work From Home" : "Apply Leave"}
        </h2>
        <p className="wfh-subtitle">
          {selectedOption === "WFH"
            ? "Please fill in the below details for WFH"
            : "Please fill in the below details for Leave"}
        </p>

        {/* Radio Buttons */}
        <div className="radio-group">
          <label
            className={`radio-option ${
              selectedOption === "Full Day" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="wfh-type"
              value="Full Day"
              checked={selectedOption === "Full Day"}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            Full Day
          </label>
          <label
            className={`radio-option ${
              selectedOption === "Half Day" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="wfh-type"
              value="Half Day"
              checked={selectedOption === "Half Day"}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            Half Day
          </label>
          <label
            className={`radio-option ${
              selectedOption === "WFH" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="wfh-type"
              value="WFH"
              checked={selectedOption === "WFH"}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            WFH
          </label>
        </div>
        {selectedOption === "WFH" ? (
          <>
            <div className="input-group">
              <label className="input-label">WFH Reason</label>
              <textarea
                className="input-field textarea"
                placeholder="Enter description"
                value={reason}
                required
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="date-container">
              <div className="input-group">
                <label className="input-label">Start Date</label>
                <div className="date-wrapper">
                  <input
                    type="date"
                    className="input-field"
                    value={startDate}
                    required
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <div className="date-wrapper">
                  <input
                    type="date"
                    className="input-field"
                    value={endDate}
                    required
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        ) : selectedOption === "Full Day" ? (
          <>
            <div className="input-group">
              <label className="input-label">Leave Policy</label>
              <select
                className="input-field"
                value={leavePolicy}
                onChange={(e) => setLeavePolicy(e.target.value)}
              >
                <option value="">Select leave type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Emerygency leave">Emerygency leave</option>
                <option value="Personal leave">Personal leave</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Leave Reason</label>
              <textarea
                className="input-field textarea"
                placeholder="Only mention the reason explanation within 2 lines only e.g:  Family Function at home town, etc."
                value={reason}
                required
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="date-container">
              <div className="input-group">
                <label className="input-label">Start Date</label>
                <div className="date-wrapper">
                  <input
                    type="date"
                    className="input-field"
                    value={startDate}
                    required
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <div className="date-wrapper">
                  <input
                    type="date"
                    className="input-field"
                    value={endDate}
                    required
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="input-group">
              <label className="input-label">Leave Policy</label>
              <select
                className="input-field"
                value={leavePolicy}
                onChange={(e) => setLeavePolicy(e.target.value)}
              >
                <option value="">Select leave type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Emerygency leave">Emerygency leave</option>
                <option value="Personal leave">Personal leave</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Leave Reason</label>
              <textarea
                className="input-field textarea"
                placeholder="Only mention the reason explanation within 2 lines only e.g:  Family Function at home town, etc."
                value={reason}
                required
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            {/* <div className="checkbox-group">
              <input
                type="checkbox"
                id="todayCheckbox"
                checked={isToday}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="todayCheckbox">Today</label>
            </div> */}
            <div className="container-checkbox1">
              <div className="radio1-group">
                <input
                  type="checkbox"
                  id="todayCheckbox"
                  checked={isToday}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="todayCheckbox">Today</label>
              </div>

              <div className="radio1-group ">
                <input
                  type="radio"
                  id="firstHalf"
                  name="half"
                  required
                  checked={selectedHalf === "First half "}
                  onChange={() => setSelectedHalf("First half ")}
                />
                <label htmlFor="firstHalf">1st Half</label>
              </div>

              <div className="radio1-group ">
                <input
                  type="radio"
                  id="secondHalf"
                  name="half"
                  required
                  checked={selectedHalf === "Second half"}
                  onChange={() => setSelectedHalf("Second half")}
                />
                <label htmlFor="secondHalf">2nd Half</label>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Select Date</label>
              <div className="date-wrapper1">
                <input
                  type="date"
                  className="input-field"
                  value={selectedDate}
                  required
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={isToday}
                />
              </div>
            </div>
          </>
        )}

        <div className="button-group">
          <button
            className="btn cancel"
            style={{ marginRight: "-30px" }}
            onClick={() => {
              setReason("");
              setStartDate("");
              setEndDate("");
              setIsToday(false);
              setSelectedDate("");
              setLeavePolicy("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="btn submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </Modal>
  );
};
const styles = {
  container: {
    width: "100%",
    // margin: "20px auto",
    // padding: "10px",
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
export default ApplyEmployeeLeavs;
