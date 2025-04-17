import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import "./AdminHoliday.css";
import AddHoliday from "../AdminComponent/AddHoliday";

import { format } from 'date-fns';
import MainLayout from "../../../layouts/MainLayout";

const AdminHoliday = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const setLoading = () => { };
  const logout = () => { };
  const token = sessionStorage.getItem("authToken");
  const [holidayData, setholidayData] = useState([])
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  useEffect(() => {
    getHolidayList();
  }, []);
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
        setholidayData(responseData?.data?.data);
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleClick = () => {
    setModalOpen(true);
  };
  const getOpcity = (data) => {
    if (data?.date < currentDate) {
      return 0.5;
    } else {
      return 1;
    }
  };
  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <div className="holidayDiv">
            <div className="crow2">
              <div className="crow3">
                <h1 style={{ fontWeight: "700", fontSize: 30, color: "black" }}>
                  Holidays({holidayData[0]?.year})
                </h1>
              </div>
              <div className="button-container1">
                <button className="myButton1" onClick={handleClick}>
                  <FaPlus style={{ marginRight: "10px" }} />
                  Add Holiday
                </button>
              </div>
            </div>
            <div className="card-container12">
              <div
                style={{
                  marginBottom: 20,

                  flexDirection: "row",
                  display: "flex",
                }}
              >
                <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 25 }}>
                  Holiday Details
                </h1>
              </div>
              <div className="holiday-list">
                {holidayData?.map((holiday, index) => (
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
                      <div className="holiday-day">{holiday?.date.split("-")[2]}</div>
                    </div>

                    <div className="holiday-details">
                      <div className="holiday-name">{holiday.holiday_name}</div>
                      <div className="holiday-weekday">{holiday.day}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
            <AddHoliday open={modalOpen} onClose={() => setModalOpen(false)} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminHoliday;
