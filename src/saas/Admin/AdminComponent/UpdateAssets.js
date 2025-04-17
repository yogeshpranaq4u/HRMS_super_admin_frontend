import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { setAssetsData } from "../../Redux/Action";
import { TfiLocationPin } from "react-icons/tfi";

const UpdateAssets = ({ open, onClose, assetsData }) => {
  const employeeId = sessionStorage.getItem("employeeId");
const setLoading = () => { };
  const logout = () => { };
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("authToken");
  const [selectedImages, setSelectedImages] = useState([]);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);

  const initialFormData = {
    itemname: "",
    category: "",
    model_brand: "",
    model_number: "",
    serial_number: "",
    accessories: "",
    // quantity: "",
    item_condition: "",
    entry_date: "",
    location: "",
    description: "",
    status: "Active",
    image: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (assetsData) {
      setFormData({
        itemname: assetsData?.itemname,
        category: assetsData?.category,
        model_brand: assetsData?.model_brand,
        model_number: assetsData?.model_number,
        serial_number: assetsData?.serial_number,
        accessories: assetsData?.accessories,
        // quantity: assetsData?.quantity,
        item_condition: assetsData?.item_condition,
        entry_date: assetsData?.entry_date,
        location: assetsData?.location,
        description: assetsData?.description,
        status: assetsData?.status,
        image: "",
      });
    }
  }, [assetsData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("id", assetsData?.id);
      formDataToSend.append("itemname", formData?.itemname);
      formDataToSend.append("added_by", employeeId);
      formDataToSend.append("category", formData?.category);
      formDataToSend.append("model_brand", formData?.model_brand);
      formDataToSend.append("model_number", formData?.model_number);
      formDataToSend.append("serial_number", formData?.serial_number);
      formDataToSend.append("accessories", formData?.accessories);
      // formDataToSend.append("quantity", formData?.quantity);
      formDataToSend.append("item_condition", formData?.item_condition);
      formDataToSend.append("entry_date", formData?.entry_date);
      formDataToSend.append("location", formData?.location);
      formDataToSend.append("description", formData?.description);
      formDataToSend.append("status", formData?.status);
      if (selectedImages) {
        selectedImages?.forEach((image) => {
          formDataToSend?.append("image[]", image);
        });
      }
      const response = await axios.post(
        `${BaseUrl}${Api.UPDATE_STOCKS}`,
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

          dispatch(setAssetsData(responseData?.data?.data));
          setLoading(false);
          onClose();
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
      classNames={{ modal: "1" }}
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
          Update Stock Entry
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
          Provide the updated details of the Asset.
        </h4>

        <form onSubmit={handleSubmit} className="form-gridAsset">
          <div className="form-groupAsset">
            <label htmlFor="itemname">Item Name:</label>
            <input
              type="text"
              name="itemname"
              id="itemname"
              placeholder="Enter item name"
              value={formData.itemname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Category">Select item category</option>
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
          <div className="form-groupAsset">
            <label htmlFor="model_brand">Model/Brand:</label>
            <input
              type="text"
              name="model_brand"
              id="model_brand"
              placeholder="Enter modal or brand"
              value={formData.model_brand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="model_number">Model Number:</label>
            <input
              type="text"
              name="model_number"
              id="model_number"
              placeholder="Enter modal number"
              value={formData.model_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="serial_number">Serial Number:</label>
            <input
              type="text"
              name="serial_number"
              id="serial_number"
              placeholder="Enter serial number"
              value={formData.serial_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="accessories">Accessories:</label>
            <input
              type="text"
              name="accessories"
              id="accessories"
              placeholder="Enter accessories"
              value={formData.accessories}
              onChange={handleChange}
            />
          </div>
          {/* <div className="form-groupAsset">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="text"
              name="quantity"
              id="quantity"
              value={formData.quantity}
              placeholder="Enter item quantity"
              onChange={handleChange}
              required
            />
          </div> */}

          <div className="form-groupAsset">
            <label htmlFor="item_condition">Condition:</label>
            <select
              name="item_condition"
              id="item_condition"
              value={formData.item_condition}
              onChange={handleChange}
              required
            >
              <option value="condition">Select condition</option>
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          <div className="form-groupAsset">
            <label htmlFor="entry_date">Purchase Date:</label>
            <input
              type="date"
              name="entry_date"
              id="entry_date"
              value={formData.entry_date}
              placeholder="Enter item quantity"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupAsset">
            <label htmlFor="location">Location:</label>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                placeholder="Enter item location"
                onChange={handleChange}
                required
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: -30,
                }}
              >
                <TfiLocationPin size={20} />
              </div>
            </div>
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
              />
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
              background: "red",
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
              htmlFor="description"
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "black",
              }}
            >
              Description:
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="1"
            />
          </div>
          <div
            style={{
              display: "flex",
              width: "50%",
              flexDirection: "column",
            }}
          >
            <label
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "black",
              }}
            >
              Status:
            </label>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                boxShadow: "none",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: 10,
                  boxShadow: "none",
                }}
              >
                <input
                  type="radio"
                  id="status"
                  name="status"
                  value="Active"
                  checked={formData.status === "Active"}
                  onChange={handleChange}
                />
                <label
                  htmlFor="status"
                  style={{ marginLeft: 10, textAlign: "center", marginTop: 5 }}
                >
                  Active
                </label>
              </div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: 30,
                  boxShadow: "none",
                }}
              >
                <input
                  type="radio"
                  id="status"
                  name="status"
                  value="Inactive"
                  onChange={handleChange}
                  checked={formData.status === "Inactive"}
                />
                <label
                  htmlFor="inactive"
                  style={{ marginLeft: 10, textAlign: "center", marginTop: 5 }}
                >
                  Inactive
                </label>
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
              <button type="submit">Update</button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateAssets;
