import React, { useCallback, useEffect, useState } from "react";
import "./Dashbord.css";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import { useAuth } from "../../Component/Authentication/AuthContext";
import Profile from "../../Assets/profile.png";
import Strucutre from "../../Assets/Strucutre.png";
import Cropper from "react-easy-crop";
import { RiAdminLine } from "react-icons/ri";
import { LuContact } from "react-icons/lu";
import ProfileCard from "../../Admin/AdminComponent/ProfileCard";
import { FiPhoneCall } from "react-icons/fi";
import { TbMicrophone2 } from "react-icons/tb";
import { PiClockCountdownLight } from "react-icons/pi";
import Leave from "../../Assets/event_busy.png";
import { IoCalendarOutline } from "react-icons/io5";
import { format } from "date-fns";
import {
  setCustomeDetails,
  setGiftCardShow,
  setLeaveWfhRequest,
} from "../../Redux/Action";
import { useDispatch } from "react-redux";
import Card from "../../Component/Card";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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
const Dashbord = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  const getEmployeeHoliday = useSelector((state) => state.getEmployeeHoliday);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const { setLoading, logout } = useAuth();
  const [profileData, setProfileData] = useState();
  const currentMonth = months[new Date().getMonth()];
  const [leaveData, setLeaveData] = useState([]);
  const [attendanceData, setAttandanceData] = useState([]);
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);
  const [reminderData, setReminderData] = useState([]);
  const [holiDayList, setHolidayList] = useState([]);
  const [leaveWfh, SetLeaveWfh] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const currentDate1 = new Date();
  const month = currentDate1.getMonth() + 1;
  const day = currentDate1.getDate();
  const [modalCardOpen, setModalCardOpen] = useState(false);
  const getGiftCardShow = useSelector((state) => state.getGiftCardShow);
  const [cardType, setCardType] = useState("");
  const [cardData, setCardData] = useState([]);
  const dispatch = useDispatch();
  const currentMonthName = new Date(0, currentMonthIndex).toLocaleString(
    "default",
    { month: "long" }
  );
  const [formData, setFormData] = useState({
    leaveYear: currentYear.toString(),
    leaveMonth: currentMonthName,
  });
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
          fetchEmployeeAttendance(responseData?.data?.data?.id);
          getEmployeeLeave(responseData?.data?.data?.id);

          const date = new Date(responseData?.data?.data?.dob);
          const month1 = date.getMonth() + 1;
          const day1 = date.getDate();
          const date1 = new Date(responseData?.data?.data?.doj);
          const month2 = date1.getMonth() + 1;
          const day2 = date1.getDate();

          if (month1 === month && day1 === day && getGiftCardShow == false) {
            setCardType("BIRTHDAY");
            setCardData(responseData?.data?.data);
            openGift();
          } else if (
            month2 === month &&
            day2 === day &&
            getGiftCardShow == false
          ) {
            setCardType("Work Anniversary");
            setCardData(responseData?.data?.data);
            openGift();
          }
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

  const fetchCustomerDetails = useCallback(async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_CUSTOMER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        // logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          dispatch(setCustomeDetails(responseData?.data?.data));

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
  useEffect(() => {
    fetchEmployeProfile();
    getReminderDetails();
    getHolidayList();
    getEmployeeLeaveWfhrequest();
    // fetchCustomerDetails();
    getAllWfhLeaveData();
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

  const handleImageUpload = async () => {
    try {
      if (!(selectedImage instanceof File)) {
        throw new Error("Selected image is not a valid File object.");
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);
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
            setLoading(false);
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
      setLoading(false);
    } finally {
    }
  };
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getEmployeeLeave = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_LEAVE}?employee_id=${data}`,
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
          setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          setLeaveData(responseData?.data?.leaves);

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

  const fetchEmployeeAttendance = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_ATTENDANCE}?employee_id=${employeeId}`,
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
          setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          setAttandanceData(responseData?.data?.data);
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
  const getLeaveCount = () => {
    let leavecount = leaveData?.filter((data) => {
      return data?.month == currentMonth;
    });
    const totalDays = leavecount?.reduce((sum, item) => {
      return sum + (item?.total_days || 0);
    }, 0);

    return totalDays; // Return the total
  };

  useEffect(() => {
    const filterLeaveData = () => {
      const allData = attendanceData?.filter((leave) => {
        return (
          leave.year === formData.leaveYear &&
          leave.month === formData.leaveMonth
        );
      });
      setFilteredLeaveData(allData);
    };

    filterLeaveData();
  }, [formData.leaveYear, formData.leaveMonth, attendanceData]);

  const getTotalLate = (data) => {
    const totalLate = data?.filter(
      (entry) => entry?.attendance_status == "Late"
    )?.length;
    return totalLate;
  };

  const getReminderDetails = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.ADMIN_REMINDER}`, {
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
        setReminderData(responseData?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getHolidayList = async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_HOLIDAY}`, {
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
      } else if (responseData?.data?.valid === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        setHolidayList(responseData?.data?.data);
        getHolidatData(responseData?.data?.data);
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getAllWfhLeaveData = async () => {
    setLoading(true);
    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_WFHLEAVE_DATA}`,
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
      } else if (responseData?.data?.valid === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        SetLeaveWfh(responseData?.data?.data);
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openGift = () => {
    setModalCardOpen(true);
  };
  const getHolidatData = (data) => {
    const todayHoliday = data.find((holiday) => holiday.date === currentDate);

    if (todayHoliday != undefined && getGiftCardShow == false) {
      setCardType(todayHoliday?.holiday_name);
      setCardData(todayHoliday);
      openGift();
    }
  };
  const getEmployeeLeaveWfhrequest = async () => {
    // setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMP_LEAVEREQUEST}?employee_id=${employeeId}`,
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
          setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          dispatch(setLeaveWfhRequest(responseData?.data?.data));

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
    <div className="mainDivprofile">
      <div
        style={{
          // marginTop: 20,
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
      </div>
      <div style={{ width: "100%", height: 20 }}></div>
      <div className="mainDashbord">
        <div
          style={{
            // width: "100%",
            flex: 1,
            display: "flex",

            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "49%", height: "100%" }}>
            <div className="card2">
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
                data={profileData?.experience}
              />
              {profileData?.experience == "Experienced" && (
                <ProfileCard
                  title={"Total Experience"}
                  data={profileData?.total_experience}
                />
              )}

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
                data={profileData?.office_location}
              />
              <ProfileCard
                title={"Shift Zone"}
                data={profileData?.shift_timing}
              />
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
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Leaves This Month
                </h>

                <img
                  src={Leave}
                  alt="Profile"
                  style={{
                    width: "20px",
                    height: "20px",
                    fill: "#888888",
                  }}
                />
              </div>
              <ProfileCard title={"Leaves"} data={getLeaveCount()} />
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
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Late This Month
                </h>
                <PiClockCountdownLight size={20} color={"#888888"} />
              </div>
              <ProfileCard
                title={"Total Lates"}
                data={getTotalLate(filteredLeaveData)}
              />
            </div>
          </div>
          <div style={{ width: "49%", height: "100%" }}>
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

                  paddingLeft: 10,

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
                    marginRight: 15,
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
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Celebration This Month
                </h>
                <LiaBirthdayCakeSolid size={20} color={"#888888"} />
              </div>
              <div>
                {reminderData?.current_events?.length > 0 ||
                reminderData?.upcoming_events?.length > 0 ? (
                  (() => {
                    // Combine current events and upcoming events, then filter for birthdays in the current month
                    const birthdayItems = [
                      ...(reminderData?.current_events || []),
                      ...(reminderData?.upcoming_events || []),
                    ].filter((item) => {
                      if (
                        item.type !== "Birthday" &&
                        item.type !== "Anniversary"
                      )
                        return false;

                      const itemDate = new Date(item.date);
                      const currentMonth = new Date().getMonth(); // Get current month (0-indexed)
                      const currentYear = new Date().getFullYear(); // Get current year

                      // Check if the item's month and year match the current month and year
                      return (
                        itemDate.getMonth() === currentMonth &&
                        itemDate.getFullYear() === currentYear
                      );
                    });

                    return birthdayItems.length > 0 ? (
                      birthdayItems.map((birthdayItem, index) => {
                        const date = new Date(birthdayItem.date);
                        const day = new Intl.DateTimeFormat("en-US", {
                          weekday: "long",
                        }).format(date);

                        return (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              padding: 10,
                              paddingRight: 20,
                              justifyContent: "space-between",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "40%",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                display: "flex",
                              }}
                            >
                              <h3
                                style={{
                                  fontWeight: "600",
                                  color: "#888888",
                                }}
                              >
                                {/* {birthdayItem?.name} */}
                                {birthdayItem?.name} ({birthdayItem.type})
                              </h3>
                            </div>
                            <div
                              style={{
                                width: "30%",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                display: "flex",
                              }}
                            >
                              <span
                                style={{
                                  color: "#115E59",
                                  fontWeight: "600",
                                }}
                              >
                                {birthdayItem?.date}
                              </span>
                            </div>

                            <div
                              style={{
                                width: "30%",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                display: "flex",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  color: "#115E59",
                                  alignItems: "center",
                                  fontWeight: "600",
                                }}
                              >
                                {day}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#888888",
                          fontWeight: "600",
                          marginTop: "20px",
                          marginBottom: "50px",
                        }}
                      >
                        No birthdays this month.
                      </div>
                    );
                  })()
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888888",
                      fontWeight: "600",
                      marginTop: "20px",
                    }}
                  >
                    No events this month.
                  </div>
                )}
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
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Holidays This Month
                </h>
                <IoCalendarOutline size={20} color={"#888888"} />
              </div>

              <div>
                <div>
                  {holiDayList && holiDayList.length > 0 ? (
                    (() => {
                      const currentMonth = new Date().getMonth(); // Current month (0-indexed)
                      const currentYear = new Date().getFullYear(); // Current year

                      const filteredHolidays = holiDayList.filter((item) => {
                        const holidayDate = new Date(item.date);
                        return (
                          holidayDate.getMonth() === currentMonth &&
                          holidayDate.getFullYear() === currentYear
                        );
                      });

                      return filteredHolidays.length > 0 ? (
                        filteredHolidays.map((holidayItem, index) => {
                          const date = new Date(holidayItem.date);
                          const day = new Intl.DateTimeFormat("en-US", {
                            weekday: "long",
                          }).format(date);

                          return (
                            <div
                              key={index}
                              style={{
                                width: "100%",
                                flexDirection: "row",
                                padding: 10,
                                paddingRight: 20,
                                justifyContent: "space-between",
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px",
                              }}
                            >
                              <div style={{ width: "40%" }}>
                                <h3
                                  style={{
                                    fontWeight: "600",
                                    color: "#888888",
                                  }}
                                >
                                  {holidayItem?.holiday_name}
                                </h3>
                              </div>
                              <div
                                style={{
                                  width: "30%",
                                  alignItems: "flex-end",
                                  justifyContent: "flex-end",
                                  display: "flex",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#115E59",
                                    fontWeight: "600",
                                  }}
                                >
                                  {holidayItem?.date}
                                </span>
                              </div>
                              <div
                                style={{
                                  width: "30%",
                                  alignItems: "flex-end",
                                  justifyContent: "flex-end",
                                  display: "flex",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    color: "#115E59",
                                    alignItems: "center",
                                    fontWeight: "600",
                                  }}
                                >
                                  {day}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            marginBottom: "50px",
                          }}
                        >
                          No holidays this month.
                        </div>
                      );
                    })()
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#888888",
                        fontWeight: "600",
                        marginTop: "20px",
                        marginBottom: "50px",
                      }}
                    >
                      No holiday data available.
                    </div>
                  )}
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
                <h style={{ color: "#1F2937", fontWeight: "600" }}>
                  Leave/WFH (Today)
                </h>
                <img
                  src={Leave}
                  alt="Profile"
                  style={{
                    width: "20px",
                    height: "20px",
                    fill: "#888888",
                  }}
                />
              </div>

              <div>
                <div>
                  {leaveWfh && leaveWfh?.length > 0 ? (
                    <>
                      {leaveWfh.map((holidayItem, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              padding: 10,
                              paddingRight: 20,
                              justifyContent: "space-between",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <div style={{ width: "40%" }}>
                              <h3
                                style={{
                                  fontWeight: "600",
                                  color: "#888888",
                                }}
                              >
                                {holidayItem?.name}
                              </h3>
                            </div>
                            <div
                              style={{
                                width: "30%",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                display: "flex",
                              }}
                            >
                              <span
                                style={{
                                  color: "#115E59",
                                  fontWeight: "600",
                                }}
                              >
                                {holidayItem?.date}
                              </span>
                            </div>
                            <div
                              style={{
                                width: "30%",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                display: "flex",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  color: "#115E59",
                                  alignItems: "center",
                                  fontWeight: "600",
                                }}
                              >
                                {holidayItem?.attendance_status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#888888",
                        fontWeight: "600",
                        marginTop: "20px",
                        marginBottom: "50px",
                      }}
                    >
                      No Leave/WFH data available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Card
          open={modalCardOpen}
          onClose={() => {
            setModalCardOpen(false);
            dispatch(setGiftCardShow(true));
          }}
          data={cardData}
          type={cardType}
        />
      </div>
    </div>
  );
};

export default Dashbord;
