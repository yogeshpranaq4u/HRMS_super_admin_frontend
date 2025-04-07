import React, { useEffect, useState } from "react";
import axios from "axios";
// import { CalendarComponent } from '@syncfusion/ej2-react-calendars';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { baseUrl } from "../components/DemoModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BookingScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [slotsData, setSlotsData] = useState({ slots: [] });
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate()
  const queryString = window.location.search;
  // Create a URLSearchParams object
  const params = new URLSearchParams(queryString);
  // Get the values by key
  const cvi = params.get("cvi");
  const ref = params.get("ref");

  const [formData, setFormData] = useState({ date: new Date(), time: "" });
  useEffect(() => {
    getSlots()
  }, [])
  const onChange = (e, fieldName) => {
    // console.log("test e", e ,dayjs(e).format("DD/MMM/YYYY"));
    if (fieldName == "date") {
      getSlots(e)
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e,
        formatedDate: dayjs(e).format("DD/MMM/YYYY")
      }))
    }
    setFormData((prev) => ({
      ...prev,
      [fieldName]: e
    }))
  }


  function combineDateTime(data) {
    const dateObj = dayjs(data.date);
    // Extract year, month, and day
    const formattedDate = dateObj.format("YYYY-MM-DD");
    // Combine date and time
    const finalDateTime = dayjs(`${formattedDate} ${data.time}`, "YYYY-MM-DD hh:mm A");
    console.log(formattedDate, data.time); // Output: 2025-04-01 12:00:00
    return finalDateTime;
  }
  const handleSubmit = async () => {
   
    if (!formData.date || !formData.time) {
      alert("Please select a time slot.");
      return;
    }
    setLoading(true)
    try {
      const response = await axios.post(`${baseUrl}/public/book-now`, {
        id: cvi||"",
        demo_date: formData.date,
        demo_time: formData.time,
      });
      // console.log("response", response);
      if(response.status == 200){
        navigate("/confirmed", {state:{data:formData}}) 
      }
      setLoading(false)
      alert("Appointment booked successfully!");
    } catch (error) {
      setLoading(false)
      alert("Error booking appointment.");
    }
  };


  // Define min and max selectable dates
  const minDate = dayjs(new Date());
  const maxDate = dayjs().add(15, "day");

  // Function to disable specific dates (e.g., weekends)
  const shouldDisableDate = (date) => {
    const day = date.day();
    return day === 0 || day === 6; // Disable Saturdays and Sundays
  };


  const getSlots = async (date) => {
    // console.log("formData.date" ,date );
    try {
      const response = await axios.post(`${baseUrl}/public/get-time-slote?date=${dayjs(date).format("YYYY-MM-DD")}`)
      // console.log(response);
      if (response.data.status) {
        setSlotsData(response.data)
      } else {
        alert(response.data.message || "Something went wrong")
      }
    } catch (error) {
      alert(error?.response.data.message || error.message || "Something went wrong")
      console.log(error);
    }
  }
  return (
    <div>
      <header className="header shadow d-flex justify-content-center align-items-center">
        <img src="assets/img/logo.png" alt="logo" />
      </header>
      <div className="container mt-5 text-center book-appointment">
        <div className="py-4">
          <h2 className="m-0 pt-3">Schedule A Call With Us</h2>
          <p className="py-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
        <div className="row main-content justify-content-center">
          <div className="calender-container">
            <div className="row justify-content-center align-items-center border rounded shadow-gradient py-4">
              <div className="col-md-6 p-4 d-flex justify-content-center ">
                <div className="customize-calender">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      disableFuture={false} // Allow selecting future dates
                      disablePast={false} // Allow selecting past dates
                      minDate={minDate} // Set minimum selectable date
                      maxDate={maxDate} // Set maximum selectable date
                      shouldDisableDate={shouldDisableDate} // Function to disable certain dates
                      defaultValue={dayjs()} // Default selected date
                      // value={dayjs(formData.date)}
                      views={["year", "month", "day"]} // Calendar views
                      showDaysOutsideCurrentMonth // Show days from previous/next month
                      readOnly={false} // Allow selection or make it read-only
                      onChange={(e)=>{onChange(e,"date")}}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="col-md-6 p-4   ">
                <div>
                  <div className="meet-duration mb-3">
                    <h4 className="text-start my-2">Meeting duration</h4>
                    <button className="w-100 py-1">
                      15 min
                    </button>
                  </div>
                  {/* <div>
                    What time works best?
                    Showing times for April 1, 2025
                  </div> */}
                  <h5 className="text-start ">
                    Select a Time
                  </h5>
                  <div className="d-flex flex-column gap-2 justify-content-start time-slots">
                    {slotsData?.slots.map((time) => (
                      <button
                        key={time}
                        className={`btn m-1 ${selectedTime === time ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => {
                          onChange(time, "time")
                          setSelectedTime(time)
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="btn book-appoint mt-3" onClick={()=>{
                  if(!loading){
                    handleSubmit()
                  }
                }}>
                  {
                    loading ? "Loading...":"Book Appointment"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScheduler;
