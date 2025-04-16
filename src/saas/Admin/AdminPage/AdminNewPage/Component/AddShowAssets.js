import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useAuth } from "../../../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Api, BaseUrl } from "../../../../Config/Api";
import { toast } from "react-toastify";
import { setAssetsAssignData, setAssetsData } from "../../../../Redux/Action";
// import { Edit } from "@mui/icons-material";
import { COLOR, IMAGE } from "../../../../Config/Color";
import Assign from "../../../../Assets/assign.png";
import { Table } from "antd";
import { Dialog, DialogContent } from "@material-ui/core";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { IoCaretForwardCircle } from "react-icons/io5";
import AddAssets from "../../../AdminComponent/AddAssets";
import UpdateAssets from "../../../AdminComponent/UpdateAssets";
import AssetAssign from "../../../AdminComponent/AssetAssign";
const AddShowAssets = () => {
  const [query, setQuery] = useState("");
  const token = sessionStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const getAssetesData = useSelector((state) => state.getAssetesData);
  const [filterAsset, setFilterAsset] = useState(getAssetesData);
  const { setLoading, logout } = useAuth();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [assetsDetail, setAssetsDetail] = useState();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [count, setCount] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
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
    setIsDisabled(false)
      setIsFilterApplied(true)
    setFormData({ ...formData, Status: e.target.value });
  };
  const handleLocationChange = (e) => {
    setIsDisabled(false)
    setIsFilterApplied(true)
    setFormData({ ...formData, Location: e.target.value });
  };
  const handleCategoryChange = (e) => {
    setIsDisabled(false)
    setIsFilterApplied(true)
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
const handleClearFilter=()=>{
    setFormData({
        Category: "Category",
        Location: "Location",
        Status: "Status",
      })
      setIsDisabled(true)
      setIsFilterApplied(false)
}
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
      title: "Asset Name",
      dataIndex: "itemname",

      key: "itemname",
      width: 250,
      fixed: "left",

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
      field: "assetName",
      width: 150,
      render: (_, rowData) => {
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
    { title: "Category", dataIndex: "category", width: 100 },
    {
      title: "Brand Name",
      dataIndex: "model_brand",
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
      width: 180,
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
      title: "Condition",
      dataIndex: "item_condition",
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
      title: "Status",
      dataIndex: "status",
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
      title: "Purchase date",
      dataIndex: "entry_date",
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
      title: "Location",
      dataIndex: "location",
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
      title: "Remark",
      dataIndex: "description",
      width: 180,
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
      title: "Assign",
      dataIndex: "assign",
      width: 80,
      render: (_, rowData) => (
        <div>
          <button
            className="action-button"
            onClick={() => {
              handleAssignClick(rowData);
            }}
          >
            <img src={Assign} width={20} alt="Dashboard" />
          </button>
        </div>
      ),
    },
    {
      title: "Action",
      field: "actions",
      width: 80,
      render: (_, rowData) => (
        <div>
          <button
            className="action-button"
            onClick={() => {
              handleEditClick(rowData);
            }}
          >
            <img src={IMAGE.PEN} width={20} alt="Dashboard" />
          </button>
        </div>
      ),
    },
  ];
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
              Category:
            </span>

            <select
              name="Category"
              id="Category"
              value={formData.Category}
              onChange={handleCategoryChange}
              required
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.BLACK,
                lineHeight: "18px",
              }}
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
              Location:
            </span>

            <select
              name="Location"
              id="Location"
              value={formData.Location}
              onChange={handleLocationChange}
              required
              style={{
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: COLOR.BLACK,
                lineHeight: "18px",
              }}
            >
              <option value="Location">Location</option>
              <option value="Office">Office</option>
              <option value="Home">Home</option>{" "}
            </select>
          </div>
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
              Status:
            </span>

            <select
              name="Status"
              id="Status"
              value={formData.Status}
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
              <option value="Status">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
          <button
            onClick={() => {
              setModalOpen(true);
            }}
            className={`px-3 py-1 rounded flex items-center justify-center transition-colors ${"bg-blue-500 text-white hover:bg-blue-600"} `}
            style={{
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "Inter",
              lineHeight: "18px",
            }}
          >
            Add New Asset
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
 \
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
    </div>
  );
};

export default AddShowAssets;
