import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAssetsAssignData, setAssetsData } from "../../Redux/Action";
import { setAssetIndex } from "../../Redux/Action";
const AssetReturn = ({ open, onClose, assetsData }) => {
  const employeeId = sessionStorage.getItem("employeeId");
  const { setLoading, logout } = useAuth();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const [selectedImages, setSelectedImages] = useState([]);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const [profileData, setProfileData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const initialFormData = {
    return_date: "",
    after_description: "",
    image: "",
  };

  const [formData, setFormData] = useState(initialFormData);

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
          // setProfileData(responseData?.data?.data);

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
      setLoading(true)
      try {
        const formDataToSend = new FormData();

        selectedImages?.forEach((image) => {
          formDataToSend?.append("after_image[]", image);
        });
        formDataToSend.append("employee_id", assetsData?.employee_id);
        formDataToSend.append("auto_generated_id", assetsData?.id);
        formDataToSend.append("after_description", formData?.after_description);
        formDataToSend.append("return_date", formData?.return_date);
        formDataToSend.append("return_id", employeeId);

        const response = await axios.post(
          `${BaseUrl}${Api.UPDATE_ASSIGN_ASSETS}`,
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

            setFormData(initialFormData);
            fetchAssignAssets();
            setSelectedImages([]);
      
        
          }
        }
      } catch (error) {
        console.error("API call failed:", error);
        alert("An error occurred. Please try again.");
        setLoading(false);
      } finally {
      }
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
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          dispatch(setAssetsAssignData(responseData?.data?.data));
          fetchAssetsData()
       
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
      
          dispatch(setAssetsData(responseData?.data?.data));
          setLoading(false);
          onClose()
     
   
 
      
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
          Assign Assets Return
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
            <label htmlFor="itemname">Employee Name:</label>
            <input
              type="text"
              name="itemname"
              id="itemname"
              placeholder="Enter item Categories"
              value={assetsData?.employee_name}
              readOnly
            />
          </div>

          <div className="form-groupAsset">
            <label htmlFor="categories">Categories:</label>
            <input
              type="text"
              name="categories"
              id="categories"
              placeholder="Enter item Categories"
              value={assetsData?.categories}
              readOnly
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="model">Model/Brand:</label>
            <input
              type="text"
              name="model"
              id="model"
              placeholder="Enter model or brand"
              value={assetsData?.model}
              readOnly
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="model_number">Model Number:</label>
            <input
              type="text"
              name="model_number"
              id="model_number"
              placeholder="Enter model number"
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
              value={assetsData?.admin_name}
              readOnly
            />
          </div>

          <div className="form-groupAsset1">
            <div style={{ marginTop: 20 }}>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  style={{
                    transform: "scale(1.5)",
                    marginRight: "10px",
                    marginLeft: "5px",
                  }}
                  onChange={handleCheckboxChange}
                />{" "}
                Return item
              </label>
            </div>
          </div>

          <div className="form-groupAsset">
            <label htmlFor="assigned_date">Assigned Date:</label>
            <input
              type="date"
              name="assigned_date"
              id="assigned_date"
              value={assetsData?.assigned_date}
              placeholder="Select date"
              required
            />
          </div>

          <div className="form-groupAsset">
            <label htmlFor="return_date">Return Date:</label>
            <input
              type="date"
              name="return_date"
              id="return_date"
              value={formData?.return_date}
              placeholder="Select date"
              onChange={handleChange}
              required
              readOnly={!isChecked}
              style={{
                backgroundColor: isChecked ? "white" : "#EEF2F7",
                cursor: isChecked ? "pointer" : "not-allowed",
              }}
            />
          </div>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "49%",
              }}
            >
              <label htmlFor="description1"  style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "black",
              }}>Before Description:</label>
              <textarea
                name="description1"
                id="description1"
                placeholder="Enter description"
                value={assetsData?.description}
                readOnly
                rows="1"
                style={{
                  borderRadius: "8px", // Add border radius here
                  padding: 10,
                  minHeight: 70,

                  border: "1px solid #ccc", // Optional: Define a border
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "49%",
                // borderRadius:10,
                // borderWidth:1
                // width: calc(100 % -2),
              }}
            >
              <label htmlFor="after_description"  style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "black",
              }}>After Description:</label>
              <textarea
                name="after_description"
                id="after_description"
                placeholder="Enter description"
                value={formData.after_description}
                onChange={handleChange}
                required
                rows="1"
                style={{
                  borderRadius: "8px", // Add border radius here
                  padding: 10,
                  minHeight: 70,
                  backgroundColor: isChecked ? "white" : "#EEF2F7",
                  border: "1px solid #ccc", // Optional: Define a border
                }}
              />
            </div>
          </div>

          <div className="form-groupAsset">
            <label htmlFor="image">Select item image</label>
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
                disabled={!isChecked}
                style={{
                  backgroundColor: isChecked ? "white" : "#EEF2F7",
                  cursor: isChecked ? "pointer" : "not-allowed",
                  padding: "5px",
                }}
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
              <button
                onClick={() => {
                  onClose();
                  setFormData(initialFormData);
                  setSelectedImages([]);
                }}
              >
                Cancel
              </button>
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
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AssetReturn;
