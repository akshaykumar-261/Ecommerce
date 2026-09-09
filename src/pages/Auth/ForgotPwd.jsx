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
function ForgotPwd() {
  const { mutate: userForgotPassword } = useForgetPassword();
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const onSubmitData = (data) => {
    userForgotPassword(data, {
      onSuccess: () => {
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
    <AuthLayout image={authBanner}>
      <Link to="/login" className="text-sm text-gray-500">
        ← Back to Login
      </Link>
      <div>
        <Mail size={35} className="mt-10 text-violet-600" />
      </div>
      <div className="mt-10">
        <h1 className="text-3xl mt-1 font-bold text-gray-900">
          Enter Your Email
        </h1>
        <p className="text-gray-500 mt-2">
          We'll send a 6-digit verification code to your email address.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmitData)} className="mt-8">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Enter Your Email Address"
              {...register("email")}
              className="
         w-full
                border
                border-gray-300
                rounded-lg
                py-4
                pl-15
                pr-4
                text-sm
                outline-none
                focus:border-violet-500
          "
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" className="py-2 mt-10 text-sm">
          VERIFY OTP
        </Button>
      </form>

      <p className="mt-7 text-1 text-gray-600">
        Remember Your Password?
        <Link to="/login" className="text-violet-600">
          Login
        </Link>{" "}
      </p>
    </AuthLayout>
  );
}

export default ForgotPwd;
