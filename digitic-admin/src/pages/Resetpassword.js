import React from "react";
import CustomInput from "../components/CustomInput";

const Resetpassword = () => {
  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <div className="my-5 w-full md:w-2/3 lg:w-1/2 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title text-lg">Reset Password</h3>
        <p className="text-center text-sm">Please enter your new password.</p>
        <form className="mt-3">
          <CustomInput type="password" label="New Password" id="pass" />
          <CustomInput type="password" label="Confirm Password" id="confirmpass" />

          <button
            className="border-0 px-3 py-2 text-white font-bold w-full"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
