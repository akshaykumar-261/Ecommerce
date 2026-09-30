import axiosInstance from "./axiosInstance";
import { passwordResetAuthHeader } from "./passwordResetSession";
export const RegisterUser = async (data) => {
  const response = await axiosInstance.post("/users/create", data);
  return response.data;
};
export const LoginUser = async (data) => {
  const response = await axiosInstance.post("/users/login", data);
  return response.data;
};
export const ForgotPassword = async (data) => {
  const response = await axiosInstance.post("/users/forgot-password", data);
  return response.data;
};
export const OtpVerifyUser = async (data) => {
  const response = await axiosInstance.post("/users/verify-user", data);
  return response.data;
};
export const OtpResendUser = async (data) => {
  const response = await axiosInstance.post(
    "/users/resend-otp-verifyUser",
    data,
  );
  return response.data;
};
// The three calls below sit behind the backend's `authorize` middleware but are
// part of the password-reset flow, not a login. They authenticate with the
// dedicated reset token so nothing is written to localStorage.accessToken.
export const OtpVerifyForgotPassword = async (data) => {
  const response = await axiosInstance.post("/users/verify-forgotOtp", data, {
    headers: passwordResetAuthHeader(),
  });
  return response.data;
};
export const OtpResendForgotPassword = async (data) => {
  const response = await axiosInstance.post(
    "/users/resend-otp-forgotPassword",
    data,
    { headers: passwordResetAuthHeader() },
  );
  return response.data;
};
export const ResetOtp = async (data) => {
  const response = await axiosInstance.post("/users/reset-password", data, {
    headers: passwordResetAuthHeader(),
  });
  return response.data;
};
export const GetUser = async () => {
  const response = await axiosInstance.get("/users/get-User");
  return response.data;
};
export const UpdateUser = async (data) => {
  const response = await axiosInstance.put("/users/update-user", data);

  return response.data;
};
export const VenderRegister = async (data) => {
  const response = await axiosInstance.post("/venders/createVendor", data);
  return response.data;
};
export const VenderOnboardingLink = async () => {
  const response = await axiosInstance.get("/venders/onboardingLink");
  return response.data;
};
export const VenderStripeDetail = async () => {
  const response = await axiosInstance.get("/venders/stripeAccountDetails");
  return response.data;
};
export const LogoutUser = async () => {
  const response = await axiosInstance.post("/users/logout");
  return response.data;
};
