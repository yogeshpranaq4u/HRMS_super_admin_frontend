import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import { useDispatch } from "react-redux";
import "./AddHoliday.css";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import axios from "axios";
import { getHolidayData } from "../../../redux/actions/employeeActions";

const AddHoliday = ({ open, onClose }) => {
  const setLoading = () => { };
  const logout = () => { };
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const [file, setFile] = useState(null);
  const initialFormData = {
    holidayName: "",
    day: "",
    date: "",
    month: "",
    year: "",
    image: null,
  };
  const [formData, setFormData] = useState({
    holidayName: "",
    day: "",
    date: "",
    month: "",
    year: "",
    image: null,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("holiday_name", formData.holidayName);
      formDataToSend.append("day", formData.day);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("month", formData.month);
      formDataToSend.append("year", formData.year);
      if (file) formDataToSend.append("image", file);
      const response = await axios.post(
        `${BaseUrl}${Api.ADD_HOLIDAY}`,
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
          toast.success(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          dispatch(getHolidayData())
          setFormData(initialFormData);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    } finally {
    }
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFile(files[0]); // Correctly sets the file
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
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
            Insert Holiday Details
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="form-grid21">
          <div className="form-group21">
            <label htmlFor="holidayName">Holiday Name:</label>
            <input
              type="text"
              name="holidayName"
              id="holidayName"
              value={formData.holidayName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group21">
            <label htmlFor="day">Day:</label>

            <select
              name="day"
              id="day"
              value={formData.day}
              onChange={handleChange}
              required
            >
              <option value="">Select Day</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          <div className="form-group21">
            <label htmlFor="month">Month: </label>

            <select
              name="month"
              id="month"
              value={formData.month}
              onChange={handleChange}
              required
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December ">December</option>
            </select>
          </div>
          <div className="form-group21">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group21">
            <label htmlFor="year">Year:</label>
            <input
              type="text"
              name="year"
              id="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group21">
            <label htmlFor="image">Image URL:</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              // id="image"
              // value={formData.image}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button22">
            <button type="submit" className="myButton24">
              Submit Details
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddHoliday;
