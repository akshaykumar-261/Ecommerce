import { useEffect, useRef, useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import authBanner from "../../assets/image copy 11.png";
import leftArrow from "../../assets/left-arrow.png";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../validation/auth";
import { useResetOtp } from "../../api/useAuth";
import { clearPasswordResetToken } from "../../api/passwordResetSession";
import { useAuth } from "../../components/common/ AuthContext";
import toast from "react-hot-toast";
function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { clearForgotPasswordFlow } = useAuth();
  const resetCompleted = useRef(false);

  /*
   * The flow state is cleared on the way out, not on success.
   *
   * This page is gated by ProtectedRoute requireForgotPasswordOtp. Clearing
   * forgotPasswordOtpVerified while /resetPassword was still mounted made that
   * guard fire its own <Navigate to="/forgot-password" replace /> and override
   * the navigation below, so a successful reset dumped the user back at the
   * start of the flow instead of the login page.
   */
  useEffect(
    () => () => {
      if (resetCompleted.current) clearForgotPasswordFlow();
    },
    [clearForgotPasswordFlow],
  );
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
        onSuccess: (res) => {
          toast.success(res.message || "Password reset successfully!");
          reset();
          // The reset token has done its job; drop it so it cannot authorise
          // another reset later in this tab.
          clearPasswordResetToken();
          resetCompleted.current = true;
          // A password reset is not a sign-in: the reset flow never stores a
          // login token, so this normally lands on the login form where the new
          // password can be used. An already signed-in user goes to the shop.
          if (localStorage.getItem("accessToken")) {
            navigate("/home", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }
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
      <Link
        to="/otpVerifyForgotPassword"
        className="absolute left-5 top-5 flex w-fit items-center gap-2 text-xs font-medium text-gray-600 transition hover:text-violet-600 md:right-8 md:top-6"
      >
        <img src={leftArrow} alt="" aria-hidden="true" className="h-4 w-4" />
        Back
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
      {/* resetCompleted is only read inside the submit handler and the unmount
          cleanup above, never during render — the rule cannot see that through
          handleSubmit, so it is suppressed here rather than worked around. */}
      {/* eslint-disable-next-line react-hooks/refs */}
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
