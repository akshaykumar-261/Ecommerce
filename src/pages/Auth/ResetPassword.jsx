import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import authBanner from "../../assets/image copy 11.png";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../validation/auth";
import { useResetOtp } from "../../api/useAuth";
import toast from "react-hot-toast";
function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: resetOtp } = useResetOtp();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmitData = (data) => {
    // Backend ko sirf password bhejna hai
    resetOtp(
      {
        newPassword: data.newPassword,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Password reset successfully!");
          reset();
          navigate("/login");
        },

        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Password reset failed!",
          );
        },
      },
    );
  };

  return (
    <AuthLayout image={authBanner}>
      {/* Back */}
      <Link to="/otp-verify-forgot-password" className="text-xs text-gray-500">
        ← Back
      </Link>

      {/* Icon */}
      <div className="mt-7">
        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
          <LockKeyhole size={20} className="text-violet-600" />
        </div>
      </div>

      {/* Heading */}
      <div className="mt-4">
        <h1 className="text-xl font-bold text-gray-900">Set a new password</h1>

        <p className="text-gray-500 text-xs mt-1">Make it strong and secure.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmitData)} className="mt-5">
        {/* New Password */}
        <div className="relative">
          <LockKeyhole
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            {...register("newPassword")}
            className="
              w-full
              h-10
              border
              border-gray-300
              rounded-lg
              pl-9
              pr-10
              text-xs
              outline-none
              focus:border-violet-500
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <Eye size={15} className="text-gray-400" />
            ) : (
              <EyeOff size={15} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Password Error */}
        {errors.newPassword && (
          <p className="text-red-500 text-[10px] mt-1">
            {errors.newPassword.message}
          </p>
        )}

        {/* Confirm Password */}
        <div className="relative mt-3">
          <LockKeyhole
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="
              w-full
              h-10
              border
              border-gray-300
              rounded-lg
              pl-9
              pr-10
              text-xs
              outline-none
              focus:border-violet-500
            "
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <Eye size={15} className="text-gray-400" />
            ) : (
              <EyeOff size={15} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Confirm Password Error */}
        {errors.confirmPassword && (
          <p className="text-red-500 text-[10px] mt-1">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Password Requirements */}
        <div className="mt-3 bg-violet-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-[10px] text-gray-600">
            <CheckCircle size={10} className="text-green-500" />
            At least 8 characters
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-1">
            <CheckCircle size={10} className="text-green-500" />
            One uppercase letter
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-1">
            <CheckCircle size={10} className="text-green-500" />
            One number
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-1">
            <CheckCircle size={10} className="text-green-500" />
            One special character
          </div>
        </div>

        {/* Reset Button */}
        <Button type="submit" className="py-2 mt-4 text-xs">
          RESET PASSWORD
        </Button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
