import React, { useState } from "react";
import CurrentEmployee from "./Component/CurrentEmployee";
import PastEmployeePage from "./Component/PastEmployeePage";
import { COLOR } from "../../../Config/Color";

const EmployeeListPage = () => {
  const [activeTab, setActiveTab] = useState("Current Employees");

  const tabs = ["Current Employees", "Past Employees"];
  return (
    <div className="newattendance-container">
      <h2
        style={{
          marginBottom: "10px",
          marginTop: "10px",
          fontSize: "24px",
          fontWeight: "700",
          fontFamily: "Inter",
          color: COLOR.BLACK,
        }}
      >
        Employee Sheet
      </h2>
 
      <div className="flex items-center justify-between border-b border-gray-300 px-10 py-3 bg-white rounded-lg shadow-sm">
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
              className={`pb-1 font-medium ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-[#78829D]" // Custom color for inactive tab
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "20px", width: "100%" }}>
        {activeTab === "Current Employees" && <CurrentEmployee />}
        {activeTab === "Past Employees" && <PastEmployeePage />}
      </div>
    </div>
  );
};

export default EmployeeListPage;
