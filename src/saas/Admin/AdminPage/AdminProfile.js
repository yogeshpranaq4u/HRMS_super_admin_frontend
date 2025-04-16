import React, { useCallback, useEffect, useState } from "react";
import "./AdminProfile.css";

import { CiEdit } from "react-icons/ci";
import { RiAdminLine } from "react-icons/ri";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import { useAuth } from "../../Component/Authentication/AuthContext";
import Profile from "../../Assets/profile.png";
import Cropper from "react-easy-crop";
import { LuContact } from "react-icons/lu";
import Strucutre from "../../Assets/Strucutre.png";
import ProfileCard from "../AdminComponent/ProfileCard";
import { FiPhoneCall } from "react-icons/fi";
import { TbMicrophone2 } from "react-icons/tb";
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

const AdminProfile = () => {
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
        profileData?.image ? ImagePath + profileData?.image : Profile
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
    <div className="mainDiv1">
      <div
        style={{
          marginTop: 20,
          paddingTop: 10,
          textAlign: "left",
          justifyContent: "flex-start",
          display: "flex",
        }}
      >
        <h1>Profile</h1>
      </div>
      <div
        className="employee-card"
        style={{
          backgroundImage: `url(${Strucutre})`,
        }}
      >
        <div className="profile-section">
          <div
            style={{
              position: "relative", // Parent container needs 'relative' positioning
              borderRadius: "5px",
              borderWidth: "2px",
              borderColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              src={
                profileData?.image ? ImagePath + profileData?.image : Profile
              }
              alt="Profile"
              className="profile-picture"
            />
            <div
              style={{
                position: "absolute",
                bottom: "-5px",
                right: "-10px",
                cursor: "pointer",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                borderRadius: "50%",
                padding: "5px",
                backgroundColor: "#fff",
              }}
              onClick={() => setIsDialogOpen(true)}
            >
              <CiEdit style={{ width: "20px", height: "20px" }} />
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
                  <div
                    style={{ position: "relative", width: "100%", height: 200 }}
                  >
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
          <div className="profile-info">
            <h2 className="employee-name">{profileData?.name}</h2>

            <div className="role-badges">
              <div className="role">
                <RiAdminLine style={{ marginRight: "5px" }} size={18} />

                {profileData?.type || "Admin"}
              </div>
              <span className="badge">🏆</span>
              <span className="badge">🎖️</span>
            </div>
          </div>
        </div>

        {/* Right Section: Awards */}
        {/* <div className="awards-section">
          <div className="award">
            🏅 Attendance Awards: <span className="award-count">3</span>
          </div>
          <div className="award">
            🏆 Employee Of The Month: <span className="award-count">1</span>
          </div>
        </div> */}
      </div>
      <div className="mainDashbord123">
        <div
          style={{
            flex: 1,
            display: "flex",
            marginTop: 30,
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "49%", height: '100%' }}>
            <div className="card23">
              <div
                style={{
                  width: "100%",

                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Profile Details
                </h>
                <LuContact size={20} color={"#888888"} />
              </div>

              <ProfileCard title={"Email"} data={profileData?.email} />
              <ProfileCard
                title={"Employee ID"}
                data={profileData?.employee_code}
              />
              <ProfileCard
                title={"Blood Group"}
                data={profileData?.blood_group}
              />
              <ProfileCard title={"Date of Birth"} data={profileData?.dob} />
              <ProfileCard
                title={"Department"}
                data={profileData?.department}
              />
              <ProfileCard
                title={"Designation"}
                data={profileData?.designation}
              />
      
              <ProfileCard
                title={"Experience"}
                data={profileData?.total_experience}
              />
              <ProfileCard title={"Date of Joining"} data={profileData?.doj} />
              <ProfileCard
                title={"Reporting Manager"}
                data={profileData?.reporting_manager}
              />
              <ProfileCard
                title={"Employee Status"}
                data={profileData?.status}
              />
              <ProfileCard
                title={"Office Location"}
                data={profileData?.location}
              />
         
              <ProfileCard
                title={"Shift timing"}
                data={profileData?.shift_timing}
              />
            </div>
          </div>
          <div style={{ width: "49%", height: '100%',  }}>
          <div className="card23" style={{ marginRight: 10 }}>
              <div
                style={{
                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Contact Details
                </h>
                <FiPhoneCall size={20} color={"#888888"} />
              </div>

              <ProfileCard title={"Personal Email"} data={profileData?.email} />
              <ProfileCard title={"Mobile No."} data={profileData?.mobile} />

              <div
                style={{
                  width: "100%",
                  flexDirection: "row",
                  padding: 10,
                  paddingRight: 20,
                  justifyContent: "space-between",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    width: "30%",
                  }}
                >
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>
                    Address
                  </h3>
                </div>
                <div
                  style={{
                    width: "70%",
                    alignItems: "flex-end",
                    justifyContent: "end",
                    display: "flex",
                  }}
                >
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>
                    {profileData?.location}
                  </h3>
                </div>
              </div>
            </div>
            <div className="card2" style={{ marginRight: 10 }}>
              <div
                style={{
                  borderBottomWidth: 2,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <h style={{ color: "#1F2937", fontWeight: "600" }}>About Me</h>
                <TbMicrophone2 size={20} color={"#888888"} />
              </div>
              <div style={{ marginTop: 10, paddingLeft: 10 }}>
                <h2 style={{ fontWeight: "600", color: "#888888" }}>
                  Department
                </h2>
              </div>
              <div style={{ marginTop: 10, paddingLeft: 10 }}>
                <h2
                  style={{
                    fontWeight: "400",
                    color: "#3D3D3D",
                    marginBottom: 10,
                  }}
                >
                  I am a professional {profileData?.designation}
                </h2>
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
