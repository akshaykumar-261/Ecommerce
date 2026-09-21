import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./ AuthContext";
const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireRegistration = false,
  requireOtpVerified = false,
  requireBusinessDetails = false,
  requireForgotPasswordEmail = false,
  requireForgotPasswordOtp = false,
}) => {
  const {
    registrationCompleted,
    otpVerified,
    businessDetailsCompleted,
    forgotPasswordEmail,
    forgotPasswordOtpVerified,
  } = useAuth();
  const token = localStorage.getItem("accessToken");

  // Auth check - redirect to login if not authenticated
  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }
  // Registration check
  if (requireRegistration && !registrationCompleted) {
    return <Navigate to="/vendorRegister" replace />;
  }
  // OTP check
  if (requireOtpVerified && !otpVerified) {
    return <Navigate to="/otpVerify" replace />;
  }
  // Business Details check
  if (requireBusinessDetails && !businessDetailsCompleted) {
    return <Navigate to="/bussinessAccountVendor" replace />;
  }
  // Forgot Password Email check
  if (requireForgotPasswordEmail && !forgotPasswordEmail) {
    return <Navigate to="/forgot-password" replace />;
  }
  // Forgot Password OTP check
  if (requireForgotPasswordOtp && !forgotPasswordOtpVerified) {
    return <Navigate to="/forgot-password" replace />;
  }
  return children;
};
export default ProtectedRoute;
