import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import "../AdminComponent/OtpModal.css";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OtpModal = ({ open, onClose, employeeData }) => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(120);
  // const { setLoading } = useAuth();
  useEffect(() => {
    if (!open) {
      setTimeLeft(120);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const handleChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };
  const resendOtp = async () => {
    // setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", employeeData?.email);
      const response = await axios.post(
        `${BaseUrl}${Api.RESEND_OTP}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${employeeData?.token}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);

        setTimeLeft(120);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      // setLoading(false);
    }
  };
  const verifyDetails = async () => {
    if (otp.trim() === "") {
      alert("OTP cannot be blank!");
      return;
    }

    if (otp.length !== 6) {
      alert("OTP must be 6 digits!");
      return;
    }
    // setLoading(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("otp", otp);
      formDataToSend.append("email", employeeData?.email);
      const response = await axios.post(
        `${BaseUrl}${Api.VERFY_OTP}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${employeeData?.token}`,
          },
        }
      );

      if (response?.data?.valid == false) {
        // setLoading(false);
        toast.error(response?.data?.mssg);
      } else if (response?.data?.success == false) {
        // setLoading(false);
        toast.error(response?.data?.mssg);
      } else {
        // setLoading(false);
        setOtp("");
        const token = response?.data?.token;
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userDetails", JSON.stringify({
          token,user:response?.data
        }));
        sessionStorage.setItem("employeeId", response?.data?.id);
        toast.success(response?.data?.mssg);
        window.location = "/admin/"
      }
    } catch (error) {
      // setLoading(false);
      console.error("Login error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      // setLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      showCloseIcon={false}
      closeOnOverlayClick={false}
      classNames={{ modal: "custom-modal134" }}
    >
      <div
        style={{
          backgroundColor: "transparent",
          borderRadius: "10px",
          maxWidth: "500px",
          width: "100%",
          margin: "auto",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          padding: 30,
          position: "relative",
        }}
      >
        <div className="otp-modal-container">
          <h2>Confirm your OTP</h2>
          <p>
            Enter the 6-digit code we just sent to your {employeeData?.email}
          </p>

          <input
            type="text"
            className="otp-input"
            placeholder="Eg: 123456"
            maxLength={6}
            value={otp}
            onChange={handleChange}
          />

          <p className="otp-timer">
            {timeLeft > 0 ? (
              <>
                Wait <strong>{formatTime(timeLeft)} min</strong> before
                requesting a new code.
              </>
            ) : (
              <strong>You can now request a new code.</strong>
            )}
          </p>
          <div className="otp-buttons">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="verify-btn"
              onClick={(event) => {
                const buttonText = event.target.textContent;
                if (buttonText == "Verify Now") {
                  verifyDetails();
                } else {
                  resendOtp();
                }
              }}
            >
              {timeLeft > 0 ? "Verify Now" : "Resend Now"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OtpModal;
