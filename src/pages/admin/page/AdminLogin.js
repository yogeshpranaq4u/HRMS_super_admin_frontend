import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Select } from "antd";
import Image2 from "../../../assets/images/test3.jpg";
import "../../admin/css/AdminLogin.css";
import { Api, BaseUrl } from "../../../config/apiEndPoints";
import axios from "axios";

const { Option } = Select;

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const data = {
      email: values?.username,
      password: values?.password,
      type: values?.role,
    };


    setLoading(true);
    let config = {
      method: "post",
      url: `${BaseUrl}${Api.LOGIN}`,
      headers: {
        "Content-Type": "application/json",
        "X-Company-ID": values?.companyId,
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log("response", response?.data);
        // if (response.data?.status) {
        //   // setOpen((pre) => ({
        //   //   ...pre,
        //   //   isOpen: true,
        //   //   message: response.data?.message,
        //   //   errortype: "success",
        //   // }));
        //   // setotpModal({ data: formData });
        // }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error) {
          // setOpen((pre) => ({
          //   ...pre,
          //   isOpen: true,
          //   message: error.response.data?.message || error.message,
          //   errortype: "error",
          // }));
          // toast.error(error.response.data?.message || error.message)
        }
        // console.log(error.response.data?.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img
            src={Image2}
            alt="Login"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              maxWidth: "100%",
            }}
          />
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={(e) => {
            if (!loading) {
              onFinish(e);
            }
          }}
          onFinishFailed={onFinishFailed}
        >
          <p className="form-title">Welcome to CV infotech Hr Management</p>

          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your email address",
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
              placeholder="Enter your username"
              className="uniform-input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              // className="uniform-input"
              // prefix={<FaLock />}
            />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role" className="uniform-input">
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
              {loading ? "Loading..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* <OtpModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employeeData={employeeData}
      />
      <WfhVerification
        open={modalOpen1}
        onClose={() => setModalOpen1(false)}
        employeeData={employeeData}
      /> */}
    </div>
  );
};

export default AdminLogin;
