import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Api, BaseUrl } from "../../Config/Api";
import { setAssetsAssignData, setAssetsData } from "../../Redux/Action";

const AssetAssign = ({ open, onClose, assetsData }) => {
  const employeeId = sessionStorage.getItem("employeeId");
const setLoading = () => { };
  const logout = () => { };
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const [selectedImages, setSelectedImages] = useState([]);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const [profileData, setProfileData] = useState([]);

  const initialFormData = {
    description1: "",
    assigned_date: "",
    status: "Active",
    image: "",
  };
  const [formData, setFormData] = useState({
    description1: "",
    assigned_date: "",
    status: "Active",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const fetchEmployeProfile = useCallback(async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_PROFILE}?employee_id=${employeeId}`,
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
          setProfileData(responseData?.data?.data);

          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setLoading(false); // Hide loader after delay
    }
  }, [token, setLoading, logout]);
  useEffect(() => {
    fetchEmployeProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImages == null) {
      toast.error("Please select image", {
        position: "top-center",
        autoClose: 1000,
      });
    } else {
      setLoading(true);
      try {
        const formDataToSend = new FormData();

        selectedImages?.forEach((image) => {
          formDataToSend?.append("image[]", image);
        });
        formDataToSend.append("employee_id", formData?.name);
        formDataToSend.append("assigned_date", formData?.assigned_date);
        formDataToSend.append("description", formData?.description1);
        formDataToSend.append("status", formData?.status);
        formDataToSend.append("itemname", assetsData?.itemname);
        formDataToSend.append("categories", assetsData?.category);
        formDataToSend.append("model_number", assetsData?.model_number);
        formDataToSend.append("model", assetsData?.model_brand);
        formDataToSend.append("serial_number", assetsData?.serial_number);
        formDataToSend.append("assigned_by", employeeId);
        formDataToSend.append("item_remark", assetsData?.description);

        const response = await axios.post(
          `${BaseUrl}${Api.ASSIGN_ASSETS}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.authenticated === false) {
          toast.error(response?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          logout();
          setLoading(false);
        } else {
          if (response?.data?.valid === false) {
            setLoading(false);
            toast.error(response?.data?.mssg[0], {
              position: "top-center",
              autoClose: 1000,
            });
          } else {
            toast.success(response?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });
            setLoading(false);
            fetchAssetsData();
            setFormData(initialFormData);
            setSelectedImages([]);
          }
        }
      } catch (error) {
        console.error("API call failed:", error);
        alert("An error occurred. Please try again.");
        setLoading(false);
      } finally {
        setLoading(true);
      }
    }
  };

  const fetchAssetsData = async () => {
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
          // const employeeData = JSON.parse(
          //   JSON.stringify(responseData.data.data)
          // );
          setLoading(false);
          dispatch(setAssetsData(responseData?.data?.data));
          fetchAssignAssets();
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
        setLoading(false);
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          dispatch(setAssetsAssignData(responseData?.data?.data));
          onClose();
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
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      showCloseIcon={false}
      closeOnOverlayClick={false}
      classNames={{ modal: "custom-modal1" }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          maxWidth: "800px",
          width: "100%",
          margin: "auto",
          paddingRight: 30,
          paddingLeft: 30,
          paddingBottom: 20,
          paddingTop: 20,
          position: "relative",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: 34,
            fontWeight: "700",
            color: "#1A202C",
          }}
        >
          Assets Assign
        </h1>
        <h4
          style={{
            marginTop: 10,
            marginBottom: 20,
            textAlign: "center",
            fontWeight: "400",
            color: "#6C757D",
          }}
        >
          Please fill in the necessary details
        </h4>

        <form onSubmit={handleSubmit} className="form-gridAsset">
          <div className="form-groupAsset">
            <label htmlFor="itemname">Item Name:</label>
            <input
              type="text"
              name="itemname"
              id="itemname"
              placeholder="Enter item Categories"
              value={assetsData?.itemname}
              readOnly
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="category">Employee Name:</label>
            <select
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              <option value="">Select emp name</option>
              {getEmployeeDetails?.map((employee, index) => (
                <option key={index} value={employee?.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-groupAsset">
            <label htmlFor="categories">Categories:</label>
            <input
              type="text"
              name="categories"
              id="categories"
              placeholder="Enter item Categories"
              value={assetsData?.category}
              readOnly
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="model">Model/Brand:</label>
            <input
              type="text"
              name="model"
              id="model"
              placeholder="Enter modal or brand"
              value={assetsData?.model_brand}
              readOnly
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="model_number">Model Number:</label>
            <input
              type="text"
              name="model_number"
              id="model_number"
              placeholder="Enter modal number"
              value={assetsData?.model_number}
              readOnly
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="serial_number">Serial Number:</label>
            <input
              type="text"
              name="serial_number"
              id="serial_number"
              placeholder="Enter serial number"
              value={assetsData?.serial_number}
              readOnly
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="accessories">Assigned By:</label>
            <input
              type="text"
              name="accessories"
              id="accessories"
              placeholder="Enter who assign"
              value={profileData?.name}
              readOnly
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="item_remark">Item remark:</label>
            <input
              type="text"
              name="item_remark"
              id="item_remark"
              placeholder="Remark assign item"
              value={assetsData?.description}
              readOnly
            />
          </div>

          <div className="form-groupAsset">
            <label htmlFor="assigned_date">Assigned Date:</label>
            <input
              type="date"
              name="assigned_date"
              id="assigned_date"
              value={formData.assigned_date}
              placeholder="Select date"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="image">Select image item:</label>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
                required
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: -30,
                }}
              ></div>
            </div>
          </div>
          <div
            style={{
              gap: 10,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              alignSelf: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginLeft: 200,
                }}
              >
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="form-groupAsset1">
            <label
              htmlFor="description1"
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "black",
              }}
            >
              Description:
            </label>
            <textarea
              name="description1"
              id="description1"
              placeholder="Enter description"
              value={formData.description1}
              onChange={handleChange}
              required
              rows="1"
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 100,
                height: 40,

                justifyContent: "center",
                display: "flex",
                alignItems: "center",

                borderRadius: 5,
                color: "#047EFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
         
              <h2 style={{fontSize:18}}onClick={() => {
                  onClose();
                  setFormData(initialFormData);
                  setSelectedImages([]);
                }}>Cancel</h2>
            </div>

            <div
              style={{
                width: 100,
                height: 40,
                background: "#047EFF",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",

                borderRadius: 5,
                color: "white",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              <button type="submit">Create</button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AssetAssign;
