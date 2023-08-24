import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch } from "react-redux";
import { getMyDetails } from "../features/auth/authSlice";

const Forgotpassword = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyDetails());
  }, [dispatch]);
  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <div className="my-5 w-100 w-md-75 w-lg-50 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title text-lg">Forgot Password</h3>
        <p className="text-center text-sm">
          Please enter your registered email to receive a reset password link.
        </p>
        <form className="mt-3">
          <CustomInput type="email" label="Email Address" id="email" />

          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Send Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;
