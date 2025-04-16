import React, { useEffect, useState } from "react";
import "./Holiday.css";
import { useDispatch, useSelector } from "react-redux";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { setEmployeeHoliday } from "../../Redux/Action";
import { format } from "date-fns";

const Holiday = () => {
  const { setLoading, logout } = useAuth();
  const token = sessionStorage.getItem("authToken");
  const getEmployeeHoliday = useSelector((state) => state.getEmployeeHoliday);
  const dispatch = useDispatch();
  const currentDate = format(new Date(), "yyyy-MM-dd");

  const [selectedImages, setSelectedImages] = useState([]);
  useEffect(() => {
    getHolidayList();
  }, []);
  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  // Handle image upload
  const handleUpload = async () => {
    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post("YOUR_API_ENDPOINT", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Upload error", error);
    }
  };

  const getHolidayList = async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_HOLIDAY}`, {
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
      } else if (responseData?.data?.valid === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        
        dispatch(setEmployeeHoliday(responseData?.data?.data));
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getOpcity = (data) => {
    if (data?.date < currentDate) {
      return 0.5;
    } else {
      return 1;
    }
  };

  return (
    <div className="holidayDiv">
      <div style={{ marginTop: 100 }}>
        <div className="card-container12">
          <div
            style={{
              marginBottom: 20,

              flexDirection: "row",
              display: "flex",
            }}
          >
            <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 25 }}>
              Holidays Details
            </h1>
          </div>
          <div className="holiday-list">
            {getEmployeeHoliday?.map((holiday, index) => (
              <div key={index} className="holiday-item">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "white",
                    width: 70,
                    height: 58,
                    borderWidth: 2,
                    opacity: getOpcity(holiday),
                    borderRadius: 2,
                    borderColor: "#047EFF",
                  }}
                >
                  <div className="holiday-date">
                    <div className="holiday-month">
                      {holiday?.month.slice(0, 3)}
                    </div>
                  </div>
                  <div className="holiday-day">
                    {holiday?.date.split("-")[2]}
                  </div>
                </div>

                <div className="holiday-details">
                  <div className="holiday-name">{holiday.holiday_name}</div>
                  <div className="holiday-weekday">{holiday.day}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holiday;
