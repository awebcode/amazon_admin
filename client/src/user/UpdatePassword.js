import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMyDetails } from "../features/auth/authSlice";

const UpdatePassword = () => {
    const dispatch = useDispatch();
    useEffect(() => {
    dispatch(getMyDetails());
    }, [dispatch]);
    const navigate=useNavigate()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${base_url}user/update-password`,
        values,
        config
      );

      setLoading(false);
      form.resetFields(); // Clear form fields after success
      toast.success(response.data.message);
      navigate("/admin/profile")
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Update Password</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[{ required: true, message: "Please enter your old password" }]}
        >
          <Input.Password visibilityToggle={true} />
        </Form.Item>

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
            Update Password
          </Button>
        </Form.Item>
        <Form.Item className="">
          <Link to="/forget-password">forget password?</Link>
        </Form.Item>
        
      </Form>

      <ToastContainer />
    </div>
  );
};

export default UpdatePassword;
