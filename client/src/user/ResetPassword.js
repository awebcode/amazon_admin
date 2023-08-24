import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); // Assuming you're using a token in the URL for reset

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const requestBody = {
        token,
        newpassword: values.newPassword,
      };

      const response = await axios.put(
        `${base_url}user/reset-password/${token}`,
        requestBody,
        config
      );

      setLoading(false);
      form.resetFields(); // Clear form fields after success
        toast.success(response.data.message);
        navigate(`/`);
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
        <h2>Reset Password</h2>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please enter a new password" }]}
        >
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("The two passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Reset Password
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/">Go back</Link>
        </Form.Item>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
