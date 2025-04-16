import React, { useRef, useState } from "react";
import Modal from "react-responsive-modal";
import Webcam from "react-webcam";
import "../Component/WfhVerification.css";
import { useAuth } from "./Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../Config/Api";
import { toast } from "react-toastify";
import { setEmployeeAllDetails, setEmployeeAuth } from "../Redux/Action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const WfhVerification = ({ open, onClose, employeeData }) => {
 
  // const { setLoading } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    // setLoading(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append(
        "email",
        employeeData?.username + "@cvinfotech.com"
      );
      formDataToSend.append("password", employeeData?.password);
      formDataToSend.append("type", employeeData?.role);
      formDataToSend.append("fcm_token", token);

      if (image) {
        const blobImage = base64ToBlob(image);
        formDataToSend.append("image", blobImage, "captured_image.jpg"); // Append image to formDataToSend
      }

      const response = await axios.post(
        `${BaseUrl}${Api.LOGIN_WFH}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${employeeData?.token}`,
          },
        }
      );

      if (response?.data?.valid == false) {
        // setLoading(false);
        toast.error(response?.data?.mssg, {
          position: "top-center",
          autoClose: 1500,
        });
      } else if (response?.data?.success == false) {
        // setLoading(false);
        toast.error(response?.data?.mssg, {
          position: "top-center",
          autoClose: 1500,
        });
      } else {
        // setLoading(false);
        setImage(null);
        const token = response?.data?.token;
        sessionStorage.setItem("authToken", token);
        dispatch(setEmployeeAuth(true));
        dispatch(setEmployeeAllDetails(response?.data));
        sessionStorage.setItem("employeeId", response?.data?.id);
        toast.success(response?.data?.mssg, {
          position: "top-center",
          autoClose: 1500,
        });
        navigate("/home/dashboard");
      }
    } catch (error) {
      // setLoading(false);
      onClose()
      console.error("Login error:", error);
      toast.error("An unexpected error occurred.", {
        position: "top-center",
        autoClose: 1500,
      });
    } finally {
        onClose()
      // setLoading(false);
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
        <h2>Login Image</h2>
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
        {image&&
          <button
            className="cancel1-btn"
            onClick={() => {
              setImage(null);
              //   onClose();
            }}
          >
            Re-Take
          </button>}
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

export default WfhVerification;
