import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPwd from "../pages/Auth/ForgotPwd";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPwd />} />
    </Routes>
  );
}

export default AppRoutes;
