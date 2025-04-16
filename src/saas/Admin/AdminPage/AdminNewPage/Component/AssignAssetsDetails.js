import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../../../Config/Api";
import { toast } from "react-toastify";
import { setAssetsAssignData } from "../../../../Redux/Action";
import { FaSearch } from "react-icons/fa";
import { COLOR, IMAGE } from "../../../../Config/Color";
import { Table } from "antd";

import { Dialog, DialogContent } from "@material-ui/core";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { IoCaretForwardCircle } from "react-icons/io5";
import AssetReturn from "../../AssetReturn";
const AssignAssetsDetails = () => {
  const [query, setQuery] = useState("");
  const [assetReturn, setAssetReturn] = useState();
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const [retuenModal, setRetuenModal] = useState(false);
  const getAssetsAssignData = useSelector((state) => state.getAssetsAssignData);
  const [filterAsset, setFilterAsset] = useState(getAssetsAssignData);
  const { setLoading, logout } = useAuth();
  const token = sessionStorage.getItem("authToken");
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState("All Employee");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const fetchAssignAssets = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_ASSIGN_ASSET}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          dispatch(setAssetsAssignData(responseData?.data?.data));
          setFilterAsset(responseData?.data?.data);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, dispatch, setLoading, logout, retuenModal]);

  useEffect(() => {
    fetchAssignAssets();
  }, [dispatch, token, setLoading, assetReturn]);

  const columns = [
    {
      title: "SN.",
      dataIndex: "sn",
      key: "sn",
      render: (text, record, index) => index + 1,
      width: 60,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
      width: 200,
      fixed: "left",

      render: (_, rowData) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <>
            <img
              src={ImagePath + rowData?.user_image}
              style={{
                width: 50,
                height: 50,
                marginRight: 10,

                borderRadius: "50%",
                borderWidth: 2,

                borderColor: "#E2E8F099",
              }}
            />
          </>

          <span
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              display: "block", // Ensures it takes full width
              overflowWrap: "break-word",
            }}
          >
            {rowData.employee_name}
          </span>
        </div>
      ),
    },
    {
      title: "Item Name",
      dataIndex: "itemname",
      width: 200,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },

    {
      title: "Item Image",
      dataIndex: "assetName",
      width: 200,
      render: (_, rowData) => {
        const images = rowData?.image || [];
        const maxVisible = 2;
        const extraCount = images.length - maxVisible;

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {images.slice(0, maxVisible).map((imageObj, index) => (
              <img
                key={index}
                onClick={() => handleImageClick(images)}
                src={imageObj?.image}
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: -5,
                  borderRadius: "50%",
                  borderWidth: 2,
                  borderColor: "#E2E8F099",
                }}
              />
            ))}

            {extraCount > 0 && (
              <div
                style={{
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#E2E8F099",
                  borderRadius: "50%",
                  fontSize: "12px",
                  color: "#000",
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                +{extraCount}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "categories",
      width: 100,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Model/Brand",
      dataIndex: "model",
      width: 120,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Model Number",
      dataIndex: "model_number",
      width: 150,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      width: 150,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Assign By",
      dataIndex: "admin_name",
      width: 150,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Remark",
      dataIndex: "description",
      width: 200,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Assign Date",
      dataIndex: "assigned_date",
      width: 150,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Return Date",
      dataIndex: "return_date",
      width: 150,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Return Status",
      dataIndex: "return_status",
      width: 150,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Receiver",
      dataIndex: "reciver_name",
      width: 150,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },

    {
      title: "Action",
      field: "actions",
      width: 80,
      render: (rowData) => (
        <div>
          <button
            className="action-button"
            onClick={() => {
              handleReturnClick(rowData);
            }}
          >
            <img src={IMAGE.PEN} width={20} alt="Dashboard" />
          </button>
        </div>
      ),
    },
  ];

  const handleReturnClick = (rowData) => {
    setAssetReturn(rowData);
    setRetuenModal(true); // Open the modal
  };
  const handleStatusChange = (event) => {
    setIsDisabled(false);
    setIsFilterApplied(true);
    setSelectedValue(event.target.value);
  };
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };
  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getAssetsAssignData.filter((item) => {
      return item.employee_name.toLowerCase().includes(lowerCaseQuery);
    });

    setFilterAsset(filteredItems);
  };
  const filteredData = useMemo(() => {
    if (selectedValue === "All Employee") {
      return getAssetsAssignData;
    } else {
      return getAssetsAssignData.filter((emp) => {
        return selectedValue === emp?.employee_name;
      });
    }
  }, [selectedValue]);
  useEffect(() => {
    setFilterAsset(filteredData);
  }, [filteredData, assetReturn]);
  const handleModalClose = () => {
    setRetuenModal(false);
    fetchAssignAssets();
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  const handleClearFilter = () => {
    setSelectedValue("All Employee");
    setIsDisabled(true);
    setIsFilterApplied(false);
  };
  return (
    <div
      className="  border-gray-300 px-5 py-5 bg-white rounded-lg shadow-sm"
      style={{
        maxHeight: "80vh", // Adjust height as needed
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="flex items-center justify-between ">
        <div
          style={{
            width: 250,
            height: 40,

            display: "flex",
          }}
        >
          <div className="searchBar-wrapper">
            <input
              type="text"
              id="search-query"
              name="query"
              value={query}
              onChange={handleInputChange}
              placeholder="Search..."
              autoComplete="current-query"
              className="searchBar-input"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
        <div className="flex items-center space-x-4 ">
          <div>
            <span
              className="mr-2"
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.GRAY3,
                lineHeight: "18px",
              }}
            >
              Employee Name:
            </span>

            <select
              name="statusType"
              id="statusType"
              value={selectedValue}
              onChange={handleStatusChange}
              required
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.BLACK,
                lineHeight: "18px",
              }}
            >
              <option value="All Employee">All Employee</option>
              {getEmployeeDetails?.map((data) => (
                <option key={data?.id} value={data?.name}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClearFilter}
            disabled={isDisabled}
            className={`px-3 py-1 rounded flex items-center justify-center transition-colors ${
              isFilterApplied
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-black"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "Inter",
              lineHeight: "18px",
            }}
          >
            Clear Filter
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
          width: "100%",
        }}
      >
        <div
          style={{
            marginTop: "20px",
            width: "100%",

            overflowX: "auto",
          }}
        >
      
          <Table
            className="dotted-border-table"
            columns={columns}
            dataSource={filterAsset}
            pagination={{ pageSize: 8, position: ["bottomRight"] }}  
            rowClassName={() => "custom-row"}
            bordered={false}
            // style={{ tableLayout: "auto" }} 
            tableLayout="fixed"
            rowKey="key"
            scroll={{ x: 1000 }} // Ensures proper scrolling behavior

            locale={{
              emptyText: (
                <div className="custom-no-data">No Assets Data Found</div>
              ),
            }}
          />
        </div>
        <AssetReturn
          open={retuenModal}
          onClose={handleModalClose}
          assetsData={assetReturn}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogContent style={{ padding: 0, position: "relative" }}>
            {selectedImage && selectedImage.length > 0 ? (
              <>
                {/* Display the current image */}
                <img
                  src={selectedImage[count]?.image}
                  style={{
                    width: 700,
                    height: 700,
                    objectFit: "cover",
                  }}
                  alt="Selected"
                />

                {/* Navigation Controls */}
                <IoCaretBackCircleSharp
                  size={50}
                  onClick={() => {
                    if (count > 0) {
                      setCount(count - 1); // Navigate to the previous image
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "5px",
                    transform: "translateY(-70%)",
                    cursor: count > 0 ? "pointer" : "not-allowed",
                    opacity: count > 0 ? 1 : 0.5,
                    // zIndex: 10, // Ensure the icons appear above the image
                    color: "black",
                  }}
                />

                <IoCaretForwardCircle
                  size={50}
                  onClick={() => {
                    if (count < selectedImage.length - 1) {
                      setCount(count + 1); // Navigate to the next image
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "5px",
                    transform: "translateY(-70%)",
                    cursor:
                      count < selectedImage.length - 1
                        ? "pointer"
                        : "not-allowed",
                    opacity: count < selectedImage.length - 1 ? 1 : 0.5,
                    // zIndex: 10, // Ensure the icons appear above the image
                    color: "black", // Optional: make icons stand out
                  }}
                />
              </>
            ) : (
              /* Display placeholder when no image is selected */
              <img
                src={IMAGE.NOIMAGE}
                style={{ width: 500, height: 500 }}
                alt="No image available"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AssignAssetsDetails;
