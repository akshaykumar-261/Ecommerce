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
import VenderLogin from "../pages/Auth/VenderLogin";
import StripeConnect from "../pages/Auth/StritpeConnect";
import Sidebar from "../components/common/SideBar";
import Topbar from "../components/common/Topbar";
import VendorDashboard from "../pages/Unauth/VendorDashboard";
import BusinessDetails from "../pages/Vendor/BusinessDetails";
import AddProducts from "../pages/Vendor/AddProducts";
import AddProductMedia from "../pages/Vendor/AddProductMedia";
import EditProduct from "../pages/Vendor/EditProduct";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Profile from "../pages/Unauth/Profile";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/otpVerify"
        element={
          <ProtectedRoute requireRegistration>
            <OtpVerify />
          </ProtectedRoute>
        }
      />
      <Route
        path="/otpVerifyForgotPassword"
        element={
          <ProtectedRoute requireForgotPasswordEmail>
            <OtpVerifyForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resetPassword"
        element={
          <ProtectedRoute requireForgotPasswordOtp>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
      <Route path="/vendorRegister" element={<VendorRegister />} />
      <Route path="/vendorLogin" element={<VenderLogin />} />
      <Route path="/vendor/stripeConnectLink" element={<StripeConnect />} />
      <Route path="/sideBar" element={<Sidebar />} />
      <Route path="/topBar" element={<Topbar />} />
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route
        path="/bussinessAccountVendor"
        element={
          <ProtectedRoute requireOtpVerified>
            <BusinessDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/vendor/addProduct" element={<AddProducts />} />
      <Route
        path="/vendor/addProductImage/:productId"
        element={<AddProductMedia />}
      />
      <Route path="/vendor/editProduct/:productId" element={<EditProduct />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;
