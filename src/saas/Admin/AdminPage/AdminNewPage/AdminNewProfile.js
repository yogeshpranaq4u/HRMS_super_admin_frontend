import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Api, BaseUrl, ImagePath } from "../../../Config/Api";
import { COLOR, FONT, IMAGE } from "../../../Config/Color";
import { useAuth } from "../../../Component/Authentication/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { FaMapMarkerAlt, FaIdBadge } from "react-icons/fa";
import Cropper from "react-easy-crop";

const getCroppedImg = async (imageSrc, crop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};

const AdminNewProfile = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState();
  const { setLoading, logout } = useAuth();
  const [profileData, setProfileData] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
  useEffect(() => {
    if (profileData) {
      setPreviewImage(
        profileData?.image ? ImagePath + profileData?.image : IMAGE?.NOIMAGE
      );
    }
  }, [profileData]);
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = async () => {
    setLoading(true);
    try {
      if (!(selectedImage instanceof File)) {
        throw new Error("Selected image is not a valid File object.");
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result;

        const img = new Image();
        img.src = imageDataUrl;

        img.onload = async () => {
          const croppedImageBlob = await getCroppedImg(
            imageDataUrl,
            croppedAreaPixels
          );

          if (!croppedImageBlob) {
            return;
          }

          const croppedImageFile = new File(
            [croppedImageBlob],
            "cropped-image.jpg",
            {
              type: "image/jpeg",
            }
          );

          const formDataToSend = new FormData();
          formDataToSend.append("employee_id", employeeId);
          formDataToSend.append("image", croppedImageFile);

          const response = await axios.post(
            `${BaseUrl}${Api.UPLOAD_PROFILE_IMAGE}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Handle the API response
          if (response?.data?.authenticated === false) {
            toast.error(response?.data?.mssg[0], {
              position: "top-center",
              autoClose: 1000,
            });
            logout();
          } else if (response?.data?.valid === false) {
            toast.error(response?.data?.mssg[0], {
              position: "top-center",
              autoClose: 1000,
            });
          } else if (response?.data?.success === true) {
            toast.success("Image added successfully", {
              position: "top-center",
              autoClose: 1000,
            });
            setIsDialogOpen(false);
            setSelectedImage(null);
            fetchEmployeProfile();
          } else {
            toast.error(response?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });
          }
        };

        img.onerror = (error) => {
          console.error("Image load error:", error);
          alert("Failed to load the image.");
        };
      };

      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-y-auto h-full">
      <div className="relative w-full h-[170px]">
        <img
          src={require("../../../Assets/NewImage/background.png")}
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 w-[95%] bg-white shadow-sm rounded-lg  p-6">
        <div className="flex items-start space-x-6">
          <div className="relative w-[150px] h-[150px]">
            {profileData?.image == null ? (
              <div className="w-16 h-16 flex justify-center items-center bg-blue-700 text-white font-bold text-xl rounded-md">
                {profileData?.name?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={ImagePath + profileData?.image}
                alt="User"
                className="w-[150px] h-[150px] rounded-md object-cover"
              />
            )}
            <button
              className="absolute bottom-[-5px] right-[-10px] bg-white p-1 rounded-full shadow-md transition flex items-center justify-center"
              onClick={() => console.log("Edit Image Clicked")}
            >
              <img
                src={IMAGE.PEN}
                alt="User"
                style={{ width: "15px", height: "15px" }}
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              />
            </button>
          </div>

          {/* Employee Details */}
          <div className="flex flex-col mt-2">
            <h2
              style={{
                color: COLOR?.BLACK,
                fontSize: "20px",
                fontWeight: "600",
                fontFamily: FONT?.INTER,
                lineHeight: "32px",
              }}
            >
              {profileData?.name}
            </h2>
            <h3
              style={{
                color: COLOR?.BLACK1,
                fontSize: "15px",
                fontWeight: "500",
                lineHeight: "22px",
                fontFamily: FONT?.INTER,
              }}
            >
              {profileData?.designation}
            </h3>
            <h3
              className=" mt-1"
              style={{
                color: COLOR?.GRAY4,
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "22px",
                fontFamily: FONT?.INTER,
              }}
            >
              I am a professional {profileData?.designation}
            </h3>

            {/* Contact Information */}
            <div className="flex flex-wrap mt-4 gap-3">
              <div className="flex items-center px-3 py-1 border border-dashed rounded-lg text-gray-700 space-x-2">
                <img src={IMAGE.CONTACT} className="w-4 h-4" alt="icon" />
                <span
                  style={{
                    fontSize: "14px",
                    fontFamily: FONT.INTER,
                    fontWeight: "500",
                    lineHeight: "22px",
                    marginTop: "5px",
                    color: COLOR.BLACK1,
                  }}
                >
                  {profileData?.employee_code}
                </span>
              </div>
              <div className="flex items-center px-3 py-1 border border-dashed rounded-lg text-gray-700 space-x-2">
                <img src={IMAGE.PHONE} className="w-4 h-4" alt="icon" />
                <span
                  style={{
                    fontSize: "14px",
                    fontFamily: FONT.INTER,
                    fontWeight: "500",
                    lineHeight: "22px",
                    marginTop: "5px",
                    color: COLOR.BLACK1,
                  }}
                >
                  {profileData?.mobile}
                </span>
              </div>
              <div className="flex items-center px-3 py-1 border border-dashed rounded-lg text-gray-700 space-x-2">
                <img src={IMAGE.EMAIL} className="w-4 h-4" alt="icon" />
                <span
                  style={{
                    fontSize: "14px",
                    fontFamily: FONT.INTER,
                    fontWeight: "500",
                    lineHeight: "22px",
                    marginTop: "5px",
                    color: COLOR.BLACK1,
                  }}
                >
                  {profileData?.email}
                </span>
              </div>
              <div className="flex items-center px-3 py-1 border border-dashed rounded-lg text-gray-700 space-x-2">
                <img src={IMAGE.LOCATION} className="w-4 h-4" alt="icon" />
                <span
                  style={{
                    fontSize: "14px",
                    fontFamily: FONT.INTER,
                    fontWeight: "500",
                    lineHeight: "22px",
                    marginTop: "5px",
                    color: COLOR.BLACK1,
                  }}
                >
                  {profileData?.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[300px] left-1/2 transform -translate-x-1/2 w-[95%] bg-white shadow-sm rounded-lg  p-6">
        <h2
          className="mb-4 border-b pb-2"
          style={{
            color: "#2D3142",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: FONT?.INTER,
            lineHeight: "24px",
          }}
        >
          Profile Details
        </h2>

        {/* Profile Details (One Line Per Entry) */}
        <div className="  space-y-3 text-gray-800 pr-2">
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Employee ID
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.employee_code}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Blood Group
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.blood_group}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Date of Birth
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.dob}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Department
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.department}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Experience
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.experience}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Total Experience
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.total_experience}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Date of Joining
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.doj}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Reporting Manager
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.reporting_manager}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Employee Status
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.status}
            </span>
          </div>
          <div className="flex justify-between  pb-2">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Office Location
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.office_location}
            </span>
          </div>
          <div className="flex justify-between ">
            <span
              style={{
                color: "#373A3C",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              Shift Zone
            </span>
            <span
              style={{
                color: "#1A1A1A",
                fontSize: "16px",
                fontWeight: "400",
                fontFamily: FONT?.INTER,
                lineHeight: "24px",
              }}
            >
              {profileData?.shift_timing}
            </span>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h2 style={{ marginBottom: 30 }}>Update Profile Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{}}
            />

            {selectedImage && (
              <div style={{ position: "relative", width: "100%", height: 200 }}>
                <Cropper
                  image={previewImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}

            <div className="dialog-buttons">
              <button className="confirm-btn" onClick={handleImageUpload}>
                Submit Image
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewProfile;
