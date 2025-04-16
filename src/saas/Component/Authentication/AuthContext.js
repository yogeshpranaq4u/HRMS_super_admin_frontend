import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BaseUrl, Api } from "../../Config/Api";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setEmployeeAllDetails, setEmployeeAuth } from "../../Redux/Action";
import { persistor } from "../../Redux/Store";
import { isMobile, isTablet } from "react-device-detect";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const getEmployeeAuth = useSelector((state) => state.getEmployeeAuth);
  const getEmployeeAllDetails = useSelector(
    (state) => state.getEmployeeAllDetails
  );

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (token) {
      dispatch(setEmployeeAuth(true));
    } else {
      // navigate("/splash");
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
    setLoading(false);
  }, [navigate, dispatch]);
  // useEffect(() => {
  //   const checkLogoutTime = () => {
  //     const now = new Date();
  //     const currentHour = now.getHours();
  //     const currentMinute = now.getMinutes();

  //     if (currentHour === 11 && currentMinute === 56) {
  //       logout();
  //     }
  //   };

  //   const intervalId = setInterval(checkLogoutTime, 60000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const login = async (email, password, selection, fcmToken) => {
    setLoading(true);
    if (isMobile || isTablet) {
      toast.error("Login Not Allow In Tab Or Mobile", {
        position: "top-center",
        autoClose: 1500,
      });
      setLoading(false);
    } else {
      try {
        const response = await axios.post(`${BaseUrl}${Api.LOGIN}`, {
          email,
          password,
          type: selection,
          fcm_token: fcmToken,
        });

        if (response?.data?.valid == false) {
          toast.error(response?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1500,
          });
          return null;
        } else if (response?.data?.success == false) {
          toast.error(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1500,
          });
          return null;
        } else {
          return response.data;
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An unexpected error occurred.", {
          position: "top-center",
          autoClose: 1500,
        });
        return null;
      } finally {
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    if (getEmployeeAllDetails.type === "Admin") {
      // dispatch(setEmployeeAuth(false));
      // sessionStorage.removeItem("authToken");
      // await persistor.flush();
      // await persistor.purge();
      // window.location.reload();
      // navigate("/login");
      try {
        const data = await axios(`${BaseUrl}${Api.LOGOUT}`, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            email: getEmployeeAllDetails?.email,
            login_token: getEmployeeAllDetails?.token,
            type: getEmployeeAllDetails?.type,
          },
        });

        if (data?.data?.valid === false) {
          setLoading(false);
          toast.error(data?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
          toast.success(data?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          dispatch(setEmployeeAuth(false));
          sessionStorage.removeItem("authToken");
          await persistor.flush();
          await persistor.purge();
          window.location.reload();
          sessionStorage.clear();
        } else {
          if (data?.data?.mssg === "Logout successfully") {
            setLoading(false);
            toast.success("Logout successfully", {
              position: "top-center",
              autoClose: 1000,
            });
            dispatch(setEmployeeAuth(false));
            sessionStorage.removeItem("authToken");
            await persistor.flush();
            await persistor.purge();
            window.location.reload();
            sessionStorage.clear();
          } else {
            toast.error(data?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });
            setLoading(false);
            toast.success(data?.data?.mssg, {
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
        }
      } catch (error) {
        console.error("Login failed:", error);
        toast.error(error, {
          position: "top-center",
          autoClose: 1000,
        });
        dispatch(setEmployeeAuth(false));
        sessionStorage.removeItem("authToken");
        await persistor.flush();
        await persistor.purge();
        window.location.reload();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);

      try {
        const data = await axios(`${BaseUrl}${Api.LOGOUT}`, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            email: getEmployeeAllDetails?.email,
            login_token: getEmployeeAllDetails?.token,
            type: getEmployeeAllDetails?.type,
          },
        });

        if (data?.data?.valid === false) {
          setLoading(false);
          toast.error(data?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
          toast.success(data?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          dispatch(setEmployeeAuth(false));
          sessionStorage.removeItem("authToken");
          await persistor.flush();
          await persistor.purge();
          window.location.reload();
        } else {
          if (data?.data?.mssg === "Logout successfully") {
            setLoading(false);
            toast.success(data?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });
            dispatch(setEmployeeAuth(false));
            sessionStorage.removeItem("authToken");
            await persistor.flush();
            await persistor.purge();
            window.location.reload();
          } else {
            toast.error(data?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });
            setLoading(false);
            toast.success(data?.data?.mssg, {
              position: "top-center",
              autoClose: 1000,
            });
            dispatch(setEmployeeAuth(false));
            sessionStorage.removeItem("authToken");
            await persistor.flush();
            await persistor.purge();
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Login failed:", error);
        toast.error(error, {
          position: "top-center",
          autoClose: 1000,
        });
        dispatch(setEmployeeAuth(false));
        sessionStorage.removeItem("authToken");
        await persistor.flush();
        await persistor.purge();
        window.location.reload();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ getEmployeeAuth, login, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
