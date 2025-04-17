import React, { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, } from "antd";

import "./AdminPasswordUpdate.css";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Component/Authentication/AuthContext";
const AdminPasswordUpdate = () => {
  const [form] = Form.useForm();
  const token = sessionStorage.getItem("authToken");
  const employeeId = sessionStorage.getItem("employeeId");
  const [profileData, setProfileData] = useState();
const setLoading = () => { };
  const logout = () => { };

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
      setLoading(false);
    }
  }, [token, setLoading, logout]);

  useEffect(() => {
    fetchEmployeProfile();
  }, []);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const responseData = await axios(
        `${BaseUrl}${Api.ADMIN_UPDATE_PASSWORD}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          data: {
            email: profileData?.email,
            oldPassword: values?.currenPassword,
            newPassword: values.newPassword,
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
        } else if (responseData?.data?.success === false) {
          toast.error(responseData?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          toast.success(responseData?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
          form.resetFields();
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="mainDivleave12">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 30,
          color: "black",
          padding: 15,
          marginTop: 20,
        }}
      >
        Update Password
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 10,
          height: "100vh",
          bgcolor: "#f0f0f0",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            width: "500px",
          }}
        >
          <Form
          form={form} 
          name="login-form12"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          >
            <p className="form-title1">Set new password</p>

            <Form.Item
              label="Current Password"
              name="currenPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password placeholder="**************" />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password placeholder="**************" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
           
            >
              <Input.Password placeholder="**************" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button1"
              >
               Set Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordUpdate;
