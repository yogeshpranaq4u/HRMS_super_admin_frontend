import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import axios from "axios";
import { setEmployeeAuth } from "../../Redux/Action";
import { useDispatch } from "react-redux";
import { persistor } from "../../Redux/Store";
import Modal from "react-responsive-modal";
import Webcam from "react-webcam";
import useClearSessionStorage from "../../useClearSessionStorage";

const LogoutModal = ({ open, onClose, employeeData }) => {
  const { setLoading } = useAuth();
  const dispatch = useDispatch();

  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const token = sessionStorage.getItem("fcmToken");
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };
  const base64ToBlob = (base64) => {
    const byteCharacters = atob(base64.split(",")[1]); // Decode base64
    const byteNumbers = new Array(byteCharacters.length).fill(0);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "image/jpeg" });
  };

  const submitDetails = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", employeeData?.email);
      formDataToSend.append("type", employeeData?.type);
      if (image) {
        const blobImage = base64ToBlob(image);
        formDataToSend.append("image", blobImage, "captured_image.jpg");
      }

      const response = await axios.post(
        `${BaseUrl}${Api.LOGOUT_WFHLOCATION_IMAGE}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${employeeData?.token}`,
          },
        }
      );
 
      if (response?.data?.valid == false) {
        setLoading(false);
        toast.error(response?.data?.mssg, {
          position: "top-center",
          autoClose: 1500,
        });
      } else if (response?.data?.success == false) {
        setLoading(false);
        toast.error(response?.data?.mssg, {
          position: "top-center",
          autoClose: 1500,
        });
      } else {
        setLoading(false);
        toast.success(response?.data?.mssg, {
          position: "top-center",
          autoClose: 1000,
        });
        dispatch(setEmployeeAuth(false));
        sessionStorage.removeItem("authToken");
        await persistor.flush();
        await persistor.purge();
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      onClose();
      console.error("Login error:", error);
      toast.error("An unexpected error occurred.", {
        position: "top-center",
        autoClose: 1500,
      });
    } finally {
      onClose();
      setLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      showCloseIcon={true}
      closeOnOverlayClick={false}
      classNames={{ modal: "custom-modal1345" }}
    >
      <div className="otp1-modal-container">
        <h2>LogOut Image</h2>
        {image ? (
          <div className="image-container">
            <img src={image} alt="Captured" className="captured-image" />
          </div>
        ) : (
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              height={480}
            />
          </div>
        )}

        <div className="otp1-buttons">
          {image && (
            <button
              className="cancel1-btn"
              onClick={() => {
                setImage(null);
                //   onClose();
              }}
            >
              Re-Take
            </button>
          )}
          <button
            className="verify1-btn"
            onClick={() => {
              if (image) {
                submitDetails();
              } else {
                capture();
              }
            }}
          >
            {image ? "Verify Now" : "Take Picture"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
const LogoutEmployee = () => {
  const { logout, setLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  const [profileData, setProfileData] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    fetchEmployeProfile();
    setShowDialog(true)
  }, []);
  const fetchEmployeProfile = async () => {
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
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          setProfileData(responseData?.data?.data);
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  };
  const employeeLogout = async () => {
    setLoading(true);
    try {
      const responseData = await axios(`${BaseUrl}${Api.LOG_OUT_WFHLOCATION}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: {
          email: profileData?.email,
          type: profileData?.type,
        },
      });
      if (responseData?.data?.valid === false) {
        setLoading(false);
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        setLoading(false);
        toast.success(responseData?.data?.mssg, {
          position: "top-center",
          autoClose: 1000,
        });
   
      } else {
        if (responseData?.data?.mssg === "Logout successfully") {
          setLoading(false);
          toast.success(responseData?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          setShowDialog(false);
          dispatch(setEmployeeAuth(false));
          sessionStorage.removeItem("authToken");
          await persistor.flush();
          await persistor.purge();
          window.location.reload();
          // sessionStorage.clear();
          // useClearSessionStorage();
        } else {
          setShowDialog(false);
          setModalOpen(true);
     
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error, {
        position: "top-center",
        autoClose: 1000,
      });
      // dispatch(setEmployeeAuth(false));
      // sessionStorage.removeItem("authToken");
      // await persistor.flush();
      // await persistor.purge();
      // window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <p>Alert!</p>
            <p>Are you sure? You want to logout?</p>
            <div className="dialog-buttons">
              <button onClick={() => employeeLogout()} className="confirm-btn">
                Yes
              </button>
              <button
                onClick={() => {
                  setShowDialog(false);
                  navigate("/home/dashboard");
                }}
                className="cancel-btn"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <LogoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employeeData={profileData}
      />
    </div>
  );
};

export default LogoutEmployee;
