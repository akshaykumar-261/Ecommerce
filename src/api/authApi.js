import { data } from "react-router-dom";
import axiosInstance from "./axiosInstance";
export const RegisterUser = async (data) => {
    const response = await axiosInstance.post("/users/create", data);
    return response.data;
}
export const LoginUser = async (data) => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data;
}
export const ForgotPassword = async (data) => {
    const response = await axiosInstance.post("/users/forgot-password", data);
    return response.data;
}
export const OtpVerifyUser = async (data) => {
    const response = await axiosInstance.post("/users/verify-user", data);
    return response.data;
}
export const OtpResendUser = async (data) => {
    const response = await axiosInstance.post("/users/resend-otp-verifyUser", data);
    return response.data;
}
export const OtpVerifyForgotPassword = async (data) => {
    const response = await axiosInstance.post("/users/verify-forgotOtp", data);
    return response.data;
}
export const OtpResendForgotPassword = async (data) => {
    const response = await axiosInstance.post("/users/resend-otp-forgotPassword", data);
    return response.data;
}
export const ResetOtp = async (data) => {
    const response = await axiosInstance.post("/users/reset-password", data);
    return response.data;
}
export const VenderRegister = async (data) => {
    const response = await axiosInstance.post("/venders/createVendor", data);
    return response.data;
}
export const VenderOnboardingLink = async (data) => {
    const response = await axiosInstance.get("/venders/onboardingLink");
    return response.data;
}

