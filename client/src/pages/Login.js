import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Checkbox, Button, Typography, Spin } from "antd";
import { LockOutlined, UserOutlined,EyeOutlined,EyeInvisibleOutlined,LoadingOutlined } from "@ant-design/icons";
import { login, resetUserState, getMyDetails } from "../features/auth/authSlice";

const { Title } = Typography;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const authState = useSelector((state) => state);

  const { user, isError, isLoginSuccess, isLoginLoading, message } = authState.auth;

  // useEffect(() => {
  //   dispatch(getMyDetails());
  //   dispatch(resetUserState());
  // }, [dispatch]);

  useEffect(() => {
    if (isLoginSuccess === true) {
      navigate("admin");
    } else {
      navigate("/");
      dispatch(resetUserState());
    }
  }, [dispatch, isLoginSuccess, navigate]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const onFinish = (values) => {
    dispatch(login(values));
  };

  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <div className="container mx-auto p-20">
        <div className="my-5 w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg mx-auto p-4">
          <Title level={3} className="text-center font-bold">
            Login
          </Title>
          <p className="text-center mb-4">
            Dear Admin, Login to your account to continue.
          </p>
          <div className="error text-center mb-2">
            {message.message === "Rejected" ? "You are not an Admin" : ""}
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              email: "",
              password: "",
            }}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeOutlined onClick={handlePasswordToggle} />
                  ) : (
                    <EyeInvisibleOutlined onClick={handlePasswordToggle} />
                  )
                }
              />
            </Form.Item>
            <Form.Item>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <div className="mb-3 text-end">
              <Link to="/forget-password" className="text-sm">
                Forgot Password?
              </Link>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isLoginLoading}
              style={{
                background: "#ffd333",
                display: "block",
                margin: "auto",
                padding: "12px 58px",
                width: "40%",
                height:"100%"
              }}
            >
              {isLoginLoading ? <Spin indicator={<LoadingOutlined />} /> : "Login"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
