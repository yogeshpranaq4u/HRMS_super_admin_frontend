import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { persistor } from "../../Redux/Store";
import { setEmployeeAuth } from "../../Redux/Action";
import useClearSessionStorage from "../../useClearSessionStorage";

const AdminLogout = () => {
  const { logout, setLoading } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");
  const employeeId = sessionStorage.getItem("employeeId");
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
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setLoading(false); // Hide loader after delay
    }
  };
  const employeeLogout = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", profileData?.email);
      formDataToSend.append("type", profileData?.type);

      const response = await axios.post(
        `${BaseUrl}${Api.LOGOUT_WFHLOCATION_IMAGE}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
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
        sessionStorage.clear();
        
      }
    } catch (error) {
      setLoading(false);

      console.error("Login error:", error);
      toast.error("An unexpected error occurred.", {
        position: "top-center",
        autoClose: 1500,
      });
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

                  navigate("/adminhome/admindashboard");
                }}
                className="cancel-btn"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogout;
