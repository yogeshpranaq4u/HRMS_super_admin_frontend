import React, { useEffect, useState } from "react";
import "./modals.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Api, BaseUrl } from "../config/apiEndPoints";

const OtpModal = ({ data }) => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(120);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!data?.data?.email) {
            setTimeLeft(120);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [data?.data?.email]);

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
        setLoading(true);
        try {
            const response = await axios.post(
                `${BaseUrl}/${Api.RESEND}`,
                { email: data.data.email },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        // Authorization: `Bearer ${employeeData?.token}`,
                    },
                }
            );

            // console.log("response" ,response)
            if (response?.data?.success) {
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 1500,
                });

                setTimeLeft(120);
            } else {
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 1500,
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || error.message ||
                "An unexpected error occurred.", {
                position: "top-center",
                autoClose: 1500,
            });
        } finally {
            setLoading(false);
        }
    };
    const verifyDetails = async () => {
        if (otp.trim() === "") {
            toast.warning("OTP cannot be blank!")
            return;
        }
        if (otp.length !== 6) {
            toast.warning("OTP must be 6 digits!")
            return;
        }
        setLoading(true);
        try {
            let config = {
                method: 'post',
                url: `${BaseUrl}${Api.VERIFYOTP}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data?.data?.token || ""}`,
                },
                data: { ...data?.data, otp }
            };
            const response = await axios.request(config);
            // console.log("response", response);
            setLoading(false);
            if (response?.data?.status == false) {
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 1500,
                });
            } else {
                setOtp("");
                const token = response?.data?.token;
                sessionStorage.setItem("userDetails", JSON.stringify({token,user:response?.data?.user}));
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 1500,
                });
                // navigate("/");
                window.location = "/superadmin/"
            }
        } catch (error) {
            setLoading(false);
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || error.message ||
                "An unexpected error occurred.", {
                position: "top-center",
                autoClose: 1500,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={"custom-modal134"}>
            <div className="otp-modal"
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
                        Enter the 6-digit code we just sent to your {data?.data?.email}
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
                        <button className="cancel-btn" onClick={data.onClose}>
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
                        >{
                                loading ? "loading.." :
                                    <>
                                        {timeLeft > 0 ? "Verify Now" : "Resend Now"}
                                    </>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpModal;
