import React, { useEffect, useState } from "react";
import { COLOR } from "../../../Config/Color";
import NewLeaveRequest from "./Component/NewLeaveRequest";
import NewWfhRequest from "./Component/NewWfhRequest";
import MainLayout from "../../../../layouts/MainLayout";

const NewLeaveRequestPage = () => {
  const [activeTab, setActiveTab] = useState("Leave Request");
  const tabs = ["Leave Request", "WFH Request"];

  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <div className="newattendance-container">
            <div
              style={{
                width: "100%",
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
                Employee Leave/ WFH requests
              </h1>
            </div>
            <div className="flex items-center justify-between border-b border-gray-300 px-10 py-1 bg-white rounded-lg shadow-sm mt-5">
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
                    className={`pb-2 font-medium ${activeTab === tab
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
              {activeTab === "Leave Request" && <NewLeaveRequest />}
              {activeTab === "WFH Request" && <NewWfhRequest />}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewLeaveRequestPage;
