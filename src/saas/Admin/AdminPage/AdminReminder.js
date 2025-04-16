import React, { useEffect, useState } from "react";
import "./AdminReminder.css";
import { useSelector } from "react-redux";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import Birthday from "../../Assets/birthday.png";
import Anniversary from "../../Assets/Anniversary.png";
import Probation from "../../Assets/Probation.png";
import Intership from "../../Assets/Intern.png";
import Performance from "../../Assets/Performance.png";

const AdminReminder = () => {
  const token = sessionStorage.getItem("authToken");
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const { setLoading, logout } = useAuth();
  const [reminderData, setReminderData] = useState([]);
  useEffect(() => {
    getReminderDetails();
  }, [token]);

  const getReminderDetails = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.ADMIN_REMINDER}`, {
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
        setReminderData(responseData?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const pastgetText = (item) => {
    if (item?.type === "Birthday") {
      return `Belated, but full of love, ${item?.name}! May your days be filled with joy, laughter, and everything you hope for in the year ahead.`;
    } else if (item?.type === "Anniversary") {
      return `We recently celebrated ${item?.name}'s work anniversary on ${item?.date}. Thank you for being with us!`;
    } else if (item?.type === "Prohibition End") {
      return `${item?.name}'s probation period was successfully completed on  ${item?.date}. Congratulations on becoming a permanent team member!`;
    } else if (item?.type === "Internship Completion") {
      return ` ${item?.name} completed their internship with us on ${item?.date}. Best of luck in their future career!`;
    } else if (item?.type === "Performance Review") {
      return `${item?.name}'s performance review was completed on ${item?.date}. Thank you for your feedback and guidance.`;
    }
  };
  const currentgetText = (item) => {
    if (item?.type === "Birthday") {
      return `Celebrate ${item?.name}'s birthday today! 🎉 Take a moment to send your best wishes.`;
    } else if (item?.type === "Anniversary") {
      return `Today is  ${item?.name}'s work anniversary! 🎉 Let’s celebrate their dedication and hard work.`;
    } else if (item?.type === "Prohibition End") {
      return `Today marks the end of ${item?.name}'s probation period. Take a moment to review their performance.`;
    } else if (item?.type === "Internship Completion") {
      return ` Today is ${item?.name}'s internship completed. Let’s wish them success in their future endeavors!`;
    } else if (item?.type === "Performance Review") {
      return `Today is ${item?.name}'s performance review day. Take this time to provide constructive feedback.`;
    }
  };
  const upcomminggetText = (item) => {
    if (item?.type === "Birthday") {
      return `Mark your calendar! ${item?.name}'s birthday is coming up on ${item?.date}. Prepare a surprise!`;
    } else if (item?.type === "Anniversary") {
      return `${item?.name} celebrates their work anniversary soon on ${item?.date}. Let's plan a celebration!`;
    } else if (item?.type === "Prohibition End") {
      return `Probation ending alert: ${item?.name}'s probation period will complete on ${item?.date}. Prepare your feedback.`;
    } else if (item?.type === "Internship Completion") {
      return `${item?.name}'s internship ends on  ${item?.date}. Prepare feedback and next steps for their farewell.`;
    } else if (item?.type === "Performance Review") {
      return `${item?.name}'s performance review is scheduled for ${item?.date}. Prepare insights and feedback.`;
    }
  };
  return (
    <div className="reminderDiv">
      <div className="container-reminder">
        <div
          style={{
            marginBottom: 20,
            display: "flex",
          }}
        >
          <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 18 }}>
            Upcoming
          </h1>
          <div style={{ marginTop: 20, marginLeft: -80 }}>
            {reminderData?.upcoming_events?.map((data, index) => (
              <div
                key={index}
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={
                    data?.type === "Birthday"
                      ? Birthday
                      : data?.type === "Anniversary"
                      ? Anniversary
                      : data?.type === "Prohibition End"
                      ? Probation
                      : data?.type === "Internship Completion"
                      ? Intership
                      : Performance
                  }
                  alt="Birthday"
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                  }}
                />
                <h1
                  style={{
                    marginLeft: 20,
                    fontWeight: "500",
                    fontSize: 18,
                    color: "#1F2937",
                    textAlign: "left",
                  }}
                >
                  {upcomminggetText(data)}
                  <h3
                    style={{
                      fontWeight: "400",
                      fontSize: 14,
                      color: "#6B7280",
                    }}
                  >
                    Upcoming Date : {data?.date}
                  </h3>
                </h1>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
          }}
        >
          <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 18 }}>
            Today
          </h1>
          <div style={{ marginTop: 20, marginLeft: -45 }}>
            {reminderData?.current_events > 0 ? (
              <>
                {reminderData?.current_events?.map((data, index) => (
                  <div
                    key={index}
                    style={{
                      marginTop: 20,
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={
                        data?.type === "Birthday"
                          ? Birthday
                          : data?.type === "Anniversary"
                          ? Anniversary
                          : data?.type === "Prohibition End"
                          ? Probation
                          : data?.type === "Internship Completion"
                          ? Intership
                          : Performance
                      }
                      alt="Birthday"
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                      }}
                    />
                    <h1
                      style={{
                        marginLeft: 20,
                        fontWeight: "500",
                        fontSize: 18,
                        color: "#1F2937",
                        textAlign: "left",
                      }}
                    >
                      {currentgetText(data)}
                      <h3
                        style={{
                          fontWeight: "400",
                          fontSize: 14,
                          color: "#6B7280",
                        }}
                      >
                        On Date : {data?.date}
                      </h3>
                    </h1>
                  </div>
                ))}
              </>
            ) : (
              <div
                style={{
                  marginTop: 20,
                  width: "100%",
                  display: "flex", // Makes the div a flex container
                  justifyContent: "center", // Centers the text horizontally
                  alignItems: "center", // Centers the text vertically
                }}
              >
                <h2
                  style={{
                    fontWeight: "500",
                    fontSize: 18,
                    color: "#1F2937",
                  }}
                >
                  No celebration for today!
                </h2>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
          }}
        >
          <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 18 }}>
            Older
          </h1>
          <div style={{ marginTop: 20, marginLeft: -45 }}>
            {reminderData?.older_events?.map((data, index) => (
              <div
                key={index}
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={
                    data?.type === "Birthday"
                      ? Birthday
                      : data?.type === "Anniversary"
                      ? Anniversary
                      : data?.type === "Prohibition End"
                      ? Probation
                      : data?.type === "Internship Completion"
                      ? Intership
                      : Performance
                  }
                  alt="Birthday"
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                  }}
                />
                <h1
                  style={{
                    marginLeft: 20,
                    fontWeight: "500",
                    fontSize: 18,
                    color: "#1F2937",
                    textAlign: "left",
                  }}
                >
                  {pastgetText(data)}
                  <h3
                    style={{
                      fontWeight: "400",
                      fontSize: 14,
                      color: "#6B7280",
                    }}
                  >
                    Passed Date : {data?.date}
                  </h3>
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReminder;
