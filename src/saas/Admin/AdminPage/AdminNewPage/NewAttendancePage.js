import React, { useState } from "react";
import { Table, Avatar, Select, Button, Pagination, Tabs } from "antd";
import "../AdminNewPage/Style/NewAttendancePage.css";
import { COLOR } from "../../../Config/Color";
import CurrentDayAttendance from "./Component/CurrentDayAttendance";
import SingleEmployeeAttendance from "./Component/SingleEmployeeAttendance";
import MonthlyAttendanceHistory from "./Component/MonthlyAttendanceHistory";
import { TbRefresh } from "react-icons/tb";
const { TabPane } = Tabs;
const { Option } = Select;
const NewAttendancePage = () => {
  const [activeTab, setActiveTab] = useState("Current Day Attendance");
  const [weekOn, setWeekOn] = useState(false);

  const tabs = ["Current Day Attendance", "Single Employee", "Monthly History"];
  return (
    <div className="newattendance-container">
      {/* <h2
        style={{
          marginBottom: "10px",
          marginTop: "10px",
          fontSize: "24px",
          fontWeight: "700",
          fontFamily: "Inter",
          color: COLOR.BLACK,
        }}
      >
        Attendance History
      </h2> */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            textAlign: "left",
            fontSize: "24px",
            fontWeight: "700",
            fontFamily: "Inter",
            color: COLOR.BLACK,
          }}
        >
          Attendance Sheet
        </h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TbRefresh size={18} />
          <p style={{ marginLeft: 10, marginRight: 10 }}>
            Pull to refresh the page for new data
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-gray-300 px-10 py-1 bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="flex space-x-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "24px",
                fontFamily: "Inter",
              }}
              className={`pb-2 font-medium ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-[#78829D]" // Custom color for inactive tab
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={weekOn}
              onChange={() => setWeekOn(!weekOn)}
              className="sr-only peer"
            />

            {/* <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 relative flex items-center">
         
              <div
                className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full transition ${
                  weekOn ? "translate-x-6" : ""
                }`}
              ></div>
            </div> */}
            <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 relative flex items-center">
              {/* Toggle Thumb */}
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full transition ${
                  weekOn ? "left-7" : "left-0"
                }`}
              ></div>
            </div>
          </label>
          <span
            style={{
              color: "#343741",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: "400",
              marginLeft: "10px",
            }}
          >
            {weekOn ? "Week On" : "Week Off"}
          </span>
        </div>
      </div>
      <div style={{ marginTop: "20px", width: "100%" }}>
        {activeTab === "Current Day Attendance" && (
          <CurrentDayAttendance data={weekOn} />
        )}
        {activeTab === "Single Employee" && (
          <SingleEmployeeAttendance data={weekOn} />
        )}
        {activeTab === "Monthly History" && (
          <MonthlyAttendanceHistory data={weekOn} />
        )}
      </div>
    </div>
  );
};

export default NewAttendancePage;
