import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${base_url}user/forget-password`,
        values,
        config
      );

      setLoading(false);
      form.resetFields(); // Clear form fields after success
      toast.success(response.data.message);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <h2>Forget Password</h2>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/">Go back to login</Link>
        </Form.Item>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default ForgetPassword;
