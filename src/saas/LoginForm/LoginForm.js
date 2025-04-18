import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Form, Input, Button, Checkbox, Select } from "antd";
// import Image2 from "../Assets/test3.jpg";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import OtpModal from "../Admin/AdminComponent/OtpModal";
import WfhVerification from "../Component/WfhVerification";
import { callApi } from "../../config/apiCall";
import { Api, BaseUrl } from "../Config/Api";

const { Option } = Select;

export const LoginForm = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [username, setUsername] = useState("");
  const [employeeData, setEmployeeData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("fcmToken");

  const onFinish = async (values) => {
    const data = new FormData()
    data.append("email" ,values.username)
    data.append("password" ,values.password )
    data.append("type" ,values.role )
    data.append("token" ,token )
    const response = await callApi(`${BaseUrl}${Api.LOGIN}`,"POST" , data,"")
    // console.log("response" ,response);
    if(response?.valid && response?.success ){
      if (response?.isOffice === true) {
        if (response?.type === "Employee") {
          toast.success(response?.mssg);
          const token = response?.token;
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("employeeId", response?.id);
          sessionStorage.setItem("userDetails", JSON.stringify({
            token,user:response
          }));
          window.location = "/employee/"
          
        } else {
          // setEmployeeresponse(response);
          setModalOpen(true);
          setEmployeeData(response)
        }
      }
      toast.success(response.mssg || response.mssg || "Login Done");
    }else{
      if(response.mssg || response.mssg ){
        toast.error(response.mssg || response.mssg || "Server Error");
      }
    }
    
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (!value.includes("@")) {
      setUsername(value);
    }
  };

  

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img
            src={"/assets/Assets/test3.jpg"}
            alt="Login"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <p className="form-title">Welcome to CV infotech Hr Management</p>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              {
                validator: (_, value) => {
                  if (value && value.includes("@")) {
                    // return Promise.reject(
                    //   new Error(
                    //     "Please do not include a domain "
                    //   )
                    // );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
              // suffix="@cvinfotech.com"
              prefix={<FaUser />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" prefix={<FaLock />} />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value="Admin">Admin</Option>
              <Option value="Employee">Employee</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="companyId"
            rules={[
              { required: true, message: "Please input your company id" },
            ]}
            className="uniform-input"
          >
            <Input placeholder="Company Id" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
      <OtpModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employeeData={employeeData}
      />
      <WfhVerification
        open={modalOpen1}
        onClose={() => setModalOpen1(false)}
        employeeData={employeeData}
      />
    </div>
  );
};
