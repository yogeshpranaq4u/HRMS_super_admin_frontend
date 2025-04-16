import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import AddAssets from "../AdminComponent/AddAssets";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAssetsData } from "../../Redux/Action";
import UpdateAssets from "../AdminComponent/UpdateAssets";
import MaterialTable from "material-table";
import { MdOutlineUploadFile } from "react-icons/md";
import NoImage from "../../Assets/imageno.png";
import Edit from "../../Assets/edit.png";
import Assign from "../../Assets/assign.png";
import { Dialog, DialogContent } from "@material-ui/core";
import "./AssetManagnment.css";
import { GoPlusCircle } from "react-icons/go";
import AssetAssign from "../AdminComponent/AssetAssign";
import AssetReturn from "./AssetReturn";
import AssetDetails from "../AdminComponent/AssetDetails";
import AssetAssignDetails from "../AdminComponent/AssetAssignDetails";
import { setAssetIndex } from "../../Redux/Action";
const AssetManagnment = () => {
  const getAssetIndex = useSelector((state) => state.getAssetIndex);
  const [selectedText, setSelectedText] = useState(getAssetIndex);
  const dispatch = useDispatch();
  const changeText = () => {
    const newText = selectedText === 0 ? 1 : 0;

    setSelectedText(newText);
    dispatch(setAssetIndex(newText));
  };

  return (
    <div className="holidayDiv121">
      <div className="crow3">
        <h1
          style={{
            fontWeight: "700",
            fontSize: 20,
            color: "black",
        
            textAlign: "left",
          }}
        >
          Assets
        </h1>
      </div>

      <div className="card-container1234">
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              borderBottom: selectedText === 0 ? "2px solid black" : "none",
              paddingBottom: 8,
              fontWeight: selectedText === 0 ? "700" : "500",
              cursor: "pointer",
              color: selectedText === 0 ? "#047EFF" : "#343741",
            }}
            onClick={changeText}
          >
            Items
          </h2>
          <h2
            style={{
              marginLeft: 20,
              borderBottom: selectedText === 1 ? "2px solid black" : "none",
              paddingBottom: 8,
              fontWeight: selectedText === 1 ? "700" : "500",
              cursor: "pointer",
              color: selectedText === 1 ? "#047EFF" : "#343741",
            }}
            onClick={changeText}
          >
            Assigned
          </h2>
        </div>
        {selectedText == 0 ? <AssetDetails /> : <AssetAssignDetails />}
      </div>
      
    </div>
  );
};

export default AssetManagnment;
