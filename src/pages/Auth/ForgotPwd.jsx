import React from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import authBanner from "../../assets/image copy 9.png";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../validation/auth";
import { useForgetPassword } from "../../api/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../components/common/ AuthContext"
import leftArrow from "../../assets/left-arrow.png";
import authFieldClass from "../../components/auth/authFieldClass";
import AuthFieldError from "../../components/auth/AuthFieldError";
function ForgotPwd() {
  const { mutate: userForgotPassword } = useForgetPassword();
  const { setForgotPasswordEmail } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });
  const onSubmitData = (data) => {
    userForgotPassword(data, {
      onSuccess: () => {
          setForgotPasswordEmail(data.email);
        toast.success("OTP sent! Please check your email.");
        reset();
        navigate("/otpVerifyForgotPassword");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Otp Send Failed");
      },
    });
  };

  return (
    <AuthLayout image={authBanner} centerContent>
      <Link
        to="/login"
        className="absolute left-5 top-5 flex w-fit items-center gap-2 text-xs font-medium text-gray-600 transition hover:text-violet-600 md:right-8 md:top-6"
      >
        <img src={leftArrow} alt="" aria-hidden="true" className="h-4 w-4" />
        Back to Login
      </Link>

      {/* HEADING */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-900">Forgot Password?</h1>
        <p className="text-xs text-gray-500 mt-1">
          Enter your email and we'll send you a 6-digit verification code to
          reset your password.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmitData)} className="space-y-4" noValidate>
        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
              className={authFieldClass()}
              aria-invalid={!!errors.email}
            />
          </div>
          <AuthFieldError message={errors.email?.message} />
        </div>

        <div className="pt-3">
          <Button type="submit" className="py-2 text-sm">
            SEND OTP
          </Button>
        </div>
      </form>

      {/* BOTTOM */}
      <p className="text-center mt-6 text-xs text-gray-600">
        Remember your password?{" "}
        <Link to="/login" className="text-violet-600 font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPwd;
