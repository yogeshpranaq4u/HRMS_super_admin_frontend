import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { GoPlusCircle } from "react-icons/go";
import { Api, BaseUrl, ImagePath1 } from "../../Config/Api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { toast } from "react-toastify";
import { setAssetsAssignData, setAssetsData } from "../../Redux/Action";
import AddAssets from "./AddAssets";
import MaterialTable from "material-table";
import Assign from "../../Assets/assign.png";
import Edit from "../../Assets/edit.png";
import { Dialog, DialogContent } from "@material-ui/core";
import UpdateAssets from "./UpdateAssets";
import AssetAssign from "./AssetAssign";
import NoImage from "../../Assets/imageno.png";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { IoCaretForwardCircle } from "react-icons/io5";
const AssetDetails = () => {
  const [query, setQuery] = useState("");
  const token = sessionStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const getAssetesData = useSelector((state) => state.getAssetesData);
  const [filterAsset, setFilterAsset] = useState(getAssetesData);
const setLoading = () => { };
  const logout = () => { };
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [assetsDetail, setAssetsDetail] = useState();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    Category: "Category",
    Location: "Location",
    Status: "Status",
  });

  const fetchAssetsData = useCallback(async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_STOCK}`, {
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
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          dispatch(setAssetsData(responseData?.data?.data));
          setFilterAsset(responseData?.data?.data);
          fetchAssignAssets();

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
  }, [token, dispatch, setLoading, logout]);
  const fetchAssignAssets = async () => {
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
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAssetsData();
  }, [dispatch, token, setLoading, modalOpen, assignModalOpen, editmodalOpen]);
  const handleStatusChange = (e) => {
    setFormData({ ...formData, Status: e.target.value });
  };
  const handleLocationChange = (e) => {
    setFormData({ ...formData, Location: e.target.value });
  };
  const handleCategoryChange = (e) => {
    setFormData({ ...formData, Category: e.target.value });
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    updateFilteredCategories(event.target.value);
  };
  const updateFilteredCategories = (searchTerm) => {
    const lowerCaseQuery = searchTerm.trim().toLowerCase();

    const filteredItems = getAssetesData.filter((item) => {
      return (
        item.category.toLowerCase().includes(lowerCaseQuery) ||
        item.location.toLowerCase().includes(lowerCaseQuery) ||
        item.status.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilterAsset(filteredItems);
  };
  const filteredData = useMemo(() => {
    if (
      formData.Category === "Category" &&
      formData.Location === "Location" &&
      formData.Status === "Status"
    ) {
      return getAssetesData;
    } else {
      return getAssetesData.filter((emp) => {
        const matchesManager =
          formData.Category === "Category" ||
          emp?.category === formData.Category;
        const matchesDepartment =
          formData.Location === "Location" ||
          emp?.location === formData.Location;
        const matchesStatus =
          formData.Status === "Status" || emp?.status === formData.Status;

        return matchesManager && matchesDepartment && matchesStatus;
      });
    }
  }, [formData]);
  useEffect(() => {
    setFilterAsset(filteredData);
  }, [filteredData]);
  const columns = [
    {
      title: "SN.",
      field: "sn",
      cellStyle: {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
      headerStyle: {
        position: "sticky",
        left: 0,

        zIndex: 2,
      },
    },

    {
      title: "Asset Name",
      field: "itemname",
      cellStyle: {
        // left: 0,
        backgroundColor: "#fff",
        // zIndex: 1,
        width: "450px",
      },
      headerStyle: {
        width: "450px",
      },
    },

    {
      title: "Item Image",
      field: "assetName",
      cellStyle: {
        // left: 0,
        backgroundColor: "#fff",
        // zIndex: 1,
        width: "450px",
      },
      headerStyle: {
        width: "450px",
      },
      render: (rowData) => {
        const images = rowData?.image || [];
        const maxVisible = 2; // Maximum images to show
        const extraCount = images.length - maxVisible; // Number of extra images

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
    { title: "Category", field: "category" },
    { title: "Brand Name", field: "model_brand" },
    {
      title: "Model Number",
      field: "model_number",
      cellStyle: {
        // width: "150px",
        whiteSpace: "normal",
        wordWrap: "break-word",
      },
    },
    {
      title: "Serial Number",
      field: "serial_number",
      headerStyle: {
        whiteSpace: "nowrap",
      },
      cellStyle: {
        width: "200px",
        whiteSpace: "normal",
        wordWrap: "break-word",
      },
    },

    { title: "Condition", field: "item_condition" },
    { title: "Status", field: "status" },
    { title: "Purchase date", field: "entry_date" },
    { title: "Location", field: "location" },
    { title: "Remark", field: "description" },
    {
      title: "Assign",
      field: "assign",
      render: (rowData) => (
        <div>
          <button
            className="action-button"
            onClick={() => {
              handleAssignClick(rowData);
            }}
          >
            <img src={Assign} width={25} alt="Dashboard" />
          </button>
        </div>
      ),
    },
    {
      title: "Action",
      field: "actions",
      render: (rowData) => (
        <div>
          <button
            className="action-button"
            onClick={() => {
              handleEditClick(rowData);
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
  }, [filterAsset]);
  const handleAssignClick = (rowData) => {
    setAssetsDetail(rowData);
    setAssignModalOpen(true); // Open the modal
  };
  const handleEditClick = (rowData) => {
    setAssetsDetail(rowData);
    setEditModalOpen(true); // Open the modal
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
      <>
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
              <select
                name="Category"
                id="Category"
                value={formData.Category}
                onChange={handleCategoryChange}
                required
              >
                <option value="Category">Category</option>
                <option value="CPU">CPU</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Mouse">Mouse</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mobile">Mobile</option>
                <option value="Tab">Tab</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="form-group222">
              <select
                name="Location"
                id="Location"
                value={formData.Location}
                onChange={handleLocationChange}
                required
              >
                <option value="Location">Location</option>
                <option value="Office">Office</option>
                <option value="Home">Home</option>
              </select>
            </div>
            <div className="form-group222">
              <select
                name="Status"
                id="Status"
                value={formData.Status}
                onChange={handleStatusChange}
                required
              >
                <option value="Status">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group32">
              <div
                style={{
                  flexDirection: "row",
                  display: "flex",
                  background: "#047EFF",

                  padding: 8,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <GoPlusCircle color="white" />
                <button
                  type="button"
                  style={{
                    marginLeft: 10,
                    textAlign: "center",
                    color: "white",
                    marginTop: 5,
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  Add New Asset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="employee-table2322">
            <MaterialTable
              columns={columns}
              data={memoizedData}
              title={`Total Assets:- ${filterAsset?.length}`}
              options={{
                paging: true,
                search: false,
                filtering: false,

                sorting: true,
                tableLayout: "auto",
                maxBodyHeight: "800px",
                headerStyle: {
                  whiteSpace: "nowrap",
                  padding: "10px",
                },
              }}
              style={{
                overflowX: "auto",
                marginTop: -15,
                overflow: "hidden",
                tableLayout: "auto",
                boxShadow: "none",
                border: "none",
              }}
            />
          </table>
        </div>
      </>
      <AddAssets open={modalOpen} onClose={() => setModalOpen(false)} />
      <UpdateAssets
        open={editmodalOpen}
        onClose={() => setEditModalOpen(false)}
        assetsData={assetsDetail}
      />
      <AssetAssign
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        assetsData={assetsDetail}
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

export default AssetDetails;
