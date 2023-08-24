import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getMyDetails, login, resetUserState } from "../features/auth/authSlice";

let schema = yup.object().shape({
  email: yup.string().email("Email should be valid").required("Email is Required"),
  password: yup.string().required("Password is Required"),
});
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(login(values));
      
    },
  });
  const authState = useSelector((state) => state);

  const { user, isError, isLoginSuccess, isLoading, message } = authState.auth;
useEffect(() => {
  dispatch(getMyDetails());
  dispatch(resetUserState());
}, [dispatch]);
  useEffect(() => {
    if (isLoginSuccess===true) {
      navigate("admin");
      // dispatch(resetUserState());
    } else {
      navigate("/");
       dispatch(resetUserState());
    }
    //  dispatch(resetUserState());
  }, [dispatch,user, isError, isLoginSuccess, isLoading,navigate]);
useEffect(() => {
  if (user && user) {
    navigate("admin");
  }
}, [navigate, user]);
  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <div className="container mx-auto p-20">
        <div className="my-5 w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg mx-auto p-4">
          <h3 className="text-center text-xl md:text-2xl font-bold">Login</h3>
          <p className="text-center mb-4">
            Dear Admin,Login to your account to continue.
          </p>
          <div className="error text-center mb-2">
            {message.message === "Rejected" ? "You are not an Admin" : ""}
          </div>
          <form onSubmit={formik.handleSubmit}>
            <CustomInput
              type="text"
              label="Email Address"
              id="email"
              name="email"
              onChng={formik.handleChange("email")}
              onBlr={formik.handleBlur("email")}
              val={formik.values.email}
            />
            <div className="error mt-2">
              {formik.touched.email && formik.errors.email}
            </div>
            <CustomInput
              type={showPassword ? "text" : "password"}
              label="Password"
              id="pass"
              name="password"
              onChng={formik.handleChange("password")}
              onBlr={formik.handleBlur("password")}
              val={formik.values.password}
            />
            {/* Show/Hide Password Toggle */}
            <div className="mt-2 d-flex align-items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            <div className="error mt-2">
              {formik.touched.password && formik.errors.password}
            </div>
            <div className="mb-3 text-end d-flex flex-column">
              <Link to="/forget-password" className="text-sm">
                Forgot Password?
              </Link>
              {/* <Link to="/reset-password" className="text-sm">
                Reset Password?
              </Link> */}
            </div>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 w-full rounded-md transition duration-300"
              type="submit"
              style={{
                background: "#ffd333",
                display: "block",
                margin: "auto",
                padding: "12px 58px",
                width: "40%",
              }}
            >
              {isLoading ? "Loading....." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
