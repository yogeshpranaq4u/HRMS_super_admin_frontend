import MaterialTable from "material-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import AssetReturn from "../AdminPage/AssetReturn";
import { useSelector } from "react-redux";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import Edit from "../../Assets/edit.png";
import { setAssetsAssignData } from "../../Redux/Action";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent } from "@material-ui/core";
import NoImage from "../../Assets/imageno.png";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { IoCaretForwardCircle } from "react-icons/io5";
const AssetAssignDetails = () => {
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
      field: "sn",

      cellStyle: {
        position: "sticky",
        left: 0,
        backgroundColor: "#fff",
        zIndex: 1,
      },
    },

    {
      title: "Employee Name",
      field: "employee_name",

      cellStyle: {
        // left: 0,
        backgroundColor: "#fff",
        // zIndex: 1,
        width: "300px",
      },
      headerStyle: {
        width: "300px",
      },
      render: (rowData) => (
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

          <span>{rowData.employee_name}</span>
        </div>
      ),
    },
    { title: "Item Name", field: "itemname" },

    {
      title: "Item Image",
      field: "assetName",
      cellStyle: {
        backgroundColor: "#fff",

        width: "450px",
      },
      headerStyle: {
        width: "450px",
      },
      render: (rowData) => {
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
    { title: "Category", field: "categories" },
    { title: "Model/Brand", field: "model" },
    { title: "Model Number", field: "model_number" },
    { title: "Serial Number", field: "serial_number" },
    { title: "Assign By", field: "admin_name" },
    { title: "Remark", field: "description" },
    { title: "Assign Date", field: "assigned_date" },
    { title: "Return Date", field: "return_date" },
    { title: "Return Status", field: "return_status" },
    { title: "Receiver", field: "reciver_name" },

    {
      title: "Action",
      field: "actions",
      render: (rowData) => (
        <div>
          <button
            className="action-button"
            onClick={() => {
              handleReturnClick(rowData);
            }}
          >
            <img src={Edit} width={25} alt="Dashboard" />
          </button>
        </div>
      ),
    },
  ];

  const memoizedData = useMemo(() => {
    return filterAsset?.map((employee, index) => ({
      ...employee,
      sn: index + 1, // Add SN number
    }));
  }, [filterAsset, retuenModal]);
  const handleReturnClick = (rowData) => {
    setAssetReturn(rowData);
    setRetuenModal(true); // Open the modal
  };
  const handleStatusChange = (event) => {
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
  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          marginTop: 25,
          justifyContent: "space-between",
          flexDirection: "row",
          display: "flex",
        }}
      >
        <div
          style={{
            width: 350,
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
        <div style={{ flexDirection: "row", display: "flex" }}>
          <div className="form-group222">
            <label htmlFor="statusType">Emp Status: </label>

            <select
              name="statusType"
              id="statusType"
              value={selectedValue}
              onChange={handleStatusChange}
              required
            >
              <option value="All Employee">All Employee</option>
              {getEmployeeDetails?.map((data) => (
                <option key={data?.id} value={data?.name}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="employee-table2322">
          <MaterialTable
            columns={columns}
            data={memoizedData}
            title={null}
            options={{
              paging: true,
              search: false,
              filtering: false,

              sorting: true,

              maxBodyHeight: "800px",
              headerStyle: {
                whiteSpace: "nowrap",
              },
              cellStyle: {
                whiteSpace: "nowrap",
              },
            }}
            style={{
              overflow: "hidden",

              boxShadow: "none",
              border: "none",
            }}
          />
        </table>
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
              src={NoImage}
              style={{ width: 500, height: 500 }}
              alt="No image available"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetAssignDetails;
