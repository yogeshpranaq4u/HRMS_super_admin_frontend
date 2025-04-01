import React, { useEffect, useState } from "react";
import BookingScheduler from "./pages/BookingScheduler";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AppointmentBooked from "./pages/AppointmentBooked";

function App() {
 
  return (
    <React.Fragment>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/book-appointment" element={<BookingScheduler/>} />
        <Route path="/confirmed" element={<AppointmentBooked/>} />
      </Routes>
      </BrowserRouter>
      
      
    </React.Fragment>
  );
}

export default App;
