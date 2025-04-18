import React, { useEffect, useState } from "react";
import "./Holiday.css";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import MainLayout from "../../../layouts/MainLayout";
import { getHolidayData } from "../../../redux/actions/employeeActions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Holiday = () => {
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const dispatch = useDispatch();
  const holidayData = useSelector((state) => state.employeeData?.holidayList)
  useEffect(() => {
    if (holidayData.length == 0) {
      dispatch(getHolidayData())
    }
  }, []);

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
            <div >
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
        </div>
      </div>
    </MainLayout>
  );
};

export default Holiday;
