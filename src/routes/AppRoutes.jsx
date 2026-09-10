import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPwd";
import Home from "../pages/Unauth/Home";
import OtpVerify from "../pages/Auth/OtpVerify";
import OtpVerifyForgotPassword from "../pages/Auth/OtpVerifyForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VendorRegister from "../pages/Auth/VendoreRegister";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<Home />} />
      <Route path="otpVerify" element={<OtpVerify />} />
      <Route path="otpVerifyForgotPassword" element={<OtpVerifyForgotPassword />} />
      <Route path="resetPassword" element={<ResetPassword />} />
      <Route path="/vendorRegister" element={<VendorRegister/>}/>
    </Routes>
  );
}

export default AppRoutes;
