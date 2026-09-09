import { useMutation } from "@tanstack/react-query";
import {
  RegisterUser,
  LoginUser,
  ForgotPassword,
  OtpVerifyUser,
  OtpResendUser,
  OtpVerifyForgotPassword,
  OtpResendForgotPassword,
  ResetOtp
} from "./authApi";
export const useRegister = () => {
  return useMutation({
    mutationFn: RegisterUser,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useLogin = () => {
  return useMutation({
    mutationFn: LoginUser,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToke", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useForgetPassword = () => {
  return useMutation({
    mutationFn: ForgotPassword,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToke", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useOtpVerifyUser = () => {
  return useMutation({
    mutationFn: OtpVerifyUser,
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useOtpResendUser = () => {
  return useMutation({
    mutationFn: OtpResendUser,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToke", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useOtpVerifyForgotPassword = () => {
  return useMutation({
    mutationFn: OtpVerifyForgotPassword,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToke", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useOtpResendForgotPassword = () => {
  return useMutation({
    mutationFn: OtpResendForgotPassword,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      localStorage.setItem("accessToke", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
export const useResetOtp = () => {
  return useMutation({
    mutationFn: ResetOtp,
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("STATUS:", error.response?.status);
      console.error("BACKEND ERROR:", error.response?.data);
      console.error("FULL ERROR:", error);
    },
  });
};
