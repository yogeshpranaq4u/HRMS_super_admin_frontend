import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const AppointmentBooked = () => {
  const { state } = useLocation()
  // let date = dayjs(state?.data?.date)

  console.log("state", state?.data?.formatedDate);

  return (
    <div>
      <header className="header shadow d-flex justify-content-center align-items-center">
        <img src="assets/img/logo.png" alt="logo" />
      </header>
      <div className="container mt-5 pt-5 text-center book-appointment">

        <div className="row main-content justify-content-center">
          <div className="confirmed-section">
            {/* <img src="assets/img/BG.png" alt="l"/> */}
            <img src="assets/img/Timemanagement.svg" alt="logo" />
            <div className="d-flex flex-column gap-1 justify-content-center ">
              <h2 className="m-0">Booking Confirm</h2>
              <p className="py-1 m-0">Your appointment is successfully booked</p>
              <h5 className="m-0"> {
                state?.data?.formatedDate || "Date"
              }</h5>
              <h5>{state?.data?.time}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooked;
