import React, { useState } from "react";
import { COLOR } from "../../../Config/Color";
import AddShowAssets from "./Component/AddShowAssets";
import AssignAssetsDetails from "./Component/AssignAssetsDetails";
import { useSelector } from "react-redux";
import { setAssetIndex } from "../../../Redux/Action";
import { useDispatch } from "react-redux";

const AssetManagment = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Assets Detail");

  const tabs = ["Assets Detail", "Assigned Assets"];
  return (
    <div className="newattendance-container">
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
          Asset Management Page
        </h1>
      </div>
      <div className="flex items-center justify-between border-b border-gray-300 px-10 py-1 bg-white rounded-lg shadow-sm">
        <div className="flex space-x-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "Assets Detail") {
                  dispatch(setAssetIndex(0));
                } else {
                  dispatch(setAssetIndex(1));
                }
              }}
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
      </div>

      <div style={{ marginTop: "20px", width: "100%" }}>
        {activeTab === "Assets Detail" && <AddShowAssets />}
        {activeTab === "Assigned Assets" && <AssignAssetsDetails />}
      </div>
    </div>
  );
};

export default AssetManagment;
