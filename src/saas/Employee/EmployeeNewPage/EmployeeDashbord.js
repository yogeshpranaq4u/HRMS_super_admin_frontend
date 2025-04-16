import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../Component/Authentication/AuthContext";
import Profile from "../../Assets/profile.png";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import {
  setCustomeDetails,
  setEmployeeHoliday,
  setGiftCardShow,
  setLeaveWfhRequest,
  setUserDetails,
} from "../../Redux/Action";
import { COLOR, FONT, IMAGE } from "../../Config/Color";
import Leave from "../../Assets/event_busy.png";
import Cropper from "react-easy-crop";
import {
  FaBirthdayCake,
  FaCalendarTimes,
  FaChartBar,
  FaUser,
} from "react-icons/fa";
import Card from "../../Component/Card";
import { ImageUrl } from "../../Config/Image";
import RootLayout from "../RootLayout";
import MainLayout from "../../../layouts/MainLayout";
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
const EmployeeDashbord = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  const getEmployeeHoliday = useSelector((state) => state.getEmployeeHoliday);
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // const { setLoading, logout } = useAuth();
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
    // setLoading(true);

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
        // logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          // setLoading(false);
        } else {
          setProfileData(responseData?.data?.data);
          fetchEmployeeAttendance(responseData?.data?.data?.id);
          getEmployeeLeave(responseData?.data?.data?.id);

          const date = new Date(responseData?.data?.data?.dob);
          const month1 = date.toLocaleString("default", { month: "long" });
          const day1 = date.getDate();
          const date1 = new Date(responseData?.data?.data?.doj);
          const month2 = date1.toLocaleString("default", { month: "long" });
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
          // setLoading(false);
        }
      }
    } catch (error) {
      // setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      // setLoading(false); // Hide loader after delay
    }
  }, [token]);

  const fetchCustomerDetails = useCallback(async () => {
    // setLoading(true);

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
          // setLoading(false);
        } else {
          dispatch(setCustomeDetails(responseData?.data?.data));

          // setLoading(false);
        }
      }
    } catch (error) {
      // setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
    }
  }, [token, dispatch]);
  useEffect(() => {
    fetchEmployeProfile();
    getReminderDetails();
    getHolidayList();
    getEmployeeLeaveWfhrequest();
    // fetchCustomerDetails();
    // fetchEmployees();
    getAllWfhLeaveData();
  }, []);
  useEffect(() => {
    if (profileData) {
      setPreviewImage(
        profileData?.image ? ImagePath + profileData?.image : Profile
      );
    }
  }, [profileData]);
  const fetchEmployees = async () => {
    // setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_EMPLOYEE}`, {
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
          // setLoading(false);
        } else {
          const employeeData = JSON.parse(
            JSON.stringify(responseData.data.data)
          );
          dispatch(setUserDetails(responseData?.data?.data));

          // setLoading(false);
        }
      }
    } catch (error) {
      // setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
    }
  };
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
        // setLoading(true);
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
            // logout();
          } else if (response?.data?.valid === false) {
            toast.error(response?.data?.mssg[0], {
              position: "top-center",
              autoClose: 1000,
            });
            // setLoading(false);
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
      // setLoading(false);
    } finally {
    }
  };
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getEmployeeLeave = async (data) => {
    // setLoading(true);

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
        // logout();
      } else {
        if (responseData?.data?.valid === false) {
          // setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          setLeaveData(responseData?.data?.leaves);

          // setLoading(false);
        }
      }
    } catch (error) {
      // setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
    }
  };

  const fetchEmployeeAttendance = async (data) => {
    // setLoading(true);

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
        // logout();
      } else {
        if (responseData?.data?.valid === false) {
          // setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          setAttandanceData(responseData?.data?.data);
          // setLoading(false);
        }
      }
    } catch (error) {
      // setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
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
    // setLoading(true);

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
        // logout();
      } else {
        setReminderData(responseData?.data);
        // setLoading(false);
      }
    } catch (error) {
      // setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
    }
  };
  const getHolidayList = async () => {
    // setLoading(true);
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
        // logout();
      } else if (responseData?.data?.valid === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        setHolidayList(responseData?.data?.data);
        getHolidatData(responseData?.data?.data);
        dispatch(setEmployeeHoliday(responseData?.data?.data));
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
    }
  };
  const getAllWfhLeaveData = async () => {
    // setLoading(true);
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
        // logout();
      } else if (responseData?.data?.valid === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        SetLeaveWfh(responseData?.data);
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
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
        // logout();
      } else {
        if (responseData?.data?.valid === false) {
          // setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          dispatch(setLeaveWfhRequest(responseData?.data?.data));

        }
      }
    } catch (error) {
      // setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <div className=" w-full overflow-y-auto h-full">
            <div className="relative w-full h-[170px]">
              <img
                src="/assets/Assets/NewImage/background.png"
                alt="background"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-[80px] left-1/2 transform -translate-x-1/2 w-[95%] bg-white shadow-sm rounded-lg  p-6">
              <div className="flex items-start space-x-6">
                <div className="relative w-[150px] h-[150px]">
                  {profileData?.image == null ? (
                    <div className="w-full h-full flex justify-center items-center bg-blue-700 text-white font-bold text-2xl rounded-md">
                      {profileData?.name?.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <img
                      src={ImagePath + profileData?.image}
                      alt="User"
                      className="w-full h-full rounded-md object-cover"
                    />
                  )}

                  {/* Edit Button at Bottom-Right */}
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

                  <div className="flex flex-wrap mt-4 gap-3">
                    <div className="flex items-center px-3 py-1 border border-dashed rounded-lg text-gray-700 space-x-2">
                      <img src={IMAGE.CONTACT} className="w-4 h-4" alt="icon" />
                      <span
                        style={{
                          fontSize: "14px",
                          fontFamily: FONT.INTER,
                          fontWeight: "500",
                          lineHeight: "22px",
                          color: COLOR.GRAY4,
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

                          color: COLOR.GRAY4,
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

                          color: COLOR.GRAY4,
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

                          color: COLOR.GRAY4,
                        }}
                      >
                        {profileData?.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-[335px] left-1/2 transform -translate-x-1/2 w-[94%] rounded-lg p-0 flex justify-between space-x-4 ">
              {/* Card Wrapper */}
              {[
                {
                  title: "Total Employees",
                  img: ImageUrl.EMPLOYEE,
                  count: leaveWfh?.data_employee?.total_emp,
                },
                {
                  title: "Total Gurgaon Office",
                  img: IMAGE?.GURUGRAM,
                  count: leaveWfh?.data_employee?.total_emp_gurugram,
                },
                {
                  title: "Total Noida Office",
                  img: IMAGE?.NOIDA,
                  count: leaveWfh?.data_employee?.total_emp_noida,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center w-1/3 h-[80px] bg-white shadow-md rounded-lg p-4"
                >
                  {/* Icon */}
                  <div className="mr-4">
                    <img src={item.img} alt={item.title} className="w-10 h-10" />
                  </div>

                  {/* Text */}
                  <div>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: "Inter",
                        color: COLOR.BLACK,
                      }}
                    >
                      {item.count || 0}
                    </p>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontFamily: "Inter",
                        color: COLOR.BLACK1,
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
              }}
              className="absolute top-[450px]  left-1/2  transform -translate-x-1/2 verflow-y-auto min-w-0"
            >
              <div style={{ width: "49%", marginBottom: "25px" }}>
                <div className="bg-white shadow-md rounded-lg p-6 w-full h-[550px] overflow-y-auto min-w-0">
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2
                      style={{
                        color: COLOR?.BLACK2,
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: FONT?.INTER,
                        lineHeight: "24px",
                      }}
                    >
                      Profile Details
                    </h2>
                    <img src={IMAGE.PROFILE} className="w-7 h-7" alt="icon" />
                  </div>

                  <div className="grid grid-cols-1 gap-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Employee ID
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.employee_code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Blood Group
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.blood_group}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Date of Birth
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.dob}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Department
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Designation
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.designation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Experience
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.experience}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Total Experience
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.total_experience}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Date of Joining
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.doj}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Reporting Manager
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.reporting_manager}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Employee Status
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Office Location
                      </strong>{" "}
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.office_location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#373A3C",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        Shift Zone
                      </strong>
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "24px",
                          fontFamily: FONT?.INTER,
                        }}
                      >
                        {profileData?.shift_timing}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 mt-[20px]">
                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <h3
                      style={{
                        color: COLOR?.BLACK2,
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: FONT?.INTER,
                        lineHeight: "24px",
                      }}
                    >
                      Leave This Month
                    </h3>

                    <img
                      src={IMAGE.LEAVE}
                      alt="Profile"
                      style={{
                        width: "25px",
                        height: "25px",
                        fill: "#888888",
                      }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <strong
                      style={{
                        color: "#2D3142",
                        fontSize: "16px",
                        fontWeight: "400",
                        fontFamily: FONT?.INTER,
                      }}
                    >
                      Leave:
                    </strong>{" "}
                    <span
                      style={{
                        color: "#1A1A1A",
                        fontSize: "16px",
                        fontWeight: "400",
                        fontFamily: FONT?.INTER,
                        marginRight: 8,
                      }}
                    >
                      {getLeaveCount()}
                    </span>
                  </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 mt-[20px]">
                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <h3
                      style={{
                        color: COLOR?.BLACK2,
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: FONT?.INTER,
                        lineHeight: "24px",
                      }}
                    >
                      Late This Month
                    </h3>
                    <img
                      src={IMAGE.LATE}
                      alt="Profile"
                      style={{
                        width: "25px",
                        height: "25px",
                        fill: "#888888",
                      }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <strong
                      style={{
                        color: "#2D3142",
                        fontSize: "16px",
                        fontWeight: "400",
                        fontFamily: FONT?.INTER,
                      }}
                    >
                      Total Late:
                    </strong>
                    <span
                      style={{
                        color: "#1A1A1A",
                        fontSize: "16px",
                        fontWeight: "400",
                        fontFamily: FONT?.INTER,
                        // display:'flex',
                        marginRight: 8,
                      }}
                    >
                      {getTotalLate(filteredLeaveData)}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ width: "49%", marginBottom: "25px" }}>
                <div className="flex flex-col gap-4 w-full  min-w-0">
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center border-b pb-2 mb-3">
                      <h3
                        style={{
                          color: "#2D3142",
                          fontSize: "16px",
                          fontWeight: "600",
                          fontFamily: FONT?.INTER,
                          lineHeight: "24px",
                        }}
                      >
                        Today Active Employees
                      </h3>
                      <img

                        src={IMAGE.CURRENT}
                        alt="Profile"
                        style={{
                          width: "25px",
                          height: "25px",
                          fill: "#888888",
                        }}
                      />
                    </div>

                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#2D3142",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "20px",
                          fontFamily: FONT?.INTER,
                          marginTop: "12px",
                        }}
                      >
                        <span style={{ color: "#2D3142", marginRight: "10px" }}>
                          ●
                        </span>
                        Total Active
                      </strong>
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "20px",
                          fontFamily: FONT?.INTER,
                          marginRight: 8,
                          marginTop: "12px",
                        }}
                      >
                        {/* {leaveWfh?.data_attendance?.total_gurugram_present +
                    leaveWfh?.data_attendance?.total_noida_present +
                    leaveWfh?.data_attendance?.total_wfh} */}
                        {(leaveWfh?.data_attendance?.total_gurugram_present ?? 0) +
                          (leaveWfh?.data_attendance?.total_noida_present ?? 0) +
                          (leaveWfh?.data_attendance?.total_wfh ?? 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#2D3142",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "20px",
                          fontFamily: FONT?.INTER,
                          marginTop: "12px",
                        }}
                      >
                        <span style={{ color: "#2D3142", marginRight: "10px" }}>
                          ●
                        </span>
                        Gurgaon Office
                      </strong>
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "20px",
                          fontFamily: FONT?.INTER,
                          marginRight: 8,
                          marginTop: "12px",
                        }}
                      >
                        {leaveWfh?.data_attendance?.total_gurugram_present}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#2D3142",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "20px",
                          fontFamily: FONT?.INTER,
                          marginTop: "12px",
                        }}
                      >
                        <span style={{ color: "#2D3142", marginRight: "10px" }}>
                          ●
                        </span>
                        Noida Office
                      </strong>
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "20px",
                          fontFamily: FONT?.INTER,
                          marginRight: 8,
                          marginTop: "12px",
                        }}
                      >
                        {leaveWfh?.data_attendance?.total_noida_present}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong
                        style={{
                          color: "#2D3142",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "20px",
                          fontFamily: FONT?.INTER,
                          marginTop: "12px",
                        }}
                      >
                        <span style={{ color: "#2D3142", marginRight: "10px" }}>
                          ●
                        </span>
                        WFH
                      </strong>
                      <span
                        style={{
                          color: "#1A1A1A",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "20px",
                          fontFamily: FONT?.INTER,
                          marginRight: 8,
                          marginTop: "12px",
                        }}
                      >
                        {leaveWfh?.data_attendance?.total_wfh}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center border-b pb-2 mb-3">
                      <h3
                        style={{
                          color: "#2D3142",
                          fontSize: "16px",
                          fontWeight: "600",
                          fontFamily: FONT?.INTER,
                          lineHeight: "24px",
                        }}
                      >
                        Celebration This Month
                      </h3>
                      <img
                        src={IMAGE.CAKE}
                        alt="Profile"
                        style={{
                          width: "25px",
                          height: "25px",
                          fill: "#888888",
                        }}
                      />
                    </div>
                    <div className="  h-[150px] overflow-y-auto min-w-0">
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
                                    padding: 5,
                                    paddingRight: 20,
                                    justifyContent: "space-between",
                                    display: "flex",
                                    alignItems: "center",
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
                                        color: "#2D3142",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        fontFamily: FONT?.INTER,
                                        marginTop: "12px",
                                        lineHeight: "20px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "#2D3142",
                                          marginRight: "10px",
                                        }}
                                      >
                                        ●
                                      </span>
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
                                        color: "#2D3142",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        fontFamily: FONT?.INTER,
                                        marginTop: "12px",
                                        lineHeight: "20px",
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
                                        color: "#2D3142",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        fontFamily: FONT?.INTER,
                                        marginTop: "12px",
                                        lineHeight: "20px",
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
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No events this month.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center border-b pb-2 mb-3">
                      <h3
                        style={{
                          color: "#2D3142",
                          fontSize: "16px",
                          fontWeight: "600",
                          fontFamily: FONT?.INTER,
                          lineHeight: "24px",
                        }}
                      >
                        Holiday's This Month
                      </h3>

                      <img
                        src={ImageUrl.CALENDER1}
                        alt="Profile"
                        style={{
                          width: "25px",
                          height: "25px",
                          fill: "#888888",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "155px",
                        alignSelf: "center",
                        padding: "10px",
                        overflowY: "auto", // Makes it scrollable
                      }}
                    >
                      {getEmployeeHoliday && getEmployeeHoliday?.length > 0 ? (
                        (() => {
                          const currentMonth = new Date().getMonth();
                          const currentYear = new Date().getFullYear();

                          const filteredHolidays = getEmployeeHoliday.filter(
                            (item) => {
                              const holidayDate = new Date(item.date);
                              return (
                                holidayDate.getMonth() === currentMonth &&
                                holidayDate.getFullYear() === currentYear
                              );
                            }
                          );

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
                                    padding: 5,
                                    paddingRight: 20,
                                    justifyContent: "space-between",
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <div style={{ width: "40%" }}>
                                    <div style={{ display: "flex" }}>
                                      <span
                                        style={{
                                          color: "#2D3142",
                                          marginRight: "10px",
                                        }}
                                      >
                                        ●
                                      </span>
                                      <h3
                                        // style={{
                                        //   marginLeft: "10px",
                                        //   fontWeight: "600",
                                        //   color: COLOR.BLACK2,
                                        //   fontSize: "14px",
                                        //   fontFamily: "Inter",
                                        // }}
                                        style={{
                                          color: "#2D3142",
                                          fontSize: "14px",
                                          fontWeight: "500",
                                          fontFamily: FONT?.INTER,

                                          lineHeight: "20px",
                                        }}
                                      >
                                        {holidayItem?.holiday_name}
                                      </h3>
                                    </div>
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
                                        color: "#2D3142",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        fontFamily: FONT?.INTER,

                                        lineHeight: "20px",
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
                                        color: "#2D3142",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        fontFamily: FONT?.INTER,

                                        lineHeight: "20px",
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
                                display: "flex", // Add this line
                                flexDirection: "column", // Add this line to stack items vertically
                                color: "#888888",
                                fontWeight: "600",
                                marginTop: "20px",
                                justifyContent: "center",
                                alignItems: "center",
                                // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                              }}
                            >
                              <img
                                src={ImageUrl.NODATA}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                }}
                              />
                              <p
                                style={{
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  fontFamily: "Inter",
                                  color: COLOR.GRAY1,
                                }}
                              >
                                No holiday this month.
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        <div
                          style={{
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No holiday this month.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center border-b pb-2 mb-5">
                      <h3
                        style={{
                          color: "#2D3142",
                          fontSize: "16px",
                          fontWeight: "600",
                          fontFamily: FONT?.INTER,
                          lineHeight: "24px",
                        }}
                      >
                        Leave/WFH (Today)
                      </h3>

                      <img
                        src={IMAGE.LEAVE}
                        alt="Profile"
                        style={{
                          width: "25px",
                          height: "25px",
                          fill: "#888888",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "155px",
                        alignSelf: "center",
                        padding: "10px",
                        overflowY: "auto", // Makes it scrollable
                      }}
                    >
                      {leaveWfh?.data && leaveWfh?.data?.length > 0 ? (
                        <>
                          {leaveWfh?.data?.map((holidayItem, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  width: "100%",
                                  flexDirection: "row",
                                  padding: 5,
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
                                      color: "#2D3142",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                      fontFamily: FONT?.INTER,

                                      lineHeight: "20px",
                                    }}
                                  >
                                    {holidayItem?.name}
                                  </h3>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#E6F2FF",
                                    padding: "5px 20px",
                                    borderRadius: 20,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      background: "#047EFF",
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "#047EFF",
                                      fontWeight: "500",
                                      marginLeft: 10,
                                      marginTop: 3,
                                      fontSize: "14px",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    {holidayItem?.attendance_status}
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
                                      color: "#2D3142",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                      fontFamily: FONT?.INTER,

                                      lineHeight: "20px",
                                    }}
                                  >
                                    {holidayItem?.date}
                                    {holidayItem?.date &&
                                      ` (${new Date(
                                        holidayItem.date
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                      })})`}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div
                          style={{
                            display: "flex", // Add this line
                            flexDirection: "column", // Add this line to stack items vertically
                            color: "#888888",
                            fontWeight: "600",
                            marginTop: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh", // Optional: Ensure the div takes the full height of the viewport
                          }}
                        >
                          <img
                            src={ImageUrl.NODATA}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              fontFamily: "Inter",
                              color: COLOR.GRAY1,
                            }}
                          >
                            No Leave/WFH data available.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {isDialogOpen && (
              <div
                className="dialog-backdrop"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1000,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <div
                  className="dialog"
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1001,
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h2 style={{ marginBottom: 30 }}>Update Profile Image</h2>
                  <input type="file" accept="image/*" onChange={handleImageSelect} />
                  {selectedImage && (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: 200,
                        zIndex: 1002,
                      }}
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
      </div>
    </MainLayout>
  );
};

export default EmployeeDashbord;
